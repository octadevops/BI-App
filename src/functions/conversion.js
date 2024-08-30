import { FOOTFALLDATA, getApiUrl } from "../api/api";

export const fetchMeasurementData = async (
  measurementType,
  startDate,
  endDate,
  locationId
) => {
  try {
    const formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
    const formattedEndDate = new Date(endDate).toISOString().slice(0, 10);

    const url = new URL(getApiUrl(FOOTFALLDATA));
    url.searchParams.append("startDate", formattedStartDate);
    url.searchParams.append("endDate", formattedEndDate);
    url.searchParams.append("reportId", 1);
    if (locationId) url.searchParams.append("locationID", locationId);

    console.log("Request URL:", url.toString());

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Calculate conversion rates
    if (data.footFall && data.bills) {
      data.conversions = data.footFall.map(
        (count, index) => (data.bills[index] / (count || 1)) * 100
      );
    } else {
      console.warn(
        "Footfall counts or bill counts are missing in the response."
      );
      data.conversions = [];
    }

    return data;
  } catch (error) {
    console.error(`Error fetching measurement data:`, error);
    return { footfallCounts: [], billCounts: [], conversions: [] }; // Return an empty structure in case of error
  }
};
