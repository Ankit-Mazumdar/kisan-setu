import React, { useEffect, useState } from 'react';

import api from '../../services/authService';

import { useAuth } from '../../context/AuthContext.jsx';

import Navbar from '../../components/Navbar.jsx';

import './MyBooking.css';


function MyBooking() {

  const { farmer } = useAuth();

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {

    if (farmer?.farmerId) {
      loadBookings();
    } else {
      setLoading(false);
    }

  }, [farmer]);


  async function loadBookings() {

    try {

      const response = await api.get(
        `/bookings/farmer/${farmer.farmerId}/`
      );

      setBookings(response.data);

    } catch (error) {

      console.error(error);

      setError('Unable to load your bookings.');

    } finally {

      setLoading(false);

    }
  }


  // Current active bookings
  const activeBookings = bookings.filter(
    (booking) =>
      booking.status === 'APPROVED' ||
      booking.status === 'IN_PROGRESS'
  );


  // Booking history
  const historyBookings = bookings
    .filter(
      (booking) =>
        booking.status === 'COMPLETED' ||
        booking.status === 'REJECTED'
    )
    .sort(
      (a, b) =>
        Number(b.booking_id) -
        Number(a.booking_id)
    );


  return (

    <div>

      <Navbar />

      <main className="my-booking-page">

        <div className="my-booking-container">

          <section className="my-booking-header">

            <span className="my-booking-eyebrow">
              YOUR BOOKINGS
            </span>

            <h1>
              My Bookings
            </h1>

            <p>
              View your procurement bookings and token details.
            </p>

          </section>


          {loading && (

            <div className="booking-loading">
              Loading your bookings...
            </div>

          )}


          {error && (

            <div className="booking-error">
              {error}
            </div>

          )}


          {!loading &&
          !error &&
          bookings.length === 0 && (

            <div className="booking-empty">

              <div className="booking-empty__icon">
                🎫
              </div>

              <h2>
                No bookings found
              </h2>

              <p>
                You have not booked a procurement slot yet.
              </p>

            </div>

          )}


          {!loading &&
          !error &&
          activeBookings.length > 0 && (

            <section className="booking-current-section">

              <div className="booking-section-header">

                <div>

                  <span className="booking-section-eyebrow">
                    ACTIVE BOOKINGS
                  </span>

                  <h2>
                    Current Bookings
                  </h2>

                </div>

                <span className="booking-section-count">
                  {activeBookings.length} active
                </span>

              </div>


              <div className="booking-list">

                {activeBookings.map((booking) => (

                  <article
                    className="booking-card"
                    key={booking.booking_id}
                  >

                    <div className="booking-card__top">

                      <div>

                        <div className="booking-card__token-label">
                          YOUR TOKEN
                        </div>

                        <h2 className="booking-card__token">
                          {booking.token_number || '—'}
                        </h2>

                      </div>

                      <span className="booking-card__status">
                        {booking.status}
                      </span>

                    </div>


                    <div className="booking-card__body">

                      <div className="booking-details">


                        <div className="booking-detail">

                          <div className="booking-detail__icon">
                            🌾
                          </div>

                          <div className="booking-detail__content">

                            <span className="booking-detail__label">
                              Crop
                            </span>

                            <p className="booking-detail__value">
                              {booking.crop_name}
                            </p>

                          </div>

                        </div>


                        <div className="booking-detail">

                          <div className="booking-detail__icon">
                            🌱
                          </div>

                          <div className="booking-detail__content">

                            <span className="booking-detail__label">
                              Variety
                            </span>

                            <p className="booking-detail__value">
                              {booking.variety}
                            </p>

                          </div>

                        </div>


                        <div className="booking-detail">

                          <div className="booking-detail__icon">
                            📍
                          </div>

                          <div className="booking-detail__content">

                            <span className="booking-detail__label">
                              Procurement Centre
                            </span>

                            <p className="booking-detail__value">
                              {booking.centre_name}
                            </p>

                          </div>

                        </div>


                        <div className="booking-detail">

                          <div className="booking-detail__icon">
                            📅
                          </div>

                          <div className="booking-detail__content">

                            <span className="booking-detail__label">
                              Booking Date
                            </span>

                            <p className="booking-detail__value">
                              {booking.booking_date}
                            </p>

                          </div>

                        </div>


                        <div className="booking-detail">

                          <div className="booking-detail__icon">
                            🕙
                          </div>

                          <div className="booking-detail__content">

                            <span className="booking-detail__label">
                              Time
                            </span>

                            <p className="booking-detail__value">
                              {booking.slot_time || 'Not assigned'}
                            </p>

                          </div>

                        </div>


                        <div className="booking-detail">

                          <div className="booking-detail__icon">
                            🏠
                          </div>

                          <div className="booking-detail__content">

                            <span className="booking-detail__label">
                              Address
                            </span>

                            <p className="booking-detail__value">
                              {booking.centre_address}
                            </p>

                          </div>

                        </div>


                      </div>

                    </div>


                    <div className="booking-card__footer">

                      <p className="booking-card__id">
                        Booking ID:{' '}
                        <strong>
                          #{booking.booking_id}
                        </strong>
                      </p>

                    </div>

                  </article>

                ))}

              </div>

            </section>

          )}


          {!loading &&
          !error &&
          historyBookings.length > 0 && (

            <section className="booking-history">

              <div className="booking-history__header">

                <div>

                  <span className="booking-history__eyebrow">
                    PAST BOOKINGS
                  </span>

                  <h2>
                    Booking History
                  </h2>

                </div>

                <span className="booking-history__count">
                  {historyBookings.length} record
                  {historyBookings.length !== 1 ? 's' : ''}
                </span>

              </div>


              <div className="booking-history__list">

                {historyBookings.map((booking) => (

                  <div
                    className="booking-history-card"
                    key={booking.booking_id}
                  >

                    <div className="booking-history-card__left">

                      <div className="booking-history-token">
                        {booking.token_number || 'No token'}
                      </div>


                      <div className="booking-history-info">

                        <h3>

                          {booking.crop_name}

                          {booking.variety && (
                            <>
                              {' • '}
                              {booking.variety}
                            </>
                          )}

                        </h3>

                        <p>
                          {booking.centre_name}
                        </p>

                        <span>
                          {booking.booking_date}

                          {booking.slot_time && (
                            <>
                              {' • '}
                              {booking.slot_time}
                            </>
                          )}
                        </span>

                      </div>

                    </div>


                    <div className="booking-history-card__right">

                      <span
                        className={
                          booking.status === 'COMPLETED'
                            ? 'booking-history-status booking-history-status--completed'
                            : 'booking-history-status booking-history-status--rejected'
                        }
                      >
                        {booking.status}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </section>

          )}

        </div>

      </main>

    </div>

  );

}


export default MyBooking;