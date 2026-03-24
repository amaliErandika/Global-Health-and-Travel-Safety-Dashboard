import React from "react";
import "../styles/dashboard.css";

// Card component displays COVID stats and travel advisory for a country
function Card({ country, cases, deaths, recovered, flag, advisoryText, advisoryScore }) {
  // Determine border color based on advisory score
  const getBorderColor = (score) => {
    if (!score || score === "N/A") return "gray"; // Default gray if no score
    const numScore = parseFloat(score); // Convert string to number
    if (numScore < 2) return "green"; // Safe travel
    if (numScore < 3) return "orange"; // Moderate risk
    return "red";
  };

  const borderColor = getBorderColor(advisoryScore); // Get border color for card

  return (
    // Card container with dynamic border color
    <div className="card" style={{ borderColor }}>
      <img src={flag} alt={`${country} flag`} />
      <h2>{country}</h2>
      <p>Cases: {cases}</p>
      <p>Deaths: {deaths}</p>
      <p>Recovered: {recovered}</p>
      <p>Advisory Score: {advisoryScore || "N/A"}</p>
      <p>{advisoryText || "No advisory available"}</p>
    </div>
  );
}

export default Card;
