import { useState } from "react";
import "../Components/Style/SignIn.css";
import { useNavigate } from "react-router-dom";
import WaveBackground from "../Components/WaveBackground";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({name: "", email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000/api/v1";
  const {login} = useAuth()

  const validate = (name, value) => {
    let error = "";

    if (name === "name" && isSignUp) {
      if (!value) error = "Name is required";
      else if (value.length < 2) error = "Name should be at least 2 characters";
    }

    if (name === "email") {
      if (!value) error = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Enter a valid email";
    }

    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 6) error = "Password should be at least 6 characters";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: validate(name, value) });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const newErrors = {
      name: validate("name", formData.name),
      email: validate("email", formData.email),
      password: validate("password", formData.password),
    };
    setErrors(newErrors);

    if (newErrors.name || newErrors.email || newErrors.password) return;

    try {
      setLoading(true);

      const endpoint = isSignUp ? "/auth/register" : "/auth/login";
      const body = isSignUp ? { name: formData.name.trim(), email: formData.email.trim(), password: formData.password } : { email: formData.email.trim(), password: formData.password };
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (isSignUp ? "Registration failed" : "Invalid email or password"));
      }
      login( {token: data.access_token,user: data.user},formData.rememberMe)
      
      navigate("/", { replace: false });
      handleReset();
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", password: "", rememberMe: false });
    setErrors({});
    setApiError("");
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    handleReset();
  };

  const isFormValid = (!isSignUp || (formData.name && !errors.name)) && formData.email && !errors.email && formData.password &&  !errors.password;

  return (
    <div className="container">
      <div className="box">
        <h1 className="heading">{isSignUp ? "Sign Up" : "Sign In"}</h1>

        <form onSubmit={handleSubmit} noValidate>
          {isSignUp && (
            <>
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="inputfield"/>
              {errors.name && <p className="error-text">{errors.name}</p>}
            </>
          )}

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="inputfield" />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="inputfield" />
          {errors.password && <p className="error-text">{errors.password}</p>}

          {apiError && <p className="error-text">{apiError}</p>}

          <div className="remember-me">
            <label>
              <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="custom-checkbox" />
              Remember me
            </label>
          </div>

          <button type="submit" className="submitBtn" disabled={!isFormValid || loading}>
            {loading ? (isSignUp ? "Signing up..." : "Logging in...") : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <button className="toggleBtn" onClick={toggleMode}>
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
      </div>

      <WaveBackground />
    </div>
  );
}

export default AuthPage;
