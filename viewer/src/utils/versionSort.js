/**
 * バージョン文字列を降順でソートする比較関数
 * - 'v' で始まるバージョンを優先
 * - セマンティックバージョニング (メジャー.マイナー.パッチ) で降順
 * - プレリリース版は正式版より後に並ぶ
 * 
 * @param {string} a - 比較対象のバージョン文字列
 * @param {string} b - 比較対象のバージョン文字列
 * @returns {number} ソート順序
 */
export const compareVersionsDesc = (a, b) => {
  const aIsV = a.startsWith('v');
  const bIsV = b.startsWith('v');

  if (aIsV && !bIsV) return -1;
  if (!aIsV && bIsV) return 1;

  const aMatch = a.match(/v?(\d+)\.(\d+)\.(\d+)(?:-(.*))?/);
  const bMatch = b.match(/v?(\d+)\.(\d+)\.(\d+)(?:-(.*))?/);

  if (!aMatch || !bMatch) {
    return b.localeCompare(a);
  }

  // メジャー・マイナー・パッチを比較（降順）
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
};
