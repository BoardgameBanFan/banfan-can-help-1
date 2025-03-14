"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const images = [
  "https://cf.geekdo-images.com/JUAUWaVUzeBgzirhZNmHHw__thumb/img/ACovMZzGGIsBRyEQXFnsT8282NM=/fit-in/200x150/filters:strip_icc()/pic4254509.jpg",
  "https://cf.geekdo-images.com/B5F5ulz0UivNgrI9Ky0euA__thumb/img/L8ouPl5jv2Ye9MC4R_Os2zSGigE=/fit-in/200x150/filters:strip_icc()/pic3122349.jpg",
  "https://cf.geekdo-images.com/oSM_AuKYfGIwOtKbVEsoVg__thumb/img/NyoufH5YBFCh1rKy4uy76bR4ITk=/fit-in/200x150/filters:strip_icc()/pic4503733.png",
  "https://cf.geekdo-images.com/awmZ9rYy-hTgea6Vdp_OoQ__thumb/img/OBVCWq284XUhX2sKlMwoilFfuGk=/fit-in/200x150/filters:strip_icc()/pic1299390.jpg",
  "https://cf.geekdo-images.com/T1ltXwapFUtghS9A7_tf4g__thumb/img/GtNX7gCmGpw39Tr6JApWC3Aga5U=/fit-in/200x150/filters:strip_icc()/pic1401448.jpg",
];

function PocketAnimation() {
  const [containerWidth, setContainerWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setContainerWidth(ref.current.clientWidth);
    }
  }, []);

  if (containerWidth === 0) {
    return (
      <div
        ref={ref}
        className="relative h-[200px] w-full rounded-xl overflow-hidden bg-slate-600"
      />
    );
  }

  const imageWidth = containerWidth / 5;
  const duration = 20;

  return (
    <div
      ref={ref}
      className="relative w-full rounded-xl overflow-hidden bg-slate-600 before:absolute before:w-full before:h-full before:bg-black before:z-10 before:opacity-80"
      style={{
        height: imageWidth * 2,
      }}
    >
      <h1 className="absolute w-full top-1/2 -translate-y-1/2 left-0 z-20 text-white text-3xl font-bold text-center">
        Kuan 最愛的十款遊戲
      </h1>

      <motion.div
        style={{ display: "flex", position: "absolute" }}
        initial={{ x: 0 }}
        animate={{ x: containerWidth }}
        transition={{
          repeat: Infinity,
          duration,
          ease: "linear",
        }}
      >
        {images.map(image => (
          <div key={image} style={{ width: imageWidth, height: imageWidth }}>
            <img
              src={image}
              style={{
                width: "auto",
                height: "100%",
                objectFit: "cover",
                margin: "auto",
              }}
            />
          </div>
        ))}
      </motion.div>
      <motion.div
        style={{ display: "flex", position: "absolute" }}
        initial={{ x: -containerWidth }}
        animate={{ x: 0 }}
        transition={{
          repeat: Infinity,
          duration,
          ease: "linear",
        }}
      >
        {images.map(image => (
          <div key={image} style={{ width: imageWidth, height: imageWidth }}>
            <img
              src={image}
              style={{
                width: "auto",
                height: "100%",
                objectFit: "cover",
                margin: "auto",
              }}
            />
          </div>
        ))}
      </motion.div>

      <motion.div
        style={{ display: "flex", position: "absolute" }}
        initial={{ x: 0, y: imageWidth }}
        animate={{ x: -containerWidth }}
        transition={{
          repeat: Infinity,
          duration,
          ease: "linear",
        }}
      >
        {images.map(image => (
          <div key={image} style={{ width: imageWidth, height: imageWidth }}>
            <img
              src={image}
              style={{
                width: "auto",
                height: "100%",
                objectFit: "cover",
                margin: "auto",
              }}
            />
          </div>
        ))}
      </motion.div>
      <motion.div
        style={{ display: "flex", position: "absolute" }}
        initial={{ x: containerWidth, y: imageWidth }}
        animate={{ x: 0 }}
        transition={{
          repeat: Infinity,
          duration,
          ease: "linear",
        }}
      >
        {images.map(image => (
          <div key={image} style={{ width: imageWidth, height: imageWidth }}>
            <img
              src={image}
              style={{
                width: "auto",
                height: "100%",
                objectFit: "cover",
                margin: "auto",
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default PocketAnimation;
