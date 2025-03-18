import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQueries
} from "@tanstack/react-query";

const queryClient = new QueryClient();

const fetchGitHubUser = async (username) => {
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

function GitHubProfiles() {
  const usernames = ["eveporcello", "moontahoe"];

  const results = useQueries({
    queries: usernames.map((username) => ({
      queryKey: ["user", username],
      queryFn: () => fetchGitHubUser(username)
    }))
  });

  return <div>{JSON.stringify(results)}</div>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GitHubProfiles />
    </QueryClientProvider>
  );
}

export default App;
