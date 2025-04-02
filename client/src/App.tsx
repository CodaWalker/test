import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./components/ThemeProvider";
import NotFound from "@/pages/not-found";
import Explore from "@/pages/Explore";
import Profile from "@/pages/Profile";
import Favorites from "@/pages/Favorites";
import Search from "@/pages/Search";
import BottomNavigation from "./components/BottomNavigation";
import Header from "./components/Header";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Explore} />
          <Route path="/profile" component={Profile} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/search" component={Search} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
