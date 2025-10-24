import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../cssfiles/verify.css";
import "../../cssfiles/OTPSingleInput.css";

const Verify = () => { // Renamed to 'Verify' to follow React component naming conventions
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a complete 6-digit OTP code.");
      return;
    }

    setIsLoading(true);
    const payload = {
      otp,
      email: localStorage.getItem("email"),
    };
    console.log(payload);

    try {
      // CHANGE 1: Verification URL
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();

      if (response.ok) {
        console.log(result);
        // localStorage.setItem("token")
        navigate("/setWarehouse");
      } else {
        alert("You have entered a wrong OTP");
      }
    } catch (err) {
      console.log("Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        alert("Email not found. Please go back to sign up.");
        return;
      }
      
      // CHANGE 2: Resend OTP URL
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      
      if (response.ok) {
        alert("A new OTP has been sent to your email.");
        setOtp("");
        setCountdown(30);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      console.log("Resend error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="otp-wrapper">
      <div className="otp-container">
        <div className="otp-header">
          <div className="otp-logo">
            <div className="logo">TG</div>
            <h1 className="company-name">
              <span className="highlight">TOTAL</span> GROUP
            </h1>
          </div>
        </div>

        <div className="otp-content">
          <h2 className="otp-title">Enter Verification Code</h2>
          <p className="otp-subtitle">
            We've sent a 6-digit verification code to your registered email
          </p>

          <form onSubmit={handleSubmit} className="otp-form">
            <div className="otp-input-container">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="otp-single-input"
              />
            </div>

            <button
              type="submit"
              className="otp-verify-button"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="otp-actions">
              <p className="otp-resend-text">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="otp-resend-link"
                  onClick={handleResendOTP}
                  disabled={isResending || countdown > 0}
                >
                  {countdown > 0
                    ? `Resend in ${countdown}s`
                    : isResending
                    ? "Sending..."
                    : "Resend OTP"}
                </button>
              </p>

              <button
                type="button"
                className="otp-back-link"
                onClick={() => navigate("/SignUp")}
              >
                ← Back to Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verify;