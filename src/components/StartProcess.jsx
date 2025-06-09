"use client";
import { useState, useEffect } from "react";
import { Box, Button, Typography, Link, LinearProgress } from "@mui/material";
import CompletedJobs from "./CompletedJobs";

export default function StartProcess({ filename, color, threshold }) {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [completedJobs, setCompletedJobs] = useState([]);

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
      try {
        const res = await fetch(`http://localhost:3000/process/${jobId}/status`);
        const data = await res.json();

        if (data.status === "done") {
          setStatus("done");
          setCompletedJobs((prev) => [...prev, { jobId, filename }]);
          clearInterval(interval);
        } else if (data.status === "error") {
          setStatus("error");
          setError(data.error || "Unknown error");
          clearInterval(interval);
        }
      } catch (err) {
        setStatus("error");
        setError("Failed to check job status");
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
        {status === "processing" ? "Processing..." : "Start Process"}
      </Button>

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
        </Box>
      )}

      <CompletedJobs jobs={completedJobs} />
    </Box>
  );
}
