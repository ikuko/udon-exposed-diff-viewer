/**
 * URLクエリパラメータの取得
 * @param {string} param - 取得するパラメータ名
 * @returns {string | null} パラメータの値、存在しない場合はnull
 */
export const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

/**
 * URLクエリパラメータの設定
 * @param {Object} params - 設定するパラメータのオブジェクト
 * @param {boolean} replace - trueの場合replaceState、falseの場合pushState（デフォルト: true）
 */
export const setQueryParams = (params, replace = true) => {
  const url = new URL(window.location);
  
  // 既存のパラメータを保持し、新しいパラメータで上書き
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  
  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', url);
};

/**
 * 現在のURLクエリパラメータを全て取得
 * @returns {Object} パラメータのオブジェクト
 */
export const getAllQueryParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  return params;
};

/**
 * バージョン選択用のクエリキー
 */
export const QUERY_KEYS = {
  VERSION_1: 'v1',
  VERSION_2: 'v2'
};