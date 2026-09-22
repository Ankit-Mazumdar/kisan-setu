import React, { useEffect, useState } from 'react';

import api from '../../services/authService';
import OfficerNavbar from '../../components/OfficerNavbar.jsx';

import './OfficerDashboard.css';


function OfficerDashboard() {

  const [selectedCentre, setSelectedCentre] = useState('');
  const [officer, setOfficer] = useState(null);

  // ================================
  // QUEUES
  // ================================

  const [queue, setQueue] = useState([]);
  const [upcomingQueue, setUpcomingQueue] = useState([]);
  const [procurementHistory, setProcurementHistory] = useState([]);

  // ================================
  // NO-SHOW HISTORY
  // ================================

  const [noShowHistory, setNoShowHistory] = useState([]);
  const [noShowLoading, setNoShowLoading] = useState(false);

  // ================================
  // CROP PRICES
  // ================================

  const [cropPrices, setCropPrices] = useState([]);
  const [currentCropPrice, setCurrentCropPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // ================================
  // LOADING
  // ================================

  const [loading, setLoading] = useState(true);
  const [queueLoading, setQueueLoading] = useState(false);
  const [upcomingLoading, setUpcomingLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [updatingId, setUpdatingId] = useState(null);
  const [noShowId, setNoShowId] = useState(null);

  const [error, setError] = useState('');

  // ================================
  // TOKEN VERIFICATION
  // ================================

  const [tokenNumber, setTokenNumber] = useState('');
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [verifiedBooking, setVerifiedBooking] = useState(null);

  // ================================
  // PROCUREMENT FORM
  // ================================

  const [showProcurementForm, setShowProcurementForm] =
    useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [quantity, setQuantity] = useState('');
  const [quality, setQuality] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');

  const [savingProcurement, setSavingProcurement] =
    useState(false);


  // ================================
  // LOAD OFFICER SESSION
  // ================================

  useEffect(() => {

    async function loadOfficerSession() {

      const session = localStorage.getItem(
        'kisansetu_officer_session'
      );

      if (!session) {

        window.location.href = '/officer/login';

        return;

      }

      try {

        const officerData = JSON.parse(session);

        const response = await api.get(
          `/officer/${officerData.officer_id}/status/`
        );

        if (response.data.status !== 'ACTIVE') {

          localStorage.removeItem(
            'kisansetu_officer_session'
          );

          alert(
            'Your officer account has been deactivated by the authority. Please contact the administrator for assistance.'
          );

          window.location.href =
            '/officer/login';

          return;

        }

        setOfficer(officerData);

        /*
         * Keep the assigned centre as a number-like string.
         * This value is later sent to the backend as centre_id.
         */
        if (officerData.centre_id !== undefined &&
            officerData.centre_id !== null) {

          setSelectedCentre(
            String(officerData.centre_id)
          );

        } else {

          setError(
            'Assigned centre is missing from the officer session.'
          );

        }

      } catch (error) {

        console.error(
          'Officer session error:',
          error
        );

        if (
          error.response?.status === 404
        ) {

          localStorage.removeItem(
            'kisansetu_officer_session'
          );

          window.location.href =
            '/officer/login';

          return;

        }

        setError(
          error.response?.data?.message ||
          'Unable to verify officer account.'
        );

      } finally {

        setLoading(false);

      }

    }

    loadOfficerSession();

  }, []);


  // ================================
  // PERIODIC OFFICER STATUS CHECK
  // ================================

  useEffect(() => {

    if (!officer?.officer_id) {
      return;
    }

    const statusInterval = setInterval(
      async () => {

        try {

          const response = await api.get(
            `/officer/${officer.officer_id}/status/`
          );

          if (
            response.data.status !== 'ACTIVE'
          ) {

            clearInterval(statusInterval);

            localStorage.removeItem(
              'kisansetu_officer_session'
            );

            alert(
              'Your officer account has been deactivated by the authority. Please contact the administrator for assistance.'
            );

            window.location.href =
              '/officer/login';

          }

        } catch (error) {

          console.error(
            'Officer status check error:',
            error
          );

        }

      },
      30000
    );

    return () => {
      clearInterval(statusInterval);
    };

  }, [officer?.officer_id]);


  // ================================
  // LOAD DASHBOARD DATA
  // ================================

  useEffect(() => {

    if (!selectedCentre) {
      return;
    }

    loadQueue();
    loadUpcomingQueue();
    loadProcurementHistory();
    loadNoShowHistory();
    loadCropPrices();

  }, [selectedCentre]);


  // ================================
  // LOAD LIVE QUEUE
  // ================================

  async function loadQueue() {

    if (!selectedCentre) {
      return;
    }

    setQueueLoading(true);

    try {

      const response = await api.get(
        `/centre/${selectedCentre}/queue/`
      );

      setQueue(
        Array.isArray(response.data)
          ? response.data
          : []
      );

      setError('');

    } catch (error) {

      console.error(
        'Queue loading error:',
        error
      );

      console.error(
        'Backend response:',
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        'Unable to load centre queue.'
      );

    } finally {

      setQueueLoading(false);

    }

  }


  // ================================
  // LOAD UPCOMING QUEUE
  // ================================

  async function loadUpcomingQueue() {

    if (!selectedCentre) {
      return;
    }

    setUpcomingLoading(true);

    try {

      const response = await api.get(
        `/centre/${selectedCentre}/upcoming-queue/`
      );

      setUpcomingQueue(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        'Upcoming queue loading error:',
        error
      );

      setUpcomingQueue([]);

    } finally {

      setUpcomingLoading(false);

    }

  }


  // ================================
  // LOAD PROCUREMENT HISTORY
  // ================================

  async function loadProcurementHistory() {

    if (!selectedCentre) {
      return;
    }

    setHistoryLoading(true);

    try {

      const response = await api.get(
        `/centre/${selectedCentre}/procurement-history/`
      );

      setProcurementHistory(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        'Procurement history loading error:',
        error
      );

      setProcurementHistory([]);

    } finally {

      setHistoryLoading(false);

    }

  }


  // ================================
  // LOAD NO-SHOW HISTORY
  // ================================

  async function loadNoShowHistory() {

    if (!selectedCentre) {
      return;
    }

    setNoShowLoading(true);

    try {

      const response = await api.get(
        `/centre/${selectedCentre}/no-show-history/`
      );

      setNoShowHistory(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        'No-show history loading error:',
        error
      );

      setNoShowHistory([]);

    } finally {

      setNoShowLoading(false);

    }

  }


  // ================================
  // LOAD CROP PRICES
  // ================================

  async function loadCropPrices() {

    if (!selectedCentre) {
      return;
    }

    setPriceLoading(true);

    try {

      const response = await api.get(
        '/crop-prices/'
      );

      const prices =
        Array.isArray(response.data)
          ? response.data
          : [];

      setCropPrices(prices);

    } catch (error) {

      console.error(
        'Crop price loading error:',
        error
      );

      setCropPrices([]);

    } finally {

      setPriceLoading(false);

    }

  }


  // ================================
  // FIND CURRENT CROP PRICE
  // ================================

  function getCurrentCropPrice(booking) {

    if (!booking || !selectedCentre) {
      return null;
    }

    const bookingCropId =
      Number(booking.crop);

    const centreId =
      Number(selectedCentre);

    const matchingPrice =
      cropPrices.find(
        (price) =>
          Number(price.crop) === bookingCropId &&
          Number(price.centre) === centreId
      );

    return matchingPrice || null;

  }


  // ================================
  // REFRESH EVERYTHING
  // ================================

  async function refreshDashboard() {

    await Promise.all([
      loadQueue(),
      loadUpcomingQueue(),
      loadProcurementHistory(),
      loadNoShowHistory(),
      loadCropPrices()
    ]);

  }


  // ================================
  // VERIFY FARMER TOKEN
  // ================================

  async function verifyFarmerToken() {

    /*
     * Remove accidental spaces and make token uppercase.
     * Example:
     * " ks-6-20260922-1 "
     * becomes
     * "KS-6-20260922-1"
     */
    const cleanToken =
      tokenNumber.trim().toUpperCase();

    if (!cleanToken) {

      setError(
        'Please enter a farmer token number.'
      );

      return;

    }

    if (!selectedCentre) {

      setError(
        'Assigned centre could not be identified.'
      );

      return;

    }

    const centreId =
      Number(selectedCentre);

    if (!Number.isInteger(centreId) ||
        centreId <= 0) {

      setError(
        'Invalid assigned centre ID.'
      );

      console.error(
        'Invalid selectedCentre:',
        selectedCentre
      );

      return;

    }

    setVerifyingToken(true);
    setVerifiedBooking(null);
    setError('');

    console.log(
      'VERIFY TOKEN REQUEST:',
      {
        token_number: cleanToken,
        centre_id: centreId
      }
    );

    try {

      const response = await api.post(
        '/officer/verify-token/',
        {
          token_number: cleanToken,
          centre_id: centreId
        }
      );

      console.log(
        'VERIFY TOKEN RESPONSE:',
        response.data
      );

      const booking =
        response.data?.booking;

      if (!booking) {

        setError(
          'Token was accepted, but booking details were not returned by the server.'
        );

        return;

      }

      setVerifiedBooking(booking);

      setTokenNumber('');

      /*
       * Refresh the live queue.
       * The booking should now be IN_PROGRESS.
       */
      await loadQueue();

      /*
       * Clear any old error.
       */
      setError('');

    } catch (error) {

      console.error(
        'Token verification error:',
        error
      );

      console.error(
        'Backend status:',
        error.response?.status
      );

      console.error(
        'Backend response:',
        error.response?.data
      );

      console.error(
        'Request URL:',
        error.config?.url
      );

      console.error(
        'Request data:',
        error.config?.data
      );

      setVerifiedBooking(null);

      /*
       * Show the actual backend message whenever
       * Django provides one.
       */
      if (error.response) {

        const backendMessage =
          error.response.data?.message;

        if (backendMessage) {

          setError(
            backendMessage
          );

        } else if (
          error.response.status === 404
        ) {

          setError(
            'Token verification endpoint or token was not found. Please check the backend URL and token.'
          );

        } else if (
          error.response.status === 400
        ) {

          setError(
            'The token request was rejected by the server. Check the token and assigned centre.'
          );

        } else if (
          error.response.status === 500
        ) {

          setError(
            'Server error while verifying the token. Check the Django terminal for the exact error.'
          );

        } else {

          setError(
            `Unable to verify token. Server returned status ${error.response.status}.`
          );

        }

      } else if (error.request) {

        setError(
          'No response received from the server. Please check whether the Django backend is running.'
        );

      } else {

        setError(
          error.message ||
          'Unable to verify token.'
        );

      }

    } finally {

      setVerifyingToken(false);

    }

  }


  // ================================
  // CLEAR VERIFIED TOKEN
  // ================================

  function clearVerifiedBooking() {

    setVerifiedBooking(null);
    setTokenNumber('');
    setError('');

  }


  // ================================
  // UPDATE BOOKING STATUS
  // ================================

  async function updateStatus(
    bookingId,
    newStatus
  ) {

    setUpdatingId(bookingId);

    try {

      await api.put(
        `/bookings/${bookingId}/status/`,
        {
          status: newStatus
        }
      );

      await loadQueue();

      await loadNoShowHistory();

      setError('');

    } catch (error) {

      console.error(
        'Status update error:',
        error
      );

      console.error(
        'Backend response:',
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        'Unable to update booking status.'
      );

    } finally {

      setUpdatingId(null);

    }

  }


  // ================================
  // CHECK NO-SHOW ELIGIBILITY
  // ================================

  function canMarkNoShow(booking) {

    if (!booking) {
      return false;
    }

    if (booking.status !== 'CONFIRMED') {
      return false;
    }

    if (
      !booking.booking_date ||
      !booking.slot_time
    ) {
      return false;
    }

    const bookingDate =
      booking.booking_date;

    const slotTime =
      booking.slot_time.slice(0, 5);

    const scheduledTime =
      new Date(
        `${bookingDate}T${slotTime}:00`
      );

    const gracePeriod =
      15 * 60 * 1000;

    const noShowAvailableAt =
      new Date(
        scheduledTime.getTime() +
        gracePeriod
      );

    return new Date() >= noShowAvailableAt;

  }


  // ================================
  // MARK BOOKING AS NO-SHOW
  // ================================

  async function markNoShow(booking) {

    if (!booking) {
      return;
    }

    if (!canMarkNoShow(booking)) {

      alert(
        'This booking cannot be marked as no-show yet. The 15-minute grace period has not ended.'
      );

      return;

    }

    const confirmed =
      window.confirm(
        `Mark ${booking.farmer_name}'s booking as NO-SHOW?\n\n` +
        `Token: ${booking.token_number}\n` +
        `Crop: ${booking.crop_name}\n\n` +
        `The farmer will be notified.`
      );

    if (!confirmed) {
      return;
    }

    setNoShowId(
      booking.booking_id
    );

    try {

      await api.post(
        `/officer/bookings/${booking.booking_id}/no-show/`
      );

      setError('');

      await loadQueue();
      await loadUpcomingQueue();
      await loadNoShowHistory();

    } catch (error) {

      console.error(
        'No-show update error:',
        error
      );

      console.error(
        'Backend response:',
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        'Unable to mark booking as no-show.'
      );

    } finally {

      setNoShowId(null);

    }

  }


  // ================================
  // OPEN PROCUREMENT FORM
  // ================================

  function openProcurementForm(booking) {

    setSelectedBooking(booking);

    setQuantity('');
    setQuality('');

    const price =
      getCurrentCropPrice(booking);

    if (price) {

      setCurrentCropPrice(price);

      setPricePerUnit(
        String(price.price_per_kg)
      );

    } else {

      setCurrentCropPrice(null);
      setPricePerUnit('');

    }

    setShowProcurementForm(true);

  }


  // ================================
  // CLOSE PROCUREMENT FORM
  // ================================

  function closeProcurementForm() {

    setShowProcurementForm(false);

    setSelectedBooking(null);

    setCurrentCropPrice(null);

    setQuantity('');
    setQuality('');
    setPricePerUnit('');

  }


  // ================================
  // SAVE PROCUREMENT
  // ================================

  async function handleSaveProcurement() {

    if (!selectedBooking) {

      alert(
        'No booking selected.'
      );

      return;

    }

    if (!quantity || !quality) {

      alert(
        'Please enter quantity and select quality.'
      );

      return;

    }

    if (Number(quantity) <= 0) {

      alert(
        'Quantity must be greater than 0 kg.'
      );

      return;

    }

    if (!pricePerUnit) {

      alert(
        'Current crop price is not available.'
      );

      return;

    }

    if (Number(pricePerUnit) <= 0) {

      alert(
        'Current crop price must be greater than 0.'
      );

      return;

    }

    try {

      setSavingProcurement(true);

      await api.post(
        '/procurement/',
        {
          booking:
            selectedBooking.booking_id,

          quantity:
            Number(quantity),

          quality:
            quality,

          price_per_unit:
            Number(pricePerUnit)
        }
      );

      alert(
        'Procurement completed successfully.'
      );

      closeProcurementForm();

      await refreshDashboard();

    } catch (error) {

      console.error(
        'Procurement error:',
        error
      );

      console.error(
        'Backend response:',
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        'Unable to complete procurement.'
      );

    } finally {

      setSavingProcurement(false);

    }

  }


  // ================================
  // GROUP DATA BY DATE
  // ================================

  function groupByDate(
    items,
    dateField
  ) {

    return items.reduce(
      (groups, item) => {

        const date =
          item[dateField];

        if (!date) {
          return groups;
        }

        if (!groups[date]) {
          groups[date] = [];
        }

        groups[date].push(item);

        return groups;

      },
      {}
    );

  }


  // ================================
  // DATE FORMAT
  // ================================

  function formatDate(dateString) {

    if (!dateString) {
      return '-';
    }

    const date =
      new Date(
        `${dateString}T00:00:00`
      );

    return date.toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    );

  }


  // ================================
  // TIME FORMAT
  // ================================

  function formatTime(timeString) {

    if (!timeString) {
      return '-';
    }

    const [
      hours,
      minutes
    ] =
      timeString.split(':');

    const date =
      new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString(
      'en-IN',
      {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }
    );

  }


  // ================================
  // GROUPED DATA
  // ================================

  const upcomingGrouped =
    groupByDate(
      upcomingQueue,
      'booking_date'
    );

  const historyGrouped =
    groupByDate(
      procurementHistory,
      'booking_date'
    );

  const noShowGrouped =
    groupByDate(
      noShowHistory,
      'booking_date'
    );


  const upcomingDates =
    Object.keys(
      upcomingGrouped
    ).sort();


  const historyDates =
    Object.keys(
      historyGrouped
    ).sort(
      (a, b) =>
        new Date(b) -
        new Date(a)
    );


  const noShowDates =
    Object.keys(
      noShowGrouped
    ).sort(
      (a, b) =>
        new Date(b) -
        new Date(a)
    );


  // ================================
  // COUNTS
  // ================================

  const waitingCount =
    queue.filter(
      (booking) =>
        booking.status === 'CONFIRMED'
    ).length;


  const processingCount =
    queue.filter(
      (booking) =>
        booking.status === 'IN_PROGRESS'
    ).length;


  // ================================
  // TOTAL PROCUREMENT AMOUNT
  // ================================

  const totalAmount =
    Number(quantity || 0) *
    Number(pricePerUnit || 0);


  // ================================
  // LOADING SCREEN
  // ================================

  if (loading) {

    return (

      <div className="officer-dashboard">

        <OfficerNavbar />

        <main className="officer-page">

          <div className="officer-container">

            <div className="officer-loading">
              Loading officer dashboard...
            </div>

          </div>

        </main>

      </div>

    );

  }


  // ================================
  // UI
  // ================================

  return (

    <div className="officer-dashboard">

      <OfficerNavbar />


      <main className="officer-page">

        <div className="officer-container">


          {/* ================================
              HEADER
          ================================= */}

          <section className="officer-header">

            <div>

              <span className="officer-eyebrow">
                PROCUREMENT OFFICER
              </span>

              <h1>
                Officer Dashboard
              </h1>

              <p>
                Manage today's farmer queue and
                procurement activity.
              </p>

            </div>


            <div className="officer-header-badge">

              <span className="officer-header-badge__icon">
                🌾
              </span>

              <div>

                <strong>
                  KisanSetu
                </strong>

                <small>
                  Procurement Management
                </small>

              </div>

            </div>

          </section>


          {/* ================================
              ASSIGNED CENTRE
          ================================= */}

          <section className="centre-selector-card">

            <div className="centre-selector-card__left">

              <div className="centre-selector-icon">
                📍
              </div>

              <div>

                <span className="section-label">
                  ASSIGNED CENTRE
                </span>

                <h2>
                  {officer?.centre_name ||
                    'Loading centre...'}
                </h2>

                <small>
                  Centre ID: {
                    officer?.centre_id || '-'
                  }
                </small>

              </div>

            </div>


            <div className="assigned-centre-badge">
              ACTIVE
            </div>

          </section>


          {/* ================================
              VERIFY TOKEN
          ================================= */}

          <section className="token-verification-card">

            <div className="token-verification-header">

              <div className="token-verification-icon">
                🎫
              </div>

              <div>

                <span className="section-label">
                  FARMER ARRIVAL
                </span>

                <h2>
                  Verify Farmer Token
                </h2>

                <p>
                  Enter the token shown by the farmer
                  to verify their booking and start
                  procurement.
                </p>

              </div>

            </div>


            <div className="token-verification-form">

              <div className="token-input-wrapper">

                <span className="token-input-icon">
                  #
                </span>

                <input
                  type="text"
                  value={tokenNumber}
                  onChange={(e) => {

                    setTokenNumber(
                      e.target.value
                    );

                    if (error) {
                      setError('');
                    }

                  }}
                  onKeyDown={(e) => {

                    if (
                      e.key === 'Enter'
                    ) {

                      verifyFarmerToken();

                    }

                  }}
                  placeholder="Enter token number"
                  autoComplete="off"
                />

              </div>


              <button
                type="button"
                className="verify-token-button"
                onClick={
                  verifyFarmerToken
                }
                disabled={
                  verifyingToken ||
                  !tokenNumber.trim()
                }
              >

                {verifyingToken
                  ? 'Verifying...'
                  : 'Verify Token'}

              </button>

            </div>


            {verifiedBooking && (

              <div className="verified-booking-card">

                <div className="verified-booking-success">

                  <span>
                    ✓
                  </span>

                  <div>

                    <strong>
                      Token Verified Successfully
                    </strong>

                    <small>
                      Procurement can now begin.
                    </small>

                  </div>

                </div>


                <div className="verified-booking-grid">

                  <div>

                    <span>
                      FARMER
                    </span>

                    <strong>
                      {verifiedBooking.farmer_name}
                    </strong>

                  </div>


                  <div>

                    <span>
                      TOKEN
                    </span>

                    <strong>
                      {verifiedBooking.token_number}
                    </strong>

                  </div>


                  <div>

                    <span>
                      CROP
                    </span>

                    <strong>
                      {verifiedBooking.crop_name}
                    </strong>

                  </div>


                  <div>

                    <span>
                      VARIETY
                    </span>

                    <strong>
                      {verifiedBooking.crop_variety ||
                        '-'}
                    </strong>

                  </div>


                  <div>

                    <span>
                      SLOT
                    </span>

                    <strong>
                      {formatTime(
                        verifiedBooking.slot_time
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      STATUS
                    </span>

                    <strong className="verified-status">
                      {verifiedBooking.status}
                    </strong>

                  </div>

                </div>


                <button
                  type="button"
                  className="verified-close-button"
                  onClick={
                    clearVerifiedBooking
                  }
                >
                  Clear Verification
                </button>

              </div>

            )}

          </section>


          {/* ================================
              ERROR
          ================================= */}

          {error && (

            <div className="officer-error">
              {error}
            </div>

          )}


          {/* ================================
              STATISTICS
          ================================= */}

          <section className="officer-stats">

            <div className="officer-stat-card">

              <div className="officer-stat-card__icon">
                🎫
              </div>

              <div>

                <span>
                  ACTIVE QUEUE
                </span>

                <strong>
                  {queue.length}
                </strong>

              </div>

            </div>


            <div className="officer-stat-card">

              <div className="officer-stat-card__icon">
                ⏳
              </div>

              <div>

                <span>
                  WAITING
                </span>

                <strong>
                  {waitingCount}
                </strong>

              </div>

            </div>


            <div className="officer-stat-card">

              <div className="officer-stat-card__icon">
                ⚙️
              </div>

              <div>

                <span>
                  IN PROGRESS
                </span>

                <strong>
                  {processingCount}
                </strong>

              </div>

            </div>

          </section>


          {/* ================================
              LIVE QUEUE
          ================================= */}

          <section className="officer-queue-section">

            <div className="officer-section-header">

              <div>

                <span className="section-label">
                  LIVE QUEUE
                </span>

                <h2>
                  Today's Procurement Queue
                </h2>

              </div>


              <button
                className="refresh-button"
                onClick={loadQueue}
                disabled={queueLoading}
              >

                ↻

                <span>
                  {queueLoading
                    ? 'Refreshing...'
                    : 'Refresh'}
                </span>

              </button>

            </div>


            {queueLoading && (

              <div className="officer-loading">
                Loading queue...
              </div>

            )}


            {!queueLoading &&
              queue.length === 0 && (

              <div className="officer-empty">

                <div className="officer-empty__icon">
                  🎫
                </div>

                <h3>
                  Queue is empty
                </h3>

                <p>
                  There are no active bookings
                  for this centre today.
                </p>

              </div>

            )}


            {!queueLoading &&
              queue.length > 0 && (

              <div className="queue-table-wrapper">

                <table className="queue-table">

                  <thead>

                    <tr>

                      <th>POSITION</th>
                      <th>TOKEN</th>
                      <th>FARMER</th>
                      <th>CROP</th>
                      <th>TIME</th>
                      <th>STATUS</th>
                      <th>ACTION</th>

                    </tr>

                  </thead>


                  <tbody>

                    {queue.map(
                      (booking, index) => (

                      <tr
                        key={
                          booking.booking_id
                        }
                      >

                        <td>

                          <span className="queue-position">
                            #{index + 1}
                          </span>

                        </td>


                        <td>

                          <strong className="queue-token">
                            {booking.token_number}
                          </strong>

                        </td>


                        <td>

                          <div className="farmer-cell">

                            <strong>
                              {booking.farmer_name}
                            </strong>

                            <span>
                              Govt ID: {
                                booking.farmer_govt_id ||
                                'Not provided'
                              }
                            </span>

                          </div>

                        </td>


                        <td>

                          <div className="crop-cell">

                            <strong>
                              {booking.crop_name}
                            </strong>

                            <span>
                              {booking.variety}
                            </span>

                          </div>

                        </td>


                        <td>

                          <span className="queue-time">
                            {booking.live_time ||
                              formatTime(
                                booking.slot_time
                              )}
                          </span>

                        </td>


                        <td>

                          <span
                            className={`status-badge ${
                              booking.status ===
                              'IN_PROGRESS'
                                ? 'status-badge--progress'
                                : booking.status ===
                                  'NO_SHOW'
                                  ? 'status-badge--no-show'
                                  : 'status-badge--booked'
                            }`}
                          >

                            <span className="status-dot"></span>

                            {booking.status}

                          </span>

                        </td>


                        <td>

                          {/* CONFIRMED BOOKING */}

                          {booking.status ===
                            'CONFIRMED' && (

                            <div className="queue-action-group">

                              <button
                                className="action-button action-button--verify"
                                onClick={() => {

                                  setTokenNumber(
                                    booking.token_number
                                  );

                                  setError('');

                                  window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                  });

                                }}
                              >

                                Verify Token

                              </button>


                              <button
                                className="action-button action-button--no-show"
                                onClick={() =>
                                  markNoShow(
                                    booking
                                  )
                                }
                                disabled={
                                  !canMarkNoShow(
                                    booking
                                  ) ||
                                  noShowId ===
                                    booking.booking_id
                                }
                                title={
                                  canMarkNoShow(
                                    booking
                                  )
                                    ? 'Mark farmer as no-show'
                                    : 'Available after the 15-minute grace period'
                                }
                              >

                                {noShowId ===
                                booking.booking_id
                                  ? 'Marking...'
                                  : 'Mark No-Show'}

                              </button>

                            </div>

                          )}


                          {/* IN PROGRESS */}

                          {booking.status ===
                            'IN_PROGRESS' && (

                            <button
                              className="action-button action-button--complete"
                              onClick={() =>
                                openProcurementForm(
                                  booking
                                )
                              }
                            >

                              Complete Procurement

                            </button>

                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>


          {/* ================================
              UPCOMING QUEUE
          ================================= */}

          <section className="officer-data-section">

            <div className="officer-section-header">

              <div>

                <span className="section-label">
                  UPCOMING QUEUE
                </span>

                <h2>
                  Future Confirmed Bookings
                </h2>

              </div>

              <button
                className="refresh-button"
                onClick={loadUpcomingQueue}
                disabled={upcomingLoading}
              >

                ↻

                <span>
                  {upcomingLoading
                    ? 'Refreshing...'
                    : 'Refresh'}
                </span>

              </button>

            </div>


            {upcomingLoading && (

              <div className="officer-loading">
                Loading upcoming queue...
              </div>

            )}


            {!upcomingLoading &&
              upcomingDates.length === 0 && (

              <div className="officer-empty">

                <div className="officer-empty__icon">
                  📅
                </div>

                <h3>
                  No Upcoming Bookings
                </h3>

                <p>
                  There are no confirmed future
                  bookings for this centre.
                </p>

              </div>

            )}


            {!upcomingLoading &&
              upcomingDates.length > 0 && (

              <div className="grouped-list">

                {upcomingDates.map((date) => (

                  <div
                    className="date-group"
                    key={date}
                  >

                    <div className="date-group-header">

                      <div className="date-group-icon">
                        📅
                      </div>

                      <div>

                        <span>
                          BOOKING DATE
                        </span>

                        <h3>
                          {formatDate(date)}
                        </h3>

                      </div>

                    </div>


                    <div className="upcoming-list">

                      {upcomingGrouped[date].map((booking) => (

                        <div
                          className="upcoming-item"
                          key={booking.booking_id}
                        >

                          <div className="upcoming-time">

                            <strong>
                              {formatTime(
                                booking.slot_time
                              )}
                            </strong>

                          </div>


                          <div className="upcoming-main">

                            <div className="upcoming-farmer">

                              <strong>
                                {booking.farmer_name}
                              </strong>

                              <span>
                                Govt ID: {
                                  booking.farmer_govt_id ||
                                  'Not provided'
                                }
                              </span>

                            </div>


                            <div className="upcoming-crop">

                              <strong>
                                {booking.crop_name}
                              </strong>

                              <span>
                                {booking.variety}
                              </span>

                            </div>

                          </div>


                          <div className="upcoming-token">

                            <span>
                              TOKEN
                            </span>

                            <strong>
                              {booking.token_number}
                            </strong>

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* ================================
              PROCUREMENT HISTORY
          ================================= */}

          <section className="officer-data-section">

            <div className="officer-section-header">

              <div>

                <span className="section-label">
                  PROCUREMENT HISTORY
                </span>

                <h2>
                  Completed Procurements
                </h2>

              </div>


              <button
                className="refresh-button"
                onClick={loadProcurementHistory}
                disabled={historyLoading}
              >

                ↻

                <span>
                  {historyLoading
                    ? 'Refreshing...'
                    : 'Refresh'}
                </span>

              </button>

            </div>


            {historyLoading && (

              <div className="officer-loading">
                Loading procurement history...
              </div>

            )}


            {!historyLoading &&
              historyDates.length === 0 && (

              <div className="officer-empty">

                <div className="officer-empty__icon">
                  📦
                </div>

                <h3>
                  No Procurement History
                </h3>

                <p>
                  Completed procurements will
                  appear here.
                </p>

              </div>

            )}


            {!historyLoading &&
              historyDates.length > 0 && (

              <div className="grouped-list">

                {historyDates.map(
                  (date) => (

                  <div
                    className="date-group"
                    key={date}
                  >

                    <div className="date-group-header">

                      <div className="date-group-icon">
                        📦
                      </div>

                      <div>

                        <span>
                          PROCUREMENT DATE
                        </span>

                        <h3>
                          {formatDate(date)}
                        </h3>

                      </div>

                    </div>


                    <div className="history-table-wrapper">

                      <table className="history-table">

                        <thead>

                          <tr>

                            <th>TOKEN</th>
                            <th>FARMER</th>
                            <th>CROP</th>
                            <th>QUANTITY</th>
                            <th>PRICE / KG</th>
                            <th>TOTAL</th>
                            <th>QUALITY</th>

                          </tr>

                        </thead>


                        <tbody>

                          {historyGrouped[date].map(
                            (item) => (

                            <tr
                              key={
                                item.procurement_id
                              }
                            >

                              <td>

                                <strong className="queue-token">
                                  {item.token_number}
                                </strong>

                              </td>


                              <td>

                                <div className="history-farmer">

                                  <strong>
                                    {item.farmer_name}
                                  </strong>

                                  <span>
                                    Govt ID: {
                                      item.farmer_govt_id ||
                                      'Not provided'
                                    }
                                  </span>

                                </div>

                              </td>


                              <td>

                                <div className="crop-cell">

                                  <strong>
                                    {item.crop_name}
                                  </strong>

                                  <span>
                                    {item.variety}
                                  </span>

                                </div>

                              </td>


                              <td>

                                <strong className="quantity-kg">

                                  {Number(
                                    item.quantity
                                  ).toLocaleString(
                                    'en-IN'
                                  )} kg

                                </strong>

                              </td>


                              <td>

                                <strong className="price-kg">

                                  ₹
                                  {Number(
                                    item.price_per_kg
                                  ).toLocaleString(
                                    'en-IN',
                                    {
                                      minimumFractionDigits: 2
                                    }
                                  )}

                                </strong>

                              </td>


                              <td>

                                <strong className="history-total">

                                  ₹
                                  {Number(
                                    item.total_amount
                                  ).toLocaleString(
                                    'en-IN',
                                    {
                                      minimumFractionDigits: 2
                                    }
                                  )}

                                </strong>

                              </td>


                              <td>

                                <span className="quality-badge">
                                  {item.quality || '-'}
                                </span>

                              </td>

                            </tr>

                          ))}

                        </tbody>

                      </table>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* ================================
              NO-SHOW HISTORY
          ================================= */}

          <section className="officer-data-section">

            <div className="officer-section-header">

              <div>

                <span className="section-label">
                  NO-SHOW RECORDS
                </span>

                <h2>
                  No-Show History
                </h2>

              </div>


              <button
                className="refresh-button"
                onClick={loadNoShowHistory}
                disabled={noShowLoading}
              >

                ↻

                <span>
                  {noShowLoading
                    ? 'Refreshing...'
                    : 'Refresh'}
                </span>

              </button>

            </div>


            {noShowLoading && (

              <div className="officer-loading">
                Loading no-show history...
              </div>

            )}


            {!noShowLoading &&
              noShowDates.length === 0 && (

              <div className="officer-empty">

                <div className="officer-empty__icon">
                  🚫
                </div>

                <h3>
                  No No-Show Records
                </h3>

                <p>
                  Farmers who miss their confirmed
                  procurement slots will appear here.
                </p>

              </div>

            )}


            {!noShowLoading &&
              noShowDates.length > 0 && (

              <div className="grouped-list">

                {noShowDates.map(
                  (date) => (

                  <div
                    className="date-group"
                    key={date}
                  >

                    <div className="date-group-header">

                      <div className="date-group-icon">
                        🚫
                      </div>

                      <div>

                        <span>
                          BOOKING DATE
                        </span>

                        <h3>
                          {formatDate(date)}
                        </h3>

                      </div>

                    </div>


                    <div className="history-table-wrapper">

                      <table className="history-table">

                        <thead>

                          <tr>

                            <th>TOKEN</th>
                            <th>FARMER</th>
                            <th>CROP</th>
                            <th>SLOT</th>
                            <th>BOOKING DATE</th>
                            <th>STATUS</th>

                          </tr>

                        </thead>


                        <tbody>

                          {noShowGrouped[date].map(
                            (booking) => (

                            <tr
                              key={
                                booking.booking_id
                              }
                            >

                              <td>

                                <strong className="queue-token">
                                  {booking.token_number || '-'}
                                </strong>

                              </td>


                              <td>

                                <div className="history-farmer">

                                  <strong>
                                    {booking.farmer_name}
                                  </strong>

                                  <span>
                                    Govt ID: {
                                      booking.farmer_govt_id ||
                                      'Not provided'
                                    }
                                  </span>

                                </div>

                              </td>


                              <td>

                                <div className="crop-cell">

                                  <strong>
                                    {booking.crop_name}
                                  </strong>

                                  <span>
                                    {booking.variety || '-'}
                                  </span>

                                </div>

                              </td>


                              <td>

                                <span className="queue-time">
                                  {formatTime(
                                    booking.slot_time
                                  )}
                                </span>

                              </td>


                              <td>

                                {formatDate(
                                  booking.booking_date
                                )}

                              </td>


                              <td>

                                <span className="status-badge status-badge--no-show">

                                  <span className="status-dot"></span>

                                  NO-SHOW

                                </span>

                              </td>

                            </tr>

                          ))}

                        </tbody>

                      </table>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* ================================
              INFORMATION
          ================================= */}

          <section className="officer-info">

            <div className="officer-info__icon">
              💡
            </div>

            <div>

              <h3>
                Queue & Procurement Management
              </h3>

              <p>
                Verify the farmer's token when they
                arrive at the centre. Token verification
                confirms the booking and starts the
                procurement process. If a farmer does
                not arrive within the 15-minute grace
                period after their scheduled slot, the
                officer can mark the booking as no-show.
                After procurement, enter the quantity
                and quality. The current official crop
                price is automatically applied.
              </p>

            </div>

          </section>


        </div>

      </main>


      {/* ================================
          PROCUREMENT MODAL
      ================================= */}

      {showProcurementForm &&
        selectedBooking && (

        <div className="procurement-modal">

          <div className="procurement-modal-card">


            <div className="procurement-modal-header">

              <div>

                <p className="procurement-eyebrow">
                  COMPLETE PROCUREMENT
                </p>

                <h2>
                  Token {
                    selectedBooking.token_number
                  }
                </h2>

                <p>
                  Booking #
                  {selectedBooking.booking_id}
                </p>

              </div>


              <button
                type="button"
                className="procurement-close"
                onClick={
                  closeProcurementForm
                }
              >
                ×
              </button>

            </div>


            <div className="procurement-form">


              {/* FARMER */}

              <div className="procurement-booking-info">

                <div>

                  <span>
                    FARMER
                  </span>

                  <strong>
                    {selectedBooking.farmer_name}
                  </strong>

                </div>

                <div>

                  <span>
                    GOVT ID
                  </span>

                  <strong>
                    {selectedBooking.farmer_govt_id ||
                      'Not provided'}
                  </strong>

                </div>

              </div>


              {/* CROP */}

              <div className="procurement-booking-info">

                <div>

                  <span>
                    CROP
                  </span>

                  <strong>
                    {selectedBooking.crop_name}
                  </strong>

                </div>

                <div>

                  <span>
                    VARIETY
                  </span>

                  <strong>
                    {selectedBooking.variety}
                  </strong>

                </div>

              </div>


              {/* CURRENT PRICE */}

              <div className="current-price-card">

                <div>

                  <span className="current-price-label">
                    CURRENT OFFICIAL PRICE
                  </span>

                  <strong className="current-price-value">

                    {priceLoading
                      ? 'Loading...'
                      : currentCropPrice
                        ? `₹${Number(
                            currentCropPrice.price_per_kg
                          ).toLocaleString(
                            'en-IN',
                            {
                              minimumFractionDigits: 2
                            }
                          )} / kg`
                        : 'Price not available'}

                  </strong>

                  <small>

                    {currentCropPrice
                      ? 'Official price for this crop at this centre'
                      : 'No price has been configured for this crop at this centre'}

                  </small>

                </div>

                <div className="current-price-icon">
                  ₹
                </div>

              </div>


              {/* QUANTITY */}

              <div className="procurement-field">

                <label>
                  Quantity (kg)
                </label>

                <div className="input-with-unit">

                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        e.target.value
                      )
                    }
                    placeholder="Enter quantity in kg"
                    min="0"
                    step="0.01"
                  />

                  <span>
                    kg
                  </span>

                </div>

              </div>


              {/* QUALITY */}

              <div className="procurement-field">

                <label>
                  Quality
                </label>

                <select
                  value={quality}
                  onChange={(e) =>
                    setQuality(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select quality
                  </option>

                  <option value="Excellent">
                    Excellent
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Average">
                    Average
                  </option>

                  <option value="Poor">
                    Poor
                  </option>

                </select>

              </div>


              {/* PRICE */}

              <div className="procurement-field">

                <label>
                  Price per kg
                </label>

                <div className="input-with-unit">

                  <input
                    type="number"
                    value={pricePerUnit}
                    readOnly
                    disabled
                  />

                  <span>
                    ₹/kg
                  </span>

                </div>

                <small className="procurement-field-hint">
                  Current official price is automatically applied.
                </small>

              </div>


              {/* TOTAL */}

              {quantity &&
                pricePerUnit && (

                <div className="procurement-total">

                  <div>

                    <span>
                      Total Procurement Amount
                    </span>

                    <small>
                      {quantity} kg × ₹
                      {Number(
                        pricePerUnit
                      ).toFixed(2)}
                      /kg
                    </small>

                  </div>

                  <strong>
                    ₹
                    {totalAmount.toLocaleString(
                      'en-IN',
                      {
                        minimumFractionDigits: 2
                      }
                    )}
                  </strong>

                </div>

              )}


              {/* ACTIONS */}

              <div className="procurement-actions">

                <button
                  type="button"
                  className="procurement-cancel"
                  onClick={
                    closeProcurementForm
                  }
                  disabled={
                    savingProcurement
                  }
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="procurement-save"
                  onClick={
                    handleSaveProcurement
                  }
                  disabled={
                    savingProcurement ||
                    !currentCropPrice
                  }
                >

                  {savingProcurement
                    ? 'Saving...'
                    : 'Complete Procurement'}

                </button>

              </div>


            </div>

          </div>

        </div>

      )}

    </div>

  );

}


export default OfficerDashboard;