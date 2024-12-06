import React from "react";
import "./hrstyle.css"; 
import bg from "./assets/images/bg.jpg"; 

function HR() {
  return (
    <>
      <header>
        <nav>
          <div className="navbar">
            <div className="logo">
              {/* Use the imported logo */}
              <img
                src={logo}
                alt="logo"
                className="logo-image"
              />
            </div>
            <ul>
              <li className="active">
                <a href="group-test-2.html">Staff information</a>
              </li>
              <li>
                <a href="service.html">Staff development</a>
              </li>
              <li>
                <a href="our-products.html">Vehicle Procument</a>
              </li>
            </ul>
          </div>
        </nav>
      </header>


      <section className="bd"></section>

      <section className="footing">
        <footer>
          <div className="footer1">
            <div className="tag2">
              <h2>Love is in the hair!</h2>
            </div>
            <div className="foot">
              <h2>All rights reserved 2024</h2>
            </div>
            <div className="email">
              <a href="mailto:mokoenasalon@gmail.com">
                mokoenasalon@gmail.com
              </a>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
}

export default HR;
