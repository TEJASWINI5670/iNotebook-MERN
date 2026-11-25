import { useEffect, useRef, useState } from "react";
import "./Signin.css";
import { toast,Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";


const initialForm = {
  name: "",
  email: "",
  mobile_no: "",
  password: "",
  confirm_password: "",
  otp: "",
};
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8400/api/user";
const RESEND_DELAY_SECONDS = 30;

const Signin = () => {
  let navigate=useNavigate()
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDelay, setResendDelay] = useState(0);
  const [emailStepComplete, setEmailStepComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailInputRef = useRef(null);

  // OTP resend timer
  useEffect(() => {
    if (resendDelay === 0) return;

    const timer = window.setTimeout(() => {
      setResendDelay((seconds) => seconds - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendDelay]);

  // Handle input changes
  const handleChange = (event) => {
    const { name } = event.target;
    const value = name === "otp"
      ? event.target.value.replace(/\D/g, "")
      : event.target.value;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (name === "email" && otpSent) {
      setOtpSent(false);
      setEmailStepComplete(false);
      setResendDelay(0);
      setMessage("Your email changed. Send a new verification code.");
    }
  };

  // Handle API response
  const getResponseData = async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const validationMessages = Array.isArray(data.errors)
        ? data.errors.map((validationError) => validationError.msg).filter(Boolean)
        : [];

      throw new Error(
        validationMessages[0] || data.message || "Something went wrong. Please try again."
      );
    }

    return data;
  };

  // Send OTP
  const handleSendOtp = async () => {
    if ((emailInputRef.current && !emailInputRef.current.reportValidity()) || resendDelay > 0) {
      return;
    }

    setError("");
    setMessage("");
    setIsSendingOtp(true);

    try {
      const response = await fetch(`${API_URL}/sendOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
        }),
      });

     const data= await getResponseData(response);
     if (data.success) {
  toast.success(data.message || "OTP sent successfully");
} else {
  toast.error(data.message || "Something went wrong");
}

      setOtpSent(true);
      setEmailStepComplete(true);
      setResendDelay(RESEND_DELAY_SECONDS);

      setMessage(
        "Verification code sent. Check your email and enter the 6-digit code."
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Create account
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (!otpSent) {
      setError(
        "Send a verification code to your email before creating your account."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/create-new-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await getResponseData(response);
 if (data.success) {
  const successMessage = data.message || "Account created successfully.";

  toast.success(successMessage);
  setMessage(successMessage);

  setTimeout(() => {
    navigate("/login");
  }, 3000);

  return;
}

toast.error(data.message || "Account creation failed.");
     

      setForm(initialForm);
      setOtpSent(false);
      setEmailStepComplete(false);
      setResendDelay(0);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Toaster/>
    <main className="signup-page">
      <section className="signup-showcase" aria-label="About iNotebook">
        <div className="brand-mark" aria-hidden="true">iN</div>
        <div className="showcase-content">
          <p className="eyebrow">YOUR PRIVATE WORKSPACE</p>
          <h1>Ideas deserve a thoughtful home.</h1>
          <p>Capture notes, keep them organized, and return to what matters — whenever you need it.</p>
          <ul className="benefit-list">
            <li><span>✓</span> Keep every thought in one secure place</li>
            <li><span>✓</span> A calm, focused space for your ideas</li>
          </ul>
        </div>
        <p className="showcase-footer">iNotebook &copy; {new Date().getFullYear()}</p>
      </section>

      <section className="signup-panel">
        <div className="mobile-brand"><span>iN</span> iNotebook</div>
        <div className="signup-card">
          <header className="signup-heading">
            <p className="eyebrow">GET STARTED</p>
            <h2>Create your account</h2>
            <p>Start organizing your thoughts in minutes.</p>
          </header>

          {!emailStepComplete ? (
            <form className="email-capture-form" onSubmit={(event) => { event.preventDefault(); handleSendOtp(); }}>
              <div className="form-field">
                <label htmlFor="email">Email address</label>
                <div className="email-action">
                  <input ref={emailInputRef} id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                  <button type="submit" disabled={isSendingOtp || resendDelay > 0} className="send-code-button">
                    {isSendingOtp ? "Sending..." : "Continue"}
                  </button>
                </div>
                <p className="field-hint">We’ll send a 6-digit verification code to this address.</p>
              </div>
            </form>
          ) : (
            <>
              <div className="email-confirmation">
                <div><span className="confirmation-icon" aria-hidden="true">✓</span><div><strong>Code sent to {form.email}</strong><p>Enter it below to verify your account.</p></div></div>
                <button type="button" onClick={() => { setEmailStepComplete(false); setOtpSent(false); setResendDelay(0); setForm((currentForm) => ({ ...currentForm, otp: "" })); }}>Change</button>
              </div>

              <div className="form-divider"><span>Complete your profile</span></div>

              <form onSubmit={handleSubmit} className="signup-form">
            <div className="field-grid">
              <div className="form-field">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange} minLength="2" maxLength="30" placeholder="Your name" required />
              </div>
              <div className="form-field">
                <label htmlFor="mobile_no">Mobile number</label>
                <input id="mobile_no" name="mobile_no" type="tel" inputMode="tel" autoComplete="tel" value={form.mobile_no} onChange={handleChange} placeholder="9876543210" title="Enter a valid Indian mobile number" required />
              </div>
            </div>

            <div className="field-grid">
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={handleChange} minLength="8" maxLength="26" placeholder="8–26 characters" required />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="confirm_password">Confirm password</label>
                <div className="password-input">
                  <input id="confirm_password" name="confirm_password" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={form.confirm_password} onChange={handleChange} minLength="8" maxLength="26" placeholder="Repeat your password" required />
                  <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>{showConfirmPassword ? "Hide" : "Show"}</button>
                </div>
              </div>
            </div>

            <div className={`form-field verification-field${otpSent ? " is-ready" : ""}`}>
              <div className="label-row">
                <label htmlFor="otp">Verification code</label>
                <button
                  type="button"
                  className="resend-code-button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || resendDelay > 0}
                >
                  {isSendingOtp ? "Sending..." : resendDelay > 0 ? `Resend in ${resendDelay}s` : "Resend code"}
                </button>
              </div>
              <input id="otp" name="otp" type="text" value={form.otp} onChange={handleChange} inputMode="numeric" autoComplete="one-time-code" minLength="6" maxLength="6" placeholder="Enter 6-digit code" required />
              <p className="field-hint">{otpSent ? "Use the most recent code sent to your email." : "Send a code after entering your email address."}</p>
            </div>

            {error && <p className="status-message error" role="alert">{error}</p>}
            {message && <p className="status-message success" role="status">{message}</p>}

            <button type="submit" disabled={isSubmitting || isSendingOtp} className="create-account-button">
              {isSubmitting ? "Creating your account..." : "Create account"}<span aria-hidden="true">→</span>
            </button>
              </form>
            </>
          )}

          <p className="terms-text">By creating an account, you agree to use iNotebook responsibly.</p>
        </div>
      </section>
    </main></>
  );
};

export default Signin;
