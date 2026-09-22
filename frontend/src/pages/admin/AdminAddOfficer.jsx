import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/authService.js';

import './AdminDashboard.css';
import './AdminAddOfficer.css';


function AdminAddOfficer() {

    const navigate = useNavigate();

    const [authority, setAuthority] = useState(null);

    const [centres, setCentres] = useState([]);

    const [loadingCentres, setLoadingCentres] = useState(true);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');

    const [success, setSuccess] = useState('');

    const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({

        fullName: '',
        email: '',
        phone: '',
        centreId: '',
        password: '',
        confirmPassword: ''

    });


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
    // LOAD CENTRES
    // ==========================================

    useEffect(() => {

        const loadCentres = async () => {

            try {

                setLoadingCentres(true);

                const { data } =
                    await api.get(
                        '/centres/'
                    );

                setCentres(data);

            } catch (error) {

                console.error(
                    'Centre loading error:',
                    error
                );

                setError(
                    'Unable to load procurement centres.'
                );

            } finally {

                setLoadingCentres(false);

            }

        };

        loadCentres();

    }, []);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');

        setSuccess('');


        // PASSWORD CHECK

        if (
            form.password !==
            form.confirmPassword
        ) {

            setError(
                'Passwords do not match.'
            );

            return;
        }


        if (
            form.password.length < 8
        ) {

            setError(
                'Password must be at least 8 characters.'
            );

            return;
        }


        setLoading(true);


        try {

            await api.post(
                '/admin/officers/create/',
                {

                    full_name:
                        form.fullName,

                    email:
                        form.email,

                    phone:
                        form.phone,

                    password:
                        form.password,

                    centre_id:
                        form.centreId

                }
            );


            setSuccess(
                'Officer created successfully.'
            );


            setForm({

                fullName: '',
                email: '',
                phone: '',
                centreId: '',
                password: '',
                confirmPassword: ''

            });


        } catch (error) {

            console.error(
                'Create officer error:',
                error
            );

            if (
                error.response &&
                error.response.data
            ) {

                setError(
                    error.response.data.message ||
                    'Unable to create officer.'
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
                            Add Officer
                        </h1>

                        <p>
                            Create a procurement
                            officer account.
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
                    className="add-officer-back"
                    onClick={() =>
                        navigate(
                            '/admin/officers'
                        )
                    }
                >
                    ← Back to Officers
                </button>


                {/* ==================================
                    FORM CARD
                ================================== */}

                <section className="add-officer-card">


                    <div className="add-officer-card-heading">

                        <h2>
                            Officer Account
                        </h2>

                        <p>
                            Enter the officer's
                            account and centre details.
                        </p>

                    </div>


                    <form
                        className="add-officer-form"
                        onSubmit={handleSubmit}
                    >


                        {/* ERROR */}

                        {error && (

                            <div className="add-officer-error">

                                {error}

                            </div>

                        )}


                        {/* SUCCESS */}

                        {success && (

                            <div className="add-officer-success">

                                {success}

                            </div>

                        )}


                        {/* ==================================
                            FULL NAME
                        ================================== */}

                        <div className="add-officer-field">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                value={
                                    form.fullName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter officer full name"
                                required
                            />

                        </div>


                        {/* ==================================
                            EMAIL
                        ================================== */}

                        <div className="add-officer-field">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter officer email"
                                required
                            />

                        </div>


                        {/* ==================================
                            MOBILE
                        ================================== */}

                        <div className="add-officer-field">

                            <label>
                                Mobile Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={
                                    form.phone
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter 10-digit mobile number"
                                maxLength="10"
                                pattern="[6-9][0-9]{9}"
                                required
                            />

                        </div>


                        {/* ==================================
                            CENTRE
                        ================================== */}

                        <div className="add-officer-field">

                            <label>
                                Procurement Centre
                            </label>

                            <select
                                name="centreId"
                                value={
                                    form.centreId
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                disabled={
                                    loadingCentres
                                }
                            >

                                <option value="">
                                    {loadingCentres
                                        ? 'Loading centres...'
                                        : 'Select procurement centre'}
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


                        {/* ==================================
                            PASSWORD
                        ================================== */}

                        <div className="add-officer-field">
    <label>
        Temporary Password
    </label>

    <div className="password-input-wrapper">
        <input
            type={
                showPassword
                    ? 'text'
                    : 'password'
            }
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create officer password"
            required
        />

        <button
            type="button"
            className="password-toggle"
            onClick={() =>
                setShowPassword(
                    !showPassword
                )
            }
        >
            {showPassword ? 'Hide' : 'Show'}
        </button>
    </div>

    <small>
        Minimum 8 characters.
    </small>
</div>

                        {/* ==================================
                            CONFIRM PASSWORD
                        ================================== */}

                        <div className="add-officer-field">
    <label>
        Confirm Password
    </label>

    <div className="password-input-wrapper">
        <input
            type={
                showConfirmPassword
                    ? 'text'
                    : 'password'
            }
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm officer password"
            required
        />

        <button
            type="button"
            className="password-toggle"
            onClick={() =>
                setShowConfirmPassword(
                    !showConfirmPassword
                )
            }
        >
            {showConfirmPassword
                ? 'Hide'
                : 'Show'}
        </button>
    </div>
</div>

                        {/* ==================================
                            ACTIONS
                        ================================== */}

                        <div className="add-officer-actions">

                            <button
                                type="button"
                                className="add-officer-cancel"
                                onClick={() =>
                                    navigate(
                                        '/admin/officers'
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="add-officer-submit"
                                disabled={
                                    loading
                                }
                            >

                                {loading
                                    ? 'Creating Officer...'
                                    : 'Create Officer'}

                            </button>

                        </div>


                    </form>

                </section>


            </main>

        </div>

    );

}


export default AdminAddOfficer;