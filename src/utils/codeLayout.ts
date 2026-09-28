import { LyricLine, CodeLanguage } from '../types';
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
  indent: string;
  sublines: FormattedSubline[];
  startTime: number;
  endTime: number;
  totalTextLength: number;
}

export function getLanguageTokens(lang: CodeLanguage): { prefix: string; suffix: string; indent: string } {
  switch (lang) {
    case 'typescript':
      return { prefix: 'yield "', suffix: '";', indent: '  ' };
    case 'python':
      return { prefix: 'print("', suffix: '")', indent: '  ' };
    case 'bash':
      return { prefix: '$ echo "', suffix: '"', indent: '  ' };
    case 'plain':
    default:
      return { prefix: '"', suffix: '"', indent: '  ' };
  }
}

/**
 * Chia từ thành các dòng con (sublines) đảm bảo không bao giờ bị tràn lề phải
 */
export function wrapLyricText(
  text: string,
  prefix: string,
  suffix: string,
  indent: string,
  totalCodeChars: number
): FormattedSubline[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [{ text: '', isFirst: true, isLast: true }];
  }

  // Giới hạn an toàn tuyệt đối: dòng 1 trừ prefix, các dòng sau trừ indent và suffix
  const firstLineMaxChars = Math.max(8, totalCodeChars - prefix.length - 1);
  const nextLineMaxChars = Math.max(8, totalCodeChars - indent.length - suffix.length - 1);

  const sublines: string[] = [];
  let currentWords: string[] = [];
  let currentLen = 0;
  let isFirstLine = true;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordLenWithSpace = currentWords.length === 0 ? word.length : word.length + 1;
    const maxChars = isFirstLine ? firstLineMaxChars : nextLineMaxChars;

    if (currentWords.length > 0 && currentLen + wordLenWithSpace > maxChars) {
      sublines.push(currentWords.join(' '));
      currentWords = [word];
      currentLen = word.length;
      isFirstLine = false;
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
  totalCodeChars: number
): FormattedCodeLine[] {
  const sorted = [...lyrics].filter((l) => l.synced).sort((a, b) => a.startTime - b.startTime);
  const { prefix, suffix, indent } = getLanguageTokens(lang);

  return sorted.map((line, idx) => {
    const sublines = wrapLyricText(line.text, prefix, suffix, indent, totalCodeChars);
    return {
      id: line.id,
      index: idx,
      lineNumStr: (idx + 1).toString().padStart(2, '0'),
      timestampStr: `[${formatTime(line.startTime)}]`,
      prefix,
      suffix,
      indent,
      sublines,
      startTime: line.startTime,
      endTime: line.endTime,
      totalTextLength: line.text.length,
    };
  });
}
