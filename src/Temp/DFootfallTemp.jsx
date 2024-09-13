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

const DFootfall = () => {
  const [chartDataHourly, setChartDataHourly] = useState({});
  const [chartDataDaily, setChartDataDaily] = useState({});
  const [chartDataWeekly, setChartDataWeekly] = useState({});
  const [chartDataMonthly, setChartDataMonthly] = useState({});
  const [conversionChartData, setConversionChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [filters, setFilters] = useState({ dateRange: [], location: 0 }); // Default location to "All Locations"
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
      setLocations([{ label: "All Locations", value: 0 }, ...locationOptions]);
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

  const getCurrentTimeMinus24Hours = () => {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - 24);
    return currentTime;
  };

  useEffect(() => {
    if (filters.dateRange.length > 0) {
      fetchData();
    }
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [startDate, endDate] = filters.dateRange;
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      let hourlyData, dailyData;

      if (filters.location === 0) {
        // Fetch data for all locations
        hourlyData = await fetchFootfallData(
          formattedStartDate,
          formattedEndDate,
          filters.location, // All locations
          MEASUREMENTS.HOURLY.value
        );
        dailyData = await fetchFootfallData(
          formattedStartDate,
          formattedEndDate,
          filters.location, // All locations
          MEASUREMENTS.DAILY.value
        );
      } else {
        // Fetch data for specific location
        const currentDate = new Date();
        const past24HoursDate = new Date(
          currentDate.getTime() - 24 * 60 * 60 * 1000
        );

        // Format dates for hourly data
        const formattedCurrentDate = formatDate(currentDate);
        const formattedPast24HoursDate = formatDate(past24HoursDate);

        // Fetch hourly data for past 24 hours for specific location
        hourlyData = await fetchFootfallData(
          formattedPast24HoursDate,
          formattedCurrentDate,
          filters.location,
          MEASUREMENTS.HOURLY.value
        );

        // Fetch daily data for specific location in the selected date range
        dailyData = await fetchFootfallData(
          formattedStartDate,
          formattedEndDate,
          filters.location,
          MEASUREMENTS.DAILY.value
        );
      }

      // Update charts based on the data
      updateChartData(hourlyData, MEASUREMENTS.HOURLY, setChartDataHourly);
      updateChartData(dailyData, MEASUREMENTS.DAILY, setChartDataDaily);
      updateConversionChartData(dailyData); // Use daily data for conversion rate calculation
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateChartData = (data, measurementType, setChartData) => {
    const documentStyle = getComputedStyle(document.documentElement);

    const labels = [];
    const footfallCounts = [];
    const billCounts = [];

    data.forEach((item) => {
      let label;
      switch (measurementType.value) {
        case MEASUREMENTS.HOURLY.value:
          label =
            filters.location === 0
              ? item.LocationName
              : new Date(item.DateNTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
          break;
        case MEASUREMENTS.DAILY.value:
          label = new Date(item.DateNTime).toLocaleDateString();
          break;
        case MEASUREMENTS.WEEKLY.value:
          label = `Week ${item.Week} (${item.Year})`;
          break;
        case MEASUREMENTS.MONTHLY.value:
          label = `${item.Month} ${item.Year}`;
          break;
        default:
          label = "Unknown";
          break;
      }

      labels.push(label);
      footfallCounts.push(item.FootFall || item.footfallCount || 0);
      billCounts.push(item.Bills || item.billCount || 0);
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

    setChartData(chartData);
  };

  const updateConversionChartData = (data) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = [];
    const conversionRates = [];

    data.forEach((item) => {
      if (filters.location === 0 || item.LocationID === filters.location) {
        labels.push(item.LocationName);
        const conversionRate =
          item.FootFall > 0 ? (item.Bills / item.FootFall) * 100 : 0;
        conversionRates.push(conversionRate.toFixed(2));
      }
    });

    const conversionChartData = {
      labels,
      datasets: [
        {
          type: "line",
          label: "Conversion Rate (%)",
          borderColor: documentStyle.getPropertyValue("--red-500"),
          data: conversionRates,
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
    <GridPanel className="" title="Footfall">
      <div
        className={
          isFullScreen ? "fixed inset-0 bg-white z-50 p-4 overflow-auto" : ""
        }
      >
        <div className="flex justify-between items-center mb-4">
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
                ? "grid grid-cols-1 gap-4"
                : "flex flex-col w-full gap-6"
            }
          >
            <Chart
              type="bar"
              data={chartDataHourly}
              options={chartOptions}
              title="Hourly Data"
            />
            <Chart type="bar" data={chartDataDaily} options={chartOptions} />
            <Chart type="bar" data={chartDataWeekly} options={chartOptions} />
            <Chart type="bar" data={chartDataMonthly} options={chartOptions} />
            <Chart
              type="line"
              data={conversionChartData}
              options={chartOptions}
            />
          </div>
        )}
      </div>
    </GridPanel>
  );
};

export default DFootfall;
