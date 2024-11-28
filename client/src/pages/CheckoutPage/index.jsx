import React, { useCallback, useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useLocation } from "react-router-dom";
import { useCreateCheckoutSession } from "hooks";
import axiosInstance from "api";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test secret API key.
const stripePromise = loadStripe("pk_test_51Q60ykRwlNk6yNbqvrPlvgJuAxjrClJULuM4CgU5AMZyrE2J5rSq31cnBv1epRZxf8D7vufZtpCTquz5zVy33Gdk003UJGeJ3p");

const CheckoutPage = () => {
  const {state} = useLocation();
  const {orderId, items} = state;
  console.log("checkout", state);
  
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return axiosInstance.post("/api/orders/create-checkout-session", {
      orderId,
      items,
    }).then((res) => res.data.clientSecret);
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

export default CheckoutPage;