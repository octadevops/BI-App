import {
  FOOTFALLDATA,
  getApiUrl,
  FETCH_LOCATION,
  LIVE_STOCK,
} from "../api/api";
import axios from "axios";
import { toast } from "react-toastify";

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

export const fetchLiveStockData = async (locationID) => {
  try {
    const response = await axios.get(getApiUrl(LIVE_STOCK), {
      params: { locationID },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error("Error fetching data");
    return [];
  }
};

// Fetch data based on ReportID (1: Hourly, 2: Daily, 3: Weekly, 4: Monthly)
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
        reportID, // Pass the reportID to determine the data aggregation type
      },
    });
    console.log("fetched data : ", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ReportID ${reportID}:`, error);
    toast.error(`Error fetching data for the selected time range.`);
    return [];
  }
};

// Fetch hourly data with ReportID = 1 by default
export const fetchHourlyData = async (startDate, endDate, locationID) => {
  return fetchFootfallData(startDate, endDate, locationID, 1); // ReportID = 1 for hourly data
};

// Fetch daily data with ReportID = 2
export const fetchDailyData = async (startDate, endDate, locationID) => {
  return fetchFootfallData(startDate, endDate, locationID, 2); // ReportID = 2 for daily data
};

// Fetch weekly data with ReportID = 3
export const fetchWeeklyData = async (startDate, endDate, locationID) => {
  return fetchFootfallData(startDate, endDate, locationID, 3); // ReportID = 3 for weekly data
};

// Fetch monthly data with ReportID = 4
export const fetchMonthlyData = async (startDate, endDate, locationID) => {
  return fetchFootfallData(startDate, endDate, locationID, 4); // ReportID = 4 for monthly data
};
