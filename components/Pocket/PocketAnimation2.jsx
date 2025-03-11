"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const imageWidth = 135;

function PocketAnimation() {
  const [containerWidth, setContainerWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setContainerWidth(ref.current.clientWidth);
      console.log(ref.current.clientWidth);
    }
  }, []);

  if (containerWidth === 0) {
    <div ref={ref} className="relative h-[200px] w-full rounded-xl overflow-hidden bg-slate-700" />;
  }

  return (
    <div ref={ref} className="relative h-[200px] w-full rounded-xl overflow-hidden bg-slate-700">
      <motion.img
        style={{
          width: imageWidth,
          position: "absolute",
        }}
        initial={{
          transform: `perspective(400px) rotate3d(0, 1, 0, 90deg) translateX(-200px) translateY(calc(100px - 50%))`,
        }}
        animate={{
          transform: `perspective(400px) rotate3d(0, 1, 0, 0deg) translateX(calc(${containerWidth - imageWidth}px - 12px)) translateY(calc(100px - 50%))`,
        }}
        transition={{
          ease: "backOut",
        }}
        src="https://cf.geekdo-images.com/JUAUWaVUzeBgzirhZNmHHw__thumb/img/ACovMZzGGIsBRyEQXFnsT8282NM=/fit-in/200x150/filters:strip_icc()/pic4254509.jpg"
      />
      <motion.img
        style={{
          width: imageWidth,
          position: "absolute",
        }}
        initial={{
          transform: `perspective(400px) rotate3d(0, 1, 0, 90deg) translateX(-200px) translateY(calc(100px - 50%))`,
        }}
        animate={{
          transform: `perspective(400px) rotate3d(0, 1, 0, 0deg) translateX(calc(${containerWidth / 2}px - 50%)) translateY(calc(100px - 50%))`,
        }}
        transition={{
          delay: 0.1,
          ease: "backOut",
        }}
        src="https://cf.geekdo-images.com/B5F5ulz0UivNgrI9Ky0euA__thumb/img/L8ouPl5jv2Ye9MC4R_Os2zSGigE=/fit-in/200x150/filters:strip_icc()/pic3122349.jpg"
      />
      <motion.img
        style={{
          width: imageWidth,
          position: "absolute",
        }}
        initial={{
          transform: `perspective(400px) rotate3d(0, 1, 0, 90deg) translateX(-200px) translateY(calc(100px - 50%))`,
        }}
        animate={{
          transform: `perspective(400px) rotate3d(0, 1, 0, 0deg) translateX(12px) translateY(calc(100px - 50%))`,
        }}
        transition={{
          delay: 0.2,
          ease: "backOut",
        }}
        src="https://cf.geekdo-images.com/oSM_AuKYfGIwOtKbVEsoVg__thumb/img/NyoufH5YBFCh1rKy4uy76bR4ITk=/fit-in/200x150/filters:strip_icc()/pic4503733.png"
      />
    </div>
  );
}

export default PocketAnimation;
