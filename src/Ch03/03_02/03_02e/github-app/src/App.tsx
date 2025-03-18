import { useState } from "react";
import "./App.css";
import {
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  useQueries,
  useMutation
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

const saveFavorite = async (data: {
  username: string;
  isFavorite: boolean;
}) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (Math.random() < 0.3) {
    throw new Error("Failed to save status");
  }
  return data;
};

function GitHubProfiles() {
  const queryClient = useQueryClient();
  const usernames = ["eveporcello", "moontahoe"];

  const results = useQueries({
    queries: usernames.map((username) => ({
      queryKey: ["github", "user", username],
      queryFn: () => fetchGitHubUser(username)
    }))
  });

  const refreshAllUsers = () => {
    queryClient.invalidateQueries({
      queryKey: ["github", "user"]
    });
  };

  const refreshUser = (username: string) => {
    queryClient.invalidateQueries({
      queryKey: ["github", "user", username]
    });
  };

  const [favorites, setFavorites] = useState<Favorites>({});
  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);
  const favoriteMutation = useMutation({
    mutationFn: saveFavorite,
    onSuccess: (data) => {
      setErrorMessage(null);
      setFavorites((prev) => ({
        ...prev,
        [data.username]: data.isFavorite
      }));
    },
    onError: (error: Error) => {
      setErrorMessage(`Error: ${error.message}`);
      console.error("Mutation failed", error);
    }
  });

  const toggleFavorite = (username: string): void => {
    favoriteMutation.mutate({
      username,
      isFavorite: !favorites[username]
    });
  };

  const isLoading = results.some(
    (query) => query.isLoading
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="profiles-container">
      <button onClick={refreshAllUsers}>
        Refresh All Users
      </button>
      {errorMessage && <div>{errorMessage}</div>}

      {results.map((result) => {
        if (!result.data) return null;
        const username = result.data.login;
        const isFavorite = favorites[username];
        const isPending =
          favoriteMutation.isPending &&
          favoriteMutation.variables?.username === username;
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
            <p>{result.data.location}</p>
            <button
              onClick={() =>
                toggleFavorite(result.data.login)
              }
            >
              {isPending
                ? "Saving..."
                : isFavorite
                ? "* Favorited"
                : "* Add to Favorites"}
            </button>
            <button
              onClick={() => refreshUser(result.data.login)}
            >
              Refresh This User
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
