import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useNavigate } from "react-router";

const OAuth = () => {
  const navigate = useNavigate();
  const onGoogleButtonClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // checking is the user is already in the database or not
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp(),
        });
        navigate("/");
      }
    } catch (error) {
      toast.error("Could not Authorized with Google...");
    }
  };
  return (
    <button
      type="button"
      onClick={onGoogleButtonClick}
      className="flex items-center justify-center w-full py-3 text-sm font-medium text-white uppercase transition duration-200 ease-in-out bg-red-700 rounded shadow-sm px-7 hover:bg-red-800 active:bg-red-900 hover:shadow-lg active:shadow-lg"
    >
      <FcGoogle className="mr-2 text-2xl bg-white rounded-full" />
      Continue with Google
    </button>
  );
};

export default OAuth;
