import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchLiveSaleData, fetchTargetData } from "../functions/APIServices";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import FilterComp from "../components/FilterComp";
import GridPanel from "../components/GridPanel";
import { Button } from "primereact/button";
import {
  HiOutlineArrowsPointingIn,
  HiOutlineArrowsPointingOut,
} from "react-icons/hi2";
import { HashLoader } from "react-spinners";

const DLiveSale = () => {
  const [liveSaleData, setLiveSaleData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    date: null,
    location: null,
    department: null,
  });
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (filters.date && filters.location) {
      loadLiveSaleData(filters);
      loadTargetData(filters);
    }
  }, [filters]);

  const loadLiveSaleData = async ({ date, location }) => {
    setLoading(true);
    const formattedDate = date ? formatDate(date) : null;
    try {
      const data = await fetchLiveSaleData(
        formattedDate,
        formattedDate,
        location
      );
      setLiveSaleData(data);
      prepareChartData(data);
    } catch (error) {
      console.error("Error loading live sale data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTargetData = async ({ date, location }) => {
    setLoading(true);
    const formattedDate = date ? formatDate(date) : null;
    try {
      const { data, totalRecords } = await fetchTargetData(
        formattedDate,
        formattedDate,
        location
      );
      setTableData(data);
      setTotalRecords(totalRecords);
    } catch (error) {
      console.error("Error loading target data:", error);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (data) => {
    const departments = data.map((item) => item.DepartmentName);
    const qtyTargets = data.map((item) => item.QtyTarget);
    const qtySales = data.map((item) => item.QtySales);

    const chartData = {
      labels: departments,
      datasets: [
        {
          label: "Target Quantity",
          data: qtyTargets,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Sales Quantity",
          data: qtySales,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    };
    setChartData(chartData);
  };

  const onFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <GridPanel title="Live Sale">
      <div
        className={
          isFullScreen ? "fixed inset-0 bg-white z-50 p-4 overflow-auto" : ""
        }
      >
        <div className="flex justify-between items-center mb-4">
          <FilterComp
            showDate={true}
            showLocation={true}
            onFilterChange={onFilterChange}
          />
          <Button
            label={
              isFullScreen ? (
                <HiOutlineArrowsPointingIn />
              ) : (
                <HiOutlineArrowsPointingOut />
              )
            }
            onClick={toggleFullScreen}
            className="pl-2 hover:scale-150 duration-300"
          />
        </div>
        {/* Bar Chart */}
        {loading ? (
          <div className="flex justify-center items-center h-[500px]">
            <HashLoader color="#3498db" loading={loading} size={60} />
          </div>
        ) : (
          <div
            className={
              isFullScreen
                ? "grid grid-cols-1 gap-2"
                : "md:max-w-screen-xl md:flex flex-col gap-3 p-5 lg:max-w-screen-xl lg:flex lg:flex-col lg:gap-4"
            }
          >
            <div className="my-6">
              <h3 className="text-lg font-semibold">
                Department vs Target & Sales Quantity
              </h3>
              {chartData && chartData.labels ? (
                <Bar data={chartData} options={{ responsive: true }} />
              ) : (
                <p>No data available for the selected filters.</p>
              )}
            </div>

            <div className="my-6">
              <h3 className="text-lg font-semibold pb-3">Target Data</h3>
              <div className="overflow-x-auto p-2 bg-white shadow rounded-lg md:max-w-4xl max-w-xs">
                <DataTable
                  value={tableData}
                  paginator
                  rows={20}
                  totalRecords={totalRecords}
                  loading={loading}
                  className="p-datatable-scrollable "
                  scrollable
                  scrollHeight="400px"
                  tableStyle={{ minWidth: "50rem" }}
                >
                  <Column
                    field="Year"
                    header="Year"
                    sortable
                    style={{ minWidth: "80px" }}
                    headerClassName="bg-gray-600 text-white px-2 py-1"
                    className="px-2"
                  />
                  <Column
                    field="Month"
                    header="Month"
                    sortable
                    style={{ minWidth: "80px" }}
                    headerClassName="bg-gray-600 text-white px-2"
                    className="px-2"
                  />
                  <Column
                    field="LocationName"
                    header="Location"
                    sortable
                    style={{ minWidth: "200px" }}
                    headerClassName="bg-gray-600 text-white px-2"
                    className="px-2"
                  />
                  <Column
                    field="DepartmentName"
                    header="Department"
                    sortable
                    style={{ minWidth: "200px" }}
                    headerClassName="bg-gray-600 text-white px-2"
                    className="px-2"
                  />
                  <Column
                    field="CategoryName"
                    header="Category"
                    sortable
                    style={{ minWidth: "200px" }}
                    headerClassName="bg-gray-600 text-white px-2"
                    className="px-2"
                  />
                  <Column
                    field="SubCategoryName"
                    header="Sub Category"
                    sortable
                    style={{ minWidth: "200px" }}
                    headerClassName="bg-gray-600 text-white px-2"
                    className="px-2"
                  />
                  <Column
                    field="QtyTarget"
                    header="TargetQTY"
                    sortable
                    style={{ minWidth: "100px" }}
                    headerClassName="bg-gray-600 text-white px-2"
                    className="px-2"
                  />
                  <Column
                    field="QtySales"
                    header="SalesQTY"
                    sortable
                    style={{ minWidth: "100px" }}
                    headerClassName="bg-gray-600 text-white px-2"
                    className="px-2"
                  />
                  <Column
                    field="TodayTargetQty"
                    header="TodayTgQTY"
                    sortable
                    style={{ minWidth: "100px" }}
                    headerClassName="bg-gray-600 text-white px-2"
                    className="px-2"
                  />
                  <Column
                    field="LiveSalesQty"
                    header="LiveSlsQTY"
                    sortable
                    style={{ minWidth: "100px" }}
                    headerClassName="bg-gray-600 text-white px-2"
                    className="px-2"
                  />
                  <Column
                    field="FloorManager"
                    header="FloorManager"
                    style={{ minWidth: "200px" }}
                    headerClassName="bg-gray-600 text-white px-2"
                    className="px-2"
                  />
                  <Column
                    field="Staff"
                    header="Staff"
                    style={{ minWidth: "200px" }}
                    headerClassName="bg-gray-600 text-white px-2"
                    className="px-2"
                  />
                </DataTable>
              </div>
            </div>
          </div>
        )}
      </div>
    </GridPanel>
  );
};

export default DLiveSale;
