import React, { useEffect, useState } from 'react';

import api from '../../services/authService';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../../components/Navbar.jsx';
import { useTranslation } from '../../translation/useTranslation.js';

import './Booking.css';


function Booking() {

    const { farmer } = useAuth();
    const { t } = useTranslation();


    const [crops, setCrops] = useState([]);

    const [centres, setCentres] = useState([]);


    const [selectedCrop, setSelectedCrop] =
        useState('');

    const [selectedCentre, setSelectedCentre] =
        useState('');


    const [recommendedCentre, setRecommendedCentre] =
        useState(null);

    const [recommendedSelected, setRecommendedSelected] =
        useState(false);

    const [recommendationLoading, setRecommendationLoading] =
        useState(false);


    const [bookingDate, setBookingDate] =
        useState('');


    // ==========================================
    // CENTRE SCHEDULE
    // ==========================================

    const [centreSchedule, setCentreSchedule] =
        useState(null);

    const [scheduleLoading, setScheduleLoading] =
        useState(false);

    const [scheduleError, setScheduleError] =
        useState('');


    // ==========================================
    // FARMER LOCATION
    // ==========================================

    const [location, setLocation] =
        useState(null);

    const [locationLoading, setLocationLoading] =
        useState(true);

    const [locationError, setLocationError] =
        useState('');


    const [loading, setLoading] =
        useState(true);

    const [bookingLoading, setBookingLoading] =
        useState(false);


    const [error, setError] =
        useState('');

    const [bookingError, setBookingError] =
        useState('');

    const [booking, setBooking] =
        useState(null);


    // ==========================================
    // BOOKING DATE / TIME VALIDATION
    // ==========================================

    function getTodayDate() {

        const now = new Date();

        const year =
            now.getFullYear();

        const month =
            String(
                now.getMonth() + 1
            ).padStart(2, '0');

        const day =
            String(
                now.getDate()
            ).padStart(2, '0');

        return `${year}-${month}-${day}`;

    }


    function isPastDate(date) {

        if (!date) {
            return false;
        }

        return date < getTodayDate();

    }


    function isCentreCurrentlyClosed() {

        if (
            !bookingDate ||
            !centreSchedule
        ) {

            return false;

        }


        // ======================================
        // PAST DATE
        // ======================================

        if (
            isPastDate(bookingDate)
        ) {

            return true;

        }


        // ======================================
        // CENTRE MANUALLY CLOSED
        // ======================================

        if (
            centreSchedule.status === 'CLOSED'
        ) {

            return true;

        }


        // ======================================
        // FUTURE DATE
        // ======================================

        if (
            bookingDate > getTodayDate()
        ) {

            return false;

        }


        // ======================================
        // TODAY
        // CHECK OPENING / CLOSING TIME
        // ======================================

        if (
            !centreSchedule.opening_time ||
            !centreSchedule.closing_time
        ) {

            return true;

        }


        const now =
            new Date();


        const currentMinutes =
            now.getHours() * 60 +
            now.getMinutes();


        const openingParts =
            centreSchedule.opening_time
                .slice(0, 5)
                .split(':');


        const closingParts =
            centreSchedule.closing_time
                .slice(0, 5)
                .split(':');


        const openingMinutes =
            Number(
                openingParts[0]
            ) * 60 +
            Number(
                openingParts[1]
            );


        const closingMinutes =
            Number(
                closingParts[0]
            ) * 60 +
            Number(
                closingParts[1]
            );


        return (
            currentMinutes < openingMinutes ||
            currentMinutes >= closingMinutes
        );

    }


    // ==========================================
    // LOAD CROPS AND CENTRES
    // ==========================================

    useEffect(() => {

        loadData();

    }, []);


    // ==========================================
    // GET FARMER LOCATION
    // ==========================================

    useEffect(() => {

        if (!navigator.geolocation) {

            setLocationError(
                t('locationNotSupported')
            );

            setLocationLoading(false);

            return;
        }


        navigator.geolocation.getCurrentPosition(

            (position) => {

                const farmerLocation = {

                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude

                };


                setLocation(
                    farmerLocation
                );

                setLocationLoading(false);


                console.log(
                    'FARMER LOCATION:',
                    position.coords.latitude,
                    position.coords.longitude
                );

            },


            (error) => {

                console.error(
                    'LOCATION ERROR:',
                    error
                );


                setLocationError(
                    t('locationPermissionRequired')
                );

                setLocationLoading(false);

            }

        );

    }, []);


    // ==========================================
    // SMART CENTRE RECOMMENDATION
    // ==========================================

    useEffect(() => {

        if (
            selectedCrop &&
            bookingDate &&
            location
        ) {

            recommendCentre();

        } else {

            setRecommendedCentre(null);

            setRecommendedSelected(false);

        }

    }, [
        selectedCrop,
        bookingDate,
        location
    ]);


    // ==========================================
    // CHECK CENTRE SCHEDULE
    // ==========================================

    useEffect(() => {

        if (
            selectedCentre &&
            bookingDate
        ) {

            checkCentreSchedule(
                selectedCentre,
                bookingDate
            );

        } else {

            setCentreSchedule(null);

            setScheduleError('');

        }

    }, [
        selectedCentre,
        bookingDate
    ]);


    // ==========================================
    // LOAD BOOKING DATA
    // ==========================================

    async function loadData() {

        try {

            const cropResponse =
                await api.get(
                    '/crops/'
                );


            const centreResponse =
                await api.get(
                    '/centres/'
                );


            setCrops(
                cropResponse.data
            );


            setCentres(
                centreResponse.data
            );


        } catch (error) {

            console.error(
                error
            );


            setError(
                t('unableToLoadBookingData')
            );


        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // CHECK CENTRE SCHEDULE
    // ==========================================

    async function checkCentreSchedule(
        centreId,
        date
    ) {

        if (
            !centreId ||
            !date
        ) {

            setCentreSchedule(null);

            setScheduleError('');

            return;

        }


        // ======================================
        // PAST DATE
        // ======================================

        if (
            isPastDate(date)
        ) {

            setCentreSchedule(null);

            setScheduleError(
                t('cannotBookPastDate')
            );

            return;

        }


        setScheduleLoading(true);

        setScheduleError('');

        setCentreSchedule(null);


        try {

            const response =
                await api.get(
                    `/centre/${centreId}/schedule/`
                );


            const schedules =
                response.data || [];


            const selectedSchedule =
                schedules.find(
                    (schedule) =>
                        schedule.schedule_date ===
                        date
                );


            /*
             * No schedule means the officer has
             * not configured this date yet.
             */

            if (!selectedSchedule) {

                setCentreSchedule(null);

                setScheduleError(
                    t('noProcurementSchedule')
                );

                return;

            }


            setCentreSchedule(
                selectedSchedule
            );


        } catch (error) {

            console.error(
                'Centre schedule error:',
                error
            );


            setScheduleError(
                t('unableToCheckCentre')
            );


        } finally {

            setScheduleLoading(false);

        }

    }


    // ==========================================
    // SMART CENTRE RECOMMENDATION
    // ==========================================

    async function recommendCentre() {

        if (
            !selectedCrop ||
            !bookingDate ||
            !location
        ) {

            setRecommendedCentre(null);

            setRecommendedSelected(false);

            return;

        }


        setRecommendationLoading(true);

        setRecommendedCentre(null);

        setRecommendedSelected(false);


        try {

            const response =
                await api.get(

                    `/smart-centre/?crop_id=${selectedCrop}&booking_date=${bookingDate}&latitude=${location.latitude}&longitude=${location.longitude}`

                );


            console.log(
                'SMART:',
                response.data
            );


            setRecommendedCentre(
                response.data.recommended_centre
            );


        } catch (error) {

            console.error(
                'SMART ERROR:',
                error.response?.data || error
            );


            setRecommendedCentre(null);


        } finally {

            setRecommendationLoading(false);

        }

    }


    // ==========================================
    // SUBMIT BOOKING
    // ==========================================

    async function handleBooking() {

        setBookingError('');


        if (!selectedCrop) {

            setBookingError(
                t('pleaseSelectCrop')
            );

            return;

        }


        if (!selectedCentre) {

            setBookingError(
                t('pleaseSelectCentre')
            );

            return;

        }


        if (!bookingDate) {

            setBookingError(
                t('pleaseSelectDate')
            );

            return;

        }


        // ======================================
        // PAST DATE CHECK
        // ======================================

        if (
            isPastDate(bookingDate)
        ) {

            setBookingError(
                t('cannotBookPastDate')
            );

            return;

        }


        // ======================================
        // SCHEDULE REQUIRED
        // ======================================

        if (!centreSchedule) {

            setBookingError(
                t('scheduleUnavailable')
            );

            return;

        }


        // ======================================
        // CENTRE CURRENTLY CLOSED
        // ======================================

        if (
            isCentreCurrentlyClosed()
        ) {

            if (
                centreSchedule.status === 'CLOSED' &&
                centreSchedule.closure_reason
            ) {

                setBookingError(
                    `${t('centreClosedOnDate')} ${centreSchedule.closure_reason}`
                );

            } else {

                setBookingError(
                    t('centreClosedChooseDate')
                );

            }

            return;

        }


        if (!farmer?.farmerId) {

            setBookingError(
                t('farmerInformationNotFound')
            );

            return;

        }


        setBookingLoading(true);


        try {

            const response =
                await api.post(

                    '/bookings/',

                    {

                        farmer:
                            farmer.farmerId,

                        crop:
                            Number(
                                selectedCrop
                            ),

                        centre:
                            Number(
                                selectedCentre
                            ),

                        booking_date:
                            bookingDate

                    }

                );


            setBooking(
                response.data.booking
            );


        } catch (error) {

            console.error(
                'Booking error:',
                error
            );


            console.error(
                'Backend response:',
                error.response?.data
            );


            if (
                error.response &&
                error.response.data
            ) {

                setBookingError(

                    error.response.data.message ||

                    t('unableToCreateBooking')

                );


            } else {

                setBookingError(

                    t('unableToConnectServer')

                );

            }


        } finally {

            setBookingLoading(false);

        }

    }


    // ==========================================
    // BOOKING CONFIRMATION
    // ==========================================

    if (booking) {

        return (

            <>

                <Navbar />


                <main className="booking-page">

                    <div className="booking-confirmation">


                        <div className="confirmation-icon">
                            ✓
                        </div>


                        <span className="booking-eyebrow">
                            {t('bookingRequestSubmitted')}
                        </span>


                        <h1>
                            {t('bookingRequestSubmittedTitle')}
                        </h1>


                        <p className="confirmation-text">

                            {t('bookingApprovalMessage')}

                        </p>


                        <div className="token-card">

                            <span>
                                {t('bookingStatus')}
                            </span>


                            <strong>
                                {booking.status}
                            </strong>

                        </div>


                        <div className="booking-details">


                            <div className="detail-item">

                                <span>
                                    {t('bookingId')}
                                </span>


                                <strong>
                                    #{booking.booking_id}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    {t('date')}
                                </span>


                                <strong>
                                    {booking.booking_date}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    {t('token')}
                                </span>


                                <strong>

                                    {booking.token_number

                                        ? booking.token_number

                                        : t('willBeGeneratedAfterApproval')

                                    }

                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    {t('status')}
                                </span>


                                <strong className="status-confirmed">

                                    {booking.status}

                                </strong>

                            </div>


                        </div>


                        <div className="confirmation-note">

                            <span>
                                💡
                            </span>


                            <p>

                                {t('approvalNote')}

                            </p>

                        </div>


                    </div>

                </main>

            </>

        );

    }


    // ==========================================
    // MAIN BOOKING PAGE
    // ==========================================

    return (

        <>

            <Navbar />


            <main className="booking-page">

                <div className="booking-container">


                    {/* =====================================
                        HEADER
                    ====================================== */}

                    <div className="booking-header">

                        <div>

                            <span className="booking-eyebrow">
                                {t('procurement')}
                            </span>


                            <h1>
                                {t('bookProcurementSlot')}
                            </h1>


                            <p>

                                {t('selectCropCentreDate')}

                            </p>

                        </div>

                    </div>


                    {/* =====================================
                        LOADING
                    ====================================== */}

                    {loading && (

                        <div className="booking-message">

                            {t('loadingBookingOptions')}

                        </div>

                    )}


                    {/* =====================================
                        GENERAL ERROR
                    ====================================== */}

                    {error && (

                        <div className="booking-error">

                            {error}

                        </div>

                    )}


                    {!loading &&
                        !error && (

                        <div className="booking-layout">


                            {/* =================================
                                BOOKING FORM
                            ================================== */}

                            <div className="booking-card">


                                <div className="card-title">

                                    <span className="card-number">
                                        01
                                    </span>


                                    <div>

                                        <h2>
                                            {t('bookingDetails')}
                                        </h2>


                                        <p>

                                            {t('chooseProcurementPreferences')}

                                        </p>

                                    </div>

                                </div>


                                {/* =================================
                                    CROP
                                ================================== */}

                                <div className="form-group">

                                    <label htmlFor="crop">

                                        {t('selectCrop')}

                                    </label>


                                    <select
                                        id="crop"
                                        name="crop"
                                        value={selectedCrop}
                                        onChange={(e) => {

                                            setSelectedCrop(
                                                e.target.value
                                            );


                                            setSelectedCentre('');


                                            setCentreSchedule(
                                                null
                                            );


                                            setScheduleError(
                                                ''
                                            );


                                            setRecommendedSelected(
                                                false
                                            );

                                        }}
                                    >

                                        <option value="">

                                            {t('selectACrop')}

                                        </option>


                                        {crops.map(
                                            (crop) => (

                                            <option
                                                key={
                                                    crop.crop_id
                                                }
                                                value={
                                                    crop.crop_id
                                                }
                                            >

                                                {crop.crop_name}

                                                {crop.variety

                                                    ? ` - ${crop.variety}`

                                                    : ''

                                                }

                                            </option>

                                        ))}

                                    </select>

                                </div>


                                {/* =================================
                                    PROCUREMENT DATE
                                ================================== */}

                                <div className="form-group">

                                    <label htmlFor="booking-date">

                                        {t('procurementDate')}

                                    </label>


                                    <input
                                        id="booking-date"
                                        name="booking_date"
                                        type="date"
                                        min={getTodayDate()}
                                        value={bookingDate}
                                        onChange={(e) => {

                                            const selectedDate =
                                                e.target.value;


                                            if (
                                                isPastDate(
                                                    selectedDate
                                                )
                                            ) {

                                                setBookingDate('');

                                                setCentreSchedule(null);

                                                setScheduleError('');

                                                setBookingError(
                                                    t('cannotBookPastDate')
                                                );

                                                return;

                                            }


                                            setBookingDate(
                                                selectedDate
                                            );


                                            setCentreSchedule(
                                                null
                                            );


                                            setScheduleError(
                                                ''
                                            );


                                            setBookingError(
                                                ''
                                            );


                                            setRecommendedSelected(
                                                false
                                            );

                                        }}
                                    />

                                </div>


                                {/* =================================
                                    LOCATION STATUS
                                ================================== */}

                                {locationLoading && (

                                    <div className="smart-recommendation">

                                        <div className="smart-recommendation__badge">

                                            📍 {t('location')}

                                        </div>


                                        <p>

                                            {t('gettingLocation')}

                                        </p>

                                    </div>

                                )}


                                {locationError && (

                                    <div className="booking-form-error">

                                        <span>
                                            !
                                        </span>


                                        {locationError}

                                    </div>

                                )}


                                {/* =================================
                                    SMART RECOMMENDATION LOADING
                                ================================== */}

                                {recommendationLoading && (

                                    <div className="smart-recommendation">

                                        <div className="smart-recommendation__badge">

                                            ⭐ {t('smartRecommendation')}

                                        </div>


                                        <p>

                                            {t('findingBestCentre')}

                                        </p>

                                    </div>

                                )}


                                {/* =================================
                                    SMART RECOMMENDATION
                                ================================== */}

                                {recommendedCentre &&
                                    !recommendationLoading && (

                                    <div className="smart-recommendation">


                                        <div className="smart-recommendation__badge">

                                            ⭐ {t('smartRecommendation')}

                                        </div>


                                        <h3>

                                            {
                                                recommendedCentre.centre_name
                                            }

                                        </h3>


                                        <div className="smart-recommendation__details">


                                            <div>

                                                <span>
                                                    {t('currentPrice')}
                                                </span>


                                                <strong>

                                                    ₹
                                                    {Number(
                                                        recommendedCentre.price
                                                    ).toFixed(2)}

                                                    {' / kg'}

                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    {t('distance')}
                                                </span>


                                                <strong>

                                                    📍

                                                    {' '}

                                                    {Number(
                                                        recommendedCentre.distance_km
                                                    ).toFixed(2)}

                                                    {' km'}

                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    {t('availableSlots')}
                                                </span>


                                                <strong>

                                                    {
                                                        recommendedCentre.available_slots
                                                    }

                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    {t('currentBookings')}
                                                </span>


                                                <strong>

                                                    {
                                                        recommendedCentre.booked_count
                                                    }

                                                </strong>

                                            </div>


                                        </div>


                                        <button
                                            type="button"
                                            onClick={() => {

                                                setSelectedCentre(
                                                    String(
                                                        recommendedCentre.centre_id
                                                    )
                                                );


                                                setRecommendedSelected(
                                                    true
                                                );

                                            }}
                                        >

                                            {recommendedSelected

                                                ? `✓ ${t('recommendedCentreSelected')}`

                                                : t('chooseRecommendedCentre')

                                            }

                                        </button>


                                    </div>

                                )}


                                {/* =================================
                                    PROCUREMENT CENTRE
                                ================================== */}

                                <div className="form-group">

                                    <label htmlFor="centre">

                                        {t('procurementCentre')}

                                    </label>


                                    <select
                                        id="centre"
                                        name="centre"
                                        value={selectedCentre}
                                        onChange={(e) => {

                                            setSelectedCentre(
                                                e.target.value
                                            );


                                            setCentreSchedule(
                                                null
                                            );


                                            setScheduleError(
                                                ''
                                            );


                                            setBookingError(
                                                ''
                                            );


                                            setRecommendedSelected(
                                                false
                                            );

                                        }}
                                    >

                                        <option value="">

                                            {t('selectCentre')}

                                        </option>


                                        {centres.map(
                                            (centre) => (

                                            <option
                                                key={
                                                    centre.centre_id
                                                }
                                                value={
                                                    centre.centre_id
                                                }
                                            >

                                                {
                                                    centre.centre_name
                                                }

                                            </option>

                                        ))}

                                    </select>


                                    {recommendedSelected && (

                                        <div className="recommended-selected">

                                            ✓ {t('recommendedCentreSelectedShort')}

                                        </div>

                                    )}

                                </div>


                                {/* =================================
                                    CENTRE SCHEDULE LOADING
                                ================================== */}

                                {scheduleLoading && (

                                    <div className="booking-schedule-loading">

                                        {t('checkingCentreAvailability')}

                                    </div>

                                )}


                                {/* =================================
                                    CENTRE SCHEDULE ERROR
                                ================================== */}

                                {scheduleError && (

                                    <div className="booking-form-error">

                                        <span>
                                            !
                                        </span>


                                        {scheduleError}

                                    </div>

                                )}


                                {/* =================================
                                    CENTRE CLOSED
                                ================================== */}

                                {!scheduleLoading &&
                                    !scheduleError &&
                                    centreSchedule &&
                                    isCentreCurrentlyClosed() && (

                                    <div className="booking-centre-closed">


                                        <div className="booking-centre-closed__icon">

                                            !

                                        </div>


                                        <div className="booking-centre-closed__content">

                                            <strong>

                                                {t('centreClosed')}

                                            </strong>


                                            <p>

                                                {isPastDate(bookingDate)

                                                    ? t('cannotBookPastDate')

                                                    : `${t('centreCurrentlyClosed')} ${bookingDate}.`

                                                }

                                            </p>


                                            {centreSchedule.status === 'CLOSED' &&
                                                centreSchedule.closure_reason && (

                                                <p className="booking-centre-closed__reason">

                                                    <strong>

                                                        {t('reason')}:

                                                    </strong>


                                                    {' '}


                                                    {
                                                        centreSchedule.closure_reason
                                                    }

                                                </p>

                                            )}

                                        </div>

                                    </div>

                                )}


                                {/* =================================
                                    CENTRE OPEN
                                ================================== */}

                                {!scheduleLoading &&
                                    !scheduleError &&
                                    centreSchedule &&
                                    !isCentreCurrentlyClosed() && (

                                    <div className="booking-centre-open">


                                        <span>
                                            ✓
                                        </span>


                                        <div>

                                            <strong>

                                                {t('centreOpen')}

                                            </strong>


                                            <p>

                                                {
                                                    centreSchedule
                                                        .opening_time
                                                        ?.slice(0, 5)
                                                }

                                                {' — '}

                                                {
                                                    centreSchedule
                                                        .closing_time
                                                        ?.slice(0, 5)
                                                }

                                                {' · '}

                                                {
                                                    centreSchedule
                                                        .daily_capacity
                                                }

                                                {' '}

                                                {t('farmersCapacity')}

                                            </p>

                                        </div>

                                    </div>

                                )}


                                {/* =================================
                                    BOOKING ERROR
                                ================================== */}

                                {bookingError && (

                                    <div className="booking-form-error">

                                        <span>
                                            !
                                        </span>


                                        {bookingError}

                                    </div>

                                )}


                                {/* =================================
                                    SUBMIT
                                ================================== */}

                                <button
                                    type="button"
                                    className="booking-submit"
                                    onClick={handleBooking}
                                    disabled={

                                        bookingLoading ||

                                        !bookingDate ||

                                        isPastDate(
                                            bookingDate
                                        ) ||

                                        !centreSchedule ||

                                        isCentreCurrentlyClosed()

                                    }
                                >

                                    {bookingLoading

                                        ? t('submitting')

                                        : isPastDate(
                                            bookingDate
                                        )

                                            ? t('pastDate')

                                            : !centreSchedule

                                                ? t('scheduleUnavailableButton')

                                                : isCentreCurrentlyClosed()

                                                    ? t('centreClosedButton')

                                                    : t('submitBookingRequest')

                                    }

                                </button>


                                <p className="booking-help">

                                    {t('bookingPendingHelp')}

                                </p>

                            </div>


                            {/* =================================
                                RIGHT INFORMATION CARD
                            ================================== */}

                            <aside className="booking-info">


                                <div className="info-icon">
                                    🌾
                                </div>


                                <h2>
                                    {t('howBookingWorks')}
                                </h2>


                                <p>

                                    {t('submitBeforeVisiting')}

                                </p>


                                {/* STEP 1 */}

                                <div className="info-step">

                                    <span>
                                        1
                                    </span>


                                    <div>

                                        <strong>
                                            {t('chooseYourCrop')}
                                        </strong>


                                        <p>

                                            {t('chooseYourCropDescription')}

                                        </p>

                                    </div>

                                </div>


                                {/* STEP 2 */}

                                <div className="info-step">

                                    <span>
                                        2
                                    </span>


                                    <div>

                                        <strong>

                                            {t('getSmartCentreRecommendation')}

                                        </strong>


                                        <p>

                                            {t('smartCentreRecommendationDescription')}

                                        </p>

                                    </div>

                                </div>


                                {/* STEP 3 */}

                                <div className="info-step">

                                    <span>
                                        3
                                    </span>


                                    <div>

                                        <strong>

                                            {t('selectProcurementDate')}

                                        </strong>


                                        <p>

                                            {t('selectProcurementDateDescription')}

                                        </p>

                                    </div>

                                </div>


                                {/* STEP 4 */}

                                <div className="info-step">

                                    <span>
                                        4
                                    </span>


                                    <div>

                                        <strong>

                                            {t('waitForApproval')}

                                        </strong>


                                        <p>

                                            {t('waitForApprovalDescription')}

                                        </p>

                                    </div>

                                </div>


                            </aside>


                        </div>

                    )}

                </div>

            </main>

        </>

    );

}


export default Booking;