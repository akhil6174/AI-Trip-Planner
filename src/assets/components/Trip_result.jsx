import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./config/config";
import Button from "./ui/Button";

const TripResult = () => {
  const location = useLocation();
  const tripData = location.state?.tripData || null;
  const [isSaved, setIsSaved] = useState(false);

  const saveTrip = async (tripData) => {
    if (isSaved) return; 
    setIsSaved(true); 
  
    const docId = Date.now().toString(); 
    const user = JSON.parse(localStorage.getItem("user")); 
  
    if (!user || !user.email) {
      console.error("User is not authenticated or email missing");
      return;
    }
  
    try {
      await setDoc(doc(db, `aitrip/${user.email}/trips/${docId}`), {
        tripData,
        id: docId, 
      });
      console.log("Trip saved successfully!");
    } catch (err) {
      console.error("Error saving trip:", err);
    }
  };
  

  if (tripData?.error === "Failed to generate trip details.") {
    return (
      <div className="text-3xl font-bold text-red-700 bg-red-100 py-10 text-center mt-20 rounded-lg shadow-md mx-5">
        ❌ Failed to generate trip details.
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-50 px-5 py-4 flex justify-end ">
        <Button
          label={isSaved ? "Trip Saved" : "Save Trip"}
          onClick={() => saveTrip(tripData)}
          disabled={isSaved}
          className={`px-6 py-2 text-white font-semibold rounded-lg transition-all duration-200 
            ${
              isSaved
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
        />
      </div>

      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 pb-20">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-2">
          🗺️ Your Trip Plan
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          <span className="font-medium">
            Here's your AI-generated itinerary!
          </span>
        </p>

        <div className="bg-white p-8 rounded-3xl shadow-2xl transition-all">
          {tripData ? (
            <div className="trip-result space-y-10">
              <div className="trip-overview bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-xl shadow w-full max-w-full overflow-hidden">
                {["destination", "duration", "focus", "travelers"].map(
                  (key) => (
                    <p
                      key={key}
                      className="text-base sm:text-lg md:text-xl text-gray-700 my-2 break-words"
                    >
                      <span className="font-bold text-blue-900 capitalize">
                        {key}:
                      </span>{" "}
                      {tripData[key]}
                    </p>
                  )
                )}
              </div>

              <div className="hotels">
                <h4 className="font-bold text-3xl text-center bg-gradient-to-r from-pink-200 to-yellow-100 text-gray-900 p-3 rounded-lg shadow mb-4">
                  🏨 Hotels
                </h4>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tripData.hotels.map((hotel) => (
                    <div
                      key={hotel.name}
                      className="bg-white border border-gray-100 rounded-xl shadow-md p-5 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <p className="text-lg font-bold text-blue-700 mt-3">
                        {hotel.name}
                      </p>
                      <p className="text-sm text-gray-500">{hotel.location}</p>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-green-600 font-bold">
                          {hotel.pricing}
                        </span>
                        <span className="text-yellow-500 font-bold">
                          {hotel.rating} ★
                        </span>
                      </div>
                      {hotel.website && (
                        <a
                          href={hotel.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit website for ${hotel.name}`}
                          className="text-blue-600 underline text-sm mt-2 block hover:text-blue-800 transition"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="dailyPlan">
                <h4 className="font-bold text-3xl text-center bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-900 p-3 rounded-lg shadow mb-4">
                  📅 Daily Plans
                </h4>
                <div className="flex flex-col gap-6">
                  {tripData.itinerary.dailyPlan.map((plan, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-md"
                    >
                      <h4 className="font-bold text-xl bg-blue-200 text-blue-900 border p-3 rounded-lg">
                        {plan.theme} - Day {plan.day}
                      </h4>

                      {["morning", "afternoon", "evening", "night"].map(
                        (timeOfDay) => (
                          <div
                            key={timeOfDay}
                            className="mt-4 p-4 bg-white rounded-md shadow transition hover:shadow-lg"
                          >
                            <h5 className="text-lg font-semibold text-gray-800 capitalize">
                              {timeOfDay}
                            </h5>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <span className="text-blue-700 font-medium">
                                {plan[timeOfDay].activity}
                              </span>
                              <span className="text-gray-500">
                                {plan[timeOfDay].time} •{" "}
                                {plan[timeOfDay].duration}
                              </span>
                            </div>
                            <p className="text-gray-700 mt-2 text-sm">
                              {plan[timeOfDay].description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-500 text-center mt-10">
              Loading trip details...
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default TripResult;
