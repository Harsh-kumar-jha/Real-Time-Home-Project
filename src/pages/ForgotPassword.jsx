import React, { useState } from "react";

import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleInput = (e) => {
    setEmail(e.target.value);
  };
  return (
    <section>
      <h1 className="mt-6 text-4xl font-bold text-center">Forgot Password</h1>
      <div className="flex flex-wrap items-center justify-center max-w-6xl px-6 py-12 mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            className="w-full rounded-2xl"
            src="https://stories.freepiklabs.com/storage/12308/forgot-password-amico-1951.png"
            alt="sign-in logo"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form>
            <input
              className="w-full px-4 py-2 mb-6 text-2xl text-gray-700 transition ease-in bg-white border-gray-300 rounded"
              type="email"
              placeholder="Enter Email"
              id="email"
              value={email}
              onChange={handleInput}
            />
            <div className="flex justify-between text-sm whitespace-nowrap sm:text-lg">
              <p className="mb-6">
                Don't have account?
                <Link
                  to="/sign-up"
                  className="ml-1 text-red-500 transition duration-300 ease-in-out hover:text-red-700"
                >
                  Register
                </Link>
              </p>
              <p>
                <Link
                  to="/sign-in"
                  className="text-blue-600 transition duration-300 ease-in-out hover:text-blue-800"
                >
                  Sign In instead
                </Link>
              </p>
            </div>
            <button
              className="w-full py-3 text-sm font-medium text-white uppercase transition duration-200 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800"
              type="submit"
            >
              Send Reset Email
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

export default ForgotPassword;
