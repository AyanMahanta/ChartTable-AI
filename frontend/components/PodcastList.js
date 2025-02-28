import { useState, useEffect } from 'react';
import axios from 'axios';
import AIInsights from './AIInsights'; // Import AI Insights component

export default function PodcastList() {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/podcasts`)
      .then(res => setPodcasts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Your Podcasts</h2>
      {podcasts.map(podcast => (
        <div key={podcast.id}>
          <h3>{podcast.title}</h3>
          <p>{podcast.description}</p>
          
          {podcast.episodes?.map(episode => (
            <div key={episode.title}>
              <h4>{episode.title}</h4>
              <p>{episode.description}</p>
              <AIInsights
                episodeTitle={episode.title}
                episodeDescription={episode.description}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
