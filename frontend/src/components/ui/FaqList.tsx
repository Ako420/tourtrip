import Icon from "./Icon";

type FaqListProps = {
  items: { id: string; question: string; answer: string }[];
};

const FaqList = ({ items }: FaqListProps) => {
  return (
    <div className="divide-y divide-line rounded-card px-5 shadow-card">
      {items.map((item) => (
        <details key={item.id} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold transition-colors duration-300 ease-out hover:text-primary [&::-webkit-details-marker]:hidden">
            {item.question}
            <Icon name="chevron-down" className="text-xs transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-sm text-ink-soft">{item.answer}</p>
        </details>
      ))}
    </div>
  );
};

export default FaqList;
