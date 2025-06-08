"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Slider, Container, Box, Grid, Typography } from "@mui/material";
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
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          mt: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Preview: {filename}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Original
            </Typography>
            <img
              src={thumbnailUrl}
              alt="Original thumbnail"
              style={{ width: "300px", border: "1px solid #ccc" }}
            />
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Binarized
            </Typography>
            <canvas
              ref={canvasRef}
              style={{
                border: "1px solid #ccc",
                display: "block",
                margin: "0 auto",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Typography>Pick Target Color:</Typography>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{
              width: "40px",
              height: "40px",
              border: "none",
              padding: 0,
            }}
          />
          <Typography sx={{ ml: 2 }}>Threshold:</Typography>
          <Slider
            value={threshold}
            min={0}
            max={200}
            onChange={(e, newValue) => setThreshold(newValue)}
            sx={{ width: 300 }}
          />
        </Box>
      </Box>
      <StartProcess />
    </Container>
  );
}
