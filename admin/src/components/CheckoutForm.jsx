import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51Q60ykRwlNk6yNbqvrPlvgJuAxjrClJULuM4CgU5AMZyrE2J5rSq31cnBv1epRZxf8D7vufZtpCTquz5zVy33Gdk003UJGeJ3p");

const CheckoutForm = () => {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("http://localhost:5000/api/orders/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.client_secret);
  }, []);

  const options = {fetchClientSecret};

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export default CheckoutForm;