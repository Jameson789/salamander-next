"use client";
import { Box, Typography, List, ListItem, Button, Link } from "@mui/material";

export default function CompletedJobs({ jobs  }) {
  if (!jobs.length) return null;

  return (
    <Box sx={{ marginTop: 6 }}>
      <Typography variant="h6">Completed Jobs</Typography>
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
            <Typography>{"Video: " + filename + "  -  Job ID: " + jobId}</Typography>
            <Link
              href={`http://localhost:3000/process/${filename.slice(0, filename.length - 4)}_${jobId}.csv`}
              // removes file extension
              download={`${filename.replace(/\.[^/.]+$/, "")}.csv`}
              sx={{ textDecoration: "none" }}
            >
              <Button variant="outlined" size="small">
                Download
              </Button>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
