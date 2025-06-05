"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

export default function PreviewPage({ params }) {
  const { filename } = useParams();
  const [color, setColor] = useState("#ff0000");
  const [threshold, setThreshold] = useState(100);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const thumbnailUrl = `http://localhost:3001/thumbnail/${encodeURIComponent(filename)}`;

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = thumbnailUrl;

    img.onload = () => {
      imgRef.current = img;
      drawBinarized(img, color, threshold);
    };
  }, [thumbnailUrl]);

  useEffect(() => {
    if (imgRef.current) {
      drawBinarized(imgRef.current, color, threshold);
    }
  }, [color, threshold]);

  const drawBinarized = (img, targetColor, threshold) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Scale image down to a max width of 300px
    const scale = 300 / img.width;
    const width = img.width * scale;
    const height = img.height * scale;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Convert hex color to RGB
    const rT = parseInt(targetColor.slice(1, 3), 16);
    const gT = parseInt(targetColor.slice(3, 5), 16);
    const bT = parseInt(targetColor.slice(5, 7), 16);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const diff = Math.sqrt((r - rT) ** 2 + (g - gT) ** 2 + (b - bT) ** 2);
      const value = diff < threshold ? 0 : 255;
      data[i] = data[i + 1] = data[i + 2] = value;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div>
      <h1>Preview: {filename}</h1>

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <h3>Original</h3>
          <img
            src={thumbnailUrl}
            alt="Original thumbnail"
            style={{ width: "300px", border: "1px solid #ccc" }}
          />
        </div>
        <div>
          <h3>Binarized</h3>
          <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }} />
        </div>
      </div>

      <div>
        <label>Pick Target Color: </label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <label style={{ marginLeft: "1rem" }}>Threshold: </label>
        <input
          type="number"
          value={threshold}
          min={0}
          max={442}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
