import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/SignInPage";
import PrivateRoute from "./PrivateRoute";
import MoviesApp from "../pages/MoviesApp";
import UpdateMovie from "../pages/UpdateMovie";
import CreateMovie from "../pages/CreateMoviePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MoviesApp />} />
        <Route path="/updatemovie" element={<UpdateMovie />} />
        <Route path="/createmovie" element={<CreateMovie />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
