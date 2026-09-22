import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Button from '../../components/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/authService.js';
import { useTranslation } from '../../translation/useTranslation.js';
import Chatbot from "../../components/Chatbot/Chatbot";
import './FarmerDashboard.css';

function FarmerDashboard() {
  const { t } = useTranslation();

  const { farmer } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [queue, setQueue] = useState(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingQueue, setLoadingQueue] = useState(true);

  const farmerName = farmer?.fullName || 'Farmer';
  const firstName = farmerName.split(' ')[0];

  // ===============================
  // LOAD FARMER BOOKINGS + QUEUE
  // ===============================
  const loadDashboardData = useCallback(async () => {
    if (!farmer?.farmerId) {
      setLoadingBookings(false);
      setLoadingQueue(false);
      return;
    }

    try {
      const { data } = await api.get(
        `/bookings/farmer/${farmer.farmerId}/`
      );

      const farmerBookings = data || [];

      setBookings(farmerBookings);

      // ===============================
      // FIND LIVE QUEUE BOOKING
      // ===============================
      // CONFIRMED = automatically confirmed booking
      // IN_PROGRESS = officer has started procurement
      const activeBookings = farmerBookings.filter(
        (booking) =>
          booking.status === 'CONFIRMED' ||
          booking.status === 'IN_PROGRESS'
      );

      // Sort:
      // 1. Earliest booking date
      // 2. Smaller token number
      // 3. Smaller booking ID
      const sortedActiveBookings = [...activeBookings].sort((a, b) => {
        const dateA = new Date(a.booking_date);
        const dateB = new Date(b.booking_date);

        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }

        const tokenA = a.token_number
          ? Number(a.token_number.split('-').pop())
          : Number.MAX_SAFE_INTEGER;

        const tokenB = b.token_number
          ? Number(b.token_number.split('-').pop())
          : Number.MAX_SAFE_INTEGER;

        if (tokenA !== tokenB) {
          return tokenA - tokenB;
        }

        return Number(a.booking_id) - Number(b.booking_id);
      });

      const activeBooking =
        sortedActiveBookings.length > 0
          ? sortedActiveBookings[0]
          : null;

      // ===============================
      // LOAD QUEUE DATA
      // ===============================
      if (!activeBooking) {
        setQueue(null);
      } else {
        try {
          const queueResponse = await api.get(
            `/queue/${activeBooking.booking_id}/`
          );

          setQueue(queueResponse.data);
        } catch (queueError) {
          console.error('Unable to load queue:', queueError);
          setQueue(null);
        }
      }
    } catch (error) {
      console.error('Unable to load dashboard data:', error);

      setBookings([]);
      setQueue(null);
    } finally {
      setLoadingBookings(false);
      setLoadingQueue(false);
    }
  }, [farmer?.farmerId]);

  // ===============================
  // INITIAL LOAD + POLLING
  // ===============================
  useEffect(() => {
    if (!farmer?.farmerId) {
      return;
    }

    loadDashboardData();

    const interval = setInterval(() => {
      loadDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, [farmer?.farmerId, loadDashboardData]);

  // ===============================
  // ACTIVE BOOKINGS
  // ===============================
  const activeBookings = bookings.filter(
    (booking) =>
      booking.status === 'CONFIRMED' ||
      booking.status === 'IN_PROGRESS'
  );

  // ===============================
  // SORT ACTIVE BOOKINGS
  // ===============================
  const sortedActiveBookings = [...activeBookings].sort((a, b) => {
    const dateA = new Date(a.booking_date);
    const dateB = new Date(b.booking_date);

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }

    const tokenA = a.token_number
      ? Number(a.token_number.split('-').pop())
      : Number.MAX_SAFE_INTEGER;

    const tokenB = b.token_number
      ? Number(b.token_number.split('-').pop())
      : Number.MAX_SAFE_INTEGER;

    if (tokenA !== tokenB) {
      return tokenA - tokenB;
    }

    return Number(a.booking_id) - Number(b.booking_id);
  });

  // ===============================
  // NEXT APPOINTMENT
  // ===============================
  const nextBooking =
    sortedActiveBookings.length > 0
      ? sortedActiveBookings[0]
      : null;

  // ===============================
  // BOOKING HISTORY
  // ===============================
  const bookingHistory = bookings
    .filter(
      (booking) =>
        booking.status === 'COMPLETED' ||
        booking.status === 'REJECTED'
    )
    .sort(
      (a, b) =>
        Number(b.booking_id) - Number(a.booking_id)
    );

  // Show only latest 3 on dashboard
  const recentBookingHistory = bookingHistory.slice(0, 3);

  return (
    <div className="farmer-dashboard">
      <Navbar />

      <main className="farmer-dashboard__main">
        <div className="farmer-dashboard__container">

          {/* ===============================
              WELCOME
          =============================== */}
          <section className="dashboard-welcome">
            <div>
              <span className="dashboard-welcome__eyebrow">
                {t('farmerDashboard')}
              </span>

              <h1>
                {t('goodMorning')}, {firstName} <span>👋</span>
              </h1>

              <p>
                {t('procurementActivity')}
              </p>
            </div>

            <div className="dashboard-welcome__badge">
              <span className="dashboard-welcome__badge-icon">
                🌾
              </span>

              <div>
                <strong>KisanSetu</strong>
                <small>{t('smartProcurement')}</small>
              </div>
            </div>
          </section>

          {/* ===============================
              NEXT APPOINTMENT
          =============================== */}
          <section className="next-appointment">
            {loadingBookings ? (
              <div className="next-appointment__content">

                <div className="next-appointment__label">
                  <span className="next-appointment__dot"></span>
                  {t('nextAppointment')}
                </div>

                <h2>
                  {t('loadingBooking')}
                </h2>

                <p>
                  {t('loadingLatestBooking')}
                </p>

              </div>
            ) : nextBooking ? (
              <>
                <div className="next-appointment__content">

                  <div className="next-appointment__label">
                    <span className="next-appointment__dot"></span>
                    {t('nextAppointment')}
                  </div>

                  <h2>
                    {nextBooking.crop_name ||
                      t('cropProcurement')}
                  </h2>

                  <p>
                    {nextBooking.variety
                      ? `${nextBooking.variety} • `
                      : ''}

                    {nextBooking.centre_name ||
                      t('procurementCentre')}
                  </p>

                  <div className="dashboard-booking-meta">

                    <span>
                      📅 {nextBooking.booking_date}
                    </span>

                    <span>
                      🕐 {nextBooking.slot_time?.slice(0, 5)}
                    </span>

                    {nextBooking.token_number && (
                      <span>
                        🎫 {nextBooking.token_number}
                      </span>
                    )}

                  </div>
                </div>

                <div className="next-appointment__action">
                  <Button
                    onClick={() =>
                      navigate('/farmer/my-booking')
                    }
                  >
                    {t('viewBooking')} <span>→</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="next-appointment__content">

                  <div className="next-appointment__label">
                    <span className="next-appointment__dot"></span>
                    {t('nextAppointment')}
                  </div>

                  <h2>
                    {t('noAppointment')}
                  </h2>

                  <p>
                    {t('bookProcurementSlot')}
                  </p>

                </div>

                <div className="next-appointment__action">
                  <Button
                    onClick={() =>
                      navigate('/farmer/booking')
                    }
                  >
                    {t('bookSlot')} <span>→</span>
                  </Button>
                </div>
              </>
            )}
          </section>

          {/* ===============================
              QUICK ACTIONS
          =============================== */}
          <section className="dashboard-section">

            <div className="dashboard-section__header">
              <div>
                <span className="dashboard-section__eyebrow">
                  {t('getStarted')}
                </span>

                <h2>
                  {t('quickActions')}
                </h2>
              </div>
            </div>

            <div className="quick-actions">

              {/* BOOK SLOT */}
              <div className="quick-action quick-action--primary">

                <div className="quick-action__top">

                  <div className="quick-action__icon">
                    📅
                  </div>

                  <span className="quick-action__arrow">
                    →
                  </span>

                </div>

                <h3>
                  {t('bookSlot')}
                </h3>

                <p>
                  {t('chooseCentreBookSlot')}
                </p>

                <button
                  className="quick-action__link"
                  onClick={() =>
                    navigate('/farmer/booking')
                  }
                >
                  {t('getStartedButton')} <span>→</span>
                </button>

              </div>

              {/* FIND CENTRE */}
              <div className="quick-action">

                <div className="quick-action__top">

                  <div className="quick-action__icon">
                    📍
                  </div>

                  <span className="quick-action__arrow">
                    →
                  </span>

                </div>

                <h3>
                  {t('findCentre')}
                </h3>

                <p>
                  {t('exploreNearbyCentres')}
                </p>

                <button
                  className="quick-action__link"
                  onClick={() =>
                    navigate('/farmer/centres')
                  }
                >
                  {t('explore')} <span>→</span>
                </button>

              </div>

              {/* MY TOKEN */}
              <div className="quick-action">

                <div className="quick-action__top">

                  <div className="quick-action__icon">
                    🎫
                  </div>

                  <span className="quick-action__arrow">
                    →
                  </span>

                </div>

                <h3>
                  {t('myToken')}
                </h3>

                <p>
                  {t('checkQueueToken')}
                </p>

                <button
                  className="quick-action__link"
                  onClick={() =>
                    navigate('/farmer/token')
                  }
                >
                  {t('view')} <span>→</span>
                </button>

              </div>

            </div>
          </section>

          {/* ===============================
              RECENT QUEUE
          =============================== */}
          <section className="dashboard-section">

            <div className="dashboard-section__header">
              <div>

                <span className="dashboard-section__eyebrow">
                  {t('liveStatus')}
                </span>

                <h2>
                  {t('recentQueue')}
                </h2>

              </div>
            </div>

            {loadingQueue ? (

              <div className="overview-grid">

                <div className="overview-card">

                  <div className="overview-card__header">

                    <div className="overview-card__icon">
                      🎫
                    </div>

                    <span className="overview-card__status">
                      {t('loading')}
                    </span>

                  </div>

                  <h3>
                    {t('loadingQueue')}
                  </h3>

                  <p className="overview-card__empty">
                    {t('loadingQueueStatus')}
                  </p>

                </div>

              </div>

            ) : queue ? (

              <div className="overview-grid">

                <div className="overview-card">

                  <div className="overview-card__header">

                    <div className="overview-card__icon">
                      🎫
                    </div>

                    <span className="overview-card__status">
                      {queue.status}
                    </span>

                  </div>

                  <h3>
                    {queue.token_number}
                  </h3>

                  <p className="overview-card__empty">

                    {t('queuePosition')}:{' '}
                    <strong>
                      #{queue.queue_position}
                    </strong>

                    <br />

                    {t('peopleAhead')}:{' '}
                    <strong>
                      {queue.people_ahead}
                    </strong>

                  </p>

                  <p className="overview-card__empty">

                    {t('estimatedWaiting')}:{' '}

                    <strong>
                      {queue.estimated_wait_minutes === 0
                        ? t('youAreNext')
                        : `${queue.estimated_wait_minutes} ${t('minutes')}`}
                    </strong>

                  </p>

                  <p className="overview-card__empty">

                    {t('estimatedTurn')}:{' '}

                    <strong>
                      {queue.estimated_turn_time}
                    </strong>

                  </p>

                  <button
                    className="overview-card__link"
                    onClick={() =>
                      navigate('/farmer/queue')
                    }
                  >
                    {t('viewQueue')} <span>→</span>
                  </button>

                </div>

              </div>

            ) : (

              <div className="overview-grid">

                <div className="overview-card">

                  <div className="overview-card__header">

                    <div className="overview-card__icon">
                      🎫
                    </div>

                    <span className="overview-card__status">
                      {t('noQueue')}
                    </span>

                  </div>

                  <h3>
                    {t('noActiveQueue')}
                  </h3>

                  <p className="overview-card__empty">
                    {t('queueWillAppear')}
                  </p>

                  <button
                    className="overview-card__link"
                    onClick={() =>
                      navigate('/farmer/queue')
                    }
                  >
                    {t('viewQueueHistory')} <span>→</span>
                  </button>

                </div>

              </div>

            )}

          </section>

          {/* ===============================
              BOOKING HISTORY
          =============================== */}
          <section className="dashboard-section">

            <div className="dashboard-section__header">

              <div>

                <span className="dashboard-section__eyebrow">
                  {t('pastBookings')}
                </span>

                <h2>
                  {t('bookingHistory')}
                </h2>

              </div>

              {bookingHistory.length > 0 && (
                <span className="booking-history-count">
                  {bookingHistory.length}{' '}
                  {bookingHistory.length !== 1
                    ? t('records')
                    : t('record')}
                </span>
              )}

            </div>

            {loadingBookings ? (

              <div className="overview-grid">

                <div className="overview-card">

                  <h3>
                    {t('loadingBookingHistory')}
                  </h3>

                  <p className="overview-card__empty">
                    {t('loadingPreviousBookings')}
                  </p>

                </div>

              </div>

            ) : recentBookingHistory.length > 0 ? (

              <>

                <div className="dashboard-booking-history">

                  {recentBookingHistory.map((booking) => (

                    <div
                      className="dashboard-booking-history__item"
                      key={booking.booking_id}
                    >

                      <div className="dashboard-booking-history__left">

                        <div className="dashboard-booking-history__icon">
                          🎫
                        </div>

                        <div>

                          <h3>
                            {booking.crop_name ||
                              t('cropProcurement')}

                            {booking.variety && (
                              <>
                                {' • '}
                                {booking.variety}
                              </>
                            )}
                          </h3>

                          <p>
                            {booking.centre_name ||
                              t('procurementCentre')}
                          </p>

                          <span>

                            {booking.booking_date}

                            {booking.slot_time && (
                              <>
                                {' • '}
                                {booking.slot_time.slice(0, 5)}
                              </>
                            )}

                          </span>

                        </div>

                      </div>

                      <div className="dashboard-booking-history__right">

                        <span
                          className={
                            booking.status === 'COMPLETED'
                              ? 'dashboard-booking-history__status dashboard-booking-history__status--completed'
                              : 'dashboard-booking-history__status dashboard-booking-history__status--rejected'
                          }
                        >
                          {booking.status}
                        </span>

                        <small>
                          #{booking.booking_id}
                        </small>

                      </div>

                    </div>

                  ))}

                </div>

                <button
                  className="overview-card__link dashboard-booking-history__view-all"
                  onClick={() =>
                    navigate('/farmer/my-booking')
                  }
                >
                  {t('viewAllBookings')} <span>→</span>
                </button>

              </>

            ) : (

              <div className="overview-grid">

                <div className="overview-card">

                  <div className="overview-card__header">

                    <div className="overview-card__icon">
                      🎫
                    </div>

                    <span className="overview-card__status">
                      {t('noHistory')}
                    </span>

                  </div>

                  <h3>
                    {t('noPastBookings')}
                  </h3>

                  <p className="overview-card__empty">
                    {t('pastBookingsWillAppear')}
                  </p>

                  <button
                    className="overview-card__link"
                    onClick={() =>
                      navigate('/farmer/booking')
                    }
                  >
                    {t('bookSlot')} <span>→</span>
                  </button>

                </div>

              </div>

            )}

          </section>

          {/* ===============================
              PROCUREMENT OVERVIEW
          =============================== */}
          <section className="dashboard-section">

            <div className="dashboard-section__header">

              <div>

                <span className="dashboard-section__eyebrow">
                  {t('yourActivity')}
                </span>

                <h2>
                  {t('procurementOverview')}
                </h2>

              </div>

            </div>

            <div className="overview-grid">

              {/* PROCUREMENT */}
              <div className="overview-card">

                <div className="overview-card__header">

                  <div className="overview-card__icon">
                    🌾
                  </div>

                  <span className="overview-card__status">
                    {t('view')}
                  </span>

                </div>

                <h3>
                  {t('procurement')}
                </h3>

                <p className="overview-card__empty">

                  {bookings.length > 0
                    ? `${bookings.length} ${
                        bookings.length > 1
                          ? t('availableBookingsPlural')
                          : t('availableBookings')
                      }`
                    : t('noProcurementRecord')}

                </p>

                <button
                  className="overview-card__link"
                  onClick={() =>
                    navigate('/farmer/procurement')
                  }
                >
                  {t('viewStatus')} <span>→</span>
                </button>

              </div>

              {/* PAYMENT */}
              <div className="overview-card">

                <div className="overview-card__header">

                  <div className="overview-card__icon">
                    ₹
                  </div>

                  <span className="overview-card__status">
                    {t('view')}
                  </span>

                </div>

                <h3>
                  {t('payment')}
                </h3>

                <p className="overview-card__empty">

                  {bookings.length > 0
                    ? t('checkPaymentStatus')
                    : t('noPaymentRecord')}

                </p>

                <button
                  className="overview-card__link"
                  onClick={() =>
                    navigate('/farmer/payment')
                  }
                >
                  {t('viewPayment')} <span>→</span>
                </button>

              </div>

            </div>

          </section>

          {/* ===============================
              HELP
          =============================== */}
          <section className="dashboard-info">

            <div className="dashboard-info__icon">
              💡
            </div>

            <div>

              <h3>
                {t('howKisanSetuWorks')}
              </h3>

              <p>
                {t('howKisanSetuWorksDescription')}
              </p>

            </div>

          </section>

        </div>
      </main>

      <Chatbot />
    </div>
  );
}

export default FarmerDashboard;