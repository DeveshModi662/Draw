import './App.css';
import React, {useLayoutEffect, useState, useRef, useCallback, useEffect} from "react" ;
import AuthPage from './AuthPage';
import Draw from './Draw';
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, loginUser } from './slices/SsoSlice' ;
import { Routes, Route, Navigate } from "react-router-dom";
import MyCanvas from './MyCanvas' ;

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
      fetch(`http://localhost:8000/isLoggedIn`, 
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
            console.log('dk-isLoggedIn-notOk-',response) ;
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
    console.log('dk-App-handleAuth-', loggedinUser) ;
    try {
      localStorage.setItem("user", loggedinUser.user);
      localStorage.setItem("jsonWebToken", loggedinUser.jsonWebToken);
      console.log('Stored in localStorage:', localStorage.getItem("user"), localStorage.getItem("jsonWebToken"));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  //   // setUser(loggedinUser.user) ;
    ssoDispatch(loginUser({user:loggedinUser.user, jsonWebToken:loggedinUser.jsonWebToken})) ;
  } ;

  const handleLogout = () => {
    console.log('dk-App-handleLogout') ;
    localStorage.removeItem("user") ;
    localStorage.removeItem("jsonWebToken") ;    
    // setUser() ;
    ssoDispatch(logoutUser()) ;
  } ;

  return (
    <div className="App"> 
      {!currentIsLoggedIn && <AuthPage onAuth={handleAuth} />}  
      {/* {currentIsLoggedIn && !currentUser && <div>Loading...</div>} */}
      {currentIsLoggedIn && 
        <div>
          <button onClick={()=>handleLogout()}>LOGOUT</button>           
            <Routes>
              <Route path = "/" element = {currentIsLoggedIn ? (<Navigate to = {`/${localStorage.getItem("user")}/canvas`} replace/>) : (<AuthPage onAuth={handleAuth} />) } />
              <Route path = "/draw" element = {currentIsLoggedIn ? (<Draw/>) : (<Navigate to="/" replace />) } />
              <Route path = "/:currentUser/canvas" element = {currentIsLoggedIn ? (<MyCanvas />) : (<Navigate to="/" replace />) } />
              <Route path = "*" element = {<Navigate to="/" replace />} />
            </Routes>                       
        </div>
      }  
      {/* {currentIsLoggedIn && <button onClick={()=>handleLogout()}>LOGOUT</button>}      
      <Routes>
        <Route path = "/" element = {currentIsLoggedIn ? (<Navigate to = "/canvas" replace/>) : (<AuthPage onAuth={handleAuth} />) } />
        <Route path = "/draw" element = {currentIsLoggedIn ? (<Draw/>) : (<Navigate to="/" replace />) } />
        <Route path = "/canvas" element = {currentIsLoggedIn ? (<MyCanvas />) : (<Navigate to="/" replace />) } />
        <Route path = "*" element = {<Navigate to="/" replace />} />
      </Routes> */}
      {/* <button onClick={()=>handleLogout()}>LOGOUT</button>
      {
        // user ? (<Draw />)
        currentIsLoggedIn ? (<Draw />)
        : (<AuthPage onAuth={handleAuth} />) 
      } */}
    </div>
  );
}

export default App;
