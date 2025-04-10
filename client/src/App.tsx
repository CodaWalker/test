import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Explore from "@/pages/Explore";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Explore} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
  );
}

export default App;
