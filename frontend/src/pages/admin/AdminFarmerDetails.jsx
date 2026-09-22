import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../../services/authService.js';

import './AdminDashboard.css';
import './AdminFarmerDetails.css';


function AdminFarmerDetails() {

    const navigate = useNavigate();

    const { farmerId } = useParams();

    const [authority, setAuthority] = useState(null);

    const [farmer, setFarmer] = useState(null);

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
    // LOAD FARMER
    // ==========================================

    useEffect(() => {

        const loadFarmer = async () => {

            try {

                setLoading(true);

                setError('');

                const { data } =
                    await api.get(
                        `/farmer/${farmerId}/`
                    );

                setFarmer(data);

            } catch (error) {

                console.error(
                    'Farmer details error:',
                    error
                );

                if (
                    error.response &&
                    error.response.data
                ) {

                    setError(
                        error.response.data.message ||
                        'Unable to load farmer details.'
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

        loadFarmer();

    }, [farmerId]);


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

                Loading farmer details...

            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="admin-farmer-details-error">

                <h2>
                    Unable to load farmer
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate('/admin/farmers')
                    }
                >
                    ← Back to Farmers
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
                        className="admin-nav-item active"
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
                        className="admin-nav-item"
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
                MAIN CONTENT
            ================================== */}

            <main className="admin-main">


                {/* ==================================
                    TOP BAR
                ================================== */}

                <header className="admin-topbar">

                    <div>

                        <h1>
                            Farmer Details
                        </h1>

                        <p>
                            View registered farmer
                            information.
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
                    BACK BUTTON
                ================================== */}

                <button
                    className="farmer-details-back"
                    onClick={() =>
                        navigate(
                            '/admin/farmers'
                        )
                    }
                >
                    ← Back to Farmers
                </button>


                {/* ==================================
                    FARMER HEADER
                ================================== */}

                <section className="farmer-details-header">

                    <div className="farmer-details-avatar">

                        {farmer?.full_name
                            ?.charAt(0)
                            ?.toUpperCase()}

                    </div>

                    <div>

                        <h2>
                            {farmer?.full_name}
                        </h2>

                        <p>
                            Farmer ID #
                            {farmer?.farmer_id}
                        </p>

                    </div>

                </section>


                {/* ==================================
                    PERSONAL INFORMATION
                ================================== */}

                <section className="farmer-details-card">

                    <div className="farmer-details-card-heading">

                        <h3>
                            Personal Information
                        </h3>

                    </div>


                    <div className="farmer-details-grid">


                        <div className="farmer-detail-item">

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {farmer?.full_name || '—'}
                            </strong>

                        </div>


                        <div className="farmer-detail-item">

                            <span>
                                Mobile Number
                            </span>

                            <strong>
                                {farmer?.phone || '—'}
                            </strong>

                        </div>


                        <div className="farmer-detail-item">

                            <span>
                                Email
                            </span>

                            <strong>
                                {farmer?.email ||
                                    'Not provided'}
                            </strong>

                        </div>


                        <div className="farmer-detail-item">

                            <span>
                                Aadhaar Number
                            </span>

                            <strong>
                                {farmer?.aadhaar_no ||
                                    'Not provided'}
                            </strong>

                        </div>


                        <div className="farmer-detail-item">

                            <span>
                                Government ID
                            </span>

                            <strong>
                                {farmer?.farmer_govt_id ||
                                    'Not provided'}
                            </strong>

                        </div>


                    </div>

                </section>


                {/* ==================================
                    ADDRESS
                ================================== */}

                <section className="farmer-details-card">

                    <div className="farmer-details-card-heading">

                        <h3>
                            Address Information
                        </h3>

                    </div>


                    <div className="farmer-details-grid">


                        <div className="farmer-detail-item farmer-detail-wide">

                            <span>
                                Address
                            </span>

                            <strong>
                                {farmer?.address || '—'}
                            </strong>

                        </div>


                        <div className="farmer-detail-item">

                            <span>
                                Village
                            </span>

                            <strong>
                                {farmer?.village || '—'}
                            </strong>

                        </div>


                        <div className="farmer-detail-item">

                            <span>
                                District
                            </span>

                            <strong>
                                {farmer?.district || '—'}
                            </strong>

                        </div>


                        <div className="farmer-detail-item">

                            <span>
                                State
                            </span>

                            <strong>
                                {farmer?.state || '—'}
                            </strong>

                        </div>


                    </div>

                </section>


            </main>

        </div>

    );

}


export default AdminFarmerDetails;