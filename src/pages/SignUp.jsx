import React, { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const handleInput = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };
  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(auth.currentUser, { displayName: name });
      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Sign up Successful...");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with Registration... ");
    }
  };
  return (
    <section>
      <h1 className="mt-6 text-4xl font-bold text-center">Sign Up</h1>
      <div className="flex flex-wrap items-center justify-center max-w-6xl px-6 py-12 mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            className="w-full rounded-2xl"
            src="https://scribie.com/assets/front/illustrations/Welcome-to-scribie-512x391.svg"
            alt="sign-in logo"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={handleForm}>
            <input
              className="w-full px-4 py-2 mb-6 text-2xl text-gray-700 transition ease-in bg-white border-gray-300 rounded"
              type="text"
              placeholder="Enter Full Name"
              id="name"
              value={name}
              onChange={handleInput}
            />
            <input
              className="w-full px-4 py-2 mb-6 text-2xl text-gray-700 transition ease-in bg-white border-gray-300 rounded"
              type="email"
              placeholder="Enter Email"
              id="email"
              value={email}
              onChange={handleInput}
            />
            <div className="relative mb-6">
              <input
                className="w-full px-4 py-2 text-2xl text-gray-700 transition ease-in bg-white border-gray-300 rounded"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                id="password"
                value={password}
                onChange={handleInput}
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="absolute text-xl cursor-pointer right-3 top-4"
                  onClick={() => setShowPassword((prevData) => !prevData)}
                />
              ) : (
                <AiFillEye
                  className="absolute text-xl cursor-pointer right-3 top-4"
                  onClick={() => setShowPassword((prevData) => !prevData)}
                />
              )}
            </div>
            <div className="flex justify-between text-sm whitespace-nowrap sm:text-lg">
              <p className="mb-6">
                Already have account?
                <Link
                  to="/sign-in"
                  className="ml-1 text-red-500 transition duration-300 ease-in-out hover:text-red-700"
                >
                  Sign In
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 transition duration-300 ease-in-out hover:text-blue-800"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
            <button
              className="w-full py-3 text-sm font-medium text-white uppercase transition duration-200 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800"
              type="submit"
            >
              Sign Up
            </button>
            <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-400 after:border-t after:flex-1 after:border-gray-400">
              <p className="mx-10 font-semibold text-center">OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
