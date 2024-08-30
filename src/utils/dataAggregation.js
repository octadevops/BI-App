// utils/dataAggregation.js

const isValideTimeStamp = (timestamp) => {
  const date = new Date(timestamp);
  return !isNaN(date.getTime());
};

export const aggregateToDaily = (hourlyData) => {
  const dailyData = { labels: [], footfallCounts: [], billCounts: [] };

  hourlyData.forEach(({ timestamp, footfall, bill }) => {
    if (!isValidTimestamp(timestamp)) {
      console.warn("Invalid timestamp value:", timestamp);
      return; // Skip invalid data
    }

    const date = new Date(timestamp).toISOString().split("T")[0];
    if (!dailyData[date]) {
      dailyData[date] = { footfall: 0, bill: 0 };
    }
    dailyData[date].footfall += footfall || 0;
    dailyData[date].bill += bill || 0;
  });

  dailyData.labels = Object.keys(dailyData);
  dailyData.footfallCounts = dailyData.labels.map(
    (date) => dailyData[date].footfall
  );
  dailyData.billCounts = dailyData.labels.map((date) => dailyData[date].bill);

  return dailyData;
};

// Similar validation can be added to aggregateToWeekly and aggregateToMonthly

export const aggregateToWeekly = (hourlyData) => {
  const weeklyData = { labels: [], footfallCounts: [], billCounts: [] };

  hourlyData.forEach(({ timestamp, footfall, bill }) => {
    if (!isValidTimestamp(timestamp)) {
      console.warn("Invalid timestamp value:", timestamp);
      return;
    }

    const date = new Date(timestamp);
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    const key = `${year}-W${week}`;

    if (!weeklyData[key]) {
      weeklyData[key] = { footfall: 0, bill: 0 };
    }
    weeklyData[key].footfall += footfall || 0;
    weeklyData[key].bill += bill || 0;
  });

  weeklyData.labels = Object.keys(weeklyData);
  weeklyData.footfallCounts = weeklyData.labels.map(
    (week) => weeklyData[week].footfall
  );
  weeklyData.billCounts = weeklyData.labels.map(
    (week) => weeklyData[week].bill
  );

  return weeklyData;
};

export const aggregateToMonthly = (hourlyData) => {
  const monthlyData = { labels: [], footfallCounts: [], billCounts: [] };

  hourlyData.forEach(({ timestamp, footfall, bill }) => {
    if (!isValidTimestamp(timestamp)) {
      console.warn("Invalid timestamp value:", timestamp);
      return;
    }

    const date = new Date(timestamp);
    const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = { footfall: 0, bill: 0 };
    }
    monthlyData[yearMonth].footfall += footfall || 0;
    monthlyData[yearMonth].bill += bill || 0;
  });

  monthlyData.labels = Object.keys(monthlyData);
  monthlyData.footfallCounts = monthlyData.labels.map(
    (month) => monthlyData[month].footfall
  );
  monthlyData.billCounts = monthlyData.labels.map(
    (month) => monthlyData[month].bill
  );

  return monthlyData;
};

// Helper function to get the week number of the year
const getWeekNumber = (date) => {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff =
    date -
    start +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
  const oneWeek = 604800000;
  return Math.ceil(diff / oneWeek + 1);
};
