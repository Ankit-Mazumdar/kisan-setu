import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function OfficerNavbar() {

  const navigate = useNavigate();

  const officerSession = JSON.parse(
    localStorage.getItem('kisansetu_officer_session')
  );

  const handleLogout = () => {

    localStorage.removeItem(
      'kisansetu_officer_session'
    );

    navigate('/officer/login');

  };


  return (

    <header className="navbar">

      <div className="navbar__inner">


        {/* BRAND */}

        <Link
          to="/officer/dashboard"
          className="brand"
        >
          Kisan
          <span className="brand__mark">
            Setu
          </span>
        </Link>


        {/* NAVIGATION */}

        <nav className="navbar__links">


          <Link
            className="navbar__link"
            to="/officer/dashboard"
          >
            Dashboard
          </Link>


          <Link
            className="navbar__link"
            to="/officer/schedule"
          >
            Centre Schedule
          </Link>


         <Link
    className="navbar__link"
    to="/officer/profile"
>
    Profile
</Link>

<Link
    className="navbar__link"
    to="/officer/change-password"
>
    Change Password
</Link>


          <span className="text-muted">

            {officerSession?.full_name ||
              'Officer'}

          </span>


          <button
            className="btn btn--outline"
            onClick={handleLogout}
          >
            Logout
          </button>


        </nav>

      </div>

    </header>

  );

}


export default OfficerNavbar;