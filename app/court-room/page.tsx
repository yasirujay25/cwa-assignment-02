"use client";

export default function CourtRoom() {
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
      <h1 style={titleStyle}>Court Room</h1>
      <p>Coming Soon...</p>
    </div>
  );
}
