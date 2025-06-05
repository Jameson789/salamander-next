"use client";

import { useEffect, useState } from "react";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/videos");
        if (!res.ok) throw new Error("Failed to load videos");

        const data = await res.json();
        setVideos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchVideos();
  }, []);  

  if (error) return <p>Error: {error}</p>;
  if (videos.length === 0) return <p>Loading videos...</p>;

  return (
    <ul>
      {videos.map((video, index) => (
        <li key={index}>{video}</li>
      ))}
    </ul>
  );
}

export default VideoList;