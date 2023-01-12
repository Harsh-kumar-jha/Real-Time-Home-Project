import { toast } from "react-toastify";
import React, { useState } from "react";
import Spinner from "../components/Spinner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geolocationEnable, setGeolocationEnable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnish: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnish,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;
  const handleChange = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prevData) => ({
        ...prevData,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discount can not be greater than regular price..");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Images can't be more than 6 images...");
      return;
    }
    let geolocation = {};
    let location = 0;
    if (geolocationEnable) {
      const res = await fetch(
        `https://maps.googleapis.com/map/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await res.json();
      geolocation.lat = data.result[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.result[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;
      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("please set a correct address...");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve("File available at", downloadURL);
            });
          }
        );
      });
    };
    const imgUrl = await Promise.all(
      [...images]
        .map((image) => storeImage(image))
        .catch((err) => {
          setLoading(false);
          toast.error("Images is not uploaded");
        })
    );
    const formDataCopy = {
      ...formData,
      imgUrl,
      geolocation,
      timestamp: serverTimestamp(),
    };
    delete formData.images;
    delete formData.latitude;
    delete formData.longitude;
    !formData.offer && delete formData.discountedPrice;
    const docRef = await addDoc(collection(db, "listing"), formData);
    setLoading(false);
    toast.success("listing is created...");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (loading) {
    <Spinner />;
  }
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="mt-6 text-3xl font-bold text-center">Create a Listing</h1>
      <form onSubmit={handleSubmit}>
        <p className="mt-6 text-lg font-semibold">Sell / Rent</p>
        <div className="flex">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={handleChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-500 text-white"
            } `}
          >
            sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={handleChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-500 text-white"
            } `}
          >
            rent
          </button>
        </div>
        <p className="mt-6 text-lg font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          placeholder="Name"
          onChange={handleChange}
          maxLength="32"
          minLength="10"
          required
          className="w-full px-4 py-2 mb-6 text-lg text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded"
        />
        <div className="flex mb-6 space-x-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={handleChange}
              min="1"
              max="5"
              required
              className="w-full px-4 py-2 text-lg text-center text-gray-700 transition duration-200 ease-in-out bg-white border-gray-400 rounded"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={handleChange}
              min="1"
              max="5"
              required
              className="w-full px-4 py-2 text-lg text-center text-gray-700 transition duration-200 ease-in-out bg-white border-gray-400 rounded"
            />
          </div>
        </div>
        <p className="mt-6 text-lg font-semibold">Parking Spot</p>
        <div className="flex">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={handleChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full ${
              !parking ? "bg-white text-black" : "bg-slate-500 text-white"
            } `}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={handleChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full ${
              parking ? "bg-white text-black" : "bg-slate-500 text-white"
            } `}
          >
            No
          </button>
        </div>
        <p className="mt-6 text-lg font-semibold">Furnished</p>
        <div className="flex">
          <button
            type="button"
            id="furnish"
            value={true}
            onClick={handleChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full ${
              !furnish ? "bg-white text-black" : "bg-slate-500 text-white"
            } `}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnish"
            value={false}
            onClick={handleChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full ${
              furnish ? "bg-white text-black" : "bg-slate-500 text-white"
            } `}
          >
            No
          </button>
        </div>
        <p className="mt-6 text-lg font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          placeholder="Address"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-6 text-lg text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded"
        />
        {!geolocationEnable && (
          <div className="flex justify-start mb-6 space-x-6">
            <div className="">
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={handleChange}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-lg text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded"
              />
            </div>
            <div className="">
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={handleChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-lg text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded"
              />
            </div>
          </div>
        )}
        <p className="text-lg font-semibold ">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          placeholder="Description"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-6 text-lg text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded"
        />
        <p className="text-lg font-semibold ">Offer</p>
        <div className="flex mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={handleChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full ${
              !offer ? "bg-white text-black" : "bg-slate-500 text-white"
            } `}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={handleChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full ${
              offer ? "bg-white text-black" : "bg-slate-500 text-white"
            } `}
          >
            No
          </button>
        </div>
        <div className="flex items-center mb-6">
          <div className="">
            <p className="text-xl font-semibold">Regular Price</p>
            <div className="flex items-center justify-center w-full space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={handleChange}
                min="5000"
                max="5000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 transition duration-200 ease-in-out bg-white border border-gray-400 rounded focus:border-slate-600"
              />
              {type === "rent" && (
                <div className="">
                  <p className="w-full text-md whitespace-nowrap">₹ / months</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="flex items-center mb-6">
            <div className="">
              <p className="text-xl font-semibold">Discounted Price</p>
              <div className="flex items-center justify-center w-full space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={handleChange}
                  min="0"
                  max="100000"
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 transition duration-200 ease-in-out bg-white border border-gray-400 rounded focus:border-slate-600"
                />
                {type === "rent" && (
                  <div className="">
                    <p className="w-full text-md whitespace-nowrap">
                      ₹ / months
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="text-xl font-semibold">Images</p>
          <p className="text-gray-600 ">
            The first Image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={handleChange}
            accept=".jpg,.jpeg,.png"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-200 focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 mb-6 text-sm font-medium text-white uppercase transition duration-200 ease-in-out bg-blue-500 rounded shadow-sm px-7 hover:bg-blue-700 hover:shadow-lg focus:shadow-lg active:bg-blue-800 active:shadow-lg"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
