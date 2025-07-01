
import { useState, useEffect } from 'react';
import { diffLines } from 'diff';

// Helper function to convert diff output to a simple array of line objects
const createLineArray = (differences) => {
  const lines = [];
  let lineNum1 = 0;
  let lineNum2 = 0;

  differences.forEach(part => {
    const partLines = part.value.split('\n');
    if (partLines[partLines.length - 1] === '') {
      partLines.pop();
    }
    partLines.forEach(line => {
      if (!part.added && !part.removed) { // Unchanged
        lineNum1++;
        lineNum2++;
        lines.push({
          text: line + '\n',
          added: part.added,
          removed: part.removed,
          lineNum1: lineNum1,
          lineNum2: lineNum2,
        });
      } else if (part.added) { // Added
        lineNum2++;
        lines.push({
          text: line + '\n',
          added: part.added,
          removed: part.removed,
          lineNum1: '',
          lineNum2: lineNum2,
        });
      } else if (part.removed) { // Removed
        lineNum1++;
        lines.push({
          text: line + '\n',
          added: part.added,
          removed: part.removed,
          lineNum1: lineNum1,
          lineNum2: '',
        });
      }
    });
  });
  return lines;
};

// Helper function to get contextual lines from a simple line array
const getContextualLines = (lines, context = 3) => {
  if (!lines.some(line => line.added || line.removed)) {
    return []; // No changes, show nothing for this file
  }

  const result = [];
  const showIndices = new Set();

  // Find indices of changed lines and their context
  lines.forEach((line, index) => {
    if (line.added || line.removed) {
      for (let i = Math.max(0, index - context); i <= Math.min(lines.length - 1, index + context); i++) {
        showIndices.add(i);
      }
    }
  });

  let lastIndex = -1;
  const sortedIndices = Array.from(showIndices).sort((a, b) => a - b);

  for (const index of sortedIndices) {
    if (lastIndex !== -1 && index > lastIndex + 1) {
      result.push({ text: '...\n', separator: true, lineNum1: '', lineNum2: '' });
    }
    result.push(lines[index]);
    lastIndex = index;
  }
  return result;
};

const getMinorVersionDiff = (v1, v2) => {
  const aMatch = v1.match(/v?(\d+)\.(\d+)/);
  const bMatch = v2.match(/v?(\d+)\.(\d+)/);
  if (!aMatch || !bMatch) return Infinity;
  return Math.abs(parseInt(bMatch[2], 10) - parseInt(aMatch[2], 10));
};

export const useDiffData = () => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion1, setSelectedVersion1] = useState('');
  const [selectedVersion2, setSelectedVersion2] = useState('');
  const [diffResult, setDiffResult] = useState([]);
  const [compared, setCompared] = useState(false);

  useEffect(() => {
    fetch('./versions.json')
      .then((response) => response.json())
      .then((data) => {
        const availableVersions = data.sort((a, b) => {
          const aIsV = a.startsWith('v');
          const bIsV = b.startsWith('v');

          if (aIsV && !bIsV) return -1;
          if (!aIsV && bIsV) return 1;

          const aMatch = a.match(/v?(\d+)\.(\d+)\.(\d+)(?:-(.*))?/);
          const bMatch = b.match(/v?(\d+)\.(\d+)\.(\d+)(?:-(.*))?/);

          if (!aMatch || !bMatch) {
            return b.localeCompare(a);
          }

          for (let i = 1; i <= 3; i++) {
            const aPart = parseInt(aMatch[i], 10);
            const bPart = parseInt(bMatch[i], 10);
            if (aPart !== bPart) {
              return bPart - aPart;
            }
          }

          const aPre = aMatch[4];
          const bPre = bMatch[4];

          if (aPre && !bPre) {
            return 1;
          } else if (!aPre && bPre) {
            return -1;
          } else if (aPre && bPre) {
            return bPre.localeCompare(aPre);
          }

          return 0;
        });
        setVersions(availableVersions);
        if (availableVersions.length > 1) {
          setSelectedVersion1(availableVersions[1]);
          setSelectedVersion2(availableVersions[0]);
        }
      });
  }, []);

  const handleCompare = async () => {
    if (!selectedVersion1 || !selectedVersion2) {
      return;
    }

    setLoading(true);
    setCompared(false);

    // If both versions are the same, show no differences
    if (selectedVersion1 === selectedVersion2) {
      setDiffResult([]);
      setCompared(true);
      setLoading(false);
      return;
    }

    const v1 = selectedVersion1;
    const v2 = selectedVersion2;

    if (getMinorVersionDiff(v1, v2) <= 1) {
      try {
        const response = await fetch(`./diffs/${v1}__${v2}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const diffData = await response.json();
        setDiffResult(diffData);
        setCompared(true);
      } catch (error) {
        console.error("Could not fetch diff data:", error);
        // Optionally, handle the error in the UI
      } finally {
        setLoading(false);
      }
    } else {
      // Fetch full data for each version and compute diff on the client
      try {
        const [res1, res2] = await Promise.all([
          fetch(`./data/${v1}.json`),
          fetch(`./data/${v2}.json`),
        ]);
        if (!res1.ok || !res2.ok) {
          throw new Error(`HTTP error! status: ${res1.status}, ${res2.status}`);
        }
        const data1 = await res1.json();
        const data2 = await res2.json();
        
        const diffResult = [];
        const allFiles = new Set([...Object.keys(data1), ...Object.keys(data2)]);

        for (const file of allFiles) {
          if (!data1[file]) {
            const lines = data2[file].split('\n').map((line, index) => ({
              text: line + '\n',
              added: true,
              removed: false,
              lineNum1: '',
              lineNum2: index + 1,
            }));
            diffResult.push({ file, lines, type: 'added' });
          } else if (!data2[file]) {
            const lines = data1[file].split('\n').map((line, index) => ({
              text: line + '\n',
              added: false,
              removed: true,
              lineNum1: index + 1,
              lineNum2: '',
            }));
            diffResult.push({ file, lines, type: 'removed' });
          } else if (data1[file] !== data2[file]) {
            const differences = diffLines(data1[file], data2[file]);
            const lineArray = createLineArray(differences);
            const contextualLines = getContextualLines(lineArray);
            if (contextualLines.length > 0) {
                diffResult.push({ file, lines: contextualLines, type: 'modified' });
            }
          }
        }
        setDiffResult(diffResult);
        setCompared(true);
      } catch (error) {
        console.error("Could not fetch or compute diff data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    versions,
    loading,
    selectedVersion1,
    setSelectedVersion1,
    selectedVersion2,
    setSelectedVersion2,
    diffResult,
    compared,
    handleCompare,
  };
};
