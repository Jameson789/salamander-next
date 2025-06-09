"use client";
import { Box, Typography, List, ListItem, Button } from "@mui/material";

export default function CompletedJobs({ jobs }) {
  if (!jobs.length) return null;

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
              component="a"
              href={`http://localhost:3000/process/${jobId}.csv`}
              download
            >
              Download
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
