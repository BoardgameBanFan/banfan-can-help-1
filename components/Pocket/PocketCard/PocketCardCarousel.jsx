"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

function PocketCardCarousel({ images }) {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <Carousel
      className="w-[100px] min-w-[100px]"
      opts={{ loop: true, align: "center" }}
      plugins={[plugin.current]}
    >
      <CarouselContent className="basis-full">
        {images.map(image => (
          <CarouselItem key={image} className="flex flex-col items-center justify-center">
            <img src={image} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default PocketCardCarousel;
