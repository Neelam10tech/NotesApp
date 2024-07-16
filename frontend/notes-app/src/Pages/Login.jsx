import React, { useState } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import Passwordinput from '../Components/Navbar/input/Passwordinput';
import { validateEmail } from '../Utils/helper';
import { axiosInstance } from '../Utils/axiosInstanse';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!password) {
      setError("Enter password");
      return;
    }

    setError("");
    try {
      const response = await axiosInstance.post("/login", {
        email: email, password: password
      });
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error); // Log the error
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="flex items-center justify-center mt-2">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <h4 className="text-2xl mb-7">Login</h4>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <Passwordinput value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">Login</button>
            <p>Not registered yet?&nbsp;</p>
            <Link to="/signup" className="font-medium text-primary underline">Create an Account</Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
