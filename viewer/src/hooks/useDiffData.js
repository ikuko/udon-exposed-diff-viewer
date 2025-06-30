
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

export const useDiffData = () => {
  const [versions, setVersions] = useState([]);
  const [selectedVersion1, setSelectedVersion1] = useState('');
  const [selectedVersion2, setSelectedVersion2] = useState('');
  const [diffResult, setDiffResult] = useState([]);
  const [compared, setCompared] = useState(false);

  useEffect(() => {
    fetch('./versions.json')
      .then((response) => response.json())
      .then((data) => {
        const availableVersions = data.sort((a, b) => {
          const aMatch = a.match(/v?(\d+)\.(\d+)\.(\d+)(?:-(.*))?/);
          const bMatch = b.match(/v?(\d+)\.(\d+)\.(\d+)(?:-(.*))?/);

          if (!aMatch || !bMatch) {
            return a.localeCompare(b);
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

    const [res1, res2] = await Promise.all([
      fetch(`./data/${selectedVersion1}.json`),
      fetch(`./data/${selectedVersion2}.json`),
    ]);

    const version1Files = await res1.json();
    const version2Files = await res2.json();

    const allFiles = new Set([...Object.keys(version1Files), ...Object.keys(version2Files)]);

    const result = [];

    for (const file of allFiles) {
      if (!version1Files[file]) {
        // Added file
        const lines = version2Files[file].split('\n').map((line, index) => ({
          text: line + '\n',
          added: true,
          removed: false,
          lineNum1: '',
          lineNum2: index + 1,
        }));
        result.push({ file, lines, type: 'added' });
      } else if (!version2Files[file]) {
        // Removed file
        const lines = version1Files[file].split('\n').map((line, index) => ({
          text: line + '\n',
          added: false,
          removed: true,
          lineNum1: index + 1,
          lineNum2: '',
        }));
        result.push({ file, lines, type: 'removed' });
      } else if (version1Files[file] !== version2Files[file]) {
        const differences = diffLines(version1Files[file], version2Files[file]);
        const lineArray = createLineArray(differences);
        const contextualLines = getContextualLines(lineArray);
        if (contextualLines.length > 0) {
            result.push({ file, lines: contextualLines, type: 'modified' });
        }
      }
    }

    setDiffResult(result);
    setCompared(true);
  };

  return {
    versions,
    selectedVersion1,
    setSelectedVersion1,
    selectedVersion2,
    setSelectedVersion2,
    diffResult,
    compared,
    handleCompare,
  };
};
