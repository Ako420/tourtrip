"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "./Icon";

type CarouselProps = {
  label: string;
  slideClassName: string;
  children: ReactNode;
};

const arrowClass =
  "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface shadow-card transition-colors duration-200 hover:text-primary";

const Carousel = ({ label, slideClassName, children }: CarouselProps) => {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState({ back: false, forward: false });

  const updateArrows = () => {
    const track = trackRef.current;

    if (track) {
      setCanScroll({
        back: track.scrollLeft > 0,
        forward: track.scrollLeft + track.clientWidth < track.scrollWidth - 1,
      });
    }
  };

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const observer = new ResizeObserver(updateArrows);
    observer.observe(track);

    return () => observer.disconnect();
  }, []);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;

    track?.scrollBy({ left: direction * track.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul ref={trackRef} onScroll={updateArrows} className="scrollbar-none flex snap-x gap-4 overflow-x-auto">
        {Children.map(children, (child) => (
          <li className={`shrink-0 snap-start ${slideClassName}`}>{child}</li>
        ))}
      </ul>

      {canScroll.back && (
        <button type="button" aria-label={`Previous ${label}`} onClick={() => scroll(-1)} className={`${arrowClass} -left-3 lg:-left-5`}>
          <Icon name="chevron-left" />
        </button>
      )}
      {canScroll.forward && (
        <button type="button" aria-label={`More ${label}`} onClick={() => scroll(1)} className={`${arrowClass} -right-3 lg:-right-5`}>
          <Icon name="chevron-right" />
        </button>
      )}
    </div>
  );
};

export default Carousel;
