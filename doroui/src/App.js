import './App.css';
import React, {useLayoutEffect, useState, useRef, useCallback, useEffect} from "react" ;
import AuthPage from './AuthPage';
import Draw from './Draw';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, loginUser } from './slices/SsoSlice' ;

function App() {

  // const [user, setUser] = useState() ;
  const ssoDispatch = useDispatch() ;
  const currentUser = useSelector((state) => state.sso.user) ;
  const currentToken = useSelector((state) => state.sso.jsonWebToken) ;
  const currentIsLoggedIn = useSelector((state) => state.sso.isLoggedIn) ;

  useEffect(() => {
    console.log('App - useEffect') ;
    // console.log(localStorage.getItem("user")) ;
    if(localStorage.getItem("user") && localStorage.getItem("jsonWebToken")) { 
      console.log('App useEffect : ', localStorage.getItem("user"), localStorage.getItem("jsonWebToken")) ;
      fetch(`http://localhost:8080/isLoggedIn/`, 
        {
          method : 'GET',
          headers : {
            'Authorization': `Bearer ${localStorage.getItem("jsonWebToken")}`
          }
        }
      )
      .then(response => {
          if(!response.ok) {
            console.log('App - useEffect - Login expired.') ;
            console.log(response) ;
            handleLogout() ;
          }
          else {
            // setUser(localStorage.getItem("user")) ;
            ssoDispatch(loginUser({user:localStorage.getItem("user"), jsonWebToken:localStorage.getItem("jsonWebToken")})) ;
          }
          
        }
      ) ;      
    }
  }, []) ;

  const handleAuth = (loggedinUser) => {
    localStorage.setItem("user", loggedinUser.user) ;
    localStorage.setItem("jsonWebToken", loggedinUser.jsonWebToken) ;
    // setUser(loggedinUser.user) ;
    ssoDispatch(loginUser({user:loggedinUser.user, jsonWebToken:loggedinUser.jsonWebToken})) ;
  } ;

  const handleLogout = () => {
    localStorage.removeItem("user") ;
    localStorage.removeItem("jsonWebToken") ;    
    // setUser() ;
    ssoDispatch(logoutUser()) ;
  } ;

  return (
    <div className="App">
      <button onClick={()=>handleLogout()}>LOGOUT</button>
      {
        // user ? (<Draw />)
        currentIsLoggedIn ? (<Draw />)
        : (<AuthPage onAuth={handleAuth} />) 
      }
    </div>
  );
}

export default App;
