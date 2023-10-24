import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Submit Handerler
  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const user = await axios.post("/register", {
        name,
        email,
        password,
      });
      alert("Registration successful", user.data.email);
    } catch (error) {
      alert("Registration failed", error.message);
    }
  };

  return (
    <div className="mt-4 flex grow items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="John Doe"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="password"
          />
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a member? <Link to="/login">Login here</Link>{" "}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
