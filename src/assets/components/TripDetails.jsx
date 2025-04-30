import React from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import Button from "./ui/Button";

function TripDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const tripData = state.tripData;

  return (
    <div className="px-4 sm:px-8 md:px-20 lg:px-36 xl:px-52 py-10">
      <h2 className="text-4xl font-extrabold text-blue-800 mb-6 text-center">
        🗺️ Your Trip Plan
      </h2>

      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl">
        {tripData ? (
          <div className="space-y-10">
            <div className="grid gap-4 bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-xl shadow-md">
              {["destination", "duration", "focus", "travelers"].map((key) => (
                <p key={key} className="text-lg sm:text-xl text-gray-700">
                  <span className="font-bold text-blue-900 capitalize">
                    {key}:
                  </span>{" "}
                  {tripData[key]}
                </p>
              ))}
            </div>
            <div>
              <h3 className="text-3xl font-bold text-center text-gray-900 bg-gradient-to-r from-pink-100 to-yellow-100 py-3 rounded-lg shadow">
                🏨 Hotels
              </h3>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {tripData.hotels.map((hotel) => (
                  <div
                    key={hotel.name}
                    className="bg-white border rounded-xl shadow hover:shadow-xl transition-all p-4"
                  >
                    <p className="mt-3 text-lg font-semibold text-blue-700">
                      {hotel.name}
                    </p>
                    <p className="text-sm text-gray-500">{hotel.location}</p>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-green-600 font-medium">
                        {hotel.pricing}
                      </span>
                      <span className="text-yellow-500 font-medium">
                        {hotel.rating} ★
                      </span>
                    </div>
                    {hotel.website && (
                      <a
                        href={hotel.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-blue-600 underline text-sm hover:text-blue-800"
                      >
                        Website
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-center text-gray-900 bg-gradient-to-r from-indigo-100 to-purple-100 py-3 rounded-lg shadow">
                📅 Daily Plans
              </h3>
              <div className="flex flex-col gap-6 mt-6">
                {tripData.itinerary.dailyPlan.map((plan, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow"
                  >
                    <h4 className="text-xl font-semibold text-blue-900 bg-blue-100 border p-3 rounded-lg mb-4">
                      {plan.theme} - Day {plan.day}
                    </h4>
                    {["morning", "afternoon", "evening", "night"].map(
                      (timeOfDay) => (
                        <div
                          key={timeOfDay}
                          className="mt-4 p-4 bg-white rounded-md shadow hover:shadow-lg transition"
                        >
                          <h5 className="text-lg font-medium text-gray-800 capitalize">
                            {timeOfDay}
                          </h5>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <span className="text-blue-700 font-medium">
                              {plan[timeOfDay].activity}
                            </span>
                            <span className="text-gray-500">
                              {plan[timeOfDay].time} • {plan[timeOfDay].duration}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">
                            {plan[timeOfDay].description}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button
                label="Back"
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-500 text-center mt-10">
            Loading trip details...
          </p>
        )}
      </div>
    </div>
  );
}

export default TripDetails;
