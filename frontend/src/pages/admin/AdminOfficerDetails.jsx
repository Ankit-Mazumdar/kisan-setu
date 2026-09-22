import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../../services/authService.js';

import './AdminDashboard.css';
import './AdminOfficerDetails.css';


function AdminOfficerDetails() {

    const navigate = useNavigate();

    const { officerId } = useParams();

    const [authority, setAuthority] = useState(null);

    const [officer, setOfficer] = useState(null);

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
    // LOAD OFFICER
    // ==========================================

    useEffect(() => {

        const loadOfficer = async () => {

            try {

                setLoading(true);

                setError('');

                const { data } =
                    await api.get(
                        '/admin/officers/'
                    );

                const foundOfficer =
                    data.find(
                        (item) =>
                            String(
                                item.officer_id
                            ) === String(officerId)
                    );

                if (!foundOfficer) {

                    setError(
                        'Officer not found.'
                    );

                    return;
                }

                setOfficer(foundOfficer);

            } catch (error) {

                console.error(
                    'Officer details error:',
                    error
                );

                setError(
                    'Unable to load officer details.'
                );

            } finally {

                setLoading(false);

            }

        };

        loadOfficer();

    }, [officerId]);


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem(
            'kisansetu_admin_session'
        );

        navigate('/admin/login');

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="admin-loading">

                Loading officer details...

            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="admin-officer-details-error">

                <h2>
                    Unable to load officer
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate(
                            '/admin/officers'
                        )
                    }
                >
                    ← Back to Officers
                </button>

            </div>
        );

    }


    return (

        <div className="admin-layout">


            {/* ==================================
                SIDEBAR
            ================================== */}

            <aside className="admin-sidebar">


                <div className="admin-brand">

                    <div className="admin-brand-name">

                        Kisan
                        <span>
                            Setu
                        </span>

                    </div>

                    <div className="admin-brand-role">

                        AUTHORITY PORTAL

                    </div>

                </div>


                <nav className="admin-nav">


                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate(
                                '/admin/dashboard'
                            )
                        }
                    >
                        <span>
                            ▦
                        </span>

                        Dashboard

                    </button>


                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate(
                                '/admin/farmers'
                            )
                        }
                    >
                        <span>
                            👨‍🌾
                        </span>

                        Farmers

                    </button>


                    <button
                        className="admin-nav-item active"
                        onClick={() =>
                            navigate(
                                '/admin/officers'
                            )
                        }
                    >
                        <span>
                            👨‍💼
                        </span>

                        Officers

                    </button>


                    <button
                        className="admin-nav-item"
                    >
                        <span>
                            📍
                        </span>

                        Centres

                    </button>


                    <button
                        className="admin-nav-item"
                    >
                        <span>
                            📅
                        </span>

                        Bookings

                    </button>


                    <button
                        className="admin-nav-item"
                    >
                        <span>
                            🌾
                        </span>

                        Procurement

                    </button>


                    <button
                        className="admin-nav-item"
                    >
                        <span>
                            ₹
                        </span>

                        Payments

                    </button>


                </nav>


                <div className="admin-sidebar-bottom">

                    <button
                        className="admin-logout"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>

                </div>

            </aside>


            {/* ==================================
                MAIN
            ================================== */}

            <main className="admin-main">


                {/* ==================================
                    TOP BAR
                ================================== */}

                <header className="admin-topbar">

                    <div>

                        <h1>
                            Officer Details
                        </h1>

                        <p>
                            View officer account
                            and centre information.
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
                    BACK
                ================================== */}

                <button
                    className="officer-details-back"
                    onClick={() =>
                        navigate(
                            '/admin/officers'
                        )
                    }
                >
                    ← Back to Officers
                </button>


                {/* ==================================
                    OFFICER HEADER
                ================================== */}

                <section className="officer-details-header">

                    <div className="officer-details-avatar">

                        {officer?.full_name
                            ?.charAt(0)
                            ?.toUpperCase()}

                    </div>


                    <div className="officer-details-title">

                        <h2>
                            {officer?.full_name}
                        </h2>

                        <p>
                            Officer ID #
                            {officer?.officer_id}
                        </p>

                    </div>


                    <span
                        className={
                            officer?.status === 'ACTIVE'
                                ? 'officer-detail-status-active'
                                : 'officer-detail-status-inactive'
                        }
                    >
                        {officer?.status}
                    </span>

                </section>


                {/* ==================================
                    OFFICER INFORMATION
                ================================== */}

                <section className="officer-details-card">

                    <div className="officer-details-card-heading">

                        <h3>
                            Officer Information
                        </h3>

                    </div>


                    <div className="officer-details-grid">


                        <div className="officer-detail-item">

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {officer?.full_name || '—'}
                            </strong>

                        </div>


                        <div className="officer-detail-item">

                            <span>
                                Officer ID
                            </span>

                            <strong>
                                #{officer?.officer_id}
                            </strong>

                        </div>


                        <div className="officer-detail-item">

                            <span>
                                Mobile Number
                            </span>

                            <strong>
                                {officer?.phone || '—'}
                            </strong>

                        </div>


                        <div className="officer-detail-item">

                            <span>
                                Email
                            </span>

                            <strong>
                                {officer?.email || '—'}
                            </strong>

                        </div>


                        <div className="officer-detail-item">

                            <span>
                                Account Status
                            </span>

                            <strong>
                                {officer?.status || '—'}
                            </strong>

                        </div>


                        <div className="officer-detail-item">

                            <span>
                                Registered On
                            </span>

                            <strong>
                                {officer?.created_at
                                    ? new Date(
                                        officer.created_at
                                      ).toLocaleDateString(
                                        'en-IN'
                                      )
                                    : '—'}
                            </strong>

                        </div>


                    </div>

                </section>


                {/* ==================================
                    CENTRE INFORMATION
                ================================== */}

                <section className="officer-details-card">

                    <div className="officer-details-card-heading">

                        <h3>
                            Assigned Procurement Centre
                        </h3>

                    </div>


                    <div className="officer-details-grid">


                        <div className="officer-detail-item">

                            <span>
                                Centre Name
                            </span>

                            <strong>
                                {
                                    officer?.centre_name
                                    || '—'
                                }
                            </strong>

                        </div>


                        <div className="officer-detail-item">

                            <span>
                                Centre ID
                            </span>

                            <strong>
                                #
                                {
                                    officer?.centre_id
                                }
                            </strong>

                        </div>


                    </div>

                </section>


            </main>

        </div>

    );

}


export default AdminOfficerDetails;