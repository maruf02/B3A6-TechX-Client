import { useGetAllPaymentQuery } from "@/Redux/api/baseApi";
import { TPayment } from "@/types";
import React from "react";

const PaymentHistory = () => {
  const {
    data: payment,
    isLoading,
    isError,
  } = useGetAllPaymentQuery(undefined);

  const payments = payment?.data || [];

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center">Failed to load payments</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-black underline">
        Payment History
      </h1>
      <table className="min-w-full border border-gray-300 text-black">
        <thead className="bg-[#B7B7B7]">
          <tr>
            <th className="border px-4 py-2">Payment ID</th>
            <th className="border px-4 py-2">User Name</th>
            <th className="border px-4 py-2">User Email</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">EndTime</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment: TPayment) => (
            <tr key={payment._id} className="border-b hover:bg-gray-100">
              <td className="border px-4 py-2">{payment.transactionId}</td>
              <td className="border px-4 py-2">
                {payment.userIdP?.name || "N/A"}
              </td>
              <td className="border px-4 py-2">
                {payment.userIdP?.email || "N/A"}
              </td>
              <td className="border px-4 py-2">${payment?.amount}</td>
              <td className="border px-4 py-2">{payment.endTime}</td>
              <td className="border px-4 py-2">{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
