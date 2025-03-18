import { useState } from "react";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQueries
} from "@tanstack/react-query";

const queryClient = new QueryClient();

const fetchGitHubUser = async (username: string) => {
  const response = await fetch(
    `https://api.github.com/users/${username}`
  );
  if (!response.ok) {
    throw new Error(
      `Network response failed: ${response.status}`
    );
  }
  return response.json();
};

interface Favorites {
  [username: string]: boolean;
}

function GitHubProfiles() {
  const usernames = ["eveporcello", "moontahoe"];

  const results = useQueries({
    queries: usernames.map((username) => ({
      queryKey: ["user", username],
      queryFn: () => fetchGitHubUser(username)
    }))
  });

  const [favorites, setFavorites] = useState<Favorites>({});

  const toggleFavorite = (username: string): void => {
    setFavorites((prev) => ({
      ...prev,
      [username]: !prev[username]
    }));
  };

  const isLoading = results.some(
    (query) => query.isLoading
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="profiles-container">
      {results.map((result) => {
        if (!result.data) return null;
        return (
          <div
            key={result.data.login}
            className="profile-card"
          >
            <img
              src={result.data.avatar_url}
              alt={result.data.login}
              className="profile-avatar"
            />
            <h2>{result.data.login}</h2>
            <button
              onClick={() =>
                toggleFavorite(result.data.login)
              }
            >
              {favorites[result.data.login]
                ? "* Favorited"
                : "* Add to Favorites"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GitHubProfiles />
    </QueryClientProvider>
  );
}

export default App;
