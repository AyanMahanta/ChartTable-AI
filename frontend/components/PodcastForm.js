import { useState } from 'react';
import axios from 'axios';

export default function PodcastForm() {
  const [rssUrl, setRssUrl] = useState('');
  const [loading, setLoading] = useState(false);

  async function submitPodcast(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/podcasts`, { rssUrl });
      alert('Podcast Added!');
      console.log(response.data);
    } catch (error) {
      alert('Failed to add podcast');
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submitPodcast}>
      <input
        type="url"
        placeholder="Podcast RSS URL"
        value={rssUrl}
        onChange={(e) => setRssUrl(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Add Podcast'}
      </button>
    </form>
  );
}
