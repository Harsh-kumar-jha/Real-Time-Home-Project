import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { FaHome } from "react-icons/fa";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const handleSignOut = () => {
    auth.signOut();
    navigate("/sign-in");
  };
  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const handleSubmit = async () => {
    try {
      //updating name inside firebase
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // updating name inside fireStore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { name });
        toast.success("Successfully updated the name...");
      }
    } catch (error) {
      toast.error("Could not update the Profile detail...");
    }
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
              disabled={!changeDetail}
              onChange={handleChange}
              className={`w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border border-gray-300 rounded-full ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
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
                wanna edit your name?
                <span
                  onClick={() => {
                    changeDetail && handleSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="ml-1 text-red-400 transition duration-200 ease-in-out cursor-pointer hover:text-red-600"
                >
                  {changeDetail ? "Apply Changes" : "Edit"}
                </span>
              </p>
              <p
                onClick={handleSignOut}
                className="text-blue-400 transition duration-200 ease-in-out cursor-pointer hover:text-blue-700"
              >
                Sign Out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full py-3 text-sm font-medium text-white uppercase transition duration-200 ease-in-out bg-gray-500 rounded-full shadow-md px-7 hover:bg-gray-700 hover:shadow-lg active:bg-gray-800"
          >
            <Link
              to="/create-listing"
              className="flex items-center justify-center"
            >
              <FaHome className="p-1 mr-2 text-3xl text-black bg-red-200 border-2 rounded-full" />
              Sell or Rent House
            </Link>
          </button>
        </div>
      </section>
    </>
  );
};

export default Profile;
