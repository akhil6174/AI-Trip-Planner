import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config/config";
import { useNavigate } from "react-router";

function Saved_trips() {
  const [trips, setTrips] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user.email;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const tripsRef = collection(db, `aitrip/${userEmail}/trips`);
      const query = await getDocs(tripsRef);
      const trips = query.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrips(trips);
    };
    fetchTrips();
  }, []);

  return (
    <div className="px-4 sm:px-8 md:px-20 lg:px-36 xl:px-52 py-10">
      <h2 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">
        📌 Your Saved Trips
      </h2>

      {trips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {trips.map((trip, index) => (
            <div
              key={trip.id}
              onClick={() =>
                navigate(`/saved-trips/${trip.id}`, {
                  state: { tripData: trip.tripData },
                })
              }
              className="cursor-pointer bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-shadow p-5 space-y-3"
            >
              <h3 className="text-xl font-bold text-gray-800">
                Trip {index + 1}
              </h3>
              <div className="space-y-1 text-gray-700 text-sm sm:text-base">
                <p>
                  <span className="font-semibold text-blue-800">Location:</span>{" "}
                  {trip.tripData.destination}
                </p>
                <p>
                  <span className="font-semibold text-blue-800">Travelers:</span>{" "}
                  {trip.tripData.travelers}
                </p>
                <p>
                  <span className="font-semibold text-blue-800">Focus:</span>{" "}
                  {trip.tripData.focus}
                </p>
                <p>
                  <span className="font-semibold text-blue-800">Duration:</span>{" "}
                  {trip.tripData.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-20">
          No saved trips found.
        </p>
      )}
    </div>
  );
}

export default Saved_trips;
