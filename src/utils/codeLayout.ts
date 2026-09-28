import { LyricLine, CodeLanguage, AspectRatio } from '../types';
import { formatTime } from './formatters';

export interface FormattedSubline {
  text: string;
  isFirst: boolean;
  isLast: boolean;
}

export interface FormattedCodeLine {
  id: string;
  index: number;
  lineNumStr: string;
  timestampStr: string;
  prefix: string;
  suffix: string;
  sublines: FormattedSubline[];
  startTime: number;
  endTime: number;
  totalTextLength: number;
}

export function getLanguageTokens(lang: CodeLanguage): { prefix: string; suffix: string } {
  switch (lang) {
    case 'typescript':
      return { prefix: 'yield "', suffix: '";' };
    case 'python':
      return { prefix: 'print("', suffix: '")' };
    case 'bash':
      return { prefix: '$ echo "', suffix: '"' };
    case 'plain':
    default:
      return { prefix: '"', suffix: '"' };
  }
}

/**
 * Chia từ thành các dòng con (sublines) vừa khít khung màn hình
 */
export function wrapLyricText(
  text: string,
  prefix: string,
  maxCharsPerLine: number
): FormattedSubline[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [{ text: '', isFirst: true, isLast: true }];
  }

  const sublines: string[] = [];
  let currentWords: string[] = [];
  // Dòng 1 có thêm prefix, các dòng sau có khoảng thụt lề
  let currentLen = prefix.length;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordLenWithSpace = currentWords.length === 0 ? word.length : word.length + 1;

    if (currentWords.length > 0 && currentLen + wordLenWithSpace > maxCharsPerLine) {
      sublines.push(currentWords.join(' '));
      currentWords = [word];
      currentLen = word.length;
    } else {
      currentWords.push(word);
      currentLen += wordLenWithSpace;
    }
  }

  if (currentWords.length > 0) {
    sublines.push(currentWords.join(' '));
  }

  return sublines.map((s, idx) => ({
    text: s,
    isFirst: idx === 0,
    isLast: idx === sublines.length - 1,
  }));
}

/**
 * Format toàn bộ danh sách lyrics thành các dòng code chuẩn hóa
 */
export function formatAllCodeLines(
  lyrics: LyricLine[],
  lang: CodeLanguage,
  maxCharsPerLine: number
): FormattedCodeLine[] {
  const sorted = [...lyrics].filter((l) => l.synced).sort((a, b) => a.startTime - b.startTime);
  const { prefix, suffix } = getLanguageTokens(lang);

  return sorted.map((line, idx) => {
    const sublines = wrapLyricText(line.text, prefix, maxCharsPerLine);
    return {
      id: line.id,
      index: idx,
      lineNumStr: (idx + 1).toString().padStart(2, '0'),
      timestampStr: `[${formatTime(line.startTime)}]`,
      prefix,
      suffix,
      sublines,
      startTime: line.startTime,
      endTime: line.endTime,
      totalTextLength: line.text.length,
    };
  });
}
