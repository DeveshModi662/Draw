import React, { useState } from "react";
import "./styles/AuthPage.css";

const BASE_URL = `${process.env.REACT_APP_GATEWAY_BASE}` ;

export default function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" , otp: ""});
  const [otpSent, setOtpSent] = useState(false) ; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can call your backend API here
    console.log(isLogin ? "Logging in..." : "Signing up...", formData);
    if(isLogin) {
      fetch(BASE_URL+`/${process.env.REACT_APP_DOROBE_SERVICE}/login`, {
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
    }
    else {
      fetch(BASE_URL+`/${process.env.REACT_APP_DOROBE_SERVICE}/signUp`, {
        method : 'POST'
        , headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({ "username": formData.email, "password": formData.password, "otp": formData.otp }) 
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

    }
    // onAuth({ email: formData.email }); // Pass fake user up
  };

  const sendOtp = () => {
    // document.getElementsByClassName("send-otp-button")[0].ariaDisabled = true ;
    // document.getElementsByClassName("send-otp-button")[0].innerText = "Resend after 2 min" ;
    // setTimeout(() => {
    // document.getElementsByClassName("send-otp-button")[0].ariaDisabled = false ;
    // document.getElementsByClassName("send-otp-button")[0].innerText = "Send OTP" ;
    // }, 10*1000);
    // if(!document.getElementsByClassName("send-otp-button")[0].ariaDisabled) {
      fetch(BASE_URL+`/${process.env.REACT_APP_DOROBE_SERVICE}/sendOtp`, {
          method : 'POST'
          , headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify({ "username": formData.email, "password": formData.password }) 
        })
        .then(setOtpSent(true)) ;
    // }
  } ;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit}
        className="auth-form">
          <label className="label-css">Gmail ID</label>
          <input
            // type="email"
            name="email"
            placeholder="Gmail ID"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            required
            autoComplete="current-password" 
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
            required
            autoComplete="current-password" 
          />
          {!isLogin ?
            <div className="otp-wrapper">
              <input value={formData.otp} name="otp" placeholder="OTP" onChange={handleChange}
              className="auth-input"/>
              <button type="button"  
                className="send-otp-button small-button" onClick={() => sendOtp()}>Send Otp</button> 
            </div>
            : null            
          }
          <button
            type="submit"
            className="auth-button"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="small-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}