import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/authService.js';
import AdminSidebar from './AdminSidebar.jsx';
import './AdminBookings.css';


function AdminBookings() {

    const navigate = useNavigate();

    const [bookingOverview, setBookingOverview] = useState([]);
    const [centres, setCentres] = useState([]);

    const [selectedCentre, setSelectedCentre] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {

        const adminSession = localStorage.getItem(
            'kisansetu_admin_session'
        );

        if (!adminSession) {
            navigate('/admin/login');
            return;
        }

        loadCentres();
        loadBookings();

    }, [navigate]);


    async function loadCentres() {

        try {

            const response = await api.get(
                '/admin/centres/'
            );

            setCentres(response.data);

        } catch (error) {

            console.error(error);

        }
    }


    async function loadBookings(
        centreValue = selectedCentre,
        dateValue = selectedDate
    ) {

        try {

            setLoading(true);
            setError('');

            let url =
                '/admin/booking-overview/';

            const params = [];


            if (centreValue) {

                params.push(
                    `centre_id=${centreValue}`
                );

            }


            if (dateValue) {

                params.push(
                    `booking_date=${dateValue}`
                );

            }


            if (params.length > 0) {

                url += '?' + params.join('&');

            }


            const response = await api.get(url);

            setBookingOverview(
                response.data
            );

        } catch (error) {

            console.error(error);

            setError(
                'Unable to load bookings.'
            );

        } finally {

            setLoading(false);

        }
    }


    async function updateBookingStatus(
        bookingId,
        newStatus
    ) {

        try {

            await api.put(
                `/admin/bookings/${bookingId}/status/`,
                {
                    status: newStatus
                }
            );

            await loadBookings();

        } catch (error) {

            console.error(error);

            if (
                error.response &&
                error.response.data
            ) {

                alert(
                    error.response.data.message ||
                    'Unable to update booking.'
                );

            } else {

                alert(
                    'Unable to connect to the server.'
                );

            }
        }
    }


    function handleApprove(bookingId) {

        const confirmed = window.confirm(
            'Are you sure you want to approve this booking?'
        );

        if (!confirmed) {
            return;
        }

        updateBookingStatus(
            bookingId,
            'APPROVED'
        );
    }


    function handleReject(bookingId) {

        const confirmed = window.confirm(
            'Are you sure you want to reject this booking?'
        );

        if (!confirmed) {
            return;
        }

        updateBookingStatus(
            bookingId,
            'REJECTED'
        );
    }


    function formatDate(dateValue) {

        if (!dateValue) {
            return '-';
        }

        const date = new Date(
            dateValue + 'T00:00:00'
        );

        return date.toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );
    }


    function formatTime(timeValue) {

        if (!timeValue) {
            return '-';
        }

        const parts = timeValue.split(':');

        const hours = Number(parts[0]);
        const minutes = parts[1];

        const period =
            hours >= 12 ? 'PM' : 'AM';

        const displayHour =
            hours % 12 === 0
                ? 12
                : hours % 12;

        return (
            String(displayHour).padStart(2, '0')
            + ':' +
            minutes
            + ' ' +
            period
        );
    }


    /*
     * Sort bookings so that pending requests
     * always appear at the top.
     */

    function sortBookings(bookings) {

        const statusOrder = {
            PENDING: 1,
            APPROVED: 2,
            IN_PROGRESS: 3,
            COMPLETED: 4,
            REJECTED: 5
        };


        return [...bookings].sort(
            (a, b) => {

                const statusA =
                    statusOrder[a.status] || 99;

                const statusB =
                    statusOrder[b.status] || 99;


                /*
                 * First sort by status.
                 */

                if (statusA !== statusB) {

                    return statusA - statusB;

                }


                /*
                 * If status is the same,
                 * newer booking comes first.
                 */

                return (
                    Number(b.booking_id)
                    -
                    Number(a.booking_id)
                );

            }
        );
    }


    return (

        <div className="admin-layout">

            <AdminSidebar />


            <main className="admin-main admin-bookings-page">

                <div className="admin-bookings-container">


                    {/* Header */}

                    <div className="admin-bookings-header">

                        <div>

                            <span className="admin-eyebrow">
                                BOOKING MANAGEMENT
                            </span>

                            <h1>
                                Bookings
                            </h1>

                            <p>
                                Review farmer procurement
                                requests centre-wise.
                            </p>

                        </div>


                        <button
                            className="admin-refresh-button"
                            onClick={() =>
                                loadBookings()
                            }
                        >
                            Refresh
                        </button>

                    </div>


                    {/* Filters */}

                    <div className="admin-booking-filters">


                        <div className="admin-filter-group">

                            <label htmlFor="centre-filter">
                                Procurement Centre
                            </label>

                            <select
                                id="centre-filter"
                                value={selectedCentre}
                                onChange={(event) =>
                                    setSelectedCentre(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Centres
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

                                    )
                                )}

                            </select>

                        </div>


                        <div className="admin-filter-group">

                            <label htmlFor="booking-date-filter">
                                Booking Date
                            </label>

                            <input
                                id="booking-date-filter"
                                type="date"
                                value={selectedDate}
                                onChange={(event) =>
                                    setSelectedDate(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <button
                            className="admin-apply-filter"
                            onClick={() =>
                                loadBookings(
                                    selectedCentre,
                                    selectedDate
                                )
                            }
                        >
                            Apply Filters
                        </button>


                        <button
                            className="admin-clear-filter"
                            onClick={() => {

                                setSelectedCentre('');
                                setSelectedDate('');

                                loadBookings(
                                    '',
                                    ''
                                );

                            }}
                        >
                            Clear
                        </button>

                    </div>


                    {/* Loading */}

                    {loading && (

                        <div className="admin-bookings-message">
                            Loading bookings...
                        </div>

                    )}


                    {/* Error */}

                    {error && (

                        <div className="admin-bookings-error">
                            {error}
                        </div>

                    )}


                    {/* Centre Overview */}

                    {!loading && !error && (

                        <>

                            {bookingOverview.length === 0 ? (

                                <div className="admin-bookings-card">

                                    <div className="empty-bookings">
                                        No procurement centres
                                        found.
                                    </div>

                                </div>

                            ) : (

                                bookingOverview.map(
                                    (centre) => (

                                        <section
                                            key={
                                                centre.centre_id
                                            }
                                            className="admin-centre-section"
                                        >


                                            {/* Centre Header */}

                                            <div className="admin-centre-overview">


                                                <div className="centre-overview-main">

                                                    <span className="admin-eyebrow">
                                                        PROCUREMENT CENTRE
                                                    </span>

                                                    <h2>
                                                        {
                                                            centre.centre_name
                                                        }
                                                    </h2>

                                                    <p>
                                                        {
                                                            centre.address ||
                                                            'Address not available'
                                                        }
                                                    </p>

                                                </div>


                                                <div className="centre-timing">

                                                    <span>
                                                        Centre Timing
                                                    </span>

                                                    <strong>

                                                        {
                                                            formatTime(
                                                                centre.opening_time
                                                            )
                                                        }

                                                        {' → '}

                                                        {
                                                            formatTime(
                                                                centre.closing_time
                                                            )
                                                        }

                                                    </strong>

                                                </div>


                                                <div className="centre-stat">

                                                    <span>
                                                        Capacity
                                                    </span>

                                                    <strong>
                                                        {
                                                            centre.daily_capacity ??
                                                            '-'
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="centre-stat">

                                                    <span>
                                                        Total
                                                    </span>

                                                    <strong>
                                                        {
                                                            centre.total_bookings
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="centre-stat">

                                                    <span>
                                                        Pending
                                                    </span>

                                                    <strong>
                                                        {
                                                            centre.pending_bookings
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="centre-stat">

                                                    <span>
                                                        Approved
                                                    </span>

                                                    <strong>
                                                        {
                                                            centre.approved_bookings
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* Booking Table */}

                                            <div className="admin-bookings-card">


                                                {centre.bookings.length === 0 ? (

                                                    <div className="empty-bookings">

                                                        No bookings for this centre

                                                        {selectedDate
                                                            ? ' on the selected date.'
                                                            : '.'}

                                                    </div>

                                                ) : (

                                                    <div className="admin-bookings-table-wrapper">


                                                        <table className="admin-bookings-table">


                                                            <thead>

                                                                <tr>

                                                                    <th>
                                                                        Booking
                                                                    </th>

                                                                    <th>
                                                                        Farmer
                                                                    </th>

                                                                    <th>
                                                                        Crop
                                                                    </th>

                                                                    <th>
                                                                        Date
                                                                    </th>

                                                                    <th>
                                                                        Status
                                                                    </th>

                                                                    <th>
                                                                        Action
                                                                    </th>

                                                                </tr>

                                                            </thead>


                                                            <tbody>

                                                                {sortBookings(
                                                                    centre.bookings
                                                                ).map(
                                                                    (booking) => (

                                                                        <tr
                                                                            key={
                                                                                booking.booking_id
                                                                            }
                                                                        >


                                                                            <td>

                                                                                <strong>

                                                                                    #
                                                                                    {
                                                                                        booking.booking_id
                                                                                    }

                                                                                </strong>


                                                                                <span className="booking-mobile">

                                                                                    {
                                                                                        booking.farmer_phone
                                                                                    }

                                                                                </span>

                                                                            </td>


                                                                            <td>

                                                                                <strong>

                                                                                    {
                                                                                        booking.farmer_name
                                                                                    }

                                                                                </strong>

                                                                            </td>


                                                                            <td>

                                                                                <strong>

                                                                                    {
                                                                                        booking.crop_name
                                                                                    }

                                                                                </strong>


                                                                                {booking.crop_variety && (

                                                                                    <span className="booking-subtext">

                                                                                        {
                                                                                            booking.crop_variety
                                                                                        }

                                                                                    </span>

                                                                                )}

                                                                            </td>


                                                                            <td>

                                                                                {
                                                                                    formatDate(
                                                                                        booking.booking_date
                                                                                    )
                                                                                }

                                                                            </td>


                                                                            <td>

                                                                                <span
                                                                                    className={
                                                                                        `booking-status booking-status--${booking.status.toLowerCase()}`
                                                                                    }
                                                                                >

                                                                                    {
                                                                                        booking.status
                                                                                    }

                                                                                </span>

                                                                            </td>


                                                                            <td>

                                                                                {booking.status === 'PENDING' ? (

                                                                                    <div className="booking-actions">


                                                                                        <button
                                                                                            className="booking-approve"
                                                                                            onClick={() =>
                                                                                                handleApprove(
                                                                                                    booking.booking_id
                                                                                                )
                                                                                            }
                                                                                        >

                                                                                            Approve

                                                                                        </button>


                                                                                        <button
                                                                                            className="booking-reject"
                                                                                            onClick={() =>
                                                                                                handleReject(
                                                                                                    booking.booking_id
                                                                                                )
                                                                                            }
                                                                                        >

                                                                                            Reject

                                                                                        </button>

                                                                                    </div>

                                                                                ) : (

                                                                                    <span className="booking-processed">

                                                                                        Processed

                                                                                    </span>

                                                                                )}

                                                                            </td>

                                                                        </tr>

                                                                    )
                                                                )}

                                                            </tbody>

                                                        </table>

                                                    </div>

                                                )}

                                            </div>

                                        </section>

                                    )
                                )

                            )}

                        </>

                    )}

                </div>

            </main>

        </div>

    );
}

export default AdminBookings;