'use client';

import styles from './Button.module.css';

export default function Button({ children, variant = 'primary', onClick, ...props }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
