import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import CreateQuestionSetPage from "./pages/QuestionSet/CreateQuestionSetPage";
import { jwtDecode } from "jwt-decode";
import ListQuestionSetPage from "./pages/QuestionSet/ListQuestionSetPage";
import AttemptQuizPage from "./pages/QuestionSet/AttemptQuizPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import UserProfilePage from "./pages/UserProfilePage";
import AdminQuestionViewPage from "./pages/QuestionSet/AdminQuestionViewPage";

export interface IAuthState {
  isAuth: boolean;
  roleState: "admin" | "professional" | "guest";
  profilePicture: string | null; //
}

export interface IAuthContext extends IAuthState {
  setAuthState: React.Dispatch<React.SetStateAction<IAuthState>>;
}

export interface JWTDecode {
  role: "admin" | "professional";
  id: string;
}

export const AuthContext = createContext<IAuthContext>({
  isAuth: false,
  roleState: "guest",
  profilePicture: null,
  setAuthState: () => {},
});

function App() {
  const [authState, setAuthState] = useState<IAuthState>({
    isAuth: false,
    roleState: "guest",
    profilePicture: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    async function fetchData() {
      try {
        // Verify the token is valid
        await axios.get("http://localhost:3000/api/verify/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { role }: JWTDecode = jwtDecode(accessToken as string);

        // After verifying, fetch the user's profile to get the picture
        const profileResponse = await axios.get(
          "http://localhost:3000/users/profile/me",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setAuthState((prev) => ({
          ...prev,
          isAuth: true,
          roleState: role,
          profilePicture: profileResponse.data.profilePicture, // <-- Set the picture here
        }));
      } catch (error) {
        localStorage.clear();
        console.error("Authentication check failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <AuthContext.Provider
        value={{
          isAuth: authState.isAuth,
          roleState: authState.roleState,
          profilePicture: authState.profilePicture, // <-- Pass picture to context
          setAuthState: setAuthState,
        }}
      >
        <Navbar />
        <main className="main-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            {!authState?.isAuth && (
              <>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
              </>
            )}
            {authState?.isAuth && (
              <>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/user/:userId" element={<UserProfilePage />} />
                <Route
                  path="/questionset/list"
                  element={<ListQuestionSetPage />}
                />
                <Route
                  path="questionset/:id/attempt"
                  element={<AttemptQuizPage />}
                />
              </>
            )}
            {authState?.roleState === "admin" && (
              <>
                <Route
                  path="/admin/questionset/create"
                  element={<CreateQuestionSetPage />}
                />
                <Route
                  path="/admin/questionset/view/:id"
                  element={<AdminQuestionViewPage />}
                />
              </>
            )}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
      </AuthContext.Provider>
    </>
  );
}

export default App;
