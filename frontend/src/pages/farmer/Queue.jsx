import React, {
  useEffect,
  useState,
  useCallback
} from 'react';

import api from '../../services/authService';

import { useAuth } from '../../context/AuthContext.jsx';

import Navbar from '../../components/Navbar.jsx';

import { useTranslation } from '../../translation/useTranslation.js';

import './Queue.css';


function Queue() {

  const { farmer } = useAuth();

  const { t, language } = useTranslation();

  const [booking, setBooking] = useState(null);
  const [queue, setQueue] = useState(null);

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const loadQueue = useCallback(async () => {

    if (!farmer?.farmerId) {
      return;
    }


    try {

      setError('');


      // Get all farmer bookings
      const bookingResponse = await api.get(
        `/bookings/farmer/${farmer.farmerId}/`
      );

      const bookings = bookingResponse.data || [];


      /*
       * LIVE QUEUE
       *
       * Only APPROVED and IN_PROGRESS
       * bookings are considered active.
       */

      const activeBookings = bookings.filter(
        (item) =>
          item.status === 'APPROVED' ||
          item.status === 'IN_PROGRESS'
      );


      /*
       * Select current active booking
       *
       * 1. Earliest booking date
       * 2. Smaller token number
       * 3. Smaller booking ID
       */

      const sortedBookings = [...activeBookings].sort(
        (a, b) => {

          const dateA = new Date(a.booking_date);
          const dateB = new Date(b.booking_date);


          if (dateA.getTime() !== dateB.getTime()) {

            return (
              dateA.getTime() -
              dateB.getTime()
            );

          }


          const tokenA = a.token_number
            ? Number(
                a.token_number.split('-').pop()
              )
            : Number.MAX_SAFE_INTEGER;


          const tokenB = b.token_number
            ? Number(
                b.token_number.split('-').pop()
              )
            : Number.MAX_SAFE_INTEGER;


          if (tokenA !== tokenB) {

            return tokenA - tokenB;

          }


          return (
            Number(a.booking_id) -
            Number(b.booking_id)
          );

        }
      );


      /*
       * CURRENT LIVE BOOKING
       */

      if (sortedBookings.length > 0) {

        const currentBooking = sortedBookings[0];

        setBooking(currentBooking);


        const queueResponse = await api.get(
          `/queue/${currentBooking.booking_id}/`
        );


        setQueue(queueResponse.data);

      } else {

        setBooking(null);
        setQueue(null);

      }


      /*
       * QUEUE HISTORY
       *
       * Completed and rejected bookings
       * are kept here instead of live queue.
       */

      const historyBookings = bookings
        .filter(
          (item) =>
            item.status === 'COMPLETED' ||
            item.status === 'REJECTED'
        )
        .sort(
          (a, b) =>
            Number(b.booking_id) -
            Number(a.booking_id)
        );


      setHistory(historyBookings);


    } catch (err) {

      console.error(
        'Failed to load queue information:',
        err
      );


      setError(
        t('queueInformationError')
      );

      setBooking(null);
      setQueue(null);
      setHistory([]);

    } finally {

      setLoading(false);

    }

  }, [farmer?.farmerId, t]);


  /*
   * Load queue when page opens.
   *
   * Refresh every 10 seconds.
   */

  useEffect(() => {

    if (!farmer?.farmerId) {

      setLoading(false);

      return;

    }


    loadQueue();


    const interval = setInterval(() => {

      loadQueue();

    }, 10000);


    return () => {

      clearInterval(interval);

    };

  }, [
    farmer?.farmerId,
    loadQueue
  ]);


  /*
   * Format booking date
   */

  function formatDate(date) {

    if (!date) {
      return t('notAvailable');
    }

    return new Date(date).toLocaleDateString(
      language === 'bn' ? 'bn-IN' : 'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  /*
   * Loading
   */

  if (loading) {

    return (
      <div>

        <Navbar />

        <main className="queue-page">

          <div className="queue-container">

            <div className="queue-loading">

              {t('loadingQueue')}

            </div>

          </div>

        </main>

      </div>
    );

  }


  return (
    <div>

      <Navbar />


      <main className="queue-page">

        <div className="queue-container">


          {/* PAGE HEADER */}

          <section className="queue-header">

            <span className="queue-eyebrow">
              {t('liveQueue')}
            </span>

            <h1>
              {t('myQueue')}
            </h1>

            <p>
              {t('trackQueuePosition')}
            </p>

          </section>


          {/* ERROR */}

          {error && (

            <div className="queue-error">

              {error}

            </div>

          )}


          {/* =========================
              LIVE QUEUE
          ========================== */}

          {!error && queue && booking && (

            <section className="queue-main-card">


              {/* TOP */}

              <div className="queue-card-top">

                <div>

                  <span className="queue-token-label">
                    {t('yourToken')}
                  </span>

                  <h2 className="queue-token">

                    {queue.token_number ||
                      booking.token_number}

                  </h2>

                </div>


                <div className="queue-status">

                  <span className="queue-status-dot"></span>

                  {queue.status}

                </div>

              </div>


              {/* STATS */}

              <div className="queue-stats">


                <div className="queue-stat">

                  <span className="queue-stat__label">
                    {t('queuePosition')}
                  </span>

                  <h3 className="queue-stat__value">

                    #{queue.queue_position}

                  </h3>

                </div>


                <div className="queue-stat">

                  <span className="queue-stat__label">
                    {t('peopleAhead')}
                  </span>

                  <h3 className="queue-stat__value">

                    {queue.people_ahead}

                  </h3>

                </div>


                <div className="queue-stat">

                  <span className="queue-stat__label">
                    {t('currentStatus')}
                  </span>

                  <h3 className="queue-stat__value">

                    {queue.status}

                  </h3>

                </div>


              </div>


              {/* DETAILS */}

              <div className="queue-details">


                <div className="queue-detail">

                  <div className="queue-detail__icon">
                    📍
                  </div>

                  <div>

                    <span className="queue-detail__label">
                      {t('procurementCentre')}
                    </span>

                    <p className="queue-detail__value">

                      {booking.centre_name}

                    </p>

                  </div>

                </div>


                <div className="queue-detail">

                  <div className="queue-detail__icon">
                    🌾
                  </div>

                  <div>

                    <span className="queue-detail__label">
                      {t('crop')}
                    </span>

                    <p className="queue-detail__value">

                      {booking.crop_name}

                      {' • '}

                      {booking.variety}

                    </p>

                  </div>

                </div>


                <div className="queue-detail">

                  <div className="queue-detail__icon">
                    📅
                  </div>

                  <div>

                    <span className="queue-detail__label">
                      {t('bookingDate')}
                    </span>

                    <p className="queue-detail__value">

                      {formatDate(booking.booking_date)}

                    </p>

                  </div>

                </div>


                {booking.slot_time && (

                  <div className="queue-detail">

                    <div className="queue-detail__icon">
                      🕐
                    </div>

                    <div>

                      <span className="queue-detail__label">
                        {t('slotTime')}
                      </span>

                      <p className="queue-detail__value">

                        {booking.slot_time}

                      </p>

                    </div>

                  </div>

                )}


                {/* ETA */}

                <div className="queue-eta">

                  <div className="queue-eta__icon">
                    ⏱️
                  </div>

                  <div className="queue-eta__content">

                    <span className="queue-eta__label">
                      {t('estimatedWaitingTime')}
                    </span>

                    <p className="queue-eta__value">

                      {queue.estimated_wait_minutes === 0 ||
                      queue.people_ahead === 0

                        ? t('youAreNextReady')

                        : `${queue.estimated_wait_minutes} ${t('minutesApproximately')}`

                      }

                    </p>

                  </div>

                </div>


                {/* ESTIMATED TURN */}

                {queue.estimated_turn_time && (

                  <div className="queue-eta">

                    <div className="queue-eta__icon">
                      🕐
                    </div>

                    <div className="queue-eta__content">

                      <span className="queue-eta__label">
                        {t('estimatedTurn')}
                      </span>

                      <p className="queue-eta__value">

                        {queue.estimated_turn_time}

                      </p>

                    </div>

                  </div>

                )}


              </div>


              {/* PROGRESS */}

              <div className="queue-progress">


                <div className="queue-progress__header">

                  <h3 className="queue-progress__title">
                    {t('queueProgress')}
                  </h3>

                  <p className="queue-progress__text">

                    {queue.people_ahead === 0

                      ? t('youAreNextInLine')

                      : t(
                          'peopleAheadOfYou',
                          {
                            count: queue.people_ahead
                          }
                        )

                    }

                  </p>

                </div>


                <div className="queue-progress__bar">

                  <div
                    className="queue-progress__fill"
                    style={{
                      width:
                        queue.queue_position === 1
                          ? '100%'
                          : '35%'
                    }}
                  ></div>

                </div>


              </div>


            </section>

          )}


          {/* =========================
              NO ACTIVE QUEUE
          ========================== */}

          {!error &&
          !booking &&
          history.length === 0 && (

            <section className="queue-empty">

              <div className="queue-empty__icon">
                🌾
              </div>

              <h2>
                {t('noActiveQueue')}
              </h2>

              <p>
                {t('noApprovedBookingLiveQueue')}
              </p>

            </section>

          )}


          {/* =========================
              QUEUE HISTORY
          ========================== */}

          {!error && history.length > 0 && (

            <section className="queue-history">


              <div className="queue-history__header">

                <div>

                  <span className="queue-eyebrow">
                    {t('pastQueueActivity')}
                  </span>

                  <h2>
                    {t('queueHistory')}
                  </h2>

                </div>


                <span className="queue-history__count">

                  {history.length}{' '}

                  {history.length === 1
                    ? t('record')
                    : t('records')
                  }

                </span>

              </div>


              <div className="queue-history__list">


                {history.map((item) => (

                  <div
                    className="queue-history-card"
                    key={item.booking_id}
                  >


                    <div className="queue-history-card__left">

                      <div className="queue-history-token">

                        {item.token_number ||
                          t('noToken')}

                      </div>


                      <div className="queue-history-info">

                        <h3>

                          {item.crop_name}

                          {item.variety && (
                            <>
                              {' • '}
                              {item.variety}
                            </>
                          )}

                        </h3>


                        <p>

                          {item.centre_name}

                        </p>


                        <span>

                          {formatDate(item.booking_date)}

                        </span>

                      </div>

                    </div>


                    <div className="queue-history-card__right">


                      <span
                        className={
                          item.status === 'COMPLETED'
                            ? 'queue-history-status queue-history-status--completed'
                            : 'queue-history-status queue-history-status--rejected'
                        }
                      >

                        {item.status}

                      </span>


                      {item.slot_time && (

                        <span className="queue-history-time">

                          🕐 {item.slot_time}

                        </span>

                      )}


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


export default Queue;