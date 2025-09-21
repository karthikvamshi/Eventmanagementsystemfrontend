import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import loginBackground from './images/loginbackground.jpeg';
import Swal from 'sweetalert2';

export default function LoginComponent() {
  const navigate = useNavigate();

  const containerStyle = {
    backgroundImage: `url(${loginBackground})`,
    backgroundSize: 'cover',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const cardStyle = {
    width: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '10px',
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email_id: email,   // must match backend DTO
      password: password,
    };

    try {
      const response = await axios.post(`http://localhost:8080/login/`, loginData);

      if (response.data) {
        setIsLoggedIn(true);

        console.log("response.data: ", response.data);

        // Save session details
        sessionStorage.setItem("email_id", email);
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("role", response.data.role);

        // ✅ Navigate based on role
        if (response.data.role === "ADMIN") {
          navigate("/adminprofile");
        } else {
          navigate("/profile");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Wrong credentials.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Something went wrong.",
        });
      }
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(sessionStorage);
  }, [isLoggedIn]);

  const handleLogout = () => {
    sessionStorage.removeItem("email_id");
    sessionStorage.setItem("isLoggedIn", "false");
    sessionStorage.removeItem("role");
    setIsLoggedIn(false);
  };

  return (
    <div style={containerStyle}>
      <div className="card p-4" style={cardStyle}>
        <h2 className="card-title text-center">Login</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmail}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePassword}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={handleLogin}>
            Login
          </button>
        </form>

        {isLoggedIn && (
          <div className="text-center mt-3">
            <p>
              Welcome! You are logged in.
              <button className="btn btn-primary ms-2" onClick={handleLogout}>
                Logout
              </button>
            </p>
            <p>
              <Link to="/profile">Profile</Link>
            </p>
          </div>
        )}

        {!isLoggedIn && (
          <div className="text-center mt-3">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
            <p>
              <Link to="/forgetpassword">Forgot Password</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
