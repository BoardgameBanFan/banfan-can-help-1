/* eslint-disable @typescript-eslint/no-require-imports */
"use client";

import { useRef, useState, useCallback, useEffect, useTransition } from "react";
import cx from "clsx";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import useClickAway from "react-use/lib/useClickAway";

import useUserStore from "@/stores/useUserStore";

import sty from "./UserQuickInfoModal.module.scss";

const UserQuickInfoModal = ({
  mode = "email", // email | name
  isNotUseBgColor = false,
  isVenue = false,
}) => {
  const refBodyContainer = useRef();
  const refInput = useRef();
  const isOpenUserQuickInfoModal = useUserStore(state => state.isOpenUserQuickInfoModal);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [, startTransition] = useTransition();
  const t = useTranslations();

  const closeModal = useCallback(() => {
    useUserStore.setState({
      isOpenUserQuickInfoModal: false,
    });
  }, []);

  useClickAway(refBodyContainer, closeModal);

  useEffect(() => {
    if (
      isOpenUserQuickInfoModal &&
      // for mobile, keypad will block the input since input auto focus to fast
      window.innerWidth > window.innerHeight
    ) {
      refInput.current?.focus();
    }
    return () => {};
  }, [isOpenUserQuickInfoModal]);

  const handleEmailChange = e => {
    const value = e.target.value;
    startTransition(() => {
      setEmail(value);
      setEmailError(false);

      if (value.includes("@")) {
        const namePart = value.split("@")[0];
        setName(namePart);
        setShowNameInput(true);
      } else {
        setShowNameInput(false);
      }
    });
  };

  const handleNameChange = e => {
    const value = e.target.value;
    startTransition(() => {
      setName(value);
      setNameError(false);
    });
  };

  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleConfirm = e => {
    e.preventDefault();
    let valid = true;

    if (mode === "email" && !validateEmail(email)) {
      setEmailError("Invalid email format");
      valid = false;
    } else {
      setEmailError("");
    }

    if (name.trim() === "") {
      setNameError("Name cannot be empty");
      valid = false;
    } else {
      setNameError("");
    }

    if (valid) {
      // Handle valid form submission
      useUserStore.setState({
        email,
        [isVenue ? "venueName" : "name"]: name,
        isOpenUserQuickInfoModal: false,
      });
      toast.success(t("Ya!! Continue to move on ♟️"), { duration: 2000, position: "top-right" });
    }
  };

  if (!isOpenUserQuickInfoModal) return null;

  return (
    <div
      className={cx(sty.UserQuickInfoModal, {
        [sty.bg__clear]: isNotUseBgColor,
      })}
    >
      <form
        ref={refBodyContainer}
        className={cx("mx-auto max-w-[480px]", sty.modalContent)}
        onSubmit={handleConfirm}
      >
        {/* <span className={sty.closeButton} onClick={closeModal}>
            &times;
          </span> */}
        <img className={sty.img} src={require("./images/surprise.svg").default.src} alt="+" />

        {mode === "email" && (
          <InputEmail
            ref={refInput}
            email={email}
            handleEmailChange={handleEmailChange}
            emailError={emailError}
          />
        )}
        {(showNameInput || mode === "name") && (
          <InputName
            ref={refInput}
            name={name}
            handleNameChange={handleNameChange}
            nameError={nameError}
            isExtend={mode === "email"}
          />
        )}

        <button type="submit" className={sty.btn__confirm}>
          {/* <img
            className={sty.img__icon_plus}
            src={require("../StoriesCardList/images/icon-plus.svg").default.src}
            alt="+"
          /> */}
          Confirm
        </button>
      </form>
    </div>
  );
};

UserQuickInfoModal.propTypes = {};

export default UserQuickInfoModal;

function InputEmail({ email, handleEmailChange, emailError, ...restProps }) {
  return (
    <>
      <input
        type="text"
        placeholder="Your Email*"
        value={email}
        onChange={handleEmailChange}
        {...restProps}
      />
      {emailError && <span className={sty.span__error}>{emailError}</span>}
    </>
  );
}

function InputName({ name, handleNameChange, nameError, isExtend, ...restProps }) {
  return (
    <>
      <label
        className={cx(sty.label__name, {
          [sty.label__isExtend]: isExtend,
        })}
      >
        Display nickname
      </label>
      <input
        type="text"
        placeholder="Your nickname*"
        value={name}
        onChange={handleNameChange}
        {...restProps}
      />
      {nameError && <span className={sty.span__error}>{nameError}</span>}
    </>
  );
}
