import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/authService.js';

import './AdminDashboard.css';
import './AdminAddCentre.css';


function AdminAddCentre() {

    const navigate = useNavigate();

    const [authority, setAuthority] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');

    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        centreName: '',
        address: '',
        district: '',
        state: '',
        latitude: '',
        longitude: '',
        capacity: ''
    });


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


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setSuccess('');


        if (!form.centreName.trim()) {

            setError(
                'Centre name is required.'
            );

            return;
        }


        setLoading(true);


        try {

            await api.post(
                '/admin/centres/create/',
                {
                    centre_name:
                        form.centreName.trim(),

                    address:
                        form.address.trim() ||
                        null,

                    district:
                        form.district.trim() ||
                        null,

                    state:
                        form.state.trim() ||
                        null,

                    latitude:
                        form.latitude
                            ? Number(form.latitude)
                            : null,

                    longitude:
                        form.longitude
                            ? Number(form.longitude)
                            : null,

                    capacity:
                        form.capacity
                            ? Number(form.capacity)
                            : null
                }
            );


            setSuccess(
                'Procurement centre created successfully.'
            );


            setForm({
                centreName: '',
                address: '',
                district: '',
                state: '',
                latitude: '',
                longitude: '',
                capacity: ''
            });


        } catch (error) {

            console.error(
                'Create centre error:',
                error
            );


            if (
                error.response &&
                error.response.data
            ) {

                setError(
                    error.response.data.message ||
                    'Unable to create procurement centre.'
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


    const handleLogout = () => {

        localStorage.removeItem(
            'kisansetu_admin_session'
        );

        navigate('/admin/login');

    };


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
                            Add Procurement Centre
                        </h1>

                        <p>
                            Create a new centre for farmer procurement.
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
                    className="add-centre-back"
                    onClick={() =>
                        navigate(
                            '/admin/centres'
                        )
                    }
                >
                    ← Back to Centres
                </button>


                <section className="add-centre-card">

                    <div className="add-centre-heading">

                        <h2>
                            Centre Information
                        </h2>

                        <p>
                            Enter the basic details and location of the procurement centre.
                        </p>

                    </div>


                    <form
                        className="add-centre-form"
                        onSubmit={handleSubmit}
                    >

                        {error && (

                            <div className="add-centre-error">
                                {error}
                            </div>

                        )}


                        {success && (

                            <div className="add-centre-success">
                                {success}
                            </div>

                        )}


                        <div className="add-centre-field">

                            <label>
                                Centre Name
                            </label>

                            <input
                                type="text"
                                name="centreName"
                                value={
                                    form.centreName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter procurement centre name"
                                required
                            />

                        </div>


                        <div className="add-centre-field">

                            <label>
                                Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                value={
                                    form.address
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter centre address"
                            />

                        </div>


                        <div className="add-centre-field">

                            <label>
                                District
                            </label>

                            <input
                                type="text"
                                name="district"
                                value={
                                    form.district
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter district"
                            />

                        </div>


                        <div className="add-centre-field">

                            <label>
                                State
                            </label>

                            <input
                                type="text"
                                name="state"
                                value={
                                    form.state
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter state"
                            />

                        </div>


                        <div className="add-centre-field">

                            <label>
                                Latitude
                            </label>

                            <input
                                type="number"
                                name="latitude"
                                value={
                                    form.latitude
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: 22.3460000"
                                step="any"
                            />

                        </div>


                        <div className="add-centre-field">

                            <label>
                                Longitude
                            </label>

                            <input
                                type="number"
                                name="longitude"
                                value={
                                    form.longitude
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: 87.2320000"
                                step="any"
                            />

                        </div>


                        <div className="add-centre-field">

                            <label>
                                Daily Capacity
                            </label>

                            <input
                                type="number"
                                name="capacity"
                                value={
                                    form.capacity
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: 500"
                                min="1"
                            />

                            <small>
                                Maximum farmers the centre can handle per day.
                            </small>

                        </div>


                        <div className="add-centre-actions">

                            <button
                                type="button"
                                className="add-centre-cancel"
                                onClick={() =>
                                    navigate(
                                        '/admin/centres'
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="add-centre-submit"
                                disabled={
                                    loading
                                }
                            >
                                {loading
                                    ? 'Creating Centre...'
                                    : 'Create Centre'}
                            </button>

                        </div>

                    </form>

                </section>

            </main>

        </div>

    );
}


export default AdminAddCentre;