"use client";
import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";
import Bild1 from "./Italienische-Rinderrouladen.png";
import Bild2 from "./Italienische-Rinderrouladen2.png";
import Bild3 from "./Italienische-Rinderrouladen3.png";
import Bild4 from "./Italienische-Rinderrouladen4.png";

export function CarouselRezeptBilder() {
  return (
    <Carousel className="w-[650px] h-[500px]">
      <CarouselContent>
        <CarouselItem>
          <Image
            src={Bild1}
            alt="Bild 1"
            
            className="w-[650px] h-[450px] object-cover rounded-xl"
          />
        </CarouselItem>
        <CarouselItem>
          <Image
            src={Bild2}
            alt="Bild 2"
            className="w-[650px] h-[450px] object-cover rounded-xl"
          />
        </CarouselItem>
        <CarouselItem>
          <Image
            src={Bild3}
            alt="Bild 3"
            className="w-[650px] h-[450px] object-cover rounded-xl"
          />
        </CarouselItem>
        <CarouselItem>
          <Image
            src={Bild4}
            alt="Bild 3"
            className="w-[650px] h-[450px] object-cover rounded-xl"
          />
        </CarouselItem>        
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
