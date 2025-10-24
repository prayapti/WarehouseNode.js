import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Heart, CheckCircle, TrendingUp, Smartphone } from 'lucide-react';
import styles from '../../cssfiles/Login.module.css';

const Login = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const payload ={
    password:password,
    email:email,
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try{
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if(response.ok){
        localStorage.setItem("token",result.token)
        if(result.userType === 'warehouse'){
          navigate('/dashboard');  
        } else if(result.userType === 'client'){
          navigate('/WarehouseDetailsForm'); 
        }
      } else{
        console.log("message")
      }
    }catch(err){
      console.log(err.message)
    }
    setLoading(true);
    console.log('Login attempt:', { email, password, remember });
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.backgroundShapes}>
        <div className={`${styles.shape} ${styles.shape1}`}></div>
        <div className={`${styles.shape} ${styles.shape2}`}></div>
        <div className={`${styles.shape} ${styles.shape3}`}></div>
      </div>

      <main className={styles.loginContainer}>
        <div className={styles.formPanel}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>TG</div>
            <h1 className={styles.companyName}>
              <span className={styles.highlight}>TOTAL</span> GROUP
            </h1>
          </div>

          <h2 className={styles.welcomeText}>Welcome Back</h2>
          <p className={styles.subtitle}>Login to access your warehouse management dashboard</p>

          <form id="loginForm" onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Email</label>
              <div className={styles.inputContainer}>
                <input 
                  type="text" 
                  id="email" 
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="Enter your Email"
                />
                <span className={styles.error} id="emailerror"></span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputContainer}>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <span className={styles.error} id="passwordError"></span>
              </div>
            </div>

            <div className={styles.optionsRow}>
              <div className={styles.rememberMe}>
                <input 
                  type="checkbox" 
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className={styles.loginButton}>
              <span>Login</span>
              <ArrowRight className={styles.arrowIcon} size={24} />
            </button>

            <p className={styles.signupText}>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>

        <div className={styles.infoPanel}>
          <div className={styles.overlay}></div>
          <div className={styles.content}>
            <div className={styles.infoCard}>
              <h2>Warehouse Logistics Management</h2>
              <p>Optimize inventory, streamline operations, and boost productivity with our powerful platform.</p>

              <div className={styles.benefitsContainer}>
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>
                    <Heart size={18} />
                  </div>
                  <span>Real-time inventory tracking</span>
                </div>

                <div className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>
                    <CheckCircle size={18} />
                  </div>
                  <span>Automated order processing</span>
                </div>

                <div className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>
                    <TrendingUp size={18} />
                  </div>
                  <span>Analytics and reporting</span>
                </div>

                <div className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>
                    <Smartphone size={18} />
                  </div>
                  <span>Mobile accessibility</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
