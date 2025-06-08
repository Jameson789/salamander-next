"use client";
import { useState, useEffect } from "react";
import { Box, Button, Typography, Link, LinearProgress } from "@mui/material";

export default function StartProcess({ filename, color, threshold }) {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const start = async () => {
    setError("");
    setStatus("processing");

    try {
      const res = await fetch(
        `http://localhost:3000/process/${filename}?targetColor=${color.slice(1)}&threshold=${threshold}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      const data = await res.json();
      setJobId(data.jobId);
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`http://localhost:3000/process/${jobId}/status`);
      const data = await res.json();

      if (data.status === "done") {
        setStatus("done");
        clearInterval(interval);
      } else if (data.status === "error") {
        setStatus("error");
        setError(data.error);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <Box sx={{ marginTop: 6, textAlign: "center" }}>
      <Button
        variant="contained"
        onClick={start}
        disabled={status === "processing"}
        sx={{ backgroundColor: "lightblue", color: "black" }}
      >
        {status === "processing" && "Processing..."}
        {status !== "processing" && "Start Process"}
      </Button>

      {/* Show progress bar when processing */}
      {status === "processing" && (
        <Box sx={{ width: "100%", mt: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {error && (
        <Typography sx={{ mt: 2, color: "red" }}>❌ {error}</Typography>
      )}

      {status === "done" && (
        <Box sx={{ mt: 2 }}>
          <Typography>✅ Process complete!</Typography>
          <Link href={`/process/${jobId}/result.csv`} underline="hover" download>
            Download CSV
          </Link>
        </Box>
      )}
    </Box>

  );
}
