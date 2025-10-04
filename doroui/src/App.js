import './App.css';
import AuthPage from './AuthPage';
import Draw from './Draw';
import { useEffect, useState } from 'react';

function App() {

  const [user, setUser] = useState() ;

  useEffect(() => {
    console.log('App - useEffect') ;
    console.log(localStorage.getItem("user")) ;
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
            console.log('App - useEffect - Not logged in') ;
            console.log(response) ;
            handleLogout() ;
          }
          else {
            setUser(localStorage.getItem("user")) ;
          }
          
        }
      ) ;      
    }
  }, []) ;

  const handleAuth = (loggedinUser) => {
    setUser(loggedinUser.user) ;
    localStorage.setItem("user", loggedinUser.user)
    localStorage.setItem("jsonWebToken", loggedinUser.jsonWebToken)
  } ;

  const handleLogout = () => {
    localStorage.removeItem("user") ;
    localStorage.removeItem("jsonWebToken") ;
    setUser() ;
  } ;

  return (
    <div className="App">
      <button onClick={()=>handleLogout()}>LOGOUT</button>
      {
        user ? (<Draw />)
        : (<AuthPage onAuth={handleAuth} />) 
      }
    </div>
  );
}

export default App;
