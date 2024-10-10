import { Button } from "primereact/button";
import GridPanel from "../components/GridPanel";
import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import FilterComp from "../components/FilterComp";
import { fetchLocations, fetchFootfallData } from "../functions/APIServices";
import { MEASUREMENTS } from "../constants/Constants";
import { HashLoader } from "react-spinners";
import {
  HiOutlineArrowsPointingIn,
  HiOutlineArrowsPointingOut,
} from "react-icons/hi2";

const HourlyFootfall = () => {
  const [chartDataHourly, setChartDataHourly] = useState({});
  const [conversionChartData, setConversionChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [filters, setFilters] = useState({ dateRange: [], location: null });
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const loadLocations = async () => {
      const fetchedLocations = await fetchLocations();
      const locationOptions = fetchedLocations.map((loc) => ({
        label: loc.locationName,
        value: loc.locationID,
      }));
      setLocations(locationOptions);
    };
    loadLocations();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (filters.date && filters.location) {
      fetchData();
    }
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const formattedDate = formatDate(filters.date);
      const hourlyData = await fetchFootfallData(
        formattedDate,
        formattedDate,
        filters.location,
        MEASUREMENTS.HOURLY.value
      );

      // Update charts with fetched data
      updateChartData(hourlyData);
      updateConversionChartData(hourlyData); // Use the same data source for conversion
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateChartData = (data) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = [];
    const footfallCounts = [];
    const billCounts = [];

    data.forEach((item) => {
      const label = item.hour ? `${item.hour}:00` : "Unknown Hour";
      labels.push(label);
      footfallCounts.push(item.FootFall || 0);
      billCounts.push(item.Bills || 0);
    });

    const chartData = {
      labels,
      datasets: [
        {
          type: "bar",
          label: "Footfall Count",
          backgroundColor: documentStyle.getPropertyValue("--blue-500"),
          data: footfallCounts,
        },
        {
          type: "bar",
          label: "Bill Count",
          backgroundColor: documentStyle.getPropertyValue("--pink-500"),
          data: billCounts,
        },
      ],
    };

    setChartDataHourly(chartData);
  };

  const updateConversionChartData = (data) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = [];
    const conversionRates = [];

    data.forEach((item) => {
      const label = item.hour ? `${item.hour}:00` : "Unknown Hour";
      labels.push(label);
      conversionRates.push(item.FootFallConversionRate || 0);
    });

    const conversionChartData = {
      labels,
      datasets: [
        {
          type: "line",
          label: "Footfall Conversion Rate (%)",
          borderColor: documentStyle.getPropertyValue("--green-500"),
          backgroundColor: documentStyle.getPropertyValue("--green-200"),
          data: conversionRates,
          fill: true,
          tension: 0.3,
        },
      ],
    };

    setConversionChartData(conversionChartData);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <GridPanel className="" title="Hourly Footfall and Conversion Analysis">
      <div
        className={
          isFullScreen ? "fixed inset-0 bg-white z-50 p-4 overflow-auto" : ""
        }
      >
        <div className="flex justify-between items-start mb-4">
          <FilterComp
            showDate={true}
            showLocation={true}
            onFilterChange={handleFilterChange}
            selectedLocation={filters.location}
            selectedDate={filters.date}
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
        {loading ? (
          <div className="flex justify-center items-center h-[500px]">
            <HashLoader color="#3498db" loading={loading} size={60} />
          </div>
        ) : (
          <div
            className={
              isFullScreen
                ? "grid grid-cols-1 gap-2"
                : "md:grid grid-cols-1 gap-3 p-5 lg:grid lg:grid-cols-2 lg:gap-4"
            }
          >
            {/* Bar Chart for Footfall and Bill Count */}
            <Chart
              type="bar"
              data={chartDataHourly}
              options={{
                responsive: true,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Hour of Day",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Count",
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                },
              }}
              title="Footfall and Bill Count"
            />

            {/* Line Chart for Conversion Rate */}
            <Chart
              type="line"
              data={conversionChartData}
              options={{
                responsive: true,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Hour of Day",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Conversion Rate (%)",
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                },
              }}
              title="Footfall Conversion Rate"
            />
          </div>
        )}
      </div>
    </GridPanel>
  );
};

export default HourlyFootfall;
