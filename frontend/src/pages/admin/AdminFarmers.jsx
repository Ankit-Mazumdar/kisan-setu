import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/authService.js';

import AdminSidebar from '../../pages/admin/AdminSidebar';

import './AdminFarmers.css';


function AdminFarmers() {

    const navigate = useNavigate();

    const [authority, setAuthority] = useState(null);

    const [farmers, setFarmers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [searchText, setSearchText] = useState('');

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
    // LOAD FARMERS
    // ==========================================

    useEffect(() => {

        const loadFarmers = async () => {

            try {

                setLoading(true);

                setError('');

                const { data } =
                    await api.get(
                        '/admin/farmers/'
                    );

                setFarmers(data);

            } catch (error) {

                console.error(
                    'Farmers error:',
                    error
                );

                if (
                    error.response &&
                    error.response.data
                ) {

                    setError(
                        error.response.data.message ||
                        'Unable to load farmers.'
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

        loadFarmers();

    }, []);


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
    // FILTER FARMERS
    // ==========================================

 const filteredFarmers =
    farmers.filter((farmer) => {

        const text =
            searchText.toLowerCase().trim();

        if (!text) {
            return true;
        }

        return (

            farmer.full_name
                ?.toLowerCase()
                .includes(text)

            ||

            farmer.phone
                ?.toLowerCase()
                .includes(text)

            ||

            farmer.email
                ?.toLowerCase()
                .includes(text)

            ||

            farmer.village
                ?.toLowerCase()
                .includes(text)

            ||

            farmer.district
                ?.toLowerCase()
                .includes(text)

        );

    });


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="admin-farmers-page">

                <div className="admin-farmers-loading">

                    Loading farmers...

                </div>

            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="admin-farmers-page">

                <div className="admin-farmers-error">

                    <h2>
                        Unable to load farmers
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
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


    return (

        <div className="admin-layout">


            {/* ==================================
                SIDEBAR
            ================================== */}

            <AdminSidebar />


            {/* <aside className="admin-sidebar">


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

            </aside> */}


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
                            Farmers
                        </h1>

                        <p>
                            View and manage registered
                            KisanSetu farmers.
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
                    FARMER CONTENT
                ================================== */}

                <section className="admin-farmers-content">


                    <div className="admin-farmers-heading">

                        <div>

                            <h2>
                                Registered Farmers
                            </h2>

                            <p>
                                {filteredFarmers.length}
                                {' '}
                                farmer
                                {filteredFarmers.length !== 1
                                    ? 's'
                                    : ''}
                                {' '}
                                found
                            </p>

                        </div>


<div className="admin-farmer-search">

    <span>
        🔎
    </span>

    <input
        type="text"
        value={search}
        onChange={(e) =>
            setSearch(
                e.target.value
            )
        }
        onKeyDown={(e) => {

            if (e.key === 'Enter') {

                setSearchText(search);

            }

        }}
        placeholder="Search farmer, mobile, village..."
    />

    <button
        type="button"
        onClick={() =>
            setSearchText(search)
        }
    >
        Search
    </button>

</div>

                    </div>


                    {/* ==================================
                        TABLE
                    ================================== */}

                    <div className="admin-farmers-table-wrapper">

                        <table className="admin-farmers-table">

                            <thead>

                                <tr>

                                    <th>
                                        Farmer
                                    </th>

                                    <th>
                                        Mobile
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Village
                                    </th>

                                    <th>
                                        District
                                    </th>

                                    <th>
                                        State
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredFarmers.length > 0 ? (

                                    filteredFarmers.map(
                                        (farmer) => (

                                            <tr
    key={farmer.farmer_id}
    onClick={() =>
        navigate(
            `/admin/farmers/${farmer.farmer_id}`
        )
    }
    className="farmer-row-clickable"
>

                                                <td>

                                                    <div className="farmer-name">

                                                        <div className="farmer-avatar">

                                                            {farmer.full_name
                                                                ?.charAt(0)
                                                                ?.toUpperCase()}

                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    farmer.full_name
                                                                }
                                                            </strong>

                                                            <span>
                                                                ID #
                                                                {
                                                                    farmer.farmer_id
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    {farmer.phone ||
                                                        '—'}

                                                </td>


                                                <td>

                                                    {farmer.email ||
                                                        'Not provided'}

                                                </td>


                                                <td>

                                                    {farmer.village ||
                                                        '—'}

                                                </td>


                                                <td>

                                                    {farmer.district ||
                                                        '—'}

                                                </td>


                                                <td>

                                                    {farmer.state ||
                                                        '—'}

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="admin-farmers-empty"
                                        >

                                            No farmers found.

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


export default AdminFarmers;