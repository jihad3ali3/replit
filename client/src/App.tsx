import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/Home";
import Universities from "@/pages/Universities";
import UniversityDetails from "@/pages/UniversityDetails";
import Colleges from "@/pages/Colleges";
import Articles from "@/pages/Articles";
import Guidance from "@/pages/Guidance";
import Apply from "@/pages/Apply";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/universities" component={Universities} />
      <Route path="/universities/:id" component={UniversityDetails} />
      <Route path="/colleges" component={Colleges} />
      <Route path="/articles" component={Articles} />
      <Route path="/guidance" component={Guidance} />
      <Route path="/apply/:uniId?" component={Apply} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
