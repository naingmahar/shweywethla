import type { FontOption } from './PageOptionsModal';
import { MYANMAR_FONTS, ENGLISH_FONTS, RX_NEXT, RX_3REM, RX_275REM, RX_25REM } from './htmlReader.constants';

export function getFontList(language?: string): FontOption[] {
  const lang = language?.toLowerCase() ?? '';
  return lang.includes('myanmar') || lang.includes('burmese') || lang === 'mm' || lang === 'my'
    ? MYANMAR_FONTS
    : ENGLISH_FONTS;
}

export function buildPageHtml(
  content: string,
  title: string,
  pageIndex: number,
  totalPages: number,
  bg: string,
  textColor: string,
  isDark: boolean,
  fontSize: number,
  fontCss: string,
  googleFontUrl?: string,
): string {
  let htmlText = content;
  htmlText = htmlText.replace(RX_NEXT, '<br/>');
  htmlText = htmlText.replace(RX_3REM,   `font-size: ${fontSize + 3}px`);
  htmlText = htmlText.replace(RX_275REM, `font-size: ${fontSize + 1}px`);
  htmlText = htmlText.replace(RX_25REM,  `font-size: ${fontSize}px`);

  const stripInlineStyles = (raw: string) =>
    raw
      .replace(/\bbackground(-color)?\s*:[^;]+;?\s*/gi, '')
      .replace(/\bcolor\s*:[^;]+;?\s*/gi, '')
      .replace(/\bfont-family\s*:[^;]+;?\s*/gi, '')
      .trim();

  htmlText = htmlText.replace(/style\s*=\s*"([^"]*)"/gi, (_, s) => {
    const cleaned = stripInlineStyles(s);
    return cleaned ? `style="${cleaned}"` : '';
  });
  htmlText = htmlText.replace(/style\s*=\s*'([^']*)'/gi, (_, s) => {
    const cleaned = stripInlineStyles(s);
    return cleaned ? `style='${cleaned}'` : '';
  });
  htmlText = htmlText.replace(/<font[^>]*>/gi, '').replace(/<\/font>/gi, '');

  const headerColor = isDark ? '#aaa' : '#999';
  const h1Color     = isDark ? '#f0f0f0' : '#1a1a1a';
  const bqBorder    = isDark ? '#555'    : '#c8b99a';
  const bqBg        = isDark ? '#1e1e1e' : '#f3ede0';
  const bqColor     = isDark ? '#ddd'    : '#555';

  return `<html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      ${googleFontUrl ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="${googleFontUrl}">` : ''}
      <style>
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        * { color: ${textColor} !important; background-color: transparent !important; font-family: inherit !important; }
        body {
          font-family: ${fontCss};
          font-size: ${fontSize}px;
          line-height: 1.85;
          color: ${textColor} !important;
          margin: 0;
          padding: 16px 8px 80px 8px;
          background-color: ${bg} !important;
          word-break: break-word;
          text-align: justify;
          -webkit-hyphens: auto;
          hyphens: auto;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          margin-bottom: 20px;
          border-bottom: 1px solid ${isDark ? '#333' : '#d0c9b5'};
          font-size: 14px;
          color: ${headerColor} !important;
        }
        .page-header .book-title {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-style: italic;
          margin-right: 12px;
          font-weight: 700;
        }
        .page-header .page-num { font-weight: 700; white-space: nowrap; }
        p { margin: 0 0 16px 0; text-align: justify; }
        h1 { font-size: 20px; font-weight: 700; color: ${h1Color} !important; margin: 20px 0 10px 0; line-height: 1.4; text-align: center; }
        h2 { font-size: 18px; font-weight: 700; color: ${isDark ? '#e0e0e0' : '#222'} !important; margin: 18px 0 10px 0; line-height: 1.4; text-align: center; }
        h3 { font-size: 17px; font-weight: 700; color: ${isDark ? '#d0d0d0' : '#333'} !important; margin: 16px 0 8px 0; line-height: 1.4; text-align: center; }
        h4 { font-size: 16px; font-weight: 600; color: ${isDark ? '#c0c0c0' : '#444'} !important; margin: 14px 0 6px 0; line-height: 1.4; }
        h5 { font-size: 15px; font-weight: 600; color: ${isDark ? '#aaa' : '#555'} !important; margin: 12px 0 6px 0; line-height: 1.4; }
        h6 { font-size: 14px; font-weight: 600; color: ${isDark ? '#999' : '#666'} !important; margin: 10px 0 4px 0; line-height: 1.4; font-style: italic; }
        blockquote {
          margin: 16px 0; padding: 12px 16px;
          border-left: 4px solid ${bqBorder};
          background-color: ${bqBg} !important;
          color: ${bqColor} !important;
          font-style: italic;
          border-radius: 0 8px 8px 0;
        }
        pre {
          background-color: #2b3440; color: #f0f0f0;
          padding: 16px; border-radius: 10px;
          font-family: "Courier New", Courier, monospace;
          font-size: 14px; margin: 16px 0;
          white-space: pre-wrap; word-wrap: break-word;
        }
        img { max-width: 100%; height: auto; margin: 16px 0; border-radius: 10px; display: block; }
        bi { font-weight: bold; font-style: italic; }
        bic { display: block; font-weight: bold; font-style: italic; text-align: center; }
        c { display: block; text-align: center; }
        .txt-center { text-align: center; }
        .full-width { width: 100%; }
      </style>
    </head>
    <body>
      <div class="page-header">
        <span class="book-title">${title}</span>
        <span class="page-num">${pageIndex + 1} / ${totalPages}</span>
      </div>
      ${htmlText}
    </body>
  </html>`;
}
