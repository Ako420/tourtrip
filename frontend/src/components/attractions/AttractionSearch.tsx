"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type AttractionSearchProps = {
  initialQuery?: string;
};

const AttractionSearch = ({ initialQuery = "" }: AttractionSearchProps) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = query.trim();

    router.push(text ? `/attractions?q=${encodeURIComponent(text)}#results` : "/attractions#results");
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="flex h-14 items-center rounded-full bg-surface pr-1.5 pl-5 text-ink shadow-card">
      <Icon name="search" className="text-ink-soft" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search places and things to do"
        aria-label="Search places and things to do"
        className="mx-3 min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
      />
      <Button type="submit" className="rounded-full">
        Search
      </Button>
    </form>
  );
};

export default AttractionSearch;
