import React from "react";
import Button from "./ui/Button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="mt-16 px-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
        <span className="text-cyan-600">AI-Powered Trip Planner:</span>
        <br />
        Your Smart Travel Companion
      </h1>

      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Plan Smarter, Travel Better – Let AI Curate Your Perfect Trip with
        Personalized Itineraries and Real-Time Insights!
      </p>

      <div className="mt-6">
        <Link to="/create-trip">
          <Button
            label="Get Started"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          />
        </Link>
      </div>
    </div>
  );
}
