import MapExample from "@/components/Map";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <QueryClientProvider client={queryClient}>
        <MapExample />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
