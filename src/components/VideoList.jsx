"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Box, 
  Button, 
  List, 
  ListItem, 
  Typography, 
  Alert,
  Container,
  Paper 
} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);  

  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/videos");
      if (!res.ok) throw new Error("Failed to load videos");

      const data = await res.json();
      setVideos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('video/')) {
      setError('Please select a video file');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('video', file);

      const res = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to upload video');
      }

      // Refresh video list after successful upload
      await fetchVideos();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        {/* Upload Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            style={{ display: 'none' }}
            id="video-upload"
          />
          <label htmlFor="video-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<UploadFileIcon />}
              disabled={uploading}
              sx={{ mb: 2 }}
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </label>
        </Box>

        {/* Error/Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Video List */}
        {videos.length === 0 && (
          <Typography align="center" color="text.secondary">
            No videos available
          </Typography>
        )}


          <List>
            {videos.map((video) => (
              <ListItem 
                key={video}
                sx={{
                  borderBottom: '1px solid #eee'
                }}
              >
                <Link 
                  href={`/preview/${encodeURIComponent(video)}`}
                  style={{
                    textDecoration: 'none',
                    color: 'black',
                    width: '100%',
                    padding: '8px '
                  }}
                >
                  {video}
                </Link>
              </ListItem>
            ))}
          </List>
      </Paper>
    </Container>
  );
}

export default VideoList;