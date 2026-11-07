import Link from "next/link";
import { supportGuarantee } from "@/constants";
import Icon from "../ui/Icon";

const SupportGuarantee = () => {
  return (
    <section className="mx-auto mt-4 max-w-content rounded-card bg-surface bg-gradient-to-r from-surface to-primary-soft/60 p-6 shadow-card">
      <h2 className="flex items-center gap-3 text-2xl font-bold">
        <Icon name="shield" className="text-primary" />
        {supportGuarantee.title}
      </h2>
      <p className="mt-2 text-sm text-ink-soft">
        {supportGuarantee.body}{" "}
        <Link href={supportGuarantee.href} className="text-primary hover:underline">
          {supportGuarantee.linkLabel}
        </Link>
      </p>
    </section>
  );
};

export default SupportGuarantee;
