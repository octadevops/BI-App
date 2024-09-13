import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchFootfallData } from "../functions/APIServices";
import { MEASUREMENTS } from "../constants/Constants";
import { HashLoader } from "react-spinners";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const FootfallChart = ({ filters, measurementType, selectedLocation }) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

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

      updateChartData(hourlyData, MEASUREMENTS.HOURLY);
      updateChartData(dailyData, MEASUREMENTS.DAILY);
      updateConversionChartData(dailyData); // Use daily data for conversion rate calculation
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateChartData = (data, measurementType) => {
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
              ? item.LocationName // Show location names when "All Locations" selected
              : new Date(item.DateNTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
          break;
        case MEASUREMENTS.DAILY.value:
          label =
            filters.location === 0
              ? item.LocationName // Show location names when "All Locations" selected
              : new Date(item.DateNTime).toLocaleDateString(); // Show date for specific location
          break;
        default:
          label = "Unknown";
          break;
      }

      labels.push(label);
      footfallCounts.push(item.FootFall || item.footfallCount || 0);
      billCounts.push(item.Bills || item.billCount || 0);
    });

    setChartData((prevData) => ({
      ...prevData,
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
    }));
  };

  const updateConversionChartData = (dailyData) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = [];
    const conversionRates = [];

    dailyData.forEach((item) => {
      if (filters.location === 0 || item.LocationID === filters.location) {
        const label =
          filters.location === 0
            ? item.LocationName
            : new Date(item.DateNTime).toLocaleDateString();

        labels.push(label);

        const conversionRate =
          item.FootFall > 0 ? (item.Bills / item.FootFall) * 100 : 0;
        conversionRates.push(conversionRate.toFixed(2));
      }
    });

    setChartData((prevData) => ({
      ...prevData,
      datasets: [
        ...prevData.datasets,
        {
          type: "line",
          label: "Conversion Rate (%)",
          borderColor: documentStyle.getPropertyValue("--red-500"),
          data: conversionRates,
          yAxisID: "y2",
        },
      ],
    }));
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time/Location",
          font: { size: 14 },
        },
      },
      y: {
        title: {
          display: true,
          text: "Counts",
          font: { size: 14 },
        },
      },
      y2: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Conversion Rate (%)",
        },
        ticks: {
          callback: (value) => `${value}%`,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  useEffect(() => {
    fetchData();
  }, [filters, measurementType, selectedLocation]);

  return (
    <div style={{ position: "relative", height: "500px" }}>
      {loading ? (
        <div className="flex justify-center items-center h-[500px]">
          <HashLoader color="#3498db" loading={loading} size={60} />
        </div>
      ) : measurementType.value === MEASUREMENTS.HOURLY.value ||
        measurementType.value === MEASUREMENTS.DAILY.value ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default FootfallChart;
