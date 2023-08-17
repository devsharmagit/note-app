import { signInWithPopup, signInAnonymously } from "firebase/auth";
import { auth, db, provider } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Spinner from "react-spinkit";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import bgImg from "../assets/images/notes.png";
import {useState} from 'react'


function Login() {
  const [user1, loading, error] = useAuthState(auth);
  const userDetailsRef = collection(db, "userDetails");

  const handleClick = async () => {
    const data = await signInWithPopup(auth, provider);
    const q = query(userDetailsRef, where("email", "==", data.user.email));
    const data1 = await getDocs(q);
    if (data1.empty) {
      addDoc(userDetailsRef, {
        name: data.user.displayName,
        email: data.user.email,
        photo: data.user.photoURL,
        userId: data.user.uid,
        personalCollections: [],
        sharedCollections: [],
        isOnline: true,
      });
    }
  };

  const [guestLoading, setGLoading] = useState(false)

  const handleGuestClick = async () => {
    setGLoading(true)
    const data = await signInAnonymously(auth);
    if(data.user){
      setGLoading(false)
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-slate-500 m-0 flex flex-col items-center justify-center">
      <img src={bgImg} className="max-h-52" />
      <p className="text-2xl font-medium text-white">Note Project By Dev</p>
      <div
        onClick={handleClick}
        className="text-center mt-8 p-3 max-w-sm flex gap-1 bg-white rounded-md items-center justify-center cursor-pointer hover:bg-slate-200"
      >
        {loading ? (
          <Spinner fadeIn="none" name="three-bounce" />
        ) : (
          <>
            <img
              className="h-10"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png"
              alt=""
            />
            <span className="ml-2 text-xl text-gray-500 font-medium">
              Continue with Google
            </span>
          </>
        )}
      </div>
      {guestLoading ? (
        <Spinner fadeIn="none" name="three-bounce" className="mt-5" />
      ) : (
        <div className="mt-5 " onClick={handleGuestClick}>
          <span className="text-slate-300  text-lg border border-transparent p-2 rounded-md border-1 cursor-pointer transition-all hover:text-white hover:border-white">
            Try with Guest Login
          </span>
        </div>
      )}
    </div>
  );
}

export default Login;
