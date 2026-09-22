import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/authService.js';

import AdminSidebar from '../../pages/admin/AdminSidebar';

import './AdminDashboard.css';
import './AdminOfficers.css';


function AdminOfficers() {

    const navigate = useNavigate();

    const [authority, setAuthority] = useState(null);

    const [officers, setOfficers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [search, setSearch] = useState('');

    const [searchText, setSearchText] = useState('');


    // ==========================================
    // CHECK AUTHORITY LOGIN
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
    // LOAD OFFICERS
    // ==========================================

    useEffect(() => {

        const loadOfficers = async () => {

            try {

                setLoading(true);

                setError('');

                const { data } =
                    await api.get(
                        '/admin/officers/'
                    );

                setOfficers(data);

            } catch (error) {

                console.error(
                    'Officer loading error:',
                    error
                );

                if (
                    error.response &&
                    error.response.data
                ) {

                    setError(
                        error.response.data.message ||
                        'Unable to load officers.'
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

        loadOfficers();

    }, []);


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredOfficers =
        officers.filter((officer) => {

            const text =
                searchText
                    .toLowerCase()
                    .trim();

            if (!text) {
                return true;
            }

            return (

                officer.full_name
                    ?.toLowerCase()
                    .includes(text)

                ||

                officer.email
                    ?.toLowerCase()
                    .includes(text)

                ||

                officer.phone
                    ?.toLowerCase()
                    .includes(text)

                ||

                officer.centre_name
                    ?.toLowerCase()
                    .includes(text)

            );

        });


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem(
            'kisansetu_admin_session'
        );

        navigate('/admin/login');

    };



    const handleStatusChange = async (officer) => {

    const newStatus =
        officer.status === 'ACTIVE'
            ? 'INACTIVE'
            : 'ACTIVE';

    const action =
        newStatus === 'ACTIVE'
            ? 'activate'
            : 'deactivate';

    const confirmed = window.confirm(
        `Are you sure you want to ${action} ${officer.full_name}?`
    );

    if (!confirmed) {
        return;
    }

    try {

        await api.post(
            `/admin/officers/${officer.officer_id}/status/`,
            {
                status: newStatus
            }
        );

        setOfficers((currentOfficers) =>
            currentOfficers.map((item) =>
                item.officer_id === officer.officer_id
                    ? {
                        ...item,
                        status: newStatus
                    }
                    : item
            )
        );

    } catch (error) {

        console.error(
            'Officer status update error:',
            error
        );

        alert(
            error.response?.data?.message ||
            'Unable to update officer status.'
        );

    }
};


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="admin-loading">

                Loading officers...

            </div>
        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="admin-layout">


            {/* ==================================
                SIDEBAR
            ================================== */}

            <AdminSidebar />
{/* 
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


                {/* TOP BAR */}

                <header className="admin-topbar">

                    <div>

                        <h1>
                            Officers
                        </h1>

                        <p>
                            Manage procurement officers
                            and their assigned centres.
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


                {/* PAGE HEADER */}

                <section className="admin-officers-heading">

                    <div>

                        <h2>
                            Officer Management
                        </h2>

                        <p>
                            {officers.length}
                            {' '}
                            officer
                            {officers.length !== 1
                                ? 's'
                                : ''}
                            {' '}
                            registered
                        </p>

                    </div>


                    <button
                        className="admin-add-officer-btn"
                        onClick={() =>
                            navigate(
                                '/admin/officers/add'
                            )
                        }
                    >
                        + Add Officer
                    </button>

                </section>


                {/* SEARCH */}

                <div className="admin-officer-search">

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

                                setSearchText(
                                    search
                                );

                            }

                        }}
                        placeholder="Search officer, mobile, centre..."
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setSearchText(
                                search
                            )
                        }
                    >
                        Search
                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="admin-error">

                        {error}

                    </div>

                )}


                {/* TABLE */}

                <div className="admin-officer-table-wrapper">

                    <table className="admin-officer-table">

                        <thead>

                            <tr>

                                <th>
                                    Officer
                                </th>

                                <th>
                                    Mobile
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Centre
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

                            {filteredOfficers.length > 0 ? (

                                filteredOfficers.map(
                                    (officer) => (

                                        <tr
                                            key={
                                                officer.officer_id
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/admin/officers/${officer.officer_id}`
                                                )
                                            }
                                            className="admin-officer-row"
                                        >

                                            <td>

                                                <div className="admin-officer-name">

                                                    <div className="admin-officer-avatar">

                                                        {officer.full_name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                officer.full_name
                                                            }
                                                        </strong>

                                                        <span>
                                                            Officer ID #
                                                            {
                                                                officer.officer_id
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>
                                                {
                                                    officer.phone
                                                }
                                            </td>


                                            <td>
                                                {
                                                    officer.email
                                                }
                                            </td>


                                            <td>
                                                {
                                                    officer.centre_name
                                                }
                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        officer.status ===
                                                        'ACTIVE'
                                                            ? 'admin-status-active'
                                                            : 'admin-status-inactive'
                                                    }
                                                >
                                                    {
                                                        officer.status
                                                    }
                                                </span>

                                            </td>


                                            <td>

    <button
        type="button"
        className={
            officer.status === 'ACTIVE'
                ? 'admin-officer-action deactivate'
                : 'admin-officer-action activate'
        }
        onClick={(e) => {

            e.stopPropagation();

            handleStatusChange(
                officer
            );

        }}
    >
        {
            officer.status === 'ACTIVE'
                ? 'Deactivate'
                : 'Activate'
        }
    </button>

</td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="admin-officer-empty"
                                    >
                                        No officers found.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


            </main>

        </div>

    );

}


export default AdminOfficers;