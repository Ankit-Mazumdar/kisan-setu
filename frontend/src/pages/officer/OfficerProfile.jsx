import React from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerNavbar from '../../components/OfficerNavbar.jsx';
import './OfficerProfile.css';

function OfficerProfile() {

  const navigate = useNavigate();

  const session = localStorage.getItem(
    'kisansetu_officer_session'
  );

  const officer = session
    ? JSON.parse(session)
    : null;

  if (!officer) {
    navigate('/officer/login');
    return null;
  }

  return (
    <>
      <OfficerNavbar />

      <main className="officer-profile-page">

        <div className="officer-profile-container">

          <div className="officer-profile-header">
            <div>
              <span className="officer-profile-eyebrow">
                OFFICER ACCOUNT
              </span>

              <h1>My Profile</h1>

              <p>
                View your officer account and assigned
                procurement centre.
              </p>
            </div>

            <button
              className="btn btn--outline"
              onClick={() => navigate('/officer/dashboard')}
            >
              ← Dashboard
            </button>
          </div>


          <div className="officer-profile-card">

            <div className="officer-profile-avatar">
              {officer.full_name
                ? officer.full_name.charAt(0).toUpperCase()
                : 'O'}
            </div>

            <div className="officer-profile-main">

              <h2>{officer.full_name}</h2>

              <span className="officer-status">
                {officer.status}
              </span>

              <p>
                Procurement Officer
              </p>

            </div>

          </div>


          <div className="officer-profile-details">

            <div className="profile-detail">
              <span>Officer ID</span>
              <strong>
                {officer.officer_id}
              </strong>
            </div>

            <div className="profile-detail">
              <span>Full Name</span>
              <strong>
                {officer.full_name}
              </strong>
            </div>

            <div className="profile-detail">
              <span>Email</span>
              <strong>
                {officer.email}
              </strong>
            </div>

            <div className="profile-detail">
              <span>Phone</span>
              <strong>
                {officer.phone}
              </strong>
            </div>

            <div className="profile-detail">
              <span>Assigned Centre</span>
              <strong>
                {officer.centre_name}
              </strong>
            </div>

            <div className="profile-detail">
              <span>Centre ID</span>
              <strong>
                {officer.centre_id}
              </strong>
            </div>

            <div className="profile-detail">
              <span>Account Status</span>
              <strong className="profile-status">
                {officer.status}
              </strong>
            </div>

          </div>

        </div>

      </main>
    </>
  );
}

export default OfficerProfile;