import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import './index.css';

const ITEMS_PER_PAGE = 30;
const API_BASE = 'https://api.github.com/search/repositories';

function App() {
  const [repos, setRepos] = useState([]);           // Array<Repo>
  const [page, setPage] = useState(1);              // Current page (GitHub starts at 1)
  const [hasMore, setHasMore] = useState(true);     // Comtrol whether to load more
  const [isLoading, setIsLoading] = useState(false); // Prevent double-fetch

  const tenDaysAgo = moment().subtract(10, 'days').format('YYYY-MM-DD');

  // Extract API call into reusable function
  const fetchRepos = async () => {
    if (isLoading) return; // Prevent race conditions
    setIsLoading(true);

    try {
      const response = await axios.get(API_BASE, {
        params: {
          q: `created:>${tenDaysAgo}`,
          sort: 'stars',
          order: 'desc',
          per_page: ITEMS_PER_PAGE,
          page: page,
        },
      });

      const newRepos = response.data.items || [];

      if (newRepos.length === 0 || newRepos.length < ITEMS_PER_PAGE) {
        setHasMore(false); // Last page reached
      }

      setRepos((prev) => [...prev, ...newRepos]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    if (repos.length === 0 && !isLoading) {
      fetchRepos();
    }
  }, []);

  // Format stars count: 1500 → 1.5k
  const formatStars = (num) => {
    if (num >= 1000) {
      const formatted = (num / 1000).toFixed(1) + 'k';
      return formatted;
    }
    return num;
  };

  const RepoItem = ({ repo }) => (
    <li className="repo-item">
      <h2 className="repo-name">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-link"
        >
          {repo.name}
        </a>
      </h2>

      <p className="repo-desc">
        {repo.description || 'No description'}
      </p>

      <div className="repo-footer">
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          className="owner-avatar-small"
          loading="lazy"
        />
        <span className="owner-name">{repo.owner.login}</span>
        <span className="repo-stars">⭐ {formatStars(repo.stargazers_count)}</span>
      </div>
    </li>
  );

  return (
    <div className="App">
      <header className="app-header">
        <h1>Trending GitHub Repos</h1>
      </header>

      <InfiniteScroll
        dataLength={repos.length}
        next={fetchRepos}
        hasMore={hasMore}
        loader={<p className="loading-text">Loading more repos...</p>}
        endMessage={<p className="end-message">No more repos available.</p>}
      >
        <ul className="repo-list">
          {repos.map((repo) => (
            <RepoItem key={repo.id} repo={repo} />
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
}

export default App;
