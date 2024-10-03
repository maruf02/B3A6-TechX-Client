import moment from "moment";

interface Payment {
  startTime: string; // Assuming startTime and endTime are in ISO string format
  endTime: string;
}

export const isUserVerified = (payments: Payment[]): boolean => {
  const today = moment(); // Get today's date

  return payments.some((payment) => {
    const startTime = moment(payment.startTime);
    const endTime = moment(payment.endTime);

    // Check if today's date is between startTime and endTime
    return today.isBetween(startTime, endTime, "day", "[]"); // Inclusive of both dates
  });
};
