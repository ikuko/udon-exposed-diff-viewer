
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const udonExposedDir = path.resolve(__dirname, '../../UdonExposed');
  const publicDir = path.resolve(__dirname, '../public');
  const dataDir = path.resolve(publicDir, 'data');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const versions = fs.readdirSync(udonExposedDir).filter(version => {
    const versionDir = path.join(udonExposedDir, version);
    return fs.statSync(versionDir).isDirectory();
  });

  for (const version of versions) {
    const versionDir = path.join(udonExposedDir, version);
    const versionData = {};
    const files = fs.readdirSync(versionDir);

    for (const file of files) {
      const filePath = path.join(versionDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      versionData[file] = content;
    }
    fs.writeFileSync(path.join(dataDir, `${version}.json`), JSON.stringify(versionData, null, 2));
  }

  fs.writeFileSync(path.join(publicDir, 'versions.json'), JSON.stringify(versions, null, 2));

  console.log('Successfully prepared versioned data and versions.json');
}
catch (e) {
  console.error('Failed to prepare versioned data:', e);
}
