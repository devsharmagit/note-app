import React from "react";
import bgImg from "../assets/images/bgImg.jpg";
import {  signInWithPopup, signInAnonymously, updateCurrentUser, updateProfile } from "firebase/auth";
import { auth, db, provider } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Spinner from "react-spinkit";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";




function Login() {

  const [user1, loading, error] = useAuthState(auth)
  const userDetailsRef = collection(db, "userDetails")

  const handleClick = async()=>{
    const data = await signInWithPopup(auth, provider)
    const q = query(userDetailsRef, where("email", "==", data.user.email))
    const data1 = await getDocs(q)
    if(data1.empty){
      addDoc(userDetailsRef, {
        name: data.user.displayName,
        email: data.user.email,
        photo: data.user.photoURL,
        userId: data.user.uid,
        personalCollections: [],
        sharedCollections: [],
        isOnline: true,
      })
    }
  }

  const handleGuestClick = async() =>{
 const data = await signInAnonymously(auth)
 console.log(data.user)
  }

  return (
    <div className="w-[100vw] h-[100vh] bg-slate-700 m-0 flex flex-col items-center justify-center">
      <div onClick={handleClick} className="text-center p-5 max-w-sm flex gap-1 bg-white rounded-md items-center justify-center cursor-pointer hover:bg-slate-200">

{loading ? <Spinner fadeIn="none" name="three-bounce" /> : <>
        <img className="h-10" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png" alt="" />
      <span className="ml-5 text-xl text-gray-500 font-bold">Continue with Google</span> </> }

      </div>
      <div className="mt-3 hover:underline" onClick={handleGuestClick}>
        {!loading &&  <span className="text-slate-300 text-lg cursor-pointer">Try with Guest Login</span>} 
      </div>
    </div>
  );
}

export default Login;
