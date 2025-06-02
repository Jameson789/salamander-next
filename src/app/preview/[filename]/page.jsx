"use client"

import NavBar from "@/components/navBar";
export default function PreviewPage({ params }) {
  return (
    <>
    <NavBar />
    <h1>Previewing file: {params.filename}</h1>
    </>
  );
}
