import {
  useCreatePaymentMutation,
  useGetPaymentByUserIdQuery,
} from "@/Redux/api/baseApi";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import React, { useState } from "react";
import Swal from "sweetalert2";

import { verifyPayment } from "./Isverify";
import { TLoginUser } from "@/types";

interface ApiError {
  data?: {
    message?: string;
  };

  status?: number;
}

const Payments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [createPayment] = useCreatePaymentMutation();

  const token = localStorage.getItem("accessToken");
  const userId = token ? jwtDecode<TLoginUser>(token)._id : null;

  const { data: payments } = useGetPaymentByUserIdQuery(userId || "", {
    skip: !userId,
  });
  const payment = payments?.data || [];

  const getCurrentDate = () => moment().format("DD-MM-YYYY");

  const getEndDate = () => {
    const endDate = moment().add(30, "days");
    return endDate.format("DD-MM-YYYY");
  };
  const isVerify = verifyPayment(payment.endTime);

  const handlePaymentSubmit = async () => {
    if (isVerify === "yes") {
      Swal.fire("Payment Already Paid, Thanks!");
      return;
    }
    try {
      const paymentData = {
        userIdP: userId,
        userId: userId,
        amount: "20",
        paymentMethod: "credit_card",
        status: "completed",
        date: getCurrentDate(),
        startTime: getCurrentDate(),
        endTime: getEndDate(),
      };
      console.log("paymentData", paymentData);

      const res = await createPayment(paymentData).unwrap();

      if (res.data && res.data.payment_url) {
        window.location.href = res.data.payment_url;
        // Swal.fire(
        //   "Payment Successful",
        //   "Your payment has been processed",
        //   "success"
        // );
      } else {
        throw new Error("Payment URL not found in response.");
      }
    } catch (error) {
      // console.error("Error during payment submission:", error);
      // Swal.fire(
      //   "Error",
      //   error.data?.message || "There was a problem processing your payment",
      //   "error"
      // );
      const apiError = error as ApiError;

      console.error("Error during payment submission:", apiError);
      Swal.fire(
        "Error",
        apiError.data?.message || "There was a problem processing your payment",
        "error"
      );
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <h1 className="text-4xl text-center py-8 text-black font-semibold underline">
        Pay for Premium access
      </h1>

      <div>
        <button
          onClick={openModal}
          className="flex mx-auto text-white btn hover:bg-[#1A4870] bg-[#5B99C2] btn-md justify-center w-3/4 text-2xl pb-1"
        >
          Proceed to Pay
        </button>

        {/* Modal Dialog */}
        {isOpen && (
          <dialog className="modal" open>
            <div className="modal-box bg-[#B7B7B7] text-black">
              <h3 className="font-bold text-2xl text-center  ">Welcome!</h3>
              <p className="py-4">Amount: $20</p>
              <p className="py-2">Expire Date:: {getEndDate()}</p>
              <div className="modal-action">
                <button
                  onClick={handlePaymentSubmit}
                  className="flex mx-auto text-white btn hover:bg-[#1A4870] bg-[#5B99C2] btn-md justify-center w-3/4 text-2xl pb-1"
                >
                  Proceed to Pay
                </button>
                <button
                  className="btn text-white btn hover:bg-[#1A4870] bg-[#5B99C2] btn-md"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>

      {/* <button
        onClick={handlePaymentSubmit}
        className="flex mx-auto text-white btn hover:bg-[#1A4870] bg-[#5B99C2] btn-md justify-center w-3/4 text-2xl pb-1"
      >
        Proceed to Pay
      </button> */}
    </div>
  );
};

export default Payments;
