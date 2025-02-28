import { useState } from 'react';
import axios from 'axios';

export default function AIInsights({ episodeTitle, episodeDescription }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchInsight() {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/insights`, {
        episodeTitle,
        episodeDescription,
        podcastId, // Pass the podcastId
      });
      setInsight(response.data.insight);
    } catch (error) {
      console.error(error);
      alert('Failed to generate insight');
    }
    setLoading(false);
  }  

  return (
    <div>
      <button onClick={fetchInsight} disabled={loading}>
        {loading ? 'Generating...' : 'Generate AI Insight'}
      </button>
      {insight && <p>{insight}</p>}
    </div>
  );
}
