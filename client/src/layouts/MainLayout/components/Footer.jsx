import React, { useContext, useEffect, useState } from "react";

const Footer = () => {
  return (
    <footer className="main-layout__footer">
      <div className="footer__section">
        <h3 className="footer__title">Exclusive</h3>
        <ul>
          <li><a href="#">Subscribe</a></li>
          <li><a href="#">Get 10% off your first order</a></li>
        </ul>
        <div className="footer__email-signup">
          <input type="email" placeholder="Enter your email" />
          <button type="submit">
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div className="footer__section"> 
        <h3 className="footer__title">Support</h3>
        <ul>
          <li>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</li>
          <li><a href="mailto:exclusive@gmail.com">exclusive@gmail.com</a></li>
          <li><a href="tel:+88015-88888-9999">+88015-88888-9999</a></li>
        </ul>
      </div>
      <div className="footer__section">
        <h3 className="footer__title">Account</h3>
        <ul>
          <li><a href="#">My Account</a></li>
          <li><a href="#">Login / Register</a></li>
          <li><a href="#">Cart</a></li>
          <li><a href="#">Wishlist</a></li>
          <li><a href="#">Shop</a></li>
        </ul>
      </div>
      <div className="footer__section">
        <h3 className="footer__title">Quick Link</h3>
        <ul>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms Of Use</a></li>
          <li><a href="#">FAQ</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div className="footer__section">
        <h3 className="footer__title">Download App</h3>
        <div className="footer__app-links">
          <a href="#" className="footer__app-link">
            <img src="/assets/images/google-play.png" alt="Google Play" />
          </a>
          <a href="#" className="footer__app-link">
            <img src="/assets/images/app-store.png" alt="App Store" />
          </a>
        </div>
        <p className="footer__app-text">Save $3 with App New User Only</p>
        <div className="footer__social-links">
          <a href="#" className="footer__social-link">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="footer__social-link">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="footer__social-link">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="footer__social-link">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
      <div className="footer__copyright">
        <p>&copy; Copyright Rimel 2022. All right reserved</p>
      </div>
    </footer>
  );
};

export default Footer;