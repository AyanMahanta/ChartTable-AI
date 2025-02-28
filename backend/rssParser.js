const Parser = require('rss-parser');
const parser = new Parser();

async function fetchPodcastData(rssUrl) {
  try {
    const feed = await parser.parseURL(rssUrl);
    return {
      title: feed.title,
      description: feed.description,
      episodes: feed.items.map(item => ({
        title: item.title,
        audioUrl: item.enclosure?.url,
        publishedAt: item.pubDate
      }))
    };
  } catch (error) {
    console.error("RSS Parsing Error:", error);
    return null;
  }
}

module.exports = fetchPodcastData;
