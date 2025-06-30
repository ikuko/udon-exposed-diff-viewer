
import { useState, useEffect } from 'react';

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

    // Ensure version1 is always the smaller version for consistency
    const [v1, v2] = [selectedVersion1, selectedVersion2].sort();

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
    }
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
