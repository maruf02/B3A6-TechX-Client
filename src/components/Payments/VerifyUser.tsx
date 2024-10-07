import { useGetPaymentByUserIdQuery } from "@/Redux/api/baseApi";
import { jwtDecode } from "jwt-decode";

import React from "react";
import { verifyPayment } from "./Isverify";

const VerifyUser = () => {
  const token = localStorage.getItem("accessToken");
  const userId = token ? jwtDecode<{ _id: string }>(token)._id : null;

  const { data: payments } = useGetPaymentByUserIdQuery(userId || "", {
    skip: !userId,
  });
  const payment = payments?.data || [];

  const isVerify = verifyPayment(payment.endTime);

  console.log(payment.endTime);

  return (
    <div>
      <h1>Verify User?</h1>
      <p>Current Date: </p>
      <h2>Payments: {isVerify}</h2>
    </div>
  );
};

export default VerifyUser;
