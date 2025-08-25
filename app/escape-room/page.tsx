"use client";

export default function EscapeRoom() {
  const containerStyle: React.CSSProperties = {
    padding: "20px",
    textAlign: "center",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "15px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Escape Room</h1>
      <p>Coming Soon...</p>
    </div>
  );
}
