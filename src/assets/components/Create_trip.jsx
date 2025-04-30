import React, { useState, useRef, useEffect } from "react";
import { budgetOptions } from "./consts/Options";
import run from "../../services/aimodel";
import { useNavigate } from "react-router-dom";
import Dialog from "./ui/Dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

const CreateTrip = () => {
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [tripDays, setTripDays] = useState("");
  const [budget, setBudget] = useState("");
  const [placeId,setPlaceId]=useState()
  const [interests, setInterests] = useState([]);
  const [numTravelers, setNumTravelers] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingTripDetails, setPendingTripDetails] = useState(null);
  const dropdownRef = useRef(null);
  const [userInform,setUserInform]=useState()
  const navigate = useNavigate();

  const interestOptions = [
    "Adventure",
    "Beach",
    "Culture",
    "Food",
    "History",
    "Nature",
    "Nightlife",
    "Shopping",
  ];

  const handleChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    if (!value) return setSuggestions([]);
    try {
      const apiKey = import.meta.env.VITE_GEOAIFY_APIKEY;
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=${apiKey}`
      );
      const data = await response.json();
      console.log(data)
      setSuggestions(data.features.map((item) => item.properties));
      console.log(suggestions)
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchData = async (tripDetails, googleResp) => {
    try {
      const result = await run(tripDetails);
      const user = JSON.parse(localStorage.getItem("user"));
      navigate("/trip-result", {
        state: { tripData: result, codeResp: googleResp },
      });
    } catch (error) {
      console.error("Error generating trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const user = localStorage.getItem("user");
    const tripDetails = {
      destination,
      tripDays,
      budget,
      interests,
      numTravelers,
      placeId,
    };

    if (!user) {
      setPendingTripDetails(tripDetails); 
      setOpenDialog(true);
      return;
    }

    setLoading(true);
    await fetchData(tripDetails, null);
  };
  const login = useGoogleLogin({
    onSuccess: async (googleResp) => {
      try {
        const userInfoResp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${googleResp.access_token}`,
          },
        });
        const userInfo = await userInfoResp.json();
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUserInform(userInfo);
        console.log(userInfo);
        setOpenDialog(false);
  
        if (pendingTripDetails) {
          setLoading(true);
          await fetchData(pendingTripDetails, userInfo); 
        }
      } catch (error) {
        console.error("Error fetching user info", error);
      }
    },
  
    onError: (err) => {
      console.error("Google login failed", err);
    },
  });
  

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-9 ${loading ? "blur-sm" : ""}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <h2 className="text-4xl font-extrabold text-blue-800 mb-2">✈️ Plan Your Perfect Trip</h2>
      <p className="text-lg text-gray-600">
        <span className="font-medium">Plan smarter, travel better</span> – Let us create a custom itinerary for you.
      </p>

      <div className="mt-10 p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100 space-y-8">
        <div ref={dropdownRef} className="relative">
          <h3 className="text-xl font-semibold mb-2">🌍 Destination</h3>
          <input
            type="text"
            value={destination}
            onChange={handleChange}
            placeholder="Search location..."
            className="w-full border p-3 text-lg rounded-xl"
          />
          {suggestions.length > 0 && (
            <ul className="absolute w-full mt-2 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setDestination(item.formatted);
                    console.log(item)
                    setPlaceId(item.place_id);
                    console.log(item.place_id)
                    setSuggestions([]);
                    console.log(placeId)
                  }}
                  className="p-3 cursor-pointer hover:bg-blue-50"
                >
                  {item.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">📅 Trip Duration</h3>
          <input
            type="number"
            value={tripDays}
            onChange={(e) => setTripDays(e.target.value)}
            placeholder="Number of days"
            className="w-full border p-3 text-lg rounded-xl"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">💸 Budget</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {budgetOptions.map(({ id, label, icon, description }) => (
              <div
                key={id}
                onClick={() => setBudget(label)}
                className={`p-4 rounded-xl cursor-pointer border ${
                  budget === label ? "bg-blue-100 border-blue-500" : "border-gray-200"
                }`}
              >
                <h4 className="text-lg font-bold flex items-center gap-2">
                  {icon} {label}
                </h4>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">🧑‍🤝‍🧑 Number of Travelers</h3>
          <input
            type="number"
            value={numTravelers}
            onChange={(e) => setNumTravelers(e.target.value)}
            placeholder="How many?"
            className="w-full border p-3 text-lg rounded-xl"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">🎭 Interests</h3>
          <div className="flex flex-wrap gap-3">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() =>
                  setInterests((prev) =>
                    prev.includes(interest)
                      ? prev.filter((i) => i !== interest)
                      : [...prev, interest]
                  )
                }
                className={`px-5 py-2 rounded-full border ${
                  interests.includes(interest)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-3 rounded-xl w-full font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
          disabled={!destination || !tripDays || !numTravelers || interests.length === 0 || loading}
        >
          🚀 Generate Trip Plan
        </button>
        <Dialog
          openDialog={openDialog}
          onClose={() => setOpenDialog(false)}
          message={
            <div>
              <p className="mb-2 text-gray-400">You have not logged in. Please login first.</p>
              <div
                onClick={() => login()}
                className="flex items-center justify-center gap-2 mt-2 border hover:border-amber-400 transition-all duration-200 rounded px-2 py-1 cursor-pointer"
              >
                <FcGoogle className="text-xl" />
                <span className="text-gray-300 font-medium">Sign in with Google</span>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CreateTrip;
