import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [countdown, setCountdown] = useState(10);
  const resultCode = searchParams.get("resultCode");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");

//   useEffect(() => {
//     // Set up countdown timer
//     const timer = setInterval(() => {
//       setCountdown((prevCount) => prevCount - 1);
//     }, 1000);

//     // Set up redirect after 10 seconds
//     const redirect = setTimeout(() => {
//       navigate("/"); // Redirect to home page
//     }, 10000);

//     return () => {
//         clearInterval(timer);
//         clearTimeout(redirect);
//       };
//     }, [navigate]);
  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold">Kết quả thanh toán</h2>
      <p>Order ID: {orderId}</p>
      <p>Message: {message}</p>
      {resultCode === "0" ? (
        <p className="text-green-600 font-semibold">✅ Thanh toán thành công!</p>
      ) : (
        <p className="text-red-600 font-semibold">❌ Thanh toán thất bại.</p>
      )}
    </div>
  );
};

export default PaymentResult;
