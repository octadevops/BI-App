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

const DailyFootfall = () => {
  const [chartDataHourly, setChartDataHourly] = useState({});
  const [chartDataDaily, setChartDataDaily] = useState({});
  const [conversionChartData, setConversionChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [filters, setFilters] = useState({ dateRange: [], location: null }); // Remove 'All Locations' option
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
      setLocations(locationOptions); // No need to add 'All Locations'
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

      let hourlyData = [];
      let dailyData = [];
      let conversionData = [];

      // Fetch data for the selected location
      const isSingleDaySelected = startDate === endDate;
      if (isSingleDaySelected) {
        hourlyData = await fetchFootfallData(
          formattedStartDate,
          formattedEndDate,
          filters.location,
          MEASUREMENTS.HOURLY.value
        );
      }
      dailyData = await fetchFootfallData(
        formattedStartDate,
        formattedEndDate,
        filters.location,
        MEASUREMENTS.DAILY.value
      );
      conversionData = await fetchConversionData(
        formattedStartDate,
        formattedEndDate,
        filters.location
      );

      // Update charts with fetched data
      updateChartData(hourlyData, MEASUREMENTS.HOURLY, setChartDataHourly);
      updateChartData(dailyData, MEASUREMENTS.DAILY, setChartDataDaily);
      updateConversionChartData(conversionData);
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
      // Use date for specific location filter
      const dateObj = new Date(item.DateLabel);
      const label = isNaN(dateObj)
        ? "Invalid Date/Time"
        : measurementType.value === MEASUREMENTS.HOURLY.value
        ? dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : dateObj.toLocaleDateString();

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

    // Sort data by DateNTime field
    data.sort((a, b) => new Date(a.DateNTime) - new Date(b.DateNTime));

    const labels = [];
    const conversionRates = [];

    data.forEach((item) => {
      // Parse the DateNTime from the API response
      const dateObj = new Date(item.DateNTime); // Assuming DateNTime is the correct field name
      const formattedDate = `${String(dateObj.getDate()).padStart(
        2,
        "0"
      )}-${String(dateObj.getMonth() + 1).padStart(
        2,
        "0"
      )}-${dateObj.getFullYear()}`; // Format to "DD-MM-YYYY"

      labels.push(formattedDate);

      // Conversion rate data
      const conversionRate = item.FootFallConversionRate || 0;
      conversionRates.push(parseFloat(conversionRate.toFixed(2)));
    });

    const conversionChartData = {
      labels,
      datasets: [
        {
          type: "line",
          label: "Conversion Rate (%)",
          borderColor: documentStyle.getPropertyValue("--red-500"),
          backgroundColor: documentStyle.getPropertyValue("--red-200"),
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
    <GridPanel className="" title="Daily Footfall and Conversion Analysis">
      <div
        className={
          isFullScreen ? "fixed inset-0 bg-white z-50 p-4 overflow-auto" : ""
        }
      >
        <div className="flex justify-between items-start mb-4">
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
            {filters.dateRange.length === 1 && (
              <Chart
                type="bar"
                data={chartDataHourly}
                options={chartOptions}
                title="Hourly Data"
              />
            )}
            <Chart
              type="bar"
              data={chartDataDaily}
              options={chartOptions}
              title="Footfall and Bill Count by Date"
            />
            <Chart
              type="line"
              data={conversionChartData}
              options={{
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Date",
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
            />
          </div>
        )}
      </div>
    </GridPanel>
  );
};

export default DailyFootfall;
