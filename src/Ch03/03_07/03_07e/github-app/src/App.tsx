import { useState } from "react";
import "./App.css";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  useQueries,
  useMutation,
  keepPreviousData
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000
    }
  }
});

const fetchUserRepos = async (
  username: string,
  page: number = 1
) => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=3&page=${page}`
  );
  return response.json();
};

interface UserRepositoriesProps {
  username: string;
}

function UserRepositories({
  username
}: UserRepositoriesProps) {
  const [page, setPage] = useState(1);
  const { data: repos = [], isLoading } = useQuery({
    queryKey: ["github", "repos", username, page],
    queryFn: () => fetchUserRepos(username, page),
    placeholderData: keepPreviousData
  });

  if (isLoading) return <div>Loading repositories...</div>;

  return (
    <div>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
            >
              {repo.name}
            </a>
          </li>
        ))}
      </ul>
      {repos.length === 0 && <p>No repos found!</p>}
      <div>
        <button
          onClick={() =>
            setPage((old) => Math.max(old - 1, 1))
          }
          disabled={page === 1}
        >
          Previous Page
        </button>
        <span>Page {page}</span>
        <button
          onClick={() =>
            setPage((old) => Math.max(old + 1))
          }
          disabled={repos.length < 3}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

const fetchGitHubUser = async (username: string) => {
  console.log(
    `Fetching ${username} data at ${new Date().toLocaleTimeString()}`
  );
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
      queryFn: () => fetchGitHubUser(username),
      staleTime: 30 * 1000
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

  const favoriteMutation = useMutation({
    mutationFn: saveFavorite,
    onMutate: async (newFavorite) => {
      const previousFavorites = { ...favorites };
      setFavorites((prev) => ({
        ...prev,
        [newFavorite.username]: newFavorite.isFavorite
      }));
      return { previousFavorites };
    },
    onError: (_err, _newFavorite, context) => {
      if (context) {
        setFavorites(context.previousFavorites);
      }
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
      {results.map((result) => {
        if (!result.data) return null;
        const username = result.data.login;
        const isFavorite = favorites[username];
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
              {isFavorite
                ? "* Favorited"
                : "* Add to Favorites"}
            </button>
            <button
              onClick={() => refreshUser(result.data.login)}
            >
              Refresh This User
            </button>
            <UserRepositories username={username} />
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
