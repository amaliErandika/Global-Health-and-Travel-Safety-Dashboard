import React from "react";
import "../styles/main.css";

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      
      <div className="nav-right">
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
export default Navbar;
