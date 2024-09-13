import axios from "axios";
import { toast } from "react-toastify";
import {
  FOOTFALLDATA,
  getApiUrl,
  FETCH_LOCATION,
  LIVE_STOCK,
} from "../api/api";

// Fetch available locations
export const fetchLocations = async () => {
  try {
    const response = await axios.get(getApiUrl(FETCH_LOCATION));
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    toast.error("Error fetching locations");
    return [];
  }
};

// Fetch live stock data for a given location
export const fetchLiveStockData = async (locationID) => {
  try {
    const response = await axios.get(getApiUrl(FOOTFALLDATA), {
      params: { locationID },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching live stock data:", error);
    toast.error("Error fetching live stock data");
    return [];
  }
};

// Generic function to fetch footfall data based on date range, location, and report type
export const fetchFootfallData = async (
  startDate,
  endDate,
  locationID,
  reportID
) => {
  try {
    const response = await axios.get(getApiUrl(FOOTFALLDATA), {
      params: {
        startDate,
        endDate,
        locationID,
        reportID, // Determines the type of data to fetch (e.g., hourly, daily)
      },
    });
    console.log("Fetched data:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ReportID ${reportID}:`, error);
    toast.error("Error fetching data for the selected time range.");
    return [];
  }
};

export const fetchLiveSaleData = async (startDate, endDate, locationID) => {
  const reportID = 8; // ReportID for live sale data
  try {
    const response = await axios.get(getApiUrl(FOOTFALLDATA), {
      params: {
        startDate,
        endDate,
        locationID,
        reportID,
      },
    });
    console.log("Fetched live sale data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching live sale data:", error);
    toast.error("Error fetching live sale data.");
    return [];
  }
};

// Fetch target data (ReportID = 7)
export const fetchTargetData = async (
  startDate,
  endDate,
  locationID,
  offset = 0,
  limit = 50
) => {
  const reportID = 7; // ReportID for target data
  try {
    const response = await axios.get(getApiUrl(FOOTFALLDATA), {
      params: {
        startDate,
        endDate,
        locationID,
        reportID,
        offset, // Pagination offset
        limit, // Number of rows per page
      },
    });
    console.log("Fetched target data:", response.data);
    return {
      data: response.data || [],
      totalRecords: response.data.length || 0, // Adjust this based on the response structure
    };
  } catch (error) {
    console.error("Error fetching target data:", error);
    toast.error("Error fetching target data.");
    return {
      data: [],
      totalRecords: 0,
    };
  }
};

// Fetch hourly data (ReportID = 1)
export const fetchHourlyData = async (startDate, endDate, locationID) => {
  return fetchFootfallData(startDate, endDate, locationID, 1); // ReportID = 1 for hourly data
};

// Fetch daily data (ReportID = 2)
export const fetchDailyData = async (startDate, endDate, locationID) => {
  return fetchFootfallData(startDate, endDate, locationID, 2); // ReportID = 2 for daily data
};

// Fetch weekly data (ReportID = 3)
export const fetchWeeklyData = async (startDate, endDate, locationID) => {
  return fetchFootfallData(startDate, endDate, locationID, 3); // ReportID = 3 for weekly data
};

// Fetch monthly data (ReportID = 4)
export const fetchMonthlyData = async (startDate, endDate, locationID) => {
  return fetchFootfallData(startDate, endDate, locationID, 4); // ReportID = 4 for monthly data
};

// Fetch conversion data (ReportID = 5)
export const fetchConversionData = async (startDate, endDate, locationID) => {
  return fetchFootfallData(startDate, endDate, locationID, 5); // ReportID = 5 for conversion data
};
