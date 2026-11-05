import Icon from "../ui/Icon";

type CruiseRouteProps = {
  route: string[];
};

const CruiseRoute = ({ route }: CruiseRouteProps) => {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">Your route</h2>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 rounded-card border border-line p-4 text-sm font-medium">
        {route.map((port, index) => (
          <li key={`${port}-${index}`} className="flex items-center gap-2">
            {index > 0 && <Icon name="chevron-right" className="text-xs text-muted" />}
            {port}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default CruiseRoute;
