import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Archive from "./pages/Archive";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NoPage from "./pages/NoPage";
import ProblemSet from "./pages/ProblemSet";
import Testing from "./components/Testing";
import POTDArchive from "./pages/POTDArchive";
import AdminProblem from "./pages/AdminProblem";
import Dashboard from "./pages/Dashboard";
import Help from "./pages/ContactUsPage";
import ProfilePage from "./pages/profilePage";
import Standings from "./pages/Standings";
import Forgotpassword from "./pages/Forgotpassword";
import DbUpdatePage from "./pages/DbUpdatePage";
import Recommendation from "./pages/Recommendation";

const theme = createTheme({
  palette: {
    primary: {
      main: "#224957",
    },
    secondary: {
      main: "#20DF7F",
    },
  },
  typography: {
    fontFamily: "Lexend Deca",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightBold: 700,
    fontWeightMedium: 600,
  },
});

function App() {
  const { user } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/forgot-password" element={<Forgotpassword />} />

          <Route
            path="/login"
            element={
              !user ? (
                <Login />
              ) : user.role === "User" ? (
                <Navigate to="/home" />
              ) : (
                <Navigate to="/admin" />
              )
            }
          />
          <Route
            path="/register"
            element={
              !user ? (
                <Signup />
              ) : user.role === "User" ? (
                <Navigate to="/home" />
              ) : (
                <Navigate to="/admin" />
              )
            }
          />

          {user && user.role === "User" ? (
            <>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/problem/:pid" element={<ProblemSet />} />
              <Route path="/testing" element={<Testing />} />
              <Route path="/potd" element={<POTDArchive />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/recommendation" element={<Recommendation />} />
              <Route path="/standing/:eid" element={<Standings />} />
            </>
          ) : (
            <></>
          )}
          {user && user.role === "Admin" ? (
            <>
              <Route path="/admin" element={<AdminProblem />} />
              <Route path="/problem/:pid" element={<ProblemSet />} />
              <Route path="/potd" element={<POTDArchive />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/standing/:eid" element={<Standings />} />
              <Route path="/dbUpdate" element={<DbUpdatePage />} />
            </>
          ) : (
            <></>
          )}

          <Route
            path="/help"
            element={
              !user ? (
                <Help pages={["register", "login", "help"]} />
              ) : (
                <Help pages={["home", "profile", "archive", "potd", "help"]} />
              )
            }
          />
          <Route path="*" element={<NoPage />} />
          <Route path="/standings" element={<Standings />} />
        </Routes>
      </BrowserRouter>

      <Footer />
    </div>
  );
}

export default App;
