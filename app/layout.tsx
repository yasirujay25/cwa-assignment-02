"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./globals.css";

import type { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren<{}>) {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
    color: theme === "light" ? "#000" : "#fff",
  };

  const footerStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "10px",
    backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
    color: theme === "light" ? "#000" : "#fff",
    marginTop: "20px",
  };

  return (
    <html lang="en">
      <body
        style={{
          margin: "0",
          backgroundColor: theme === "light" ? "#a79f9fff" : "#474855ff",
          color: theme === "light" ? "#474855ff" : "#a79f9fff",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <header style={headerStyle}>
          <h4>LTU Moodle Prototype</h4>
          <span style={{ fontWeight: "bold" }}>Student No: 21764827</span>
        </header>

        {/* NAVBAR */}
        <nav
          style={{
            padding: "10px",
            background: "#19532cff",
            color: "#90d8a0ff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ul
              style={{
                display: "flex",
                gap: "20px",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              <li>
                <Link href="/">Tabs</Link>
              </li>
              <li>
                <Link href="/pre-lab-question">Pre-Lab-Question</Link>
              </li>
              <li>
                <Link href="/escape-room">Escape Room</Link>
              </li>
              <li>
                <Link href="/coding-races">Coding Races</Link>
              </li>
              <li>
                <Link href="/court-room">Court Room</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
            </ul>

            {/* Hamburger button */}
            <button
              onClick={toggleMenu}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: theme === "light" ? "#000" : "#fff",
                transition: "transform 0.3s ease",
                transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)", // animation
              }}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>

          {/* Expandable mobile menu */}
          <div
            style={{
              maxHeight: menuOpen ? "500px" : "0",
              overflow: "hidden",
              transition: "max-height 0.4s ease",
            }}
          >
            <ul
              style={{
                listStyle: "none",
                padding: "10px 0",
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <li>
                <button
                  onClick={toggleTheme}
                  style={{
                    background: "none",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "8px",
                    cursor: "pointer",
                    color: theme === "light" ? "#000" : "#fff",
                    backgroundColor: theme === "light" ? "#fff" : "#222",
                  }}
                >
                  {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main style={{ flex: "1" }}>{children}</main>

        {/* FOOTER */}
        <footer style={footerStyle}>
          © Yasiru Eumal Jayasinghe | Student No: 21764827 |{" "}
          {new Date().toLocaleDateString()}
        </footer>
      </body>
    </html>
  );
}
