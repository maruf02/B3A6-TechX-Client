import moment from "moment";

// Utility function to verify if the current date is before the end date
export const verifyPayment = (endTime: string) => {
  const currentDate = moment(); // Get current date as a Moment.js object
  const endDate = moment(endTime, "DD-MM-YYYY"); // Convert payment end time to Moment.js

  return endDate.isAfter(currentDate) ? "yes" : "No";
};
