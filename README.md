# GitHub Trending Repos (Last 10 Days)

A responsive React web app that displays the most starred GitHub repositories created in the last 10 days, with infinite scroll.

Live Demo: https://hamadanono.github.io/github-trending-repos

## Features

- Fetches real-time data from GitHub API
- Shows only repositories created in the last 10 days
- Sorted by number of stars (descending)
- Infinite scrolling
- Fully responsive – works perfectly on mobile and desktop

## Tech Stack

- React.js
- Axios
- Moment.js
- react-infinite-scroll-component
- CSS

## How It Works

1. On load, calculates "10 days ago" using Moment.js
2. Calls GitHub API:  
   `https://api.github.com/search/repositories?q=created:>YYYY-MM-DD&sort=stars&order=desc`
3. Uses pagination (`&page=2`, `&page=3`, etc.)
4. Appends new results to the list as you scroll
5. Stops when no more repositories are returned

## Project Structure

src/
  App.js
  index.js
  index.css
public/
  index.html

## Setup & Run Locally

```bash
# Clone the repo
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Start development server
npm start

Open http://localhost:3000 to view it in the browser.

