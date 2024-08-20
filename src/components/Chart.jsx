import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { DataTable } from "primereact/datatable";
import { fetchLiveStockData, fetchLocations } from "../functions/APIServices";
import { Column } from "primereact/column";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ initialLocation }) => {
  const [locationID, setLocationID] = useState(initialLocation || "");
  const [locations, setLocations] = useState([]);
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [tableData, setTableData] = useState([]);
  const [dates, setDates] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      const locations = await fetchLocations();
      setLocations(locations);
    };

    loadLocations();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const startDate = dates ? dates[0].toISOString().split("T")[0] : "";
      const endDate = dates ? dates[1].toISOString().split("T")[0] : "";

      const fetchedData = await fetchLiveStockData(
        locationID,
        startDate,
        endDate
      );
      const labels = fetchedData.map((item) => item.locationName);
      const counts = fetchedData.map((item) => item.qty);

      setData({
        labels,
        datasets: [
          {
            label: "Stock Count",
            data: counts,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      });
      setTableData(fetchedData);
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, [locationID, dates]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3">
        <div>
          <DataTable
            value={tableData}
            scrollable
            scrollHeight="500px"
            className="bg-white text-black border border-gray-900"
          >
            <Column
              field="locationName"
              header="Location Name"
              style={{ minWidth: "200px", paddingLeft: "30px" }}
              headerStyle={{ background: "#32363E", color: "#efefef" }}
              footerStyle={{ background: "#32363E", color: "#efefef" }}
            />
            <Column
              field="qty"
              header="QTY"
              style={{ minWidth: "50px", paddingLeft: "30px" }}
              headerStyle={{ background: "#32363E", color: "#efefef" }}
              footerStyle={{ background: "#32363E", color: "#efefef" }}
            />
            <Column
              field="amount"
              header="Amount"
              style={{ minWidth: "150px", paddingLeft: "30px" }}
              headerStyle={{ background: "#32363E", color: "#efefef" }}
              footerStyle={{ background: "#32363E", color: "#efefef" }}
            />
          </DataTable>
        </div>
        <div className="col-span-2">
          <Bar data={data} />
        </div>
      </div>
    </div>
  );
};

export default Chart;
