import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./payment.css";

const PaymentPage = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch clientSecret when component mounts
  useEffect(() => {
    if (!total) return;
    axios
      .post("http://localhost:5000/create-payment-intent", { amount: total })
      .then((response) => {
        console.log(response.data); // Add this line to check the response
        setClientSecret(response.data.clientSecret);
      })
      .catch((error) => console.error("Error:", error));
  }, [total]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "Customer Name",
        },
      },
    });

    setIsProcessing(false);

    if (result.error) {
      console.error(result.error.message);
    } else {
      console.log("Payment Successful");
      navigate("/confirmation");
    }
  };

  // Ensure clientSecret is available before rendering the form
  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <div className="payment-container">
      <h2>Complete Payment</h2>
      <form onSubmit={handleSubmit}>
        <CardElement className="card-element" />
        <button type="submit" disabled={!stripe || !clientSecret || isProcessing}>
          {isProcessing ? "Processing..." : `Pay $${total}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
