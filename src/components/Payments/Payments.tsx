import { useCreatePaymentMutation } from "@/Redux/api/baseApi";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import React from "react";
import Swal from "sweetalert2";
import VerifyUser from "./VerifyUser";

const Payments = () => {
  const [createPayment] = useCreatePaymentMutation();

  const token = localStorage.getItem("accessToken");
  const userId = token ? jwtDecode(token)._id : null;

  const getCurrentDate = () => moment().format("DD-MM-YYYY");

  const getEndDate = () => {
    const endDate = moment().add(30, "days");
    return endDate.format("DD-MM-YYYY");
  };

  const handlePaymentSubmit = async () => {
    try {
      const paymentData = {
        bookingId: userId,
        userId: userId,
        amount: "20", // Make sure this is a number, not a string
        paymentMethod: "credit_card", // example
        status: "completed",
        date: getCurrentDate(),
        startTime: getCurrentDate(),
        endTime: getEndDate(),
      };
      console.log("paymentData", paymentData);

      const res = await createPayment(paymentData).unwrap();

      // Check if the response contains the expected payment_url
      if (res.data && res.data.payment_url) {
        window.location.href = res.data.payment_url;
        Swal.fire(
          "Payment Successful",
          "Your payment has been processed",
          "success"
        );
      } else {
        throw new Error("Payment URL not found in response.");
      }
    } catch (error) {
      console.error("Error during payment submission:", error);
      Swal.fire(
        "Error",
        error.data?.message || "There was a problem processing your payment",
        "error"
      );
    }
  };

  return (
    <div>
      <h1>Payment Demo</h1>
      <button
        onClick={handlePaymentSubmit}
        className="flex text-white btn hover:bg-[#1A4870] bg-[#5B99C2] btn-md justify-center w-full text-2xl pb-1"
      >
        Proceed to Pay
      </button>

      <VerifyUser />
    </div>
  );
};

export default Payments;
