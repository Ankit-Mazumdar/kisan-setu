import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import api from '../../services/authService.js';

import './AdminDashboard.css';
import AdminSidebar from './AdminSidebar.jsx';


function AdminDashboard() {

    const navigate = useNavigate();

    const [authority, setAuthority] = useState(null);

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');


    // ==========================================
    // CHECK AUTHORITY SESSION
    // ==========================================

    useEffect(() => {

        const session =
            localStorage.getItem(
                'kisansetu_admin_session'
            );

        if (!session) {

            navigate('/admin/login');

            return;
        }

        try {

            const admin =
                JSON.parse(session);

            setAuthority(admin);

        } catch (error) {

            localStorage.removeItem(
                'kisansetu_admin_session'
            );

            navigate('/admin/login');

        }

    }, [navigate]);


    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                setError('');

                const { data } =
                    await api.get(
                        '/admin/dashboard/'
                    );

                setDashboard(data);

            } catch (error) {

                console.error(
                    'Dashboard error:',
                    error
                );

                if (
                    error.response &&
                    error.response.data
                ) {

                    setError(
                        error.response.data.message ||
                        'Unable to load dashboard.'
                    );

                } else {

                    setError(
                        'Unable to connect to the server.'
                    );

                }

            } finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);


    // ==========================================
    // LOGOUT
    // ==========================================

    // const handleLogout = () => {

    //     localStorage.removeItem(
    //         'kisansetu_admin_session'
    //     );

    //     navigate('/admin/login');

    // };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="admin-page">

                <div className="admin-loading">

                    Loading dashboard...

                </div>

            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="admin-page">

                <div className="admin-error">

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="btn btn--primary"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );

    }


    // ==========================================
    // FORMAT MONEY
    // ==========================================

    const formatMoney = (amount) => {

        return new Intl.NumberFormat(
            'en-IN',
            {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 2
            }
        ).format(amount || 0);

    };


    // ==========================================
    // FORMAT NUMBER
    // ==========================================

    const formatNumber = (number) => {

        return new Intl.NumberFormat(
            'en-IN'
        ).format(number || 0);

    };


    return (

        <div className="admin-layout">


{/* ==================================
    SIDEBAR
================================== */}

<AdminSidebar />


            {/* ==================================
                MAIN CONTENT
            ================================== */}

            <main className="admin-main">


                {/* ==================================
                    TOP BAR
                ================================== */}

                <header className="admin-topbar">

                    <div>

                        <h1>
                            Authority Dashboard
                        </h1>

                        <p>
                            Monitor and manage
                            KisanSetu procurement operations.
                        </p>

                    </div>


                    <div className="admin-account">

                        <div className="admin-account-avatar">

                            {authority?.full_name
                                ?.charAt(0)
                                ?.toUpperCase() || 'A'}

                        </div>

                        <div>

                            <strong>
                                {authority?.full_name ||
                                    'Authority'}
                            </strong>

                            <span>
                                Authority
                            </span>

                        </div>

                    </div>

                </header>


                {/* ==================================
                    OVERVIEW CARDS
                ================================== */}

                <section className="admin-section">


                    <div className="admin-section-heading">

                        <div>

                            <h2>
                                Overview
                            </h2>

                            <p>
                                Current KisanSetu system
                                statistics.
                            </p>

                        </div>

                    </div>


                    <div className="admin-stats-grid">


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                👨‍🌾
                            </div>

                            <div>

                                <span>
                                    Total Farmers
                                </span>

                                <strong>
                                    {formatNumber(
                                        dashboard?.total_farmers
                                    )}
                                </strong>

                            </div>

                        </div>


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                👨‍💼
                            </div>

                            <div>

                                <span>
                                    Total Officers
                                </span>

                                <strong>
                                    {formatNumber(
                                        dashboard?.total_officers
                                    )}
                                </strong>

                            </div>

                        </div>


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                📍
                            </div>

                            <div>

                                <span>
                                    Total Centres
                                </span>

                                <strong>
                                    {formatNumber(
                                        dashboard?.total_centres
                                    )}
                                </strong>

                            </div>

                        </div>


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                📅
                            </div>

                            <div>

                                <span>
                                    Total Bookings
                                </span>

                                <strong>
                                    {formatNumber(
                                        dashboard?.total_bookings
                                    )}
                                </strong>

                            </div>

                        </div>


                    </div>

                </section>


                {/* ==================================
                    PROCUREMENT + PAYMENT
                ================================== */}

                <section className="admin-highlight-grid">


                    <div className="admin-highlight-card">

                        <div>

                            <span>
                                Total Procurement
                            </span>

                            <strong>
                                {formatNumber(
                                    dashboard?.total_procurement_quantity
                                )}{' '}
                                kg
                            </strong>

                            <small>
                                Today's procurement:{' '}
                                {formatNumber(
                                    dashboard?.todays_procurement_quantity
                                )}{' '}
                                kg
                            </small>

                        </div>

                        <div className="admin-highlight-icon">
                            🌾
                        </div>

                    </div>


                    <div className="admin-highlight-card">

                        <div>

                            <span>
                                Total Money Paid
                            </span>

                            <strong>
                                {formatMoney(
                                    dashboard?.total_amount_paid
                                )}
                            </strong>

                            <small>
                                Today's payment:{' '}
                                {formatMoney(
                                    dashboard?.todays_amount_paid
                                )}
                            </small>

                        </div>

                        <div className="admin-highlight-icon">
                            ₹
                        </div>

                    </div>


                </section>


                {/* ==================================
                    TODAY'S OVERVIEW
                ================================== */}

                <section className="admin-section">


                    <div className="admin-section-heading">

                        <div>

                            <h2>
                                Today's Overview
                            </h2>

                            <p>
                                Activity recorded today.
                            </p>

                        </div>

                    </div>


                    <div className="admin-today-grid">


                        <div className="admin-today-card">

                            <span>
                                Today's Bookings
                            </span>

                            <strong>
                                {formatNumber(
                                    dashboard?.todays_bookings
                                )}
                            </strong>

                        </div>


                        <div className="admin-today-card">

                            <span>
                                Pending Bookings
                            </span>

                            <strong>
                                {formatNumber(
                                    dashboard?.pending_bookings
                                )}
                            </strong>

                        </div>


                        <div className="admin-today-card">

                            <span>
                                Pending Payments
                            </span>

                            <strong>
                                {formatNumber(
                                    dashboard?.pending_payments
                                )}
                            </strong>

                        </div>


                    </div>

                </section>


                {/* ==================================
                    CROP SUMMARY
                ================================== */}

                <section className="admin-section">


                    <div className="admin-section-heading">

                        <div>

                            <h2>
                                Crop-wise Procurement
                            </h2>

                            <p>
                                Procurement quantity and
                                paid amount by crop.
                            </p>

                        </div>

                    </div>


                    <div className="admin-table-wrapper">

                        <table className="admin-table">

                            <thead>

                                <tr>

                                    <th>
                                        Crop
                                    </th>

                                    <th>
                                        Quantity
                                    </th>

                                    <th>
                                        Amount Paid
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {dashboard?.crop_summary &&
                                dashboard.crop_summary.length > 0 ? (

                                    dashboard.crop_summary.map(
                                        (crop, index) => (

                                            <tr
                                                key={index}
                                            >

                                                <td>

                                                    <strong>
                                                        {crop.crop_name}
                                                    </strong>

                                                </td>

                                                <td>

                                                    {formatNumber(
                                                        crop.quantity
                                                    )}{' '}
                                                    kg

                                                </td>

                                                <td>

                                                    {formatMoney(
                                                        crop.amount_paid
                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="3"
                                            className="admin-empty"
                                        >
                                            No procurement
                                            data available.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>


            </main>

        </div>

    );

}


export default AdminDashboard;