import React, { useState } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Passwordinput from '../Components/Navbar/input/Passwordinput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../Utils/helper';
import { axiosInstance } from '../Utils/axiosInstanse';

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Enter name");
      return;
    }

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
      const response = await axiosInstance.post("/create-account", {
        email: email, password: password, fullname: name
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard"); // Change to navigate to the dashboard after successful signup
      } else {
        setError("Sign-up failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">SignUp</h4>
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Passwordinput value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">Create Account</button>
            <p>Already have an account?&nbsp;</p>
            <Link to="/login" className="font-medium text-primary underline">Login</Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
