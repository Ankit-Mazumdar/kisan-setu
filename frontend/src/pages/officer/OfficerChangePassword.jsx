import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/authService.js';

import './OfficerChangePassword.css';


function OfficerChangePassword() {

    const navigate = useNavigate();

    const [officer, setOfficer] = useState(null);

    const [currentPassword, setCurrentPassword] =
        useState('');

    const [newPassword, setNewPassword] =
        useState('');

    const [confirmPassword, setConfirmPassword] =
        useState('');

    const [message, setMessage] =
        useState('');

    const [error, setError] =
        useState('');

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // LOAD OFFICER SESSION
    // ==========================================

    React.useEffect(() => {

        const session =
            localStorage.getItem(
                'kisansetu_officer_session'
            );

        if (!session) {

            navigate('/officer/login');

            return;
        }

        try {

            const officerData =
                JSON.parse(session);

            setOfficer(officerData);

        } catch (error) {

            localStorage.removeItem(
                'kisansetu_officer_session'
            );

            navigate('/officer/login');

        }

    }, [navigate]);


    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage('');
        setError('');


        if (!currentPassword ||
            !newPassword ||
            !confirmPassword) {

            setError(
                'Please fill in all password fields.'
            );

            return;
        }


        if (newPassword.length < 6) {

            setError(
                'New password must be at least 6 characters long.'
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            setError(
                'New password and confirm password do not match.'
            );

            return;
        }


        if (currentPassword === newPassword) {

            setError(
                'New password must be different from your current password.'
            );

            return;
        }


        try {

            setLoading(true);

            const { data } =
                await api.post(
                    '/officer/change-password/',
                    {
                        officer_id:
                            officer.officer_id,

                        current_password:
                            currentPassword,

                        new_password:
                            newPassword
                    }
                );

            setMessage(
                data.message ||
                'Password changed successfully.'
            );


            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error) {

            console.error(
                'Change password error:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Unable to change password.'
            );

        } finally {

            setLoading(false);

        }

    };


    if (!officer) {

        return (
            <div className="officer-password-loading">
                Loading...
            </div>
        );

    }


    return (

        <div className="officer-password-page">

            <div className="officer-password-card">


                {/* HEADER */}

                <div className="officer-password-header">

                    <div className="officer-password-icon">
                        🔐
                    </div>

                    <div>

                        <span>
                            OFFICER ACCOUNT
                        </span>

                        <h1>
                            Change Password
                        </h1>

                        <p>
                            Update your account password
                            securely.
                        </p>

                    </div>

                </div>


                {/* SUCCESS */}

                {message && (

                    <div className="officer-password-success">

                        ✓ {message}

                    </div>

                )}


                {/* ERROR */}

                {error && (

                    <div className="officer-password-error">

                        {error}

                    </div>

                )}


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="officer-password-form"
                >


                    <div className="officer-password-field">

                        <label>
                            Current Password
                        </label>

                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter current password"
                        />

                    </div>


                    <div className="officer-password-field">

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter new password"
                        />

                    </div>


                    <div className="officer-password-field">

                        <label>
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Confirm new password"
                        />

                    </div>


                    <div className="officer-password-actions">

                        <button
                            type="button"
                            className="officer-password-back"
                            onClick={() =>
                                navigate(
                                    '/officer/dashboard'
                                )
                            }
                        >
                            ← Back
                        </button>


                        <button
                            type="submit"
                            className="officer-password-submit"
                            disabled={loading}
                        >

                            {loading
                                ? 'Updating...'
                                : 'Change Password'}

                        </button>

                    </div>

                </form>


            </div>

        </div>

    );

}


export default OfficerChangePassword;