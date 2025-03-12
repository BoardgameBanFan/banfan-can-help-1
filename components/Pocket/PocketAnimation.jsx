"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

function PocketAnimation({ games, pocketId }) {
  const { data } = useSWR(`/pocket/${pocketId}/games`, null, {
    fallbackData: games,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [images, setImage] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setContainerWidth(ref.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    setContainerWidth(0);
    setImage(data.map(({ game }) => game.thumbnail));

    setTimeout(() => setContainerWidth(ref.current.clientWidth), 100);
  }, [data]);

  if (containerWidth === 0) {
    return (
      <div
        ref={ref}
        className="relative h-[200px] w-full rounded-xl overflow-hidden bg-slate-400"
      />
    );
  }

  const imageWidth = 160;

  return (
    <div ref={ref} className="relative h-[200px] w-full rounded-xl overflow-hidden bg-slate-400">
      {images.map((image, index) => (
        <motion.img
          key={image}
          src={image}
          style={{
            width: imageWidth,
            position: "absolute",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
          }}
          initial={{
            y: "calc(100px - 50%)",
          }}
          animate={{
            x: [
              -imageWidth,
              containerWidth / 2 - imageWidth / 2,
              containerWidth / 2 - imageWidth / 2,
              containerWidth,
            ],
            rotateY: [0, "20deg", 0, 0],
            rotateX: [0, "10deg", 0, 0],
          }}
          transformTemplate={(_, generated) => `perspective(400px) ${generated}`}
          transition={{
            repeat: Infinity,
            repeatDelay: 1.5 * (images.length - 1),
            delay: index * 1.5,
            duration: 2,
            ease: "backOut",
            times: [0, 0.5, 0.8, 1],
          }}
        />
      ))}
    </div>
  );
}

export default PocketAnimation;
