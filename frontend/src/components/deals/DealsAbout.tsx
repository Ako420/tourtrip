import Link from "next/link";
import { Fragment } from "react";
import type { DealsContent } from "@/types";

type DealsAboutProps = {
  about: DealsContent["about"];
  popularFlights: DealsContent["popularFlights"];
};

const headingClass = "font-bold text-ink-soft";

const DealsAbout = ({ about, popularFlights }: DealsAboutProps) => {
  return (
    <section className="mx-auto mt-10 max-w-content space-y-4 text-xs leading-relaxed">
      {about.map((block) => (
        <div key={block.id}>
          <h2 className={headingClass}>{block.title}</h2>
          <p className="mt-2">{block.body}</p>
        </div>
      ))}

      {popularFlights.length > 0 && (
        <div>
          <h2 className={headingClass}>Popular flights</h2>
          <p className="mt-2 text-ink-soft">
            {popularFlights.map((flight, index) => (
              <Fragment key={flight.href}>
                {index > 0 && " | "}
                <Link href={flight.href} className="transition-colors duration-300 ease-out hover:text-primary">
                  {flight.label}
                </Link>
              </Fragment>
            ))}
          </p>
        </div>
      )}
    </section>
  );
};

export default DealsAbout;
