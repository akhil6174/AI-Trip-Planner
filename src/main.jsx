import CreateTrip from './assets/components/Create_trip.jsx'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter ,Routes,Route} from 'react-router'
import App from './App.jsx'
import Header from './assets/components/Header.jsx'
import Trip_result from './assets/components/Trip_result.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Saved_trips from './assets/components/Saved_trips.jsx'
import TripDetails from './assets/components/TripDetails.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header/>
      <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/create-trip' element={<CreateTrip/>}/>
        <Route path='/trip-result' element={<Trip_result/>}/>
        <Route path='/saved-trips' element={<Saved_trips/>}/>
        <Route path="/saved-trips/:id" element={<TripDetails />} />
      </Routes>
      </GoogleOAuthProvider>
  </BrowserRouter>,
)
