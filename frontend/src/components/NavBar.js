import React, { useState } from "react";
import "../styles/NavBar.css";

const NavBar = () => {
  const [language, setLanguage] = useState("English");

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="language-selector">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
