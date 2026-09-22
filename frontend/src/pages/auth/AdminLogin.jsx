import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../../services/authService.js';

import './Auth.css';


function AdminLogin() {

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');

        setLoading(true);


        try {

            const { data } =
                await api.post(
                    '/admin/login/',
                    {
                        email,
                        password
                    }
                );


            localStorage.setItem(
                'kisansetu_admin_session',
                JSON.stringify(
                    data.authority
                )
            );


            navigate(
                '/admin/dashboard'
            );


        } catch (error) {

            if (
                error.response &&
                error.response.data
            ) {

                setError(
                    error.response.data.message ||
                    'Invalid email or password.'
                );

            } else {

                setError(
                    'Unable to connect to the server. Please try again.'
                );

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-shell">

            <div className="auth-card">

                <div className="auth-card__header">

                    <div className="brand">
                        Kisan
                        <span className="brand__mark">
                            Setu
                        </span>
                    </div>


                    <p className="auth-eyebrow">
                        AUTHORITY PORTAL
                    </p>


                    <h1>
                        Admin Login
                    </h1>


                    <p>
                        Manage farmers, officers,
                        centres, bookings, procurement
                        and payments.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                >

                    {error && (

                        <div className="auth-error">
                            {error}
                        </div>

                    )}


                    <div className="form-group">

                        <label>
                            Email
                        </label>


                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            placeholder="Enter authority email"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>


                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter authority password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="btn btn--primary auth-submit"
                        disabled={loading}
                    >

                        {loading
                            ? 'Signing in...'
                            : 'Login as Authority'}

                    </button>

                </form>


                <div className="auth-footer">

                    <button
                        type="button"
                        onClick={() =>
                            navigate('/login')
                        }
                    >
                        ← Back to Farmer Login
                    </button>

                </div>

            </div>

        </div>

    );

}


export default AdminLogin;