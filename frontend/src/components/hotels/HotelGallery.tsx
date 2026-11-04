"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";

type HotelGalleryProps = {
  name: string;
  images: string[];
};

const stepClass =
  "absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-ink shadow-card transition-colors duration-200 hover:text-primary";

const HotelGallery = ({ name, images }: HotelGalleryProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const open = (index: number) => {
    setActiveIndex(index);
    dialogRef.current?.showModal();
  };

  const step = (direction: 1 | -1) => {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  return (
    <section aria-label={`Photos of ${name}`} className="relative mt-4">
      <div className="grid h-64 grid-cols-1 gap-2 overflow-hidden rounded-panel sm:h-96 md:grid-cols-4 md:grid-rows-2">
        {images.slice(0, 5).map((image, index) => (
          <button
            key={image}
            type="button"
            aria-label={`View photo ${index + 1} of ${images.length}`}
            onClick={() => open(index)}
            className={`group relative overflow-hidden bg-surface-alt ${
              index === 0 ? "md:col-span-2 md:row-span-2" : "hidden md:block"
            }`}
          >
            <AppImage
              src={image}
              alt=""
              fill
              priority={index === 0}
              sizes={index === 0 ? "(min-width: 768px) 50vw, 100vw" : "25vw"}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => open(0)}
        className="absolute right-3 bottom-3 flex items-center gap-2 rounded-md bg-surface px-3 py-2 text-sm font-medium shadow-card transition-colors duration-200 hover:text-primary"
      >
        <Icon name="expand" />
        See all {images.length} photos
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`Photos of ${name}`}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="m-auto size-full max-h-none max-w-none bg-transparent backdrop:bg-ink/90"
      >
        <div className="relative mx-auto flex h-full max-w-5xl items-center px-4">
          <div className="relative h-[70vh] w-full">
            <AppImage src={images[activeIndex]} alt={`${name}, photo ${activeIndex + 1}`} fill sizes="100vw" className="object-contain" />
          </div>
          <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className={`${stepClass} left-2`}>
            <Icon name="chevron-left" />
          </button>
          <button type="button" aria-label="Next photo" onClick={() => step(1)} className={`${stepClass} right-2`}>
            <Icon name="chevron-right" />
          </button>
          <button
            type="button"
            aria-label="Close photos"
            onClick={() => dialogRef.current?.close()}
            className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-surface text-ink shadow-card"
          >
            <Icon name="close" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      </dialog>
    </section>
  );
};

export default HotelGallery;
