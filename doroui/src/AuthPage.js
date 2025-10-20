import React, { useState } from "react";

const AUTH_URL = 'http://localhost:8000/login' ;

export default function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can call your backend API here
    console.log(isLogin ? "Logging in..." : "Signing up...", formData);
    fetch(AUTH_URL, {
      method : 'POST'
      , headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({ "username": formData.email, "password": formData.password }) 
    })
      .then(response => response.json())
      .then(response => {
        console.log(response) ;
        // const token = response.jsonWebToken ;
        // localStorage.setItem('user', formData.email) ;
        // localStorage.setItem('jsonWebToken', response.jsonWebToken) ;
        // setIsLogin(true) ;
        onAuth({ 'user': formData.email,  'jsonWebToken': response.jsonWebToken});
      }
    ) ;
    // onAuth({ email: formData.email }); // Pass fake user up
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-96 bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            // type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            autoComplete="current-password" 
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            autoComplete="current-password" 
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"            
          >
            {isLogin ? "EnterLogin" : "EnterSignup"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
