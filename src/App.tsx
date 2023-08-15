import "./App.css";
import React, {useState, useEffect} from 'react'
import Main from "./Components/Main";
import Navbar from "./Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Components/Login";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "./config/firebase";
import { loginOfUser } from "./redux/userSlice";

function App() {
  
  const [user1, loading, error] = useAuthState(auth)

  const dispatch = useDispatch()

 
  useEffect(()=>{
    dispatch(loginOfUser({
      name: user1?.displayName,
      email: user1?.email,
      photo: user1?.photoURL,
      userId: user1?.uid
    }))
  }, [user1])

  return (<>
  {user1 ? <div className="max-w-screen-2xl m-auto">
      <Navbar />
      <Main  />
    </div> : <Login /> }
    
  </>
  );
}

export default App;
