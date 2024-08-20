import DateTime from "../components/DateTime";
import Chart from "../components/Chart";
import FilterComp from "../components/FilterComp";
import Card from "../components/Card";

const DLiveStock = () => {
  const handleFilterChange = (Filters) => {
    console.log(Filters);
  };
  return (
    <div className="h-full w-full p-6 bg-slate-200  ">
      <div className="text-end">
        <DateTime />
      </div>
      <div className="flex">
        <Card className="" title="Live Stock">
          <FilterComp
            showDateRange={true}
            showLocation={true}
            onFilterChange={handleFilterChange}
          />
        </Card>
      </div>
      <div>
        <Chart initialLocation="" />
      </div>
    </div>
  );
};

export default DLiveStock;
