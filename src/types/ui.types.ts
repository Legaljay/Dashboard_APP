export interface ITheme {
  mode: 'light' | 'dark' | 'system';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    error: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    border: string;
    divider: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  zIndex: {
    modal: number;
    popup: number;
    tooltip: number;
    dropdown: number;
  };
}

export interface IUIState {
  theme: ITheme;
  sidebar: {
    isOpen: boolean;
    width: number;
  };
  modal: {
    isOpen: boolean;
    component?: string;
    props?: Record<string, any>;
  };
  toast: {
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  };
  loading: {
    isLoading: boolean;
    message?: string;
  };
}

export interface IMenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: IMenuItem[];
  permissions?: string[];
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

export interface ITableColumn {
  id: string;
  label: string;
  field: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
}

export interface IFormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'radio' | 'textarea';
  value: any;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  options?: Array<{
    label: string;
    value: any;
  }>;
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | undefined;
  };
}

export interface IChart {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
    }>;
  };
  options?: Record<string, any>;
}
