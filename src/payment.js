import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database"; 
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./payment.css";

const stripePromise = loadStripe("pk_test_51QoxkWJ8OGc89FDAurmplBqDO88rFXenomBag0whkwU7AvbGMpFFQlwput0xdIUut6NZsaBMb0L0ezY34QEhxS1u00Xup12hUj");

const CheckoutForm = ({ totalPrice, cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const auth = getAuth();

  const handlePayment = async (event) => {
    event.preventDefault();
    const user = auth.currentUser;
  
    if (!stripe || !elements) {
      alert("Stripe has not loaded yet. Please try again.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice, currency: "usd" }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const { clientSecret } = await response.json();
      const cardElement = elements.getElement(CardElement);
  
      if (!cardElement) {
        alert("Card details are missing. Please enter your details.");
        return;
      }
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.displayName || "Guest",
            email: user?.email || "no-email@example.com",
          },
        },
      });
  
      if (result.error) {
        console.error("Payment failed:", result.error);
        alert("Payment failed. Try again.");
      } else {
        if (result.paymentIntent.status === "succeeded") {
          const orderData = {
            products: cart,
            total: totalPrice,
            orderDate: new Date().toISOString(),
            status: "Paid",
            paymentMethod: "Stripe",
            userDetails: {
              name: user?.displayName || "Guest",
              email: user?.email || "no-email@example.com",
              userId: user?.uid || "guest-id",  // Add user ID
            },
          };
        
          const db = getDatabase();
          const orderRef = ref(db, `orders/${user?.uid}/${Date.now()}`);
          await set(orderRef, orderData);  // Save the order to Firebase
          console.log("Order successfully stored in Firebase");
        
          // Clear the cart after successful payment
          const cartRef = ref(db, `carts/${user?.uid}`);
          await set(cartRef, {});  // Empty the cart in Firebase
          console.log("Cart cleared in Firebase");
        
          // Navigate to the confirmation page
          navigate("/confirmation");
        }
        
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please try again.");
    }
  };
  

  return (
    <form onSubmit={handlePayment} className="payment-form">
      <CardElement />
      <button className="pay-button" type="submit" disabled={!stripe}>
        Pay ${totalPrice.toFixed(2)}
      </button>
    </form>
  );
};

const Payment = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const db = getDatabase();
        const cartRef = ref(db, `carts/${userId}`);

        try {
          const snapshot = await get(cartRef);
          if (snapshot.exists()) {
            const cartData = snapshot.val();
            const cartItems = Object.values(cartData);
            setCart(cartItems);
            setTotalPrice(cartItems.reduce((total, item) => total + item.price * item.quantity, 0));
          } else {
            setCart([]);
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      }
    };

    fetchCart();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <div className="payment-container">
        <h2>Payment</h2>
        <p>Total Amount: ${totalPrice.toFixed(2)}</p>
        <CheckoutForm totalPrice={totalPrice} cart={cart} />
      </div>
    </Elements>
  );
};

export default Payment;
