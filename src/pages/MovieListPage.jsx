import { useState } from "react";
import Header from "../Components/Header";
import MovieCard from "../Components/MovieCard";
import Pagination from "../Components/Pagination";
import "../Components/Style/movies.css";

export default function MovieListPage({ movies = [], onAdd }) {
  const [page, setPage] = useState(1);
  const MOVIES_PER_PAGE = 8;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  const endIndex = startIndex + MOVIES_PER_PAGE;
  const currentMovies = movies.slice(startIndex, endIndex);

  return (
    <div className="content">
      <Header onAdd={onAdd} />
      <div style={{maxHeight:"700px"}}>
      <div className="movie-grid">
        {currentMovies.map((m) => (<MovieCard key={m.id} movie={m} />))}
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={Math.ceil(movies.length / MOVIES_PER_PAGE)}
      />
      </div>
    </div>
  );
}
