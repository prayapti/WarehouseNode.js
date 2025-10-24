import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import "../../cssfiles/SignUp.css";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  const nameRegex = /^[a-zA-Z\s]+$/;

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  let newErrors = {};

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (!nameRegex.test(formData.fullName.trim())) {
      newErrors.fullName = "Only letters and spaces allowed";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Min 8 characters & 1 number required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) console.log(newErrors);
    const payload = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      password2: formData.confirmPassword,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/SignUpview`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      console.log("Form submitted");
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        localStorage.setItem("email", formData.email);
        navigate("/verify");
      } else {
        const errorData = await response.json();
        console.error("Signup failed", errorData);
        alert("Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during signup:", err.message);
      // alert("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="signup-container">
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">TG</div>
              <div className="company-name">
                <span className="total">TOTAL</span> GROUP
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="signup-layout">
            <div className="form-card combined-card">
              <div className="form-section">
                <div className="form-header">
                  <h1 className="main-title">
                    <span className="title-highlight">Create</span> Account
                  </h1>
                  <p className="subtitle">
                    Join hundreds of businesses optimizing their warehouse
                    operations
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="signup-form">
                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <div className="password-wrapper">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <div className="password-wrapper">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="password-toggle"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} /> // <-- Fixed: Changed 1Details to 16
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      required
                      className="form-checkbox"
                    />
                    <label htmlFor="terms" className="checkbox-label">
                      I agree to the{" "}
                      <Link to="/TermsOfService" className="link">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/PrivacyPolicy" className="link">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <button type="submit" className="submit-button">
                    <UserPlus size={16} />
                    Create Account
                  </button>
                </form>

                <div className="login-link">
                  <p>
                    Already have an account?{" "}
                    <Link to="/login" className="login-link-text">
                      Log In
                    </Link>
                  </p>
                </div>
              </div>

              <div className="signup-image">
                <div className="image-container">
                  <img
                    src="https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Warehouse operations"
                    className="warehouse-image"
                  />
                  <div className="image-overlay"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;