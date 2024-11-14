import api from "api";
const moment = require("moment")

const getStatistics = async ({
  range,
  date,
  week,
  month,
  year,
}) => {
 

  try {
    const response = await api.get("/sale/statistics", {
      params: {
        range: range,
        date: date,
        week: week,
        month: month,
        year: year,
      }
    });

    if (response.data.success === false) {
      return response.data;
    }

    return response.data;
  } catch (e) {
    return e.response.data;
  }
}

export {
  getStatistics
}