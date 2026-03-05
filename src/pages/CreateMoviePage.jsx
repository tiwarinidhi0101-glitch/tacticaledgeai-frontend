import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/Style/CreateMoviePage.css";
import { getToken, getUserId } from "../utiles/auth";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000/api/v1';

export default function CreateMovie() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [publishingYear, setPublishingYear] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback((file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be less than 2MB");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e) => handleFile(e.target.files?.[0]),
    [handleFile]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !publishingYear) {
      setError("Title and publishing year are required");
      return;
    }

    if (!imagePreview) {
      setError("Please upload an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = getToken();
      const userId = getUserId();

      if (!token || !userId) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch(`${BASE_URL}/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          publishingYear: Number(publishingYear),
          poster: imagePreview,
          userId,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        if (err.message?.includes("object to insert too large")) {
          throw new Error("Image too large. Please upload a smaller image.");
        }
        throw new Error(err.message || "Failed to create movie");
      }

      alert("Movie created successfully!");
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setPublishingYear("");
    setImagePreview(null);
    setError("");
    navigate("/");
  };

  return (
    <div className="create-page-container">
      <h1 className="title">Create a new movie</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-content">
          <div className={`drop-zone ${dragActive ? "drag-active" : ""} ${imagePreview ? "has-image" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            {imagePreview ? (<img src={imagePreview} alt="Preview" className="image-preview" />) : (
              <>
                <div className="download-icon">⬆</div>
                <p className="drop-text">Drop an image here</p>
              </>
            )}

            <input id="fileInput" type="file" accept="image/*" onChange={handleFileInput} hidden />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
            />

            <input type="number" placeholder="Publishing year" value={publishingYear}
              onChange={(e) => setPublishingYear(e.target.value)}
              className="input-field input-year"
              required
            />

            {error && <p className="error-text">{error}</p>}
            <div className="button-group">
              <button type="button" className="btn btn-cancel" onClick={handleCancel}> Cancel</button>
              <button type="submit" className="btn btn-submit" disabled={loading || !title || !publishingYear} >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
