import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FarmerLogin from '../pages/auth/FarmerLogin.jsx';
import FarmerRegister from '../pages/auth/FarmerRegister.jsx';
import FarmerDashboard from '../pages/farmer/FarmerDashboard.jsx';
import Booking from '../pages/farmer/Booking.jsx';
import MyBooking from '../pages/farmer/MyBooking.jsx';
import MyToken from '../pages/farmer/MyToken.jsx';
import Queue from '../pages/farmer/Queue.jsx';
import OfficerDashboard from '../pages/officer/OfficerDashboard.jsx';
import Procurement from '../pages/farmer/Procurement.jsx';
import Payment from '../pages/farmer/Payment.jsx';
import Profile from '../pages/farmer/Profile.jsx';
import Centres from '../pages/farmer/Centres.jsx';
import OfficerLogin from '../pages/auth/OfficerLogin.jsx';
import OfficerProfile from '../pages/officer/OfficerProfile.jsx';
import AdminLogin from '../pages/auth/AdminLogin.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminFarmers from '../pages/admin/AdminFarmers.jsx';
import AdminFarmerDetails from '../pages/admin/AdminFarmerDetails.jsx';
import AdminOfficers from '../pages/admin/AdminOfficers.jsx';
import AdminOfficerDetails from '../pages/admin/AdminOfficerDetails.jsx';
import AdminAddOfficer from '../pages/admin/AdminAddOfficer.jsx';
import AdminCentres from '../pages/admin/AdminCentres.jsx';
import AdminCentreDetails from '../pages/admin/AdminCentreDetails.jsx';
import AdminAddCentre from '../pages/admin/AdminAddCentre.jsx';
import OfficerSchedule from "../pages/officer/OfficerSchedule.jsx";
import AdminBookings from "../pages/admin/AdminBookings.jsx";
import AdminProcurement from '../pages/admin/AdminProcurement.jsx';
import AdminProcurementDetails from '../pages/admin/AdminProcurementDetails.jsx';
// import AdminProcurementDetails from '../pages/admin/AdminProcurementDetails.jsx';
import AdminPayments from '../pages/admin/AdminPayments.jsx';
import AdminPrices from '../pages/admin/AdminPrices.jsx';
import OfficerChangePassword
    from '../pages/officer/OfficerChangePassword.jsx';
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";

// Future protected-route wrapper (not active yet):
// function RequireAuth({ children }) {
//   const { isAuthenticated, loading } = useAuth();
//   if (loading) return null;
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login" element={<FarmerLogin />} />
      <Route path="/register" element={<FarmerRegister />} />
      <Route path="/officer/login" element={<OfficerLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Farmer */}
      <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
      <Route path="/farmer/profile" element={<Profile />} />
      <Route path="/officer/profile" element={<OfficerProfile />} />
      <Route path="/farmer/booking" element={<Booking />} />
      <Route path="/farmer/centres" element={<Centres />} />
      <Route path="/farmer/my-booking" element={<MyBooking />} />
      <Route path="/farmer/token" element={<MyToken />} />
      <Route path="/farmer/queue" element={<Queue />} />
      <Route path="/officer/dashboard" element={<OfficerDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/farmers" element={<AdminFarmers />} />
      <Route path="/farmer/procurement" element={<Procurement />} />
      <Route path="/farmer/payment" element={<Payment />} />
      <Route
    path="/admin/farmers/:farmerId"
    element={<AdminFarmerDetails />}
/>

<Route
    path="/admin/officers"
    element={<AdminOfficers />}
/>

<Route
    path="/admin/officers/:officerId"
    element={<AdminOfficerDetails />}
/>

<Route
    path="/admin/officers/add"
    element={<AdminAddOfficer />}
/>



<Route
    path="/admin/centres"
    element={<AdminCentres />}
/>
<Route
    path="/admin/centres/:centreId"
    element={<AdminCentreDetails />}
/>

<Route
    path="/admin/centres/add"
    element={<AdminAddCentre />}
/>

<Route
    path="/officer/schedule"
    element={<OfficerSchedule />}
/>

<Route
    path="/admin/bookings"
    element={<AdminBookings />}
/>

<Route
    path="/admin/procurement"
    element={<AdminProcurement />}
/>

<Route
    path="/admin/procurement/:centreId"
    element={<AdminProcurementDetails />}
/>

<Route
    path="/admin/payments"
    element={<AdminPayments />}
/>

<Route
    path="/admin/prices"
    element={<AdminPrices />}
/>

<Route
    path="/officer/change-password"
    element={<OfficerChangePassword />}
/>
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

{/* <Route
    path="/admin/procurement/:centreId"
    element={<AdminProcurementDetails />}
/> */}


      {/*
        Reserved for upcoming modules — added here as routes are built:
        <Route path="/farmer/profile" element={<FarmerProfile />} />
        <Route path="/farmer/crop" element={<CropSelection />} />
        <Route path="/farmer/centre" element={<CentreSelection />} />
        <Route path="/farmer/booking" element={<BookingPage />} />
        <Route path="/farmer/token" element={<TokenPage />} />
        <Route path="/farmer/queue" element={<QueueStatus />} />
        <Route path="/farmer/procurement" element={<ProcurementStatus />} />
        <Route path="/farmer/payment" element={<PaymentStatus />} />
      */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;