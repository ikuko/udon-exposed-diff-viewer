import { useEffect, useCallback, useRef } from 'react';
import { getQueryParam, setQueryParams, QUERY_KEYS } from '../utils/query';

/**
 * URLクエリパラメータと状態の同期を管理するフック
 * @param {string[]} versions - 利用可能なバージョンリスト
 * @param {string} selectedVersion1 - 選択されているバージョン1
 * @param {string} selectedVersion2 - 選択されているバージョン2
 * @param {function} setSelectedVersion1 - バージョン1の設定関数
 * @param {function} setSelectedVersion2 - バージョン2の設定関数
 * @param {function} handleCompare - Compare関数（オプション）
 */
export const useQuerySync = (
  versions,
  selectedVersion1,
  selectedVersion2,
  setSelectedVersion1,
  setSelectedVersion2,
  handleCompare = null
) => {
  // 初期化フラグ
  const isInitializedRef = useRef(false);
  const shouldAutoCompareRef = useRef(false);
  // 初回のみURLクエリから初期値を設定
  useEffect(() => {
    if (versions.length === 0 || isInitializedRef.current) return;
    
    const queryV1 = getQueryParam(QUERY_KEYS.VERSION_1);
    const queryV2 = getQueryParam(QUERY_KEYS.VERSION_2);
    
    // クエリに有効なバージョンが指定されている場合のみ設定
    const hasValidQuery = (queryV1 && versions.includes(queryV1)) || 
                         (queryV2 && versions.includes(queryV2));
    
    if (hasValidQuery) {
      if (queryV1 && versions.includes(queryV1)) {
        setSelectedVersion1(queryV1);
      }
      
      if (queryV2 && versions.includes(queryV2)) {
        setSelectedVersion2(queryV2);
      }
      
      // 両方のバージョンが有効な場合、自動でCompareを実行
      if (queryV1 && versions.includes(queryV1) && 
          queryV2 && versions.includes(queryV2) && 
          handleCompare) {
        shouldAutoCompareRef.current = true;
      }
    }
    
    isInitializedRef.current = true;
  }, [versions, setSelectedVersion1, setSelectedVersion2, handleCompare]);
  
  // 自動Compare実行
  useEffect(() => {
    if (shouldAutoCompareRef.current && selectedVersion1 && selectedVersion2 && handleCompare) {
      shouldAutoCompareRef.current = false;
      // 次のティックで実行して、状態の更新を完了させる
      setTimeout(() => {
        handleCompare();
      }, 0);
    }
  }, [selectedVersion1, selectedVersion2, handleCompare]);

  // バージョン変更時にURLを更新する関数
  const updateQueryParams = useCallback(() => {
    // 初期化が完了している場合のみURLを更新
    if (isInitializedRef.current && (selectedVersion1 || selectedVersion2)) {
      setQueryParams({
        [QUERY_KEYS.VERSION_1]: selectedVersion1,
        [QUERY_KEYS.VERSION_2]: selectedVersion2
      });
    }
  }, [selectedVersion1, selectedVersion2]);
  
  // バージョンが変更されたらURLを更新
  useEffect(() => {
    updateQueryParams();
  }, [updateQueryParams]);
  
  // ブラウザの戻る/進むボタン対応
  useEffect(() => {
    const handlePopState = () => {
      if (versions.length === 0) return;
      
      const queryV1 = getQueryParam(QUERY_KEYS.VERSION_1);
      const queryV2 = getQueryParam(QUERY_KEYS.VERSION_2);
      
      // 現在の値と異なる場合のみ更新
      if (queryV1 && versions.includes(queryV1) && queryV1 !== selectedVersion1) {
        setSelectedVersion1(queryV1);
      }
      
      if (queryV2 && versions.includes(queryV2) && queryV2 !== selectedVersion2) {
        setSelectedVersion2(queryV2);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [versions, selectedVersion1, selectedVersion2, setSelectedVersion1, setSelectedVersion2]);
  
  return {
    updateQueryParams
  };
};