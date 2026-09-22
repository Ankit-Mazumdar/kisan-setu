import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../../services/authService.js';

import './AdminDashboard.css';
import './AdminCentreDetails.css';


function AdminCentreDetails() {

    const navigate = useNavigate();
    const { centreId } = useParams();

    const [authority, setAuthority] = useState(null);

    const [centre, setCentre] = useState(null);

    const [prices, setPrices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [priceLoading, setPriceLoading] = useState(true);

    const [error, setError] = useState('');

    const [priceError, setPriceError] = useState('');


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


    useEffect(() => {

        const loadCentre = async () => {

            try {

                setLoading(true);
                setError('');

                const { data } =
                    await api.get(
                        `/admin/centres/${centreId}/`
                    );

                setCentre(data);

            } catch (error) {

                console.error(
                    'Centre details error:',
                    error
                );

                if (
                    error.response &&
                    error.response.data
                ) {

                    setError(
                        error.response.data.message ||
                        'Unable to load centre details.'
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

        loadCentre();

    }, [centreId]);


    useEffect(() => {

        const loadCentrePrices = async () => {

            try {

                setPriceLoading(true);
                setPriceError('');

                const { data } =
                    await api.get(
                        '/crop-prices/'
                    );

                const centrePrices =
                    data.filter(
                        (price) =>
                            String(price.centre) ===
                            String(centreId)
                    );

                setPrices(centrePrices);

            } catch (error) {

                console.error(
                    'Centre price loading error:',
                    error
                );

                setPriceError(
                    error.response?.data?.message ||
                    'Unable to load procurement prices.'
                );

            } finally {

                setPriceLoading(false);

            }

        };

        loadCentrePrices();

    }, [centreId]);


    const handleLogout = () => {

        localStorage.removeItem(
            'kisansetu_admin_session'
        );

        navigate('/admin/login');

    };


    if (loading) {

        return (
            <div className="admin-layout">

                <aside className="admin-sidebar">

                    <div className="admin-brand">

                        <div className="admin-brand-name">
                            Kisan
                            <span>Setu</span>
                        </div>

                        <div className="admin-brand-role">
                            AUTHORITY PORTAL
                        </div>

                    </div>

                </aside>

                <main className="admin-main">

                    <div className="centre-details-state">
                        Loading centre details...
                    </div>

                </main>

            </div>
        );

    }


    if (error || !centre) {

        return (
            <div className="admin-layout">

                <aside className="admin-sidebar">

                    <div className="admin-brand">

                        <div className="admin-brand-name">
                            Kisan
                            <span>Setu</span>
                        </div>

                        <div className="admin-brand-role">
                            AUTHORITY PORTAL
                        </div>

                    </div>

                    <div className="admin-sidebar-bottom">

                        <button
                            className="admin-logout"
                            onClick={handleLogout}
                        >
                            ↪ Logout
                        </button>

                    </div>

                </aside>

                <main className="admin-main">

                    <div className="centre-details-error">

                        {error ||
                            'Centre not found.'}

                    </div>

                    <button
                        className="centre-details-back"
                        onClick={() =>
                            navigate(
                                '/admin/centres'
                            )
                        }
                    >
                        ← Back to Centres
                    </button>

                </main>

            </div>
        );

    }


    return (

        <div className="admin-layout">

            {/* SIDEBAR */}

            <aside className="admin-sidebar">

                <div className="admin-brand">

                    <div className="admin-brand-name">
                        Kisan
                        <span>Setu</span>
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
                        <span>▦</span>
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
                        <span>👨‍🌾</span>
                        Farmers
                    </button>


                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate(
                                '/admin/officers'
                            )
                        }
                    >
                        <span>👨‍💼</span>
                        Officers
                    </button>


                    <button
                        className="admin-nav-item active"
                        onClick={() =>
                            navigate(
                                '/admin/centres'
                            )
                        }
                    >
                        <span>📍</span>
                        Centres
                    </button>


                    <button
                        className="admin-nav-item"
                    >
                        <span>📅</span>
                        Bookings
                    </button>


                    <button
                        className="admin-nav-item"
                    >
                        <span>🌾</span>
                        Procurement
                    </button>


                    <button
                        className="admin-nav-item"
                    >
                        <span>₹</span>
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


            {/* MAIN */}

            <main className="admin-main">

                <header className="admin-topbar">

                    <div>

                        <h1>
                            Centre Details
                        </h1>

                        <p>
                            View procurement centre information and assigned officers.
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


                <button
                    className="centre-details-back"
                    onClick={() =>
                        navigate(
                            '/admin/centres'
                        )
                    }
                >
                    ← Back to Centres
                </button>


                {/* CENTRE HEADER */}

                <section className="centre-profile-card">

                    <div className="centre-profile-icon">
                        📍
                    </div>


                    <div className="centre-profile-info">

                        <h2>
                            {centre.centre_name}
                        </h2>

                        <p>
                            Centre ID: {centre.centre_id}
                        </p>

                    </div>

                </section>


                {/* INFORMATION */}

                <section className="centre-info-card">

                    <div className="centre-section-heading">

                        <div>

                            <h2>
                                Centre Information
                            </h2>

                            <p>
                                Basic details of this procurement centre.
                            </p>

                        </div>

                    </div>


                    <div className="centre-info-grid">

                        <div className="centre-info-item">

                            <span>
                                Address
                            </span>

                            <strong>
                                {centre.address || '—'}
                            </strong>

                        </div>


                        <div className="centre-info-item">

                            <span>
                                District
                            </span>

                            <strong>
                                {centre.district || '—'}
                            </strong>

                        </div>


                        <div className="centre-info-item">

                            <span>
                                State
                            </span>

                            <strong>
                                {centre.state || '—'}
                            </strong>

                        </div>


                        <div className="centre-info-item">

                            <span>
                                Capacity
                            </span>

                            <strong>
                                {centre.capacity
                                    ? `${centre.capacity} farmers/day`
                                    : '—'}
                            </strong>

                        </div>


                        <div className="centre-info-item">

                            <span>
                                Latitude
                            </span>

                            <strong>
                                {centre.latitude || '—'}
                            </strong>

                        </div>


                        <div className="centre-info-item">

                            <span>
                                Longitude
                            </span>

                            <strong>
                                {centre.longitude || '—'}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* PROCUREMENT PRICES */}

                <section className="centre-info-card centre-price-card">

                    <div className="centre-section-heading">

                        <div>

                            <h2>
                                Procurement Prices
                            </h2>

                            <p>
                                Current crop prices available at this centre.
                            </p>

                        </div>


                        <span className="centre-price-unit">
                            Price / KG
                        </span>

                    </div>


                    {priceLoading ? (

                        <div className="centre-price-state">
                            Loading procurement prices...
                        </div>

                    ) : priceError ? (

                        <div className="centre-price-error">
                            {priceError}
                        </div>

                    ) : prices.length === 0 ? (

                        <div className="centre-price-empty">

                            <strong>
                                No crop prices available
                            </strong>

                            <span>
                                No procurement price has been added for this centre yet.
                            </span>

                        </div>

                    ) : (

                        <div className="centre-price-table-wrapper">

                            <table className="centre-price-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Crop
                                        </th>

                                        <th>
                                            Variety
                                        </th>

                                        <th>
                                            Current Price
                                        </th>

                                        <th>
                                            Effective Date
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {prices.map(
                                        (price) => (

                                            <tr
                                                key={
                                                    price.price_id
                                                }
                                            >

                                                <td>

                                                    <strong>
                                                        {
                                                            price.crop_name
                                                        }
                                                    </strong>

                                                </td>


                                                <td>
                                                    {
                                                        price.variety ||
                                                        '—'
                                                    }
                                                </td>


                                                <td>

                                                    <span className="centre-price-value">
                                                        ₹
                                                        {
                                                            price.price_per_kg
                                                        }
                                                    </span>

                                                </td>


                                                <td>
                                                    {
                                                        price.effective_date ||
                                                        '—'
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


                {/* OFFICERS */}

                <section className="centre-info-card">

                    <div className="centre-section-heading">

                        <div>

                            <h2>
                                Assigned Officers
                            </h2>

                            <p>
                                Officers currently assigned to this centre.
                            </p>

                        </div>


                        <span className="centre-officer-total">

                            {centre.officer_count || 0}
                            {' '}
                            Officer
                            {centre.officer_count !== 1
                                ? 's'
                                : ''}

                        </span>

                    </div>


                    {centre.officers &&
                    centre.officers.length > 0 ? (

                        <div className="centre-officer-list">

                            {centre.officers.map(
                                (officer) => (

                                    <div
                                        className="centre-officer-row"
                                        key={
                                            officer.officer_id
                                        }
                                        onClick={() =>
                                            navigate(
                                                `/admin/officers/${officer.officer_id}`
                                            )
                                        }
                                    >

                                        <div className="centre-officer-avatar">

                                            {officer.full_name
                                                ?.charAt(0)
                                                ?.toUpperCase() || 'O'}

                                        </div>


                                        <div className="centre-officer-info">

                                            <strong>
                                                {
                                                    officer.full_name
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    officer.email
                                                }
                                            </span>

                                        </div>


                                        <div className="centre-officer-mobile">

                                            {
                                                officer.phone
                                            }

                                        </div>


                                        <span
                                            className={
                                                officer.status ===
                                                'ACTIVE'
                                                    ? 'centre-status active'
                                                    : 'centre-status inactive'
                                            }
                                        >
                                            {
                                                officer.status
                                            }
                                        </span>


                                        <span className="centre-officer-arrow">
                                            →
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="centre-empty-officers">

                            <strong>
                                No officers assigned
                            </strong>

                            <span>
                                No procurement officer is currently assigned to this centre.
                            </span>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}


export default AdminCentreDetails;