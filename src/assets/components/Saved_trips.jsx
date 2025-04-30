import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "./config/config";
import { useNavigate } from "react-router";

function Saved_trips() {
  const [trips, setTrips] = useState([]);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchTrips = async () => {
      try {
        const tripsRef = collection(db, `aitrip/${user.email}/trips`);
        const query = await getDocs(tripsRef);
        const trips = query.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((trip) => trip.tripData);
    
        console.log("Fetched trips:", trips);
        setTrips(trips);
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };
    
    

    fetchTrips();
  }, [user, navigate]);

  const handleDelete = async (tripId) => {
    try {
      await deleteDoc(doc(db, `aitrip/${user.email}/trips/${tripId}`));
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
    } catch (err) {
      console.error("Error deleting trip:", err);
    }
  };

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
              className="relative bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-shadow p-5 space-y-3"
            >
              <button
                onClick={() => handleDelete(trip.id)}
                className="absolute top-2 right-2 text-red-500 text-xs bg-red-100 px-2 py-1 rounded hover:bg-red-200"
              >
                Delete
              </button>
              <div
                onClick={() =>
                  navigate(`/saved-trips/${trip.id}`, {
                    state: { tripData: trip.tripData },
                  })
                }
                className="cursor-pointer space-y-1 text-gray-700 text-sm sm:text-base"
              >
                <h3 className="text-xl font-bold text-gray-800">
                  Trip {index + 1}
                </h3>
                <p>
                  <span className="font-semibold text-blue-800">Location:</span>{" "}
                  {trip.tripData.destination}
                </p>
                <p>
                  <span className="font-semibold text-blue-800">Travelers:</span>{" "}
                  {trip.tripData.travelers}
                </p>
                <p className="break-words overflow-hidden">
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
