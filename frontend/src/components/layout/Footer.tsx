import Link from "next/link";
import { copyrightText, footerColumns, paymentMethods, socialLinks } from "@/constants";
import Icon from "../ui/Icon";

const Footer = () => {
  return (
    <footer className="bg-surface px-4 lg:px-8">
      <div className="mx-auto max-w-content border-t border-line pt-12 pb-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-[15.25rem_15.25rem_1fr_17.5rem] lg:gap-0">
          {footerColumns.map((column, index) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="mb-4 font-bold">{column.title}</h2>
              <ul className="flex flex-col gap-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {index === 0 && (
                <ul className="mt-6 flex gap-2">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        aria-label={link.label}
                        className="flex size-6 items-center justify-center rounded-full bg-ink-soft text-xs text-white hover:bg-primary"
                      >
                        {link.iconName && <Icon name={link.iconName} />}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          ))}

          <div>
            <h2 className="mb-3 text-sm font-normal text-muted">Payment methods</h2>
            <ul className="grid grid-cols-5 gap-3 text-2xl text-ink-soft">
              {paymentMethods.map((method) => (
                <li
                  key={method.label}
                  title={method.label}
                  className="flex h-7.5 items-center justify-center rounded-sm border border-line"
                >
                  <Icon name={method.iconName} />
                  <span className="sr-only">{method.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-line pt-6 text-center text-xs">{copyrightText}</p>
      </div>
    </footer>
  );
};

export default Footer;
