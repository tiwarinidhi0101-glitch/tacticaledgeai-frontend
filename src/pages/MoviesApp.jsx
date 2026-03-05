import { useState, useEffect } from "react";
import MovieListPage from "./MovieListPage";
import { useNavigate } from "react-router-dom";
import "../Components/Style/movies.css";
import { getToken } from "../utiles/auth";

export default function MoviesApp() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000/api/v1"

  useEffect(() => {
  const fetchMovies = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication token missing");
      }

      const response = await fetch(`${BASE_URL}/movies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMovies(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchMovies();
}, []);

  if (loading)
    return (
      <div className="api-response">
        <p>Loading movies...</p>
      </div>
    );

  return (
    <div className="app-container">
      {movies.length > 0 ? ( <MovieListPage movies={movies} onAdd={() => navigate("/createmovie")}/> ) : (
        <div className="empty-movie">
          <h1>Your movie list is empty</h1>
          <button className="create-movie-btn" onClick={() => navigate("/createmovie")}> Add a new movie</button>
        </div>
      )}
    </div>
  );
}
