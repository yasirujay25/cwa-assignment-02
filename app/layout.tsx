"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import './globals.css';


export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
    color: theme === "light" ? "#000" : "#fff"
  };

  const footerStyle = {
    textAlign: "center",
    padding: "10px",
    backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
    color: theme === "light" ? "#000" : "#fff",
    marginTop: "20px"
  };

  const menuButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: theme === "light" ? "#000" : "#fff"
  };


  return (
    <html lang="en">
      <body style={{ margin: "0", backgroundColor: theme === "light" ? "#a79f9fff" : "#474855ff", color: theme === "light" ? "#474855ff" : "#a79f9fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* HEADER */}
        <header style={headerStyle}>
          <h4>LTU Moodle Prototype</h4>
          <span style={{ fontWeight: "bold" }}>Student No: 123456</span>

          
        </header>

        <nav style={{ padding: '10px', background: '#19532cff', color: '#90d8a0ff', display: 'flex', alignItems: "center",justifyContent: "space-between" }}>
          <ul style={{ display: 'flex', gap: '20px', listStyle: 'none' }}>
            <li><Link href="/">Tabs</Link></li>
            <li><Link href="/pre-lab-question">Pre-Lab-Question</Link></li>
            <li><Link href="/escape-room">Escape Room</Link></li>
            <li><Link href="/coding-races">Coding Races</Link></li>
            <li><Link href="/court-room">Court Room</Link></li>
          </ul>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: '20px'
          }}>
            <li style={{ listStyle: 'none' }} ><Link href="/about">About</Link></li>
            <button style={menuButtonStyle}>☰</button>
          </div>
        </nav>


        {/* MAIN CONTENT */}
        <main style={{ flex: "1" }}>
          <button style={{ ...menuButtonStyle, float: "right" }} onClick={toggleTheme}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          {children}</main>

        {/* FOOTER */}
        <footer style={footerStyle}>
          © Your Name | Student No: 123456 | {new Date().toLocaleDateString()}
        </footer>
      </body>
    </html>
  );
}
