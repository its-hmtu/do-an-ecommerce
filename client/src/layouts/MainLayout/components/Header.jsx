import React, { useContext, useEffect, useState } from "react";

const Header = () => {
  return (
    <header className="main-layout__header">
      <div className="main-layout__header__top-banner">
        <p>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50% <a href="#">ShopNow</a></p>
      </div>
      <div className="main-layout__header__nav">
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Sign Up</a></li>
          </ul>
        </nav>
        <div className="header__nav-icons">
          <a href="#" className="header__nav-icon">
            <i className="fas fa-search"></i>
          </a>
          <a href="#" className="header__nav-icon">
            <i className="fas fa-heart"></i>
          </a>
          <a href="#" className="header__nav-icon">
            <i className="fas fa-shopping-cart"></i>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;

