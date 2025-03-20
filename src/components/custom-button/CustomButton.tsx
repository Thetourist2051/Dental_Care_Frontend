import React, { useEffect, useState } from 'react';
import styles from './CustomButton.module.scss'; // Import the SCSS module
import { ThemeButtonProps } from '../../utils/TypescriptEnum';


const CustomButton: React.FC<ThemeButtonProps> = ({
  size = 'md',
  type = 'primary',
  label,
  icon,
  iconPosition = 'left',
  apihitting = false,
  apihittingLabel,
  outline = false,
  disabled = false,
  btnStyle = {},
  rounded = false,
  isPiIcon = true,
  styleClass = '',
  isCustomBtn = false,
  customBtnPath = null,
  onSubmitEvent,
}) => {
  const [isOutlinedBtn, setIsOutlinedBtn] = useState(0);
  const [isRounded, setIsRounded] = useState(0);

  useEffect(() => {
    setIsOutlinedBtn(outline ? 1 : 0);
    setIsRounded(rounded ? 1 : 0);
  }, [outline, rounded]);

  const handleClick = () => {
    if (onSubmitEvent) {
      onSubmitEvent();
    }
  };

  const buttonClasses = [
    styles[`themeButton_${type}_${isOutlinedBtn}`],
    styles.themeButton, 
    styles[`button_${size}`],
    styles[`button_icon_${iconPosition}`],
    styles[`button_outline_${isOutlinedBtn}`],
    styles[`theme_button_rounded_${isRounded}`],
    styleClass,
    label ? '' : styles.onlyIconPresent, 
  ].join(' ');

  return (
    <button
      style={btnStyle}
      className={buttonClasses}
      disabled={disabled}
      onClick={handleClick}
      type='button'
    >
      {iconPosition === 'left' && (icon || apihitting || customBtnPath) && (
        <div className={styles.btnIcon}>
          {!apihitting && isPiIcon && !isCustomBtn && <i className={`pi pi-${icon}`}></i>}
          {!apihitting && !isPiIcon && !isCustomBtn && <i className="material-icons">{icon}</i>}
          {isCustomBtn && customBtnPath && <img className={styles.btnImg} src={customBtnPath} alt="btn_path" />}
          {apihitting && <i className="pi pi-spinner pi-spin"></i>}
        </div>
      )}
      {!apihitting && label && <div className={styles.btnLabel}>{label}</div>}
      {apihitting && <div className={styles.btnLabel}>{apihittingLabel || 'Please Wait...'}</div>}
      {iconPosition === 'right' && (icon || apihitting || customBtnPath) && (
        <div className={styles.btnIcon}>
          {!apihitting && isPiIcon && !isCustomBtn && <i className={`pi pi-${icon}`}></i>}
          {!apihitting && !isPiIcon && !isCustomBtn && <i className="material-icons">{icon}</i>}
          {isCustomBtn && customBtnPath && <img className={styles.btnImg} src={customBtnPath} alt="btn_path" />}
          {apihitting && <i className="pi pi-spinner pi-spin"></i>}
        </div>
      )}
    </button>
  );
};

export default CustomButton;