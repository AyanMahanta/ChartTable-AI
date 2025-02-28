"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file || !title) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.storage
      .from("podcasts")
      .upload(`uploads/${Date.now()}_${file.name}`, file);

    if (error) {
      alert("Upload failed!");
      console.error(error);
    } else {
      alert("Podcast uploaded!");
      console.log("File URL:", data.path);
    }

    setLoading(false);
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
