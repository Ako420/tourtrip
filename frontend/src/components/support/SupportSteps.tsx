import { supportSteps } from "@/constants";

const SupportSteps = () => {
  return (
    <section className="mx-auto mt-4 max-w-content rounded-card bg-surface p-6 shadow-card">
      <h2 className="text-2xl font-bold">{supportSteps.title}</h2>
      <ol className="mt-5 grid gap-4 md:grid-cols-3">
        {supportSteps.items.map((step, index) => (
          <li key={step.id} className="rounded-card bg-surface-alt p-5">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary font-bold text-white">
              {index + 1}
            </span>
            <h3 className="mt-3 font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default SupportSteps;
