import Link from "next/link";
import { copyrightText, footerColumns, paymentMethods, socialLinks } from "@/constants";
import Icon from "../ui/Icon";

const Footer = () => {
  return (
    <footer className="bg-surface-alt px-4 pt-10 pb-8 lg:px-8">
      <div className="mx-auto max-w-content">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {footerColumns.map((column, index) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="mb-3 text-sm font-bold">{column.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-ink-soft hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {index === 0 && (
                <ul className="mt-4 flex gap-2">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        aria-label={link.label}
                        className="flex size-8 items-center justify-center rounded-full bg-ink-soft text-sm text-white hover:bg-primary"
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
            <h2 className="mb-3 text-sm font-bold">Payment methods</h2>
            <ul className="flex flex-wrap gap-3 text-3xl text-ink-soft">
              {paymentMethods.map((method) => (
                <li key={method.label} title={method.label}>
                  <Icon name={method.iconName} />
                  <span className="sr-only">{method.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-line pt-6 text-center text-xs text-muted">{copyrightText}</p>
      </div>
    </footer>
  );
};

export default Footer;
