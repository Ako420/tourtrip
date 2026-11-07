import type { CarsContent } from "@/types";
import SectionHeading from "../ui/SectionHeading";
import WordmarkList from "../ui/WordmarkList";

type CarSuppliersProps = {
  section: CarsContent["suppliers"];
};

const CarSuppliers = ({ section }: CarSuppliersProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>
      <p className="-mt-3 mb-4 text-sm text-muted">{section.note}</p>
      <WordmarkList names={section.items} iconName="car" />
    </section>
  );
};

export default CarSuppliers;
