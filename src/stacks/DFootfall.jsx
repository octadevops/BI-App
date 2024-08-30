import { Button } from "primereact/button";
import GridPanel from "../components/GridPanel";
import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import FilterComp from "../components/FilterComp";
import { ButtonGroup } from "primereact/buttongroup";
import { fetchLocations, fetchFootfallData } from "../functions/APIServices";
import { MEASUREMENTS } from "../constants/Constants";
import { ClimbingBoxLoader, ClipLoader, HashLoader } from "react-spinners";

const DFootfall = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [filters, setFilters] = useState({});
  const [measurementType, setMeasurementType] = useState(MEASUREMENTS.HOURLY); // Default to Hourly
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load locations on component mount
  useEffect(() => {
    const loadLocations = async () => {
      const fetchedLocations = await fetchLocations();
      const locationOptions = fetchedLocations.map((loc) => ({
        label: loc.locationName,
        value: loc.locationID,
      }));
      setLocations([
        { label: "All Locations", value: null }, // Add All Locations option

        ...locationOptions,
      ]);

      setSelectedLocation(null); // Default to "All Locations"
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
    fetchData();
  }, [filters, measurementType, selectedLocation]);

  // Fetch data when filters, measurementType, or selectedLocation change

  const fetchData = async () => {
    setLoading(true);
    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange;
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      const data = await fetchFootfallData(
        formattedStartDate,
        formattedEndDate,
        selectedLocation,
        measurementType.value
      );
      updateChartData(data);
    }
    setLoading(false);
  };

  const updateChartData = (data) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const labels = [];
    const footfallCounts = [];
    const billCounts = [];
    const conversionRates = [];

    const isAllLocations = selectedLocation === null;

    data.forEach((item) => {
      if (isAllLocations) {
        // Show location names on X-axis when "All Locations" is selected
        labels.push(item.locationName);
      } else {
        // Show dates or times on X-axis when a specific location is selected
        labels.push(new Date(item.dateNTime).toLocaleString()); // Adjust format as needed (e.g., just date or just time)
      }
      footfallCounts.push(item.footfall);
      billCounts.push(item.bills);

      const conversion =
        item.footfall > 0 ? (item.bills / item.footfall) * 100 : 0;
      conversionRates.push(conversion.toFixed(2));
    });

    const chartData = {
      labels: locations, // Use labels from data
      datasets: [
        {
          type: "bar", // Display Footfall Count as a bar chart
          label: "Footfall Count",
          backgroundColor: documentStyle.getPropertyValue("--blue-500"),
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          data: footfallCounts, // Use footfall counts from data
        },
        {
          type: "bar", // Display Bill Count as a bar chart
          label: "Bill Count",
          backgroundColor: documentStyle.getPropertyValue("--pink-500"),
          borderColor: documentStyle.getPropertyValue("--pink-500"),
          data: billCounts, // Use bill counts from data
        },
        {
          type: "line", // Overlay Conversion Rate as a line chart
          label: "Conversion Rate (%)",
          borderColor: documentStyle.getPropertyValue("--red-500"),
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: conversionRates, // Use calculated conversion rates
          yAxisID: "y2", // Use a separate y-axis for conversion rate
        },
      ],
    };

    const chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
          title: {
            display: true,
            text: isAllLocations ? "Locations" : "Date/Time", // Title changes based on selection
            color: textColorSecondary,
          },
        },
        y: {
          position: "left",
          title: {
            display: true,
            text: "Count",
            color: textColorSecondary,
          },
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y2: {
          position: "right",
          title: {
            display: true,
            text: "Conversion Rate (%)",
            color: textColorSecondary,
          },
          ticks: {
            color: textColorSecondary,
            callback: (value) => `${value}%`, // Format conversion rate as a percentage
          },
          grid: {
            drawOnChartArea: false, // Disable grid lines on the right y-axis
          },
        },
      },
    };

    setChartData(chartData);
    setChartOptions(chartOptions);
  };

  const handleMeasurementTypeChange = (type) => {
    setMeasurementType(type);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.value);
  };

  return (
    <GridPanel className="" title="Footfall">
      <div className="">
        {loading ? (
          <div className="flex justify-center items-center h-">
            <HashLoader color="#3498db" loading={loading} size={30} />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <FilterComp
                showDateRange={true}
                showLocation={true}
                onFilterChange={handleFilterChange}
                onLocationChange={handleLocationChange}
              />
              <div>
                <ButtonGroup>
                  <div className="flex border border-sky-500 rounded text-sky-500">
                    <Button
                      label="Hr"
                      className={`hover:bg-sky-400 hover:text-white duration-300 w-full px-2 ${
                        measurementType === MEASUREMENTS.HOURLY
                          ? "bg-sky-400 text-white"
                          : ""
                      }`}
                      onClick={() =>
                        handleMeasurementTypeChange(MEASUREMENTS.HOURLY)
                      }
                    />
                    <Button
                      label="D"
                      className={`hover:bg-sky-400 hover:text-white duration-300 w-full px-2 ${
                        measurementType === MEASUREMENTS.DAILY
                          ? "bg-sky-400 text-white"
                          : ""
                      }`}
                      onClick={() =>
                        handleMeasurementTypeChange(MEASUREMENTS.DAILY)
                      }
                    />
                    <Button
                      label="W"
                      className={`hover:bg-sky-400 hover:text-white duration-300 w-full px-2 ${
                        measurementType === MEASUREMENTS.WEEKLY
                          ? "bg-sky-400 text-white"
                          : ""
                      }`}
                      onClick={() =>
                        handleMeasurementTypeChange(MEASUREMENTS.WEEKLY)
                      }
                    />
                    <Button
                      label="M"
                      className={`hover:bg-sky-400 hover:text-white duration-300 w-full px-2 ${
                        measurementType === MEASUREMENTS.MONTHLY
                          ? "bg-sky-400 text-white"
                          : ""
                      }`}
                      onClick={() =>
                        handleMeasurementTypeChange(MEASUREMENTS.MONTHLY)
                      }
                    />
                  </div>
                </ButtonGroup>
              </div>
            </div>
            <Chart type="bar" data={chartData} options={chartOptions} />
          </>
        )}
      </div>
    </GridPanel>
  );
};

export default DFootfall;
