import React, { useState } from 'react';
import Button from './ui/Button';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchSavedTrips = () => {
    setMobileMenuOpen(false);
    navigate('/saved-trips');
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
        window.location.reload();
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    },
    onError: (err) => {
      console.error("Google login failed:", err);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="p-4 px-6 shadow-md flex justify-between items-center bg-[rgb(245,245,245)] m-1.5">
      <img
        src="/aitriplogo.svg"
        className="w-12 h-12 cursor-pointer"
        alt="AI Trip Logo"
        onClick={() => navigate('/')}
      />
      <div className="sm:hidden text-3xl cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <HiX /> : <HiMenu />}
      </div>
      <div className="hidden sm:flex items-center gap-6">
        {user && (
          <p
            className="font-semibold text-base text-gray-700 hover:text-blue-600 hover:border hover:border-black hover:rounded-lg hover:px-3 hover:py-2 transition-all duration-300 cursor-pointer"
            onClick={fetchSavedTrips}
          >
            Saved Trips
          </p>
        )}

        {!user ? (
          <Button
            label="Sign in"
            onClick={() => login()}
            className="border-2 border-amber-500 px-5 py-2 rounded-md text-sm transition-all duration-300 ease-in-out bg-amber-500 text-white hover:bg-amber-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Sign in button"
          />
        ) : (
          <div className="flex items-center gap-4">
            <img
              src={user.picture || "/profile_logo.svg"}
              alt="User"
              className="w-10 h-10 rounded-full border"
            />
            <p className="text-gray-700 font-medium text-sm">{user.name}</p>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 border border-red-400 px-3 py-1 rounded hover:bg-red-50 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-md p-6 flex flex-col items-center sm:hidden z-50 rounded-lg">
          {user && (
            <p
              className="font-semibold text-base text-gray-700 hover:text-blue-600 cursor-pointer mb-4 mr-6 transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={fetchSavedTrips}
            >
              Saved Trips
            </p>
          )}
          {!user ? (
            <Button
              label="Sign in"
              onClick={() => {
                login();
                setMobileMenuOpen(false);
              }}
              className="border-2 border-amber-500 px-5 py-2 rounded-md text-sm w-full transition-all duration-300 ease-in-out bg-amber-500 text-white hover:bg-amber-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Sign in button"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <img
                src={user.picture || "/profile_logo.svg"}
                alt="User"
                className="w-10 h-10 rounded-full border"
              />
              <p className="text-gray-700 font-medium">{user.name}</p>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 border border-red-400 px-3 py-1 rounded hover:bg-red-50 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
