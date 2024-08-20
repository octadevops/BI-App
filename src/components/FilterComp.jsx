import React, { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { fetchLocations } from "../functions/APIServices";

const FilterComp = ({
  showDateRange = false,
  showLocation = false,
  showDepartment = false,
  showSubcategory = false,
  onFilterChange,
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
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
      const fetchedlocations = await fetchLocations();
      const locationOptions = fetchedlocations.map((loc) => ({
        label: loc.locationName,
        value: loc.locationID,
      }));
      setLocations(locationOptions);
    };
    loadLocations();
  }, []);

  const handleFilterChange = () => {
    onFilterChange({
      dateRange: selectedDateRange,
      location: selectedLocation,
      department: selectedDepartment,
      subcategory: selectedSubcategory,
    });
  };

  return (
    <div className="w-full flex md:grid md:grid-cols-4 lg:grid-cols- gap-4">
      {showDateRange && (
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Date Range
          </label>
          <Calendar
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

      <div className="bg-slate-800 w-fit px-2 rounded text-white col-span-1 md:col-span-2 lg:col-span-4 flex justify-end">
        <Button
          label="Apply Filters"
          icon="pi pi-filter"
          className="px-1 py-1"
          onClick={handleFilterChange}
        />
      </div>
    </div>
  );
};

export default FilterComp;
