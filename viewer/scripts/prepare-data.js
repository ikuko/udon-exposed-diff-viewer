
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const udonExposedDir = path.resolve(__dirname, '../../UdonExposed');
  const publicDir = path.resolve(__dirname, '../public');

  const data = {};

  const versions = fs.readdirSync(udonExposedDir);

  for (const version of versions) {
    const versionDir = path.join(udonExposedDir, version);
    const stats = fs.statSync(versionDir);

    if (stats.isDirectory()) {
      data[version] = {};
      const files = fs.readdirSync(versionDir);

      for (const file of files) {
        const filePath = path.join(versionDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        data[version][file] = content;
      }
    }
  }

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'udon-data.json'), JSON.stringify(data, null, 2));

  console.log('Successfully prepared udon-data.json');
}
catch (e) {
  console.log('Failed prepared udon-data.json');
}
