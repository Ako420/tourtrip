"use client";

import { useState } from "react";
import Icon from "./Icon";

type FavoriteButtonProps = {
  label: string;
};

const FavoriteButton = ({ label }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <button
      type="button"
      aria-label={`Save ${label}`}
      aria-pressed={isFavorite}
      onClick={() => setIsFavorite((current) => !current)}
      className={`absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-surface/90 shadow-card transition-all duration-200 hover:scale-110 hover:bg-surface ${
        isFavorite ? "text-promo" : "text-ink"
      }`}
    >
      <Icon name={isFavorite ? "heart" : "heart-outline"} />
    </button>
  );
};

export default FavoriteButton;
