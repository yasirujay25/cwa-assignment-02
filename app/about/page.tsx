"use client";

export default function AboutPage() {
  const containerStyle = {
    padding: "20px",
    textAlign: "center"
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "15px"
  };

  const videoStyle = {
    width: "80%",
    height: "400px",
    marginTop: "20px",
    border: "2px solid #ccc"
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>About Me</h1>
      <p>Name: Your Name</p>
      <p>Student Number: 123456</p>
      <p>Video demo: How to use this website</p>
      <video style={videoStyle} controls>
  <source src="/use.mp4" type="video/mp4" />
</video>
    </div>
  );
}
