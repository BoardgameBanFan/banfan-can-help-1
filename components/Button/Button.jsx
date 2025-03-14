"use client";

import PropTypes from "prop-types";
import styles from "./Button.module.css";

export default function Button({ children, variant = "primary", onClick, ...props }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  onClick: PropTypes.func,
};

Button.defaultProps = {
  variant: "primary",
  onClick: () => {},
};
