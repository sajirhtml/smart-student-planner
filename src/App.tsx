import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/UserContext";
import Layout from "@/components/Layout.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import CoursePlanner from "@/pages/CoursePlanner.jsx";
import CGPA from "@/pages/CGPA.jsx";
import Tasks from "@/pages/Tasks.jsx";
import Schedule from "@/pages/Schedule.jsx";
import Rooms from "@/pages/Rooms.jsx";
import Placeholder from "@/pages/Placeholder.jsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/planner" element={<CoursePlanner />} />
              <Route path="/schedule"      element={<Schedule />} />
              <Route path="/cgpa"          element={<CGPA />} />
              <Route path="/tasks"         element={<Tasks />} />
              <Route path="/rooms"         element={<Rooms />} />
              <Route path="/resources"     element={<Placeholder title="Course Resource Hub" />} />
              <Route path="/consultations" element={<Placeholder title="Faculty Consultations" />} />
              <Route path="/faculty"       element={<Placeholder title="Faculty & Advisor Portal" />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
