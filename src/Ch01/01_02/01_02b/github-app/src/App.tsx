import "./App.css";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function GitHubProfile() {
  return <div>GitHub Profile Component</div>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GitHubProfile />
    </QueryClientProvider>
  );
}

export default App;
