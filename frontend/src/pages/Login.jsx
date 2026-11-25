import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast, Toaster } from "react-hot-toast";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8400/api/user";

const Login = () => {
    const navigate=useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/login_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to sign in. Please check your details.");
      }

      toast.success(data.message || "Signed in successfully.");
      sessionStorage.setItem("token",data.token)

      setTimeout(()=>{
navigate("/")
      },2000)
      return

    } catch (requestError) {
      const message = requestError.message || "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(()=>{
    if(sessionStorage.getItem("token")){
        navigate("/")
    }
  },[])

  return (
    <>
      <Toaster />
      <main className="signup-page login-page">
        <section className="signup-showcase" aria-label="About iNotebook">
          <div className="brand-mark" aria-hidden="true">iN</div>
          <div className="showcase-content">
            <p className="eyebrow">WELCOME BACK</p>
            <h1>Your ideas are waiting for you.</h1>
            <p>Pick up right where you left off, with every note safely organized in one private workspace.</p>
            <ul className="benefit-list">
              <li><span aria-hidden="true">✓</span> Your notes, always within reach</li>
              <li><span aria-hidden="true">✓</span> A calm place to focus and create</li>
            </ul>
          </div>
          <p className="showcase-footer">iNotebook &copy; {new Date().getFullYear()}</p>
        </section>

        <section className="signup-panel">
          <div className="mobile-brand"><span>iN</span> iNotebook</div>
          <div className="signup-card login-card">
            <header className="signup-heading">
              <p className="eyebrow">SIGN IN</p>
              <h2>Welcome back</h2>
              <p>Enter your details to continue to your workspace.</p>
            </header>

            <form className="signup-form login-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" value={credentials.email} onChange={handleChange} placeholder="you@example.com" required />
              </div>

              <div className="form-field">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <button type="button" className="forgot-password-button">Forgot password?</button>
                </div>
                <div className="password-input">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={credentials.password} onChange={handleChange} placeholder="Enter your password" required />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && <p className="status-message error" role="alert">{error}</p>}

              <button type="submit" className="create-account-button" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"} <span aria-hidden="true">→</span>
              </button>
            </form>

            <p className="login-switch-text">
              New to iNotebook? <Link to="/signup">Create an account</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
