export interface TypescriptEnum {
  TabTypes: "Home" | "About" | "Service";
}

export interface RouteInterface {
  path: string;
  element: React.ReactNode;
  modulename?: string;
  id?: any;
  moduleicon?: string;
}


export type ButtonSize =  'sm' | 'md' | 'xl';
export type ButtonType = 'primary' | 'warning' | 'info' | 'danger' | 'secondary' | 'success';
export type ButtonIconPosition = 'left' | 'right';
export interface ThemeButtonProps {
  size?: ButtonSize;
  type?: ButtonType;
  label?: string;
  icon?: string;
  iconPosition?: ButtonIconPosition;
  apihitting?: boolean;
  apihittingLabel?: string;
  outline?: boolean;
  disabled?: boolean;
  btnStyle?: React.CSSProperties;
  rounded?: boolean;
  isPiIcon?: boolean;
  styleClass?: string;
  btnHref?: string;
  isCustomBtn?: boolean;
  customBtnPath?: string;
  onSubmitEvent?: () => void;
}