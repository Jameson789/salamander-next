"use client";
import { Box, Typography, List, ListItem, Button } from "@mui/material";

export default function CompletedJobs({ jobs }) {
  if (!jobs.length) return null;

  const handleDownload = async (jobId, filename) => {
    try {
      const res = await fetch(`http://localhost:3000/process/${jobId}.csv`);
      if (!res.ok) throw new Error("File not found");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename.replace(/\.[^/.]+$/, "")}_${jobId}.csv`; // strip extension
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h6" gutterBottom>
        Completed Jobs
      </Typography>
      <List>
        {jobs.map(({ jobId, filename }) => (
          <ListItem
            key={jobId}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>{filename}</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleDownload(jobId, filename)}
            >
              Download
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
