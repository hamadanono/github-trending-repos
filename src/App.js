import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import './index.css';

function App() {
  const [repos, setRepos] = useState([]); // State to store the accumulated list of repositories
  const [page, setPage] = useState(1); // Page number for GitHub API pagination
  const [hasMore, setHasMore] = useState(true); // Controls whether more data is available to load
  const initialLoadDone = useRef(false); // Prevent double-fetch (dev mode mounts twice)
  const tenDaysAgo = moment().subtract(10, 'days').format('YYYY-MM-DD');

  const fetchRepos = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=created:>${tenDaysAgo}&sort=stars&order=desc&page=${page}`
      );

      const newRepos = response.data.items || [];

      // If no more results, stop infinite scroll
      if (newRepos.length === 0) {
        setHasMore(false);
        return;
      }

      // Append newly fetched repos to the existing list
      setRepos((prev) => [...prev, ...newRepos]);

      // Move to the next page for the next scroll
      setPage((prev) => prev + 1);

    } catch (error) {
      console.error('API error:', error);
      setHasMore(false);
    }
  };

  // Load first page only once even in StrictMode
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
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

  return (
    <div className="App">
      <h1>Trending Repos</h1>

      <InfiniteScroll
        dataLength={repos.length}
        next={fetchRepos}
        hasMore={hasMore}
        loader={<p style={{ textAlign: 'center', padding: '20px' }}>Loading more repos...</p>}
        endMessage={<p style={{ textAlign: 'center', padding: '20px' }}>No more repos.</p>}
      >
        <ul className="repo-list">
          {repos.map((repo) => (
            <li key={repo.id} className="repo-item">
              <h2 className="repo-name">{repo.name}</h2>
              <p className="repo-desc">{repo.description || 'No description'}</p>

              <div className="repo-footer">
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="owner-avatar-small"
                />
                <span className="owner-name">{repo.owner.login}</span>
                <span className="repo-stars">⭐ {formatStars(repo.stargazers_count)}</span>
              </div>
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
}

export default App;
