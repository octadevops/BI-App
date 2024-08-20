import ENVIRONMENT from "../config/Config";

const LOGIN_API = {
  Live: "https://stk.nolimitfashion.com/api/Login/login", // Live;
  Development: "https://localhost:44301/api/Login/login", // Development;
};
const LIVE_STOCK = {
  Live: "https://stk.nolimitfashion.com/api/reports/location-wise", // Live;
  Development: "https://localhost:44301/api/reports/location-wise", // Development;
};
const FETCH_LOCATION = {
  Live: "https://stk.nolimitfashion.com/api/Location/location", // Live;
  Development: "https://localhost:44301/api/Location/location", // Development;
};
const REPORTS = {
  Live: "https://stk.nolimitfashion.com/api/Report/GetReport", // Live;
  Development: "https://localhost:44301/api/Report/GetReport", // Development;
};

const getApiUrl = (apiObject) => apiObject[ENVIRONMENT];

export { LOGIN_API, LIVE_STOCK, FETCH_LOCATION, REPORTS, getApiUrl };
