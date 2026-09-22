import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './AdminSidebar.css';


function AdminSidebar() {

    const navigate = useNavigate();
    const location = useLocation();


    // ==========================================
    // CHECK ACTIVE PAGE
    // ==========================================

    const isActive = (path) => {

        return location.pathname === path ||
               location.pathname.startsWith(path + '/');

    };


    // ==========================================
    // NAVIGATION
    // ==========================================

    const goTo = (path) => {

        navigate(path);

    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem(
            'kisansetu_admin_session'
        );

        navigate('/admin/login');

    };


    return (

        <aside className="admin-sidebar">


            {/* ==================================
                BRAND
            ================================== */}

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


            {/* ==================================
                NAVIGATION
            ================================== */}

            <nav className="admin-nav">


                {/* Dashboard */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/dashboard')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        goTo('/admin/dashboard')
                    }
                >

                    <span>
                        ▦
                    </span>

                    Dashboard

                </button>


                {/* Farmers */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/farmers')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        goTo('/admin/farmers')
                    }
                >

                    <span>
                        👨‍🌾
                    </span>

                    Farmers

                </button>


                {/* Officers */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/officers')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        goTo('/admin/officers')
                    }
                >

                    <span>
                        👨‍💼
                    </span>

                    Officers

                </button>


                {/* Centres */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/centres')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        goTo('/admin/centres')
                    }
                >

                    <span>
                        📍
                    </span>

                    Centres

                </button>

                                {/* Prices */}
                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/prices')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        goTo('/admin/prices')
                    }
                >
                    <span>
                        ₹
                    </span>
                    Prices
                </button>


                {/* Bookings */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/bookings')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        goTo('/admin/bookings')
                    }
                >

                    <span>
                        📅
                    </span>

                    Bookings

                </button>


                {/* Procurement */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/procurement')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        goTo('/admin/procurement')
                    }
                >

                    <span>
                        🌾
                    </span>

                    Procurement

                </button>


                {/* Payments */}

                <button
                    type="button"
                    className={`admin-nav-item ${
                        isActive('/admin/payments')
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        goTo('/admin/payments')
                    }
                >

                    <span>
                        ₹
                    </span>

                    Payments

                </button>


            </nav>


            {/* ==================================
                LOGOUT
            ================================== */}

            <div className="admin-sidebar-bottom">

                <button
                    type="button"
                    className="admin-logout"
                    onClick={handleLogout}
                >

                    ↪ Logout

                </button>

            </div>


        </aside>

    );

}


export default AdminSidebar;