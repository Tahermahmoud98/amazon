
export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textColor?: string;
  backgroundColor?: string;
}

export interface CellData {
  id: string;
  content: string;
  style: CellStyle;
}

export interface TableState {
  title: string;
  rows: CellData[][]; // header is rows[0]
  theme: string;
}

export enum ThemeKey {
  DEFAULT_BLUE = 'theme-default-blue',
  DARK = 'theme-dark',
  PROFESSIONAL_GRAY = 'theme-professional-gray',
  STRIPED_GREEN = 'theme-striped-green',
  SUNSET = 'theme-sunset',
  OCEAN = 'theme-ocean',
  FOREST = 'theme-forest',
  CLASSIC_BOOK = 'theme-classic-book',
  MIDNIGHT = 'theme-midnight',
  SUNNY = 'theme-sunny',
  BOLD_RED = 'theme-bold-red',
  CLEAN_WHITE = 'theme-clean-white',
  TECH_GRID = 'theme-tech-grid',
  VINTAGE_PAPER = 'theme-vintage-paper',
  SOFT_PINK = 'theme-soft-pink',
  ORANGE_VIBE = 'theme-orange-vibe',
  HIGH_CONTRAST = 'theme-high-contrast',
  BORDERED_BLUE = 'theme-bordered-blue',
  MINIMALIST = 'theme-minimalist',
  BORDERLESS = 'theme-borderless'
}
