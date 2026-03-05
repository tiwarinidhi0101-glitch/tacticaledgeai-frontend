import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../utiles/auth";
import "../Components/Style/CreateMoviePage.css";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000/api/v1";

export default function EditMovie() {
  const location = useLocation();
  const navigate = useNavigate();
  const movieData = location.state?.movie;

  const [title, setTitle] = useState("");
  const [publishingYear, setPublishingYear] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!movieData) {
      navigate("/");
      return;
    }

    setTitle(movieData.title || "");
    setPublishingYear(movieData.publishingYear || "");
    setImagePreview(movieData.poster || null);
  }, [movieData, navigate]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be less than 2MB");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!movieData?._id) {
      setError("Movie ID missing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) throw new Error("Authentication required. Please login again.");

      const response = await fetch(`${BASE_URL}/movies/${movieData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          publishingYear: Number(publishingYear),
          poster: imagePreview,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Update failed");
      }

      alert("Movie updated successfully!");
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(movieData.title || "");
    setPublishingYear(movieData.publishingYear || "");
    setImagePreview(movieData.poster || null);
    navigate("/");
  };

  return (
    <div className="create-page-container">
      <h1 className="title">Edit Movie</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-content">
          <div
            className={`drop-zone ${dragActive ? "drag-active" : ""} ${imagePreview ? "has-image" : ""
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <>
                <div className="download-icon">⬆</div>
                <p className="drop-text">Drop an image here</p>
              </>
            )}
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileInput}
              hidden
            />
          </div>

          <div className="input-group">
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" required />
            <input type="number" placeholder="Publishing year" value={publishingYear} onChange={(e) => setPublishingYear(e.target.value)} className="input-field input-year" required />
            {error && <p className="error-text">{error}</p>}

            <div className="button-group">
              <button type="button" onClick={handleCancel} className="btn btn-cancel">Cancel</button>
              <button type="submit" className="btn btn-submit" disabled={loading}> {loading ? "Updating..." : "Update"}</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
