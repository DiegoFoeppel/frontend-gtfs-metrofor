import MapExample from "@/components/Map";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MapExample />
    </QueryClientProvider>
  );
}

export default App;
