import { EditorTheme } from '../types';

export interface ThemeConfig {
  id: EditorTheme;
  name: string;
  icon: string;
  bg: string;
  appBg: string;
  titleBarBg: string;
  titleBarBorder: string;
  titleBarText: string;
  tabActiveBg: string;
  gutterBg: string;
  gutterText: string;
  gutterActiveText: string;
  timestampColor: string;
  activeTimestampColor: string;
  keywordColor: string;
  punctuationColor: string;
  stringColor: string;
  inactiveStringColor: string;
  activeLineBg: string;
  activeLineBorder: string;
  cursorColor: string;
  glowColor: string;
  badgeBg: string;
}

export const THEMES: Record<EditorTheme, ThemeConfig> = {
  'vscode-dark': {
    id: 'vscode-dark',
    name: 'VS Code Dark+',
    icon: '💻',
    bg: '#1e1e1e',
    appBg: '#0b0c10',
    titleBarBg: '#252526',
    titleBarBorder: '#333333',
    titleBarText: '#cccccc',
    tabActiveBg: '#1e1e1e',
    gutterBg: '#1e1e1e',
    gutterText: '#6e7681',
    gutterActiveText: '#c6c6c6',
    timestampColor: '#4ec9b0',
    activeTimestampColor: '#569cd6',
    keywordColor: '#569cd6',
    punctuationColor: '#d4d4d4',
    stringColor: '#ce9178',
    inactiveStringColor: '#6e7681',
    activeLineBg: 'rgba(255, 255, 255, 0.06)',
    activeLineBorder: '#007acc',
    cursorColor: '#aeafad',
    glowColor: 'rgba(206, 145, 120, 0.4)',
    badgeBg: '#0e639c',
  },
  'tokyo-night': {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    icon: '🌃',
    bg: '#1a1b26',
    appBg: '#0e1017',
    titleBarBg: '#1f2335',
    titleBarBorder: '#292e42',
    titleBarText: '#c0caf5',
    tabActiveBg: '#1a1b26',
    gutterBg: '#1a1b26',
    gutterText: '#565f89',
    gutterActiveText: '#7aa2f7',
    timestampColor: '#bb9af7',
    activeTimestampColor: '#7dcfff',
    keywordColor: '#bb9af7',
    punctuationColor: '#89ddff',
    stringColor: '#9ece6a',
    inactiveStringColor: '#565f89',
    activeLineBg: 'rgba(122, 162, 247, 0.1)',
    activeLineBorder: '#7aa2f7',
    cursorColor: '#c0caf5',
    glowColor: 'rgba(158, 206, 106, 0.5)',
    badgeBg: '#7aa2f7',
  },
  'dracula': {
    id: 'dracula',
    name: 'Dracula Pro',
    icon: '🧛',
    bg: '#282a36',
    appBg: '#16171d',
    titleBarBg: '#21222c',
    titleBarBorder: '#44475a',
    titleBarText: '#f8f8f2',
    tabActiveBg: '#282a36',
    gutterBg: '#282a36',
    gutterText: '#6272a4',
    gutterActiveText: '#f1fa8c',
    timestampColor: '#8be9fd',
    activeTimestampColor: '#ff79c6',
    keywordColor: '#ff79c6',
    punctuationColor: '#f8f8f2',
    stringColor: '#f1fa8c',
    inactiveStringColor: '#6272a4',
    activeLineBg: 'rgba(68, 71, 90, 0.35)',
    activeLineBorder: '#bd93f9',
    cursorColor: '#f8f8f2',
    glowColor: 'rgba(241, 250, 140, 0.45)',
    badgeBg: '#bd93f9',
  },
  'matrix': {
    id: 'matrix',
    name: 'Matrix Hacker',
    icon: '⚡',
    bg: '#0a0f0d',
    appBg: '#020504',
    titleBarBg: '#07150e',
    titleBarBorder: '#133821',
    titleBarText: '#22c55e',
    tabActiveBg: '#0a0f0d',
    gutterBg: '#0a0f0d',
    gutterText: '#166534',
    gutterActiveText: '#4ade80',
    timestampColor: '#22c55e',
    activeTimestampColor: '#86efac',
    keywordColor: '#4ade80',
    punctuationColor: '#22c55e',
    stringColor: '#86efac',
    inactiveStringColor: '#166534',
    activeLineBg: 'rgba(34, 197, 94, 0.12)',
    activeLineBorder: '#22c55e',
    cursorColor: '#22c55e',
    glowColor: 'rgba(74, 222, 128, 0.7)',
    badgeBg: '#15803d',
  },
  'monokai': {
    id: 'monokai',
    name: 'Monokai Pro',
    icon: '🎨',
    bg: '#272822',
    appBg: '#151612',
    titleBarBg: '#1e1f1c',
    titleBarBorder: '#3e3d32',
    titleBarText: '#f8f8f2',
    tabActiveBg: '#272822',
    gutterBg: '#272822',
    gutterText: '#75715e',
    gutterActiveText: '#a6e22e',
    timestampColor: '#66d9ef',
    activeTimestampColor: '#fd971f',
    keywordColor: '#f92672',
    punctuationColor: '#f8f8f2',
    stringColor: '#e6db74',
    inactiveStringColor: '#75715e',
    activeLineBg: 'rgba(255, 255, 255, 0.08)',
    activeLineBorder: '#a6e22e',
    cursorColor: '#f8f8f0',
    glowColor: 'rgba(230, 219, 116, 0.5)',
    badgeBg: '#f92672',
  },
  'cyberpunk': {
    id: 'cyberpunk',
    name: 'Cyberpunk Amber',
    icon: '🔥',
    bg: '#120c04',
    appBg: '#060401',
    titleBarBg: '#1a1106',
    titleBarBorder: '#38260b',
    titleBarText: '#fbbf24',
    tabActiveBg: '#120c04',
    gutterBg: '#120c04',
    gutterText: '#784f10',
    gutterActiveText: '#f59e0b',
    timestampColor: '#d97706',
    activeTimestampColor: '#fde047',
    keywordColor: '#f59e0b',
    punctuationColor: '#fbbf24',
    stringColor: '#fef08a',
    inactiveStringColor: '#784f10',
    activeLineBg: 'rgba(245, 158, 11, 0.15)',
    activeLineBorder: '#f59e0b',
    cursorColor: '#fbbf24',
    glowColor: 'rgba(245, 158, 11, 0.65)',
    badgeBg: '#d97706',
  },
};
