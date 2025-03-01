"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || !title) {
      alert("Please fill all fields!");
      return;
    }
  
    setLoading(true);
  
    try {
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("podcasts")
        .upload(`uploads/${Date.now()}_${file.name}`, file);
  
      if (error) {
        console.error("Upload Error:", error);
        alert("Upload failed!");
        setLoading(false);
        return; // Stop the function if upload fails
      }
  
      console.log("File Uploaded:", data.path);
  
      // Call AI Insights API Route
      const aiResponse = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
  
      if (!aiResponse.ok) {
        console.error("AI API Error");
        alert("AI failed to generate insights!");
        setLoading(false);
        return;
      }
  
      const { insight } = await aiResponse.json();
      console.log("AI Insight:", insight);
  
      alert(`Podcast uploaded successfully! 🎧\nAI Insight: ${insight}`);
    } catch (err) {
      console.error("Unexpected Error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false); // Always reset loading state
    }
  }  

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Upload Podcast</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Podcast Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          className="w-full p-2 border rounded"
          onChange={(e) => setFile(e.target.files[0])}




        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
