import './Style/movies.css';
import movieImage from '../assets/Images/imagemovie.png';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate("/updatemovie", { state: { movie } });
  };

  return (
    <div className="movie-card">
      <img src={movie?.poster || movieImage} alt={movie?.title} className="movie-image" />

      <div className="infoContainer">
        <div className="movie-info">
          <h3>{movie?.title}</h3>
          <p>{movie?.publishingYear}</p>
        </div>

        <button className="updateBtn" onClick={handleUpdate}>
          Edit
        </button>
      </div>
    </div>
  );
}
