type CruiseRouteProps = {
  route: string[];
};

const getStopLabel = (index: number, count: number) => {
  if (index === 0) return "Departure";
  if (index === count - 1) return "Arrival";
  return "Port of call";
};

const CruiseRoute = ({ route }: CruiseRouteProps) => {
  return (
    <section id="itinerary" className="mt-8 scroll-mt-32">
      <h2 className="mb-4 text-center text-2xl font-bold">Itinerary</h2>
      <table className="w-full text-left text-sm sm:text-base">
        <thead>
          <tr className="bg-surface-alt">
            <th scope="col" className="px-4 py-3 font-bold">
              Stop
            </th>
            <th scope="col" className="px-4 py-3 font-bold">
              Port
            </th>
            <th scope="col" className="px-4 py-3 font-bold">
              Itinerary info
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {route.map((port, index) => (
            <tr key={`${port}-${index}`}>
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{port}</td>
              <td className="px-4 py-3">{getStopLabel(index, route.length)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default CruiseRoute;
