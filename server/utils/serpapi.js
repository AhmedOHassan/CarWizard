import { config } from 'dotenv';
import SerpApi from 'google-search-results-nodejs';

config();

const search = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY);

export const getProductLinks = (query, callback) => {
  const params = {
    engine: "google",
    q: query,
    location: "United States",
    hl: "en",
    gl: "us",
  };

  search.json(params, (data) => {
    const results = data.organic_results?.slice(0, 3).map(r => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet
    })) || [];

    callback(results);
  });
};
