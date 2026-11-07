import Icon from "./Icon";

type FaqListProps = {
  items: { id: string; question: string; answer: string }[];
  large?: boolean;
};

const FaqList = ({ items, large = false }: FaqListProps) => {
  return (
    <div className="divide-y divide-line rounded-card bg-surface px-6 shadow-card">
      {items.map((item) => (
        <details key={item.id} className={`group ${large ? "py-6" : "py-4"}`}>
          <summary
            className={`flex cursor-pointer list-none items-center justify-between gap-4 font-semibold transition-colors duration-300 ease-out hover:text-primary [&::-webkit-details-marker]:hidden ${
              large ? "text-xl sm:text-2xl" : ""
            }`}
          >
            {item.question}
            <Icon name="chevron-down" className="text-xs transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <p className={`mt-2 text-ink-soft ${large ? "" : "text-sm"}`}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
};

export default FaqList;
