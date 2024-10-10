import { Button } from "primereact/button";
import GridPanel from "../components/GridPanel";
import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import FilterComp from "../components/FilterComp";
import {
  fetchLocations,
  fetchFootfallData,
  fetchConversionData,
} from "../functions/APIServices";
import { MEASUREMENTS } from "../constants/Constants";
import { HashLoader } from "react-spinners";
import {
  HiOutlineArrowsPointingIn,
  HiOutlineArrowsPointingOut,
} from "react-icons/hi2";

const WeeklyFootfall = () => {
  const [footfallChartData, setFootfallChartData] = useState({});
  const [conversionChartData, setConversionChartData] = useState({});
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

  useEffect(() => {
    if (filters.dateRange.length > 0 && filters.location) {
      fetchData();
    }
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [startDate, endDate] = filters.dateRange;
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      // Fetch data for weekly footfall and conversion
      const weeklyData = await fetchFootfallData(
        formattedStartDate,
        formattedEndDate,
        filters.location,
        MEASUREMENTS.WEEKLY.value
      );
      updateFootfallChartData(weeklyData);
      updateConversionChartData(weeklyData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // Update the chart for footfall and bill count vs. week
  const updateFootfallChartData = (data) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = [];
    const footfallCounts = [];
    const billCounts = [];

    data.forEach((item) => {
      const weekLabel = item.WeekLabel || `Week ${item.Week}`;
      labels.push(weekLabel);
      footfallCounts.push(item.footfallCount || 0);
      billCounts.push(item.billCount || 0);
    });

    const footfallChartData = {
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

    setFootfallChartData(footfallChartData);
  };

  // Update the chart for conversion rate vs. week
  const updateConversionChartData = (data) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = [];
    const conversionRates = [];

    data.forEach((item) => {
      const weekLabel = item.WeekLabel || `Week ${item.Week}`;
      labels.push(weekLabel);
      const conversionRate = item.FootFallConversionRate || 0;
      conversionRates.push(parseFloat(conversionRate.toFixed(2)));
    });

    const conversionChartData = {
      labels,
      datasets: [
        {
          type: "line",
          label: "Conversion Rate (%)",
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
    <GridPanel className="" title="Weekly Footfall and Conversion Analysis">
      <div
        className={
          isFullScreen ? "fixed inset-0 bg-white z-50 p-4 overflow-auto" : ""
        }
      >
        <div className="flex justify-between items-start mb-4 ">
          <FilterComp
            showDateRange={true}
            showLocation={true}
            onFilterChange={handleFilterChange}
            selectedLocation={filters.location}
            selectedDateRange={filters.dateRange}
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
              data={footfallChartData}
              options={{
                responsive: true,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Week",
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
              title="Footfall and Bill Count by Week"
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
                      text: "Week",
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
              title="Conversion Rate by Week"
            />
          </div>
        )}
      </div>
    </GridPanel>
  );
};

export default WeeklyFootfall;
