import { useState, useCallback, useEffect } from "react";
import cx from "clsx";

import sty from "./SwitchToggler.module.scss";

const SwitchToggler = ({ className, isActivate, handleClick, ...resetProps }) => {
  const [isOpen, setIsOpen] = useState(isActivate);

  useEffect(() => {
    setIsOpen(isActivate);
    return () => {};
  }, [isActivate]);

  const onClick = useCallback(
    e => {
      setIsOpen(state => {
        handleClick?.(e, !state);
        return !state;
      });
    },
    [handleClick]
  );

  return (
    <div
      className={cx(sty.SwitchToggler, className, {
        [sty.open]: isOpen,
      })}
      onClick={onClick}
      {...resetProps}
    >
      <span>{isOpen ? "Opening" : "Closed"}</span>
      <div className={sty.dot} />
    </div>
  );
};

SwitchToggler.propTypes = {};

export default SwitchToggler;
