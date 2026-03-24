import React, { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import ChartComponent from "./components/ChartComponent";
import "./styles/main.css";
import "./styles/dashboard.css";

// Library to convert ISO country codes
import countriesLib from "i18n-iso-countries";
// Register English locale
countriesLib.registerLocale(require("i18n-iso-countries/langs/en.json"));

// Dashboard component: displays navbar, search, country cards, and chart
function Dashboard({ countries, advisories, onLogout }) {
  const [searchField, setSearchField] = useState("");

  
  // Filter countries based on search input
  const filteredCountries = countries.filter((country) =>
    country.country.toLowerCase().includes(searchField.toLowerCase())
  );

  return (
    <div className="App">
      <Navbar onLogout={onLogout} />

      <div className="dashboard-center">
        <h1>🌍 Global Health and Travel Safety Dashboard</h1>
        <input
          type="text"
          placeholder="Search country..."
          onChange={(e) => setSearchField(e.target.value)}
          className="search-box"
        />
      </div>

      <div className="card-container">
        {filteredCountries.map((c) => {
          const iso2 = c.countryInfo?.iso2;
          const iso3 = iso2 ? countriesLib.alpha2ToAlpha3(iso2) : null;

          // Get advisory data for the country
          const advisory = iso3 && advisories[iso3]?.advisory ? advisories[iso3].advisory : null;

          return (
            <Card
              key={c.country} // Unique key for React
              country={c.country}
              cases={c.cases}
              deaths={c.deaths}
              recovered={c.recovered}
              flag={c.countryInfo?.flag}
              advisoryText={advisory?.message || "No advisory available"}
              advisoryScore={advisory?.score || "N/A"}
            />
          );
        })}
      </div>

      <ChartComponent data={filteredCountries} />
    </div>
  );
}
// Main App component
function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Track login state
  const [countries, setCountries] = useState([]); // Store country COVID data
  const [advisories, setAdvisories] = useState({}); // Store travel advisory data
  const [loading, setLoading] = useState(true); // Loading state

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get("token");

    if (tokenFromURL) {
      localStorage.setItem("jwt", tokenFromURL);
      setLoggedIn(true);
      window.history.replaceState({}, document.title, "/");
    } else {
      const tokenFromStorage = localStorage.getItem("jwt");
      if (tokenFromStorage) setLoggedIn(true);
    }

    // Fetch COVID data and travel advisories from backend
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch COVID-19 data
        const covidResp = await fetch("http://localhost:3001/api/covid");
        const covidData = await covidResp.json();
        setCountries(covidData);

        // Fetch advisory data
        const advResp = await fetch("http://localhost:3001/api/advisory");
        const advData = await advResp.json();
        setAdvisories(advData.data || {});

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  // Show loading message while data is fetched
  if (loading) {
    return (
      <div className="App">
        <h2>Loading data...</h2>
      </div>
    );
  }
  // Show landing page 
  return !loggedIn ? (
    <Landing onLogin={() => setLoggedIn(true)} />
  ) : (
    <Dashboard
      countries={countries}
      advisories={advisories}
      onLogout={handleLogout}
    />
  );
}

export default App;
