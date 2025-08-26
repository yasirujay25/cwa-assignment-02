"use client";

import React from "react";

export default function AboutPage() {
  const containerStyle: React.CSSProperties = {
    padding: "20px",
    textAlign: "center",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "15px",
  };

  const videoStyle: React.CSSProperties = {
    width: "80%",
    height: "400px",
    marginTop: "20px",
    border: "2px solid #ccc",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>About Me</h1>
      <p>Name: Yasiru Eumal Jayasinghe</p>
      <p>Student Number: 21764827</p>
      <p>Video demo: How to use this website</p>
      <video style={videoStyle} controls>
        <source src="/use.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
