import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import GuestRoute from "./components/common/GuestRoute";
import AuthLayout from "./components/layout/AuthLayout";
import Loading from "./components/common/Loading";
import Home from "./pages/HomePage";
import Dashboard from "./pages/DashboardPage";
import Levels from "./pages/LevelsPage";
import Lesson from "./pages/LessonPage";
import CameraChallenge from "./pages/CameraChallengePage";
import Profile from "./pages/ProfilePage";
import Settings from "./pages/SettingsPage";
import useAuthStore from "./context/AuthContext";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import LearningPage from "./pages/LearningPage";
import Leaderboard from "./pages/LeaderboardPage";

function App() {
  const { initialize, loading } = useAuthStore();
  useEffect(() => {
    initialize();
  }, [initialize]);

  return loading ? (
    <Loading />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/levels" element={<Levels />} />
            <Route path="/lesson/:id" element={<Lesson />} />
            <Route path="/learn/:id" element={<LearningPage />} />
            <Route path="/camera-challenge" element={<CameraChallenge />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
