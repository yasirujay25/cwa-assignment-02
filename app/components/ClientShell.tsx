"use client";

import Link from "next/link";
import React from "react";

type Theme = "light" | "dark";

export default function ClientShell({ children }: React.PropsWithChildren) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [dateStr, setDateStr] = React.useState("");
  const [theme, setTheme] = React.useState<Theme>("light");

  // Mount: sync theme + date, lock page to viewport (no body scroll)
  React.useEffect(() => {
    const savedTheme =
      (typeof localStorage !== "undefined" &&
        (localStorage.getItem("theme") as Theme)) ||
      "light";

    setTheme(savedTheme);

    if (typeof document !== "undefined") {
      document.body.dataset.theme = savedTheme;

      // Lock document to 100% height and hide page scrollbars
      document.documentElement.style.height = "100%";
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }

    setDateStr(new Date().toLocaleDateString());
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);

    if (typeof document !== "undefined") {
      document.body.dataset.theme = next;
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", next);
    }
  };

  const toggleMenu = () => setMenuOpen((v) => !v);

  // ---- Layout styles (100dvh grid shell) ----
  const viewportStyle: React.CSSProperties = {
    // Use dynamic viewport to avoid mobile URL bar jumps
    height: "100dvh",
    display: "grid",
    gridTemplateRows: "auto auto 1fr auto",
    overflow: "hidden",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "var(--header-bg)",
    color: "var(--header-fg)",
  };

  const footerStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "10px",
    backgroundColor: "var(--footer-bg)",
    color: "var(--footer-fg)",
  };

  const navStyle: React.CSSProperties = {
    padding: "10px",
    background: "var(--nav-bg)",
    color: "var(--nav-fg)",
    display: "flex",
    flexDirection: "column",
  };

  const iconButtonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "var(--header-fg)",
    transition: "transform 0.3s ease",
    transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
  };

  const themeButtonStyle: React.CSSProperties = {
    background: "var(--btn-bg)",
    color: "var(--btn-fg)",
    border: "1px solid var(--btn-border)",
    borderRadius: "6px",
    padding: "8px",
    cursor: "pointer",
  };

  const mainStyle: React.CSSProperties = {
    // Critical for grid children to allow scrolling without growing the grid
    minHeight: 0,
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    padding: "10px",
  };

  return (
    <div style={viewportStyle}>
      {/* HEADER */}
      <header style={headerStyle}>
        <h4 style={{ margin: 0 }}>LTU Moodle Prototype</h4>
        <span style={{ fontWeight: "bold" }}>Student No: 21764827</span>
      </header>

      {/* NAVBAR */}
      <nav style={navStyle}>
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
              flexWrap: "wrap",
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
            style={iconButtonStyle}
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
              <button onClick={toggleTheme} style={themeButtonStyle}>
                {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* MAIN CONTENT (scrolls inside, page stays 100dvh) */}
      <main style={mainStyle}>{children}</main>

      {/* FOOTER */}
      <footer style={footerStyle}>
        © Yasiru Eumal Jayasinghe | Student No: 21764827 |{" "}
        <span suppressHydrationWarning>{dateStr}</span>
      </footer>
    </div>
  );
}
