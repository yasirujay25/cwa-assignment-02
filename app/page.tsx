"use client";
import { useState, useEffect } from "react";

export default function TabsPage() {
  const [tabs, setTabs] = useState<string[]>(["Step 1", "Step 2"]);
  const [contents, setContents] = useState<string[]>([
    "Install VSCode",
    "Install Chrome",
  ]);
  const [outputHtml, setOutputHtml] = useState<string>("");

  const [mounted, setMounted] = useState(false); // 👈 fix hydration mismatch

  // Load from localStorage after mount
  useEffect(() => {
    const storedTabs = localStorage.getItem("tabs");
    const storedContents = localStorage.getItem("contents");

    if (storedTabs && storedContents) {
      setTabs(JSON.parse(storedTabs));
      setContents(JSON.parse(storedContents));
    }
    setMounted(true);
  }, []);

  // Save to localStorage whenever tabs/contents change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("tabs", JSON.stringify(tabs));
      localStorage.setItem("contents", JSON.stringify(contents));
    }
  }, [tabs, contents, mounted]);

  const containerStyle: React.CSSProperties = {
    padding: "20px",
    textAlign: "center",
  };
  const titleStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  };
  const inputStyle = { padding: "5px", margin: "5px", width: "200px" };
  const buttonStyle = { padding: "5px 10px", margin: "5px", cursor: "pointer" };
  const textareaStyle = { width: "90%", height: "250px", marginTop: "20px" };

  const addTab = () => {
    setTabs([...tabs, `Step ${tabs.length + 1}`]);
    setContents([...contents, "New Step Content"]);
  };

  const deleteTab = (index: number) => {
    const newTabs = [...tabs];
    const newContents = [...contents];
    newTabs.splice(index, 1);
    newContents.splice(index, 1);
    setTabs(newTabs);
    setContents(newContents);
  };

  const updateContent = (index: number, value: string) => {
    const newContents = [...contents];
    newContents[index] = value;
    setContents(newContents);
  };

  const updateTab = (index: number, value: string) => {
    const newTabs = [...tabs];
    newTabs[index] = value;
    setTabs(newTabs);
  };

  const generateHtml = () => {
    let tabsHeaders = "";
    let tabsContent = "";

    tabs.forEach((tab, index) => {
      tabsHeaders += `<button style="padding:5px;margin:2px;cursor:pointer;" onclick="showTab(${index})">${tab}</button>\n`;
      tabsContent += `<div id="tab${index}" style="display:${
        index === 0 ? "block" : "none"
      };padding:10px;border:1px solid #ccc;margin-top:5px;">${
        contents[index]
      }</div>\n`;
    });

    const finalHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Tabs Output</title>
</head>
<body style="font-family:Arial, sans-serif;padding:20px;">
<h2>Tabs Example</h2>
<div>
${tabsHeaders}
</div>
<div>
${tabsContent}
</div>
<script>
function showTab(index) {
  const total = ${tabs.length};
  for(let i=0;i<total;i++){
    document.getElementById('tab'+i).style.display = 'none';
  }
  document.getElementById('tab'+index).style.display = 'block';
}
</script>
</body>
</html>
    `;
    setOutputHtml(finalHtml);
  };

  // ✅ Prevent hydration mismatch: render nothing until mounted
  if (!mounted) return null;

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>HTML5 + JS Tabs Generator</h1>

      <div>
        {tabs.map((tab, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              value={tab}
              style={inputStyle}
              onChange={(e) => updateTab(index, e.target.value)}
            />
            <input
              type="text"
              value={contents[index]}
              style={inputStyle}
              onChange={(e) => updateContent(index, e.target.value)}
            />
            <button
              style={{ ...buttonStyle, background: "red", color: "white" }}
              onClick={() => deleteTab(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <button style={buttonStyle} onClick={addTab}>
        Add Step
      </button>
      <button style={buttonStyle} onClick={generateHtml}>
        Generate HTML
      </button>

      <div>
        <textarea style={textareaStyle} value={outputHtml} readOnly />
      </div>
    </div>
  );
}
