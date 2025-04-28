import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const resultCode = searchParams.get("resultCode");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold">Payment Result</h2>
      <p>Order ID: {orderId}</p>
      {/* <p>Message: {message}</p> */}
      {resultCode === "0" ? (
        <p className="text-green-600 font-semibold">Payment successfull!</p>
      ) : (
        <p className="text-red-600 font-semibold">Payment fail! </p>
      )}
    </div>
  );
};

export default PaymentResult;
