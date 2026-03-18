import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="card">
      <h1>Codex vibe starter</h1>
      <p>Your Cloudflare build is alive.</p>
      <p>Clicks: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Click me</button>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
