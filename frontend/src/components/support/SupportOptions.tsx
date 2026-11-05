import Link from "next/link";
import { supportOptions } from "@/constants";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";

const SupportOptions = () => {
  return (
    <section className="mx-auto mt-10 max-w-content">
      <SectionHeading>More ways to get help</SectionHeading>

      <ul className="grid gap-4 sm:grid-cols-3">
        {supportOptions.map((option) => (
          <li key={option.id}>
            <Link
              href={option.href}
              className="flex h-full flex-col rounded-card border border-line p-5 transition-colors duration-300 ease-out hover:border-primary"
            >
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Icon name={option.iconName} />
              </span>
              <span className="font-semibold">{option.title}</span>
              <span className="mt-1 text-sm text-muted">{option.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SupportOptions;
