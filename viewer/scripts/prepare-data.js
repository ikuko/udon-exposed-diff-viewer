
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { diffLines } from 'diff';
import { compareVersionsDesc, getMinorVersionDiff } from '../src/utils/versionSort.js';

// Helper functions from useDiffData.js, adapted for Node.js
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

const getContextualLines = (lines, context = 3) => {
  if (!lines.some(line => line.added || line.removed)) {
    return []; // No changes, show nothing for this file
  }

  const result = [];
  const showIndices = new Set();

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


try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const udonExposedDir = path.resolve(__dirname, '../../UdonExposed');
  const publicDir = path.resolve(__dirname, '../public');
  const diffsDir = path.resolve(publicDir, 'diffs');
  const dataDir = path.resolve(publicDir, 'data');

  // Clean up existing directories
  console.log('Cleaning up old data...');
  if (fs.existsSync(diffsDir)) {
    fs.rmSync(diffsDir, { recursive: true, force: true });
  }
  if (fs.existsSync(dataDir)) {
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
  fs.mkdirSync(diffsDir, { recursive: true });
  fs.mkdirSync(dataDir, { recursive: true });

  const versions = fs.readdirSync(udonExposedDir).filter(version => {
    const versionDir = path.join(udonExposedDir, version);
    return fs.statSync(versionDir).isDirectory();
  }).sort(compareVersionsDesc);

  // 1. バージョンごとのフルデータを先に dataDir に書き出す（メモリに全て保持しない）
  console.log('\nCopying full version data...');
  versions.forEach((version, index) => {
    const progress = Math.round(((index + 1) / versions.length) * 100);
    console.log(`[${progress}%] Copying ${version}...`);

    const versionDir = path.join(udonExposedDir, version);
    const files = fs.readdirSync(versionDir);

    const versionFiles = {};
    for (const file of files) {
      const filePath = path.join(versionDir, file);
      versionFiles[file] = fs.readFileSync(filePath, 'utf-8');
    }

    fs.writeFileSync(
      path.join(dataDir, `${version}.json`),
      JSON.stringify(versionFiles, null, 2)
    );
  });

  // 2. versions.json を書き出し
  fs.writeFileSync(path.join(publicDir, 'versions.json'), JSON.stringify(versions, null, 2));

  // 3. diff 対象の組み合わせを作成
  console.log('\nCalculating diffs...');
  const combinations = [];
  for (let i = 0; i < versions.length; i++) {
    for (let j = i + 1; j < versions.length; j++) {
      const version1 = versions[i];
      const version2 = versions[j];

      if (getMinorVersionDiff(version1, version2) <= 1) {
        combinations.push([version1, version2]);
        combinations.push([version2, version1]);
      }
    }
  }

  // 4. 組み合わせごとに必要な 2 バージョンだけ読み込んで diff を計算
  let processedCombinations = 0;
  for (const [version1, version2] of combinations) {
    processedCombinations++;
    const progress = Math.round((processedCombinations / combinations.length) * 100);
    console.log(`[${progress}%] Calculating diff between ${version1} and ${version2}...`);

    // dataDir から 2 バージョン分だけ読み込む
    const version1Path = path.join(dataDir, `${version1}.json`);
    const version2Path = path.join(dataDir, `${version2}.json`);

    if (!fs.existsSync(version1Path) || !fs.existsSync(version2Path)) {
      console.warn(`Skipping diff for ${version1} and ${version2} because data file is missing.`);
      continue;
    }

    const version1Files = JSON.parse(fs.readFileSync(version1Path, 'utf-8'));
    const version2Files = JSON.parse(fs.readFileSync(version2Path, 'utf-8'));

    const allFiles = new Set([...Object.keys(version1Files), ...Object.keys(version2Files)]);
    const diffResult = [];

    for (const file of allFiles) {
      const content1 = version1Files[file];
      const content2 = version2Files[file];

      if (content1 == null && content2 != null) {
        // 追加されたファイル
        const lines = content2.split('\n').map((line, index) => ({
          text: line + '\n',
          added: true,
          removed: false,
          lineNum1: '',
          lineNum2: index + 1,
        }));
        diffResult.push({ file, lines, type: 'added' });
      } else if (content1 != null && content2 == null) {
        // 削除されたファイル
        const lines = content1.split('\n').map((line, index) => ({
          text: line + '\n',
          added: false,
          removed: true,
          lineNum1: index + 1,
          lineNum2: '',
        }));
        diffResult.push({ file, lines, type: 'removed' });
      } else if (content1 !== content2) {
        // 修正されたファイル
        const differences = diffLines(content1, content2);
        const lineArray = createLineArray(differences);
        const contextualLines = getContextualLines(lineArray);
        if (contextualLines.length > 0) {
          diffResult.push({ file, lines: contextualLines, type: 'modified' });
        }
      }
    }
    fs.writeFileSync(path.join(diffsDir, `${version1}__${version2}.json`), JSON.stringify(diffResult, null, 2));
  }

  console.log('Successfully prepared diffs and versions.json');
}
catch (e) {
  console.error('Failed to prepare diffs:', e);
}
