import { useGetPaymentByUserIdQuery } from "@/Redux/api/baseApi";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import moment from "moment";
import React from "react";

const VerifyUser = () => {
  const token = localStorage.getItem("accessToken");
  const userId = token ? jwtDecode<{ _id: string }>(token)._id : null;

  const {
    data: payments,
    error,
    isLoading,
  } = useGetPaymentByUserIdQuery(userId || "", {
    skip: !userId,
  });
  const payment = payments?.data || [];

  if (isLoading) return <div>Loading payments...</div>;
  if (error) return <div>Error loading payments</div>;

  // verify payment

  const Date = moment().format("DD-MM-YYYY");
  const date1 = moment(payment.endTime, "DD-MM-YYYY"); // Start date
  const date2 = moment(Date, "DD-MM-YYYY"); // End date

  // Compare the dates
  const result = date1.isAfter(date2) ? "yess" : "Noo";
  // verify payment
  return (
    <div>
      <h1>Verify User?</h1>
      <p>Current Date: </p>
      <h2>Payments: </h2>
      {result}
      {payments?.length ? (
        <ul>
          {payments.map((payment: any) => {
            // Assuming startTime and endTime are part of a booking object
            const startTime = payment.booking?.startTime; // Update path if needed
            const endTime = payment.booking?.endTime; // Update path if needed
            <p>startTime:{startTime}</p>;
            // Check if today is between startTime and endTime
            const isVerified = today.isBetween(startTime, endTime, "day", "[]"); // '[]' includes the start and end date
            console.log(isVerified);
            return (
              <li key={payment._id}>
                Amount: {payment.amount}, Status: {payment.status}, Start:{" "}
                {startTime?.format("DD-MM-YYYY")}, End:{" "}
                {endTime?.format("DD-MM-YYYY")}, Verified:{" "}
                {isVerified ? "Yes" : "No"}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No payments found for this user.</p>
      )}
    </div>
  );
};

export default VerifyUser;
