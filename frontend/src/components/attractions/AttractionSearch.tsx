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
    <form onSubmit={handleSubmit} role="search" className="flex items-center gap-3">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search places and things to do"
        aria-label="Search places and things to do"
        className="h-14 min-w-0 flex-1 rounded-2xl border border-line bg-transparent px-4 font-medium outline-none transition-colors duration-300 ease-out placeholder:text-muted focus:border-primary"
      />
      <Button type="submit" size="lg" aria-label="Search" className="shrink-0 rounded-full sm:px-6">
        <Icon name="search" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
};

export default AttractionSearch;
