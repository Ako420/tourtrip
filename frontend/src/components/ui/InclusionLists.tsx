import Icon from "./Icon";

type InclusionListsProps = {
  included: string[];
  notIncluded: string[];
};

const InclusionLists = ({ included, notIncluded }: InclusionListsProps) => {
  return (
    <section id="included" className="mt-8 scroll-mt-32">
      <h2 className="mb-4 type-section font-bold">What&apos;s included</h2>
      <ul className="flex flex-col gap-3 text-sm">
        {included.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Icon name="check" className="mt-0.5 text-success" />
            {item}
          </li>
        ))}
        {notIncluded.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Icon name="close" className="mt-0.5 text-danger" />
            <span>
              <span className="sr-only">Not included: </span>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default InclusionLists;
