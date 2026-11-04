import Icon from "./Icon";

type PaginationProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

const buttonClass =
  "flex size-10 items-center justify-center rounded-md text-sm font-medium transition-colors duration-300 ease-out disabled:text-line";

const Pagination = ({ page, pageCount, onChange }: PaginationProps) => {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Results pages" className="mt-6 flex justify-center gap-1">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={`${buttonClass} hover:text-primary`}
      >
        <Icon name="chevron-left" />
      </button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          type="button"
          aria-label={`Page ${number}`}
          aria-current={number === page ? "page" : undefined}
          onClick={() => onChange(number)}
          className={`${buttonClass} ${number === page ? "bg-primary text-white" : "hover:bg-surface-alt"}`}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
        className={`${buttonClass} hover:text-primary`}
      >
        <Icon name="chevron-right" />
      </button>
    </nav>
  );
};

export default Pagination;
