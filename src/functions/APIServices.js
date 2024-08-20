import axios from "axios";
import { toast } from "react-toastify";
import { FETCH_LOCATION, getApiUrl, LIVE_STOCK } from "../api/api";

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
