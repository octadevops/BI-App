import React, { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { fetchLocations } from "../functions/APIServices";

const FilterComp = ({
  showDateRange = false,
  showDate = false,
  showLocation = false,
  showDepartment = false,
  showSubcategory = false,
  onFilterChange,
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [locations, setLocations] = useState([]);

  const departments = [
    { label: "Department 1", value: 1 },
    { label: "Department 2", value: 2 },
  ];
  const subcategories = [
    { label: "Subcategory 1", value: 1 },
    { label: "Subcategory 2", value: 2 },
  ];

  useEffect(() => {
    const loadLocations = async () => {
      const fetchedLocations = await fetchLocations();
      setLocations([
        // { label: "All Locations", value: null }, // Add All Locations option
        ...fetchedLocations.map((loc) => ({
          label: loc.locationName,
          value: loc.locationID,
        })),
      ]);
    };
    loadLocations();
  }, []);

  const handleFilterChange = () => {
    const filters = {
      date: selectedDate,
      dateRange: selectedDateRange,
      location: selectedLocation,
      department: selectedDepartment,
      subcategory: selectedSubcategory,
    };

    onFilterChange(filters);
  };

  return (
    <div className="w-full flex flex-col md:grid md:grid-cols-6 lg:grid-cols-4 gap-4">
      {showDate && (
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <Calendar
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.value)}
            selectionMode="single"
            placeholder="Select Date"
            className="w-full bg-gray-50 px-2 rounded text-gray-600"
            panelClassName="bg-gray-50 p-2 rounded mt-1"
          />
        </div>
      )}
      {showDateRange && (
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Date Range
          </label>
          <Calendar
            variant="filled"
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.value)}
            selectionMode="range"
            placeholder="Select Date Range"
            className="w-full bg-gray-50 px-2 rounded text-gray-600"
            panelClassName="bg-gray-50 p-2 rounded mt-1"
          />
        </div>
      )}

      {showLocation && (
        <div className="filter-item">
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <Dropdown
            value={selectedLocation}
            options={locations}
            onChange={(e) => setSelectedLocation(e.value)}
            placeholder="Select Location"
            className="w-full bg-gray-50 px-2 rounded text-gray-600"
            panelClassName="bg-gray-50 p-2 rounded mt-1"
          />
        </div>
      )}

      {showDepartment && (
        <div className="filter-item">
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <Dropdown
            value={selectedDepartment}
            options={departments}
            onChange={(e) => setSelectedDepartment(e.value)}
            placeholder="Select Department"
            className="w-full bg-gray-50 px-2 rounded text-gray-400"
          />
        </div>
      )}

      {showSubcategory && (
        <div className="filter-item">
          <label className="block text-sm font-medium text-gray-700">
            Subcategory
          </label>
          <Dropdown
            value={selectedSubcategory}
            options={subcategories}
            onChange={(e) => setSelectedSubcategory(e.value)}
            placeholder="Select Subcategory"
            className="w-full bg-gray-50 px-2 rounded text-gray-400"
          />
        </div>
      )}

      <div className="bg-slate-800 w-fit px-2 rounded text-white col-span-1 md:col-span-2 lg:col-span-4 flex justify-end py-0 hover:bg-emerald-500 duration-300">
        <Button
          label="Apply"
          icon="pi pi-filter"
          className="px-1 md:py-1 py-0 "
          onClick={handleFilterChange}
        />
      </div>
    </div>
  );
};

export default FilterComp;
