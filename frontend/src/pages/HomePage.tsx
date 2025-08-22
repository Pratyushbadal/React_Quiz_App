import { useContext } from "react";
import AuthHomePage from "../components/HomePage/AuthHomePage";
import UnAuthHomePage from "../components/HomePage/UnAuthHomePage";
import { AuthContext } from "../App";

function HomePage() {
  const { isAuth } = useContext(AuthContext);

  return isAuth ? <AuthHomePage /> : <UnAuthHomePage />;
}

export default HomePage;
