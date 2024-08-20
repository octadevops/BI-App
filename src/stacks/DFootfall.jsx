import DateTime from "../components/DateTime";
import { Button } from "primereact/button";

const DFootfall = () => {
  return (
    <div className="h-full w-full px-6 py-1 bg-slate-200  ">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold py-2">Foot Fall Analysis</h1>
        <div>
          <DateTime />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default DFootfall;
