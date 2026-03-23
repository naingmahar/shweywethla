import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview';
import type { ThemeOption, FontOption } from '../PageOptionsModal';
import { buildPageHtml } from '../htmlReader.utils';

interface Params {
  path: string;
  title: string;
  localPageDir?: string;
  knownTotalPages?: number;
  htmlTheme: ThemeOption;
  fontSize: number;
  currentFont: FontOption;
}

export interface PageManagerResult {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
  pageContent: string;
  currentPageHtml: string;
  isFileLoading: boolean;
  isWebViewLoading: boolean;
  setIsWebViewLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fileError: string | null;
  showGuide: boolean;
  setShowGuide: React.Dispatch<React.SetStateAction<boolean>>;
  sendCommand: (prompt: 'next' | 'previous') => void;
  INJECTED_JAVASCRIPT: string;
  webViewRef: React.RefObject<WebView>;
}

export function useReaderPageManager({
  path,
  title,
  localPageDir,
  knownTotalPages,
  htmlTheme,
  fontSize,
  currentFont,
}: Params): PageManagerResult {
  const isPerPageMode = !!localPageDir;

  // Legacy full-file mode
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  // Per-page mode
  const [currentPageContent, setCurrentPageContent] = useState('');
  const [totalPageCount, setTotalPageCount] = useState(knownTotalPages ?? 0);
  const pageCache   = useRef<Map<number, string>>(new Map());
  const prefetching = useRef<Set<number>>(new Set());

  const [currentPage, setCurrentPage]       = useState(0);
  const [isPageRestored, setIsPageRestored] = useState(false);
  const [isFileLoading, setIsFileLoading]   = useState(true);
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);
  const [fileError, setFileError]           = useState<string | null>(null);
  const [showGuide, setShowGuide]           = useState(false);

  const webViewRef  = useRef<WebView>(null);
  const saveTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Progress file lives next to the book pages (or alongside the legacy file)
  const progressFile = localPageDir
    ? `${localPageDir}/progress.json`
    : `${path}.progress`;

  // Step 1: Restore last-read page from file
  useEffect(() => {
    RNFS.readFile(progressFile, 'utf8')
      .then(data => {
        const saved = JSON.parse(data)?.page;
        if (typeof saved === 'number') setCurrentPage(saved);
        else setShowGuide(true);
      })
      .catch(() => setShowGuide(true)) // file not found = first open
      .finally(() => setIsPageRestored(true));
  }, [progressFile]);

  // Step 2: Debounced page save to file
  useEffect(() => {
    if (!isPageRestored) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      RNFS.writeFile(progressFile, JSON.stringify({ page: currentPage }), 'utf8')
        .catch(e => console.error('Failed to save progress', e));
    }, 400);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [currentPage, isPageRestored, progressFile]);

  // Prefetch neighbour pages into cache
  const prefetchPage = useCallback((idx: number) => {
    if (!localPageDir) return;
    if (idx < 0 || idx >= totalPageCount) return;
    if (pageCache.current.has(idx) || prefetching.current.has(idx)) return;
    prefetching.current.add(idx);
    RNFS.readFile(`${localPageDir}/page_${idx}.txt`, 'utf8')
      .then(content => {
        pageCache.current.set(idx, content);
        for (const key of pageCache.current.keys()) {
          if (Math.abs(key - idx) > 5) pageCache.current.delete(key);
        }
      })
      .catch(() => {})
      .finally(() => prefetching.current.delete(idx));
  }, [localPageDir, totalPageCount]);

  // Step 3a: Per-page mode load
  useEffect(() => {
    if (!isPerPageMode || !localPageDir) return;
    let cancelled = false;
    const load = async () => {
      // Only show loading spinner on initial open (meta not yet loaded)
      // — not on every page flip, which would flash white on rapid tapping
      const isInitialLoad = totalPageCount === 0;
      if (isInitialLoad) setIsFileLoading(true);

      try {
        if (isInitialLoad) {
          const meta = JSON.parse(await RNFS.readFile(`${localPageDir}/meta.json`, 'utf8'));
          if (cancelled) return;
          console.log(`[HtmlReader] meta loaded: totalPages=${meta.totalPages} dir=${localPageDir}`);
          setTotalPageCount(meta.totalPages);
          setCurrentPage(p => Math.min(p, Math.max(0, meta.totalPages - 1)));
        }
        const fromCache = pageCache.current.has(currentPage);
        let content = pageCache.current.get(currentPage);
        if (!content) {
          content = await RNFS.readFile(`${localPageDir}/page_${currentPage}.txt`, 'utf8');
          if (cancelled) return;
          pageCache.current.set(currentPage, content);
        }
        console.log(`[HtmlReader] page=${currentPage + 1}/${totalPageCount} source=${fromCache ? 'cache' : 'disk'} bytes=${content?.length ?? 0} empty=${!content?.trim()}`);
        if (!content?.trim()) {
          Alert.alert('Empty Page', `Page ${currentPage + 1} has no content.\n\nPath: ${localPageDir}/page_${currentPage}.txt\nFile size: ${content?.length ?? 0} bytes`, [{ text: 'OK' }]);
        }
        if (!cancelled) setCurrentPageContent(content);
        prefetchPage(currentPage + 1);
        prefetchPage(currentPage + 2);
        prefetchPage(currentPage - 1);
      } catch (err: any) {
        if (cancelled) return;
        const msg = err?.message ?? String(err);
        console.error('Per-page load failed:', err);
        const detail = `Page ${currentPage} load failed.\n\nPath: ${localPageDir}/page_${currentPage}.txt\n\nError: ${msg}`;
        Alert.alert('Load Error', detail, [{ text: 'OK' }]);
        setFileError(detail);
      } finally {
        // Always clear loading — even when cancelled, so the next effect
        // that re-runs due to totalPageCount change doesn't get stuck
        setIsFileLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isPerPageMode, localPageDir, currentPage, totalPageCount, prefetchPage]);

  // Step 3b: Legacy full-file mode
  useEffect(() => {
    if (isPerPageMode) return;
    setIsFileLoading(true);
    RNFS.readFile(path, 'utf8')
      .then(content => {
        const parsed = content.split('---').map(p => p.trim()).filter(p => p.length > 0);
        console.log(`[HtmlReader] legacy mode: path=${path} totalPages=${parsed.length} fileBytes=${content.length}`);
        if (parsed.length === 0) {
          Alert.alert('Empty Book', `Book file loaded but has no pages.\n\nPath: ${path}\nFile size: ${content.length} bytes\nExpected "---" separators between pages.`, [{ text: 'OK' }]);
        }
        setParagraphs(parsed);
        setCurrentPage(p => Math.min(p, Math.max(0, parsed.length - 1)));
      })
      .catch((err: any) => {
        const msg = err?.message ?? String(err);
        console.error('Legacy load failed:', err);
        const detail = `Failed to load book.\n\nPath: ${path}\n\nError: ${msg}`;
        Alert.alert('Load Error', detail, [{ text: 'OK' }]);
        setFileError(detail);
      })
      .finally(() => setIsFileLoading(false));
  }, [path, isPerPageMode]);

  // Unified view
  const pageCount   = isPerPageMode ? totalPageCount : paragraphs.length;
  const pageContent = isPerPageMode ? currentPageContent : (paragraphs[currentPage] ?? '');

  const currentPageHtml = useMemo(() => {
    if (pageCount === 0 || !pageContent) {
      return `<html><body style="margin:0;padding:0;background-color:${htmlTheme.bg};"></body></html>`;
    }
    return buildPageHtml(
      pageContent, title, currentPage, pageCount,
      htmlTheme.bg, htmlTheme.color, htmlTheme.dark,
      fontSize, currentFont.css, currentFont.googleFontUrl,
    );
  }, [pageContent, pageCount, currentPage, title, htmlTheme, fontSize, currentFont]);

  const sendCommand = useCallback((prompt: 'next' | 'previous') => {
    if (pageCount <= 1) return;
    setIsWebViewLoading(true);
    if (prompt === 'next') setCurrentPage(c => Math.min(c + 1, pageCount - 1));
    else                   setCurrentPage(c => Math.max(c - 1, 0));
  }, [pageCount]);

  const INJECTED_JAVASCRIPT = useMemo(() => `
    if (!document.body) { true; }
    else {
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.webkitTouchCallout = 'none';
    if (!window.__swipeListenersAdded) {
      window.__swipeListenersAdded = true;
      var touchStartX = 0, touchStartY = 0;
      document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      document.addEventListener('touchend', function(e) {
        var totalPages = window.__totalPages || 1;
        if (totalPages <= 1) return;
        var touchEndX = e.changedTouches[0].clientX;
        var touchEndY = e.changedTouches[0].clientY;
        var diffX = Math.abs(touchEndX - touchStartX);
        var diffY = Math.abs(touchEndY - touchStartY);
        if (diffX < 10 && diffY < 10) {
          if (touchStartX < window.innerWidth / 2) window.ReactNativeWebView.postMessage('previous');
          else window.ReactNativeWebView.postMessage('next');
        }
      }, { passive: true });
    }
    window.__totalPages = ${pageCount};
    } // end else
    true;
  `, [pageCount]);

  return {
    currentPage, setCurrentPage,
    pageCount, pageContent,
    currentPageHtml,
    isFileLoading,
    isWebViewLoading, setIsWebViewLoading,
    fileError,
    showGuide, setShowGuide,
    sendCommand,
    INJECTED_JAVASCRIPT,
    webViewRef,
  };
}
