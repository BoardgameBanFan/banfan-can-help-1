"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import dynamic from "next/dynamic";
import cx from "clsx";

const BggInput = dynamic(() => import("bgbf-bgg-search"), {
  ssr: false, // 禁用伺服器端渲染
});

import sty from "./BggSearchInput.module.scss";

const BggSearchInput = ({
  className,
  isGetFullGameData,
  handleGetData = (data) => {
    console.log(data);
  },
}) => {
  const handleSelectChanged = useCallback(
    async (res) => {
      try {
        // res is promise
        const data = await res;
        handleGetData(data);
      } catch (error) {
        console.log(error);
        alert("遊戲資料錯誤...？");
      }
    },
    [handleGetData]
  );

  return (
    <div className={cx(className, sty.BggSearchInput)}>
      <BggInput
        className={sty.BggSearchInput}
        onChangeSelect={handleSelectChanged}
        isGetFullGameData={isGetFullGameData}
      />
    </div>
  );
};

BggSearchInput.propTypes = {};

export default BggSearchInput;
