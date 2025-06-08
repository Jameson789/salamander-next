"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Slider, Container, Box, Typography } from "@mui/material";
import StartProcess from "./StartProcess";

export default function PreviewVideo({ params }) {
  const { filename } = useParams();
  const [color, setColor] = useState("#ff0000");
  const [threshold, setThreshold] = useState(100);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const thumbnailUrl = `http://localhost:3000/thumbnail/${encodeURIComponent(
    filename
  )}`;

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

    const scale = 300 / img.width;
    const width = img.width * scale;
    const height = img.height * scale;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

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

  const cardStyle = {
    padding: 2,
    borderRadius: 2,
    backgroundColor: "#fff",
    boxShadow: 1,
    textAlign: "center",
    maxWidth: 320,
    flex: "1 1 320px",
  };

  return (
    <Container maxWidth="md" sx={{ py: 5, px: 3, bgcolor: "#f9f9f9", borderRadius: 2, boxShadow: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, marginBottom: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#1976d2" }}>
          Preview: {filename}
        </Typography>

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
          <Box sx={cardStyle}>
            <Typography variant="h6" gutterBottom>
              Original
            </Typography>
            <img
              src={thumbnailUrl}
              alt="Original thumbnail"
              style={{
                width: "300px",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
          </Box>

          <Box sx={cardStyle}>
            <Typography variant="h6" gutterBottom>
              Binarized
            </Typography>
            <canvas
              ref={canvasRef}
              style={{
                width: "300px",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            padding: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
            boxShadow: 1,
            justifyContent: "center",
          }}
        >
          <Typography>Pick Target Color:</Typography>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{
              width: 40,
              height: 40,
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          />
          <Typography sx={{ marginLeft: 2 }}>Threshold:</Typography>
          <Slider
            value={threshold}
            min={0}
            max={200}
            onChange={(e, newValue) => setThreshold(newValue)}
            sx={{ width: 250 }}
          />
        </Box>
      </Box>

      <StartProcess filename={filename} color={color} threshold={threshold} />
    </Container>
  );
}
