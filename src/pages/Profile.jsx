import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const handleSignOut = () => {
    auth.signOut();
    navigate("/sign-in");
  };
  return (
    <>
      <section className="flex flex-col items-center justify-center max-w-6xl mx-auto">
        <h1 className="mt-6 text-3xl font-bold text-center ">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            <input
              type="text"
              id="name"
              value={name}
              disabled
              className="w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border border-gray-300 rounded-full"
            />
            <input
              type="text"
              id="email"
              value={email}
              disabled
              className="w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border border-gray-300 rounded-full"
            />
            <div className="flex justify-between mb-6 text-sm whitespace-nowrap sm:text-lg">
              <p className="flex items-center">
                wanna edit your name or email?
                <Link className="ml-1 text-red-400 transition duration-200 ease-in-out cursor-pointer hover:text-red-600">
                  edit
                </Link>
              </p>
              <p
                onClick={handleSignOut}
                className="text-blue-400 transition duration-200 ease-in-out cursor-pointer hover:text-blue-700"
              >
                Sign Out
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Profile;
