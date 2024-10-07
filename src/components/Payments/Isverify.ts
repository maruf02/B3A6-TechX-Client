import moment from "moment";

export const verifyPayment = (endTime: string) => {
  const currentDate = moment();
  const endDate = moment(endTime, "DD-MM-YYYY");

  return endDate.isAfter(currentDate) ? "yes" : "No";
};
