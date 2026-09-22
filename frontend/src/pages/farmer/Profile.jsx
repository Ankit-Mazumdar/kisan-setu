import React, { useEffect, useState } from 'react';

import Navbar from '../../components/Navbar.jsx';

import { useAuth } from '../../context/AuthContext.jsx';

import {
    getFarmerProfile,
    updateFarmerProfile
} from '../../services/authService.js';

import { useTranslation } from '../../translation/useTranslation.js';

import './Profile.css';


function Profile() {

    const { farmer } = useAuth();

    const { t } = useTranslation();


    const [profile, setProfile] = useState(null);

    const [editing, setEditing] = useState(false);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');


    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        village: '',
        district: '',
        state: '',
        aadhaarNo: '',
        farmerGovtId: '',
        bankName: '',
        bankAccountNo: ''
    });


    /* ==================================================
       LOAD COMPLETE FARMER PROFILE
       ================================================== */

    useEffect(() => {

        async function loadProfile() {

            try {

                setLoading(true);

                setError('');


                const data = await getFarmerProfile(
                    farmer.farmerId
                );


                setProfile(data);


                /* Convert API field names
                   into form field names */

                setForm({

                    fullName:
                        data.full_name || '',

                    phone:
                        data.phone || '',

                    email:
                        data.email || '',

                    address:
                        data.address || '',

                    village:
                        data.village || '',

                    district:
                        data.district || '',

                    state:
                        data.state || '',

                    aadhaarNo:
                        data.aadhaar_no || '',

                    farmerGovtId:
                        data.farmer_govt_id || '',

                    bankName:
                        data.bank_name || '',

                    bankAccountNo:
                        data.bank_account_no || ''

                });

            } catch (err) {

                setError(
                    err.message ||
                    t('unableToLoadProfile')
                );

            } finally {

                setLoading(false);

            }

        }


        if (farmer?.farmerId) {

            loadProfile();

        } else {

            setLoading(false);

        }

    }, [farmer, t]);


    /* ==================================================
       FARMER NOT FOUND
       ================================================== */

    if (!farmer) {

        return (

            <>

                <Navbar />

                <main className="profile-page">

                    <div className="profile-message">

                        <h2>
                            {t('farmerInformationNotFound')}
                        </h2>

                        <p>
                            {t('pleaseLoginToViewProfile')}
                        </p>

                    </div>

                </main>

            </>

        );

    }


    /* ==================================================
       LOADING
       ================================================== */

    if (loading) {

        return (

            <>

                <Navbar />

                <main className="profile-page">

                    <div className="profile-message">

                        <h2>
                            {t('loadingProfile')}
                        </h2>

                        <p>
                            {t('loadingProfileDescription')}
                        </p>

                    </div>

                </main>

            </>

        );

    }


    /* ==================================================
       ERROR
       ================================================== */

    if (error) {

        return (

            <>

                <Navbar />

                <main className="profile-page">

                    <div className="profile-message">

                        <h2>
                            {t('unableToLoadProfile')}
                        </h2>

                        <p>
                            {error}
                        </p>

                    </div>

                </main>

            </>

        );

    }


    /* ==================================================
       HANDLE INPUT CHANGE
       ================================================== */

    function handleChange(e) {

        const { name, value } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]: value

        }));

    }


    /* ==================================================
       START EDITING
       ================================================== */

    function handleEdit() {

        setForm({

            fullName:
                profile?.full_name || '',

            phone:
                profile?.phone || '',

            email:
                profile?.email || '',

            address:
                profile?.address || '',

            village:
                profile?.village || '',

            district:
                profile?.district || '',

            state:
                profile?.state || '',

            aadhaarNo:
                profile?.aadhaar_no || '',

            farmerGovtId:
                profile?.farmer_govt_id || '',

            bankName:
                profile?.bank_name || '',

            bankAccountNo:
                profile?.bank_account_no || ''

        });


        setEditing(true);

    }


    /* ==================================================
       CANCEL EDIT
       ================================================== */

    function handleCancel() {

        setForm({

            fullName:
                profile?.full_name || '',

            phone:
                profile?.phone || '',

            email:
                profile?.email || '',

            address:
                profile?.address || '',

            village:
                profile?.village || '',

            district:
                profile?.district || '',

            state:
                profile?.state || '',

            aadhaarNo:
                profile?.aadhaar_no || '',

            farmerGovtId:
                profile?.farmer_govt_id || '',

            bankName:
                profile?.bank_name || '',

            bankAccountNo:
                profile?.bank_account_no || ''

        });


        setEditing(false);

    }


    /* ==================================================
       SAVE
       ================================================== */

    async function handleSave(e) {

        e.preventDefault();

        try {

            setLoading(true);

            setError('');


            const updatedFarmer =
                await updateFarmerProfile(
                    farmer.farmerId,
                    form
                );


            /* Update profile with database data */

            setProfile(updatedFarmer);


            /* Exit edit mode */

            setEditing(false);


        } catch (err) {

            setError(
                err.message ||
                t('unableToUpdateProfile')
            );

        } finally {

            setLoading(false);

        }

    }


    return (

        <>

            <Navbar />


            <main className="profile-page">

                <div className="profile-container">


                    {/* ==================================================
                        PAGE HEADER
                        ================================================== */}

                    <section className="profile-header">

                        <div>

                            <span className="profile-eyebrow">

                                {t('account')}

                            </span>

                            <h1>

                                {t('myProfile')}

                            </h1>

                            <p>

                                {t('profileDescription')}

                            </p>

                        </div>


                        {!editing && (

                            <button
                                type="button"
                                className="profile-edit-button"
                                onClick={handleEdit}
                            >

                                ✏️ {t('editProfile')}

                            </button>

                        )}

                    </section>


                    {/* ==================================================
                        PROFILE CARD
                        ================================================== */}

                    <section className="profile-card">


                        {/* PROFILE HEADER */}

                        <div className="profile-card__top">

                            <div className="profile-avatar">

                                {profile?.full_name
                                    ?.charAt(0)
                                    .toUpperCase() || 'F'}

                            </div>


                            <div>

                                <h2>

                                    {profile?.full_name ||
                                        t('farmer')}

                                </h2>

                                <p>

                                    {t('kisanSetuFarmer')}

                                </p>

                            </div>

                        </div>


                        {/* ==================================================
                            PROFILE FORM
                            ================================================== */}

                        <form
                            onSubmit={handleSave}
                            className="profile-details"
                        >


                            {/* ==============================
                                PERSONAL INFORMATION
                                ============================== */}

                            <div className="profile-section-title">

                                <h3>

                                    {t('personalInformation')}

                                </h3>

                            </div>


                            {/* FULL NAME */}

                            <div className="profile-detail">

                                <span>

                                    {t('fullName')}

                                </span>

                                {editing ? (

                                    <input
                                        type="text"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />

                                ) : (

                                    <strong>

                                        {profile?.full_name || '-'}

                                    </strong>

                                )}

                            </div>


                            {/* MOBILE NUMBER */}

                            <div className="profile-detail">

                                <span>

                                    {t('mobileNumber')}

                                </span>

                                {editing ? (

                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />

                                ) : (

                                    <strong>

                                        {profile?.phone || '-'}

                                    </strong>

                                )}

                            </div>


                            {/* EMAIL */}

                            <div className="profile-detail">

                                <span>

                                    {t('email')}

                                </span>

                                {editing ? (

                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder={t('optional')}
                                        className="profile-input"
                                    />

                                ) : (

                                    <strong>

                                        {profile?.email || '-'}

                                    </strong>

                                )}

                            </div>


                            {/* ADDRESS */}

                            <div className="profile-detail">

                                <span>

                                    {t('address')}

                                </span>

                                {editing ? (

                                    <input
                                        type="text"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />

                                ) : (

                                    <strong>

                                        {profile?.address || '-'}

                                    </strong>

                                )}

                            </div>


                            {/* VILLAGE */}

                            <div className="profile-detail">

                                <span>

                                    {t('village')}

                                </span>

                                {editing ? (

                                    <input
                                        type="text"
                                        name="village"
                                        value={form.village}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />

                                ) : (

                                    <strong>

                                        {profile?.village || '-'}

                                    </strong>

                                )}

                            </div>


                            {/* DISTRICT */}

                            <div className="profile-detail">

                                <span>

                                    {t('district')}

                                </span>

                                {editing ? (

                                    <input
                                        type="text"
                                        name="district"
                                        value={form.district}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />

                                ) : (

                                    <strong>

                                        {profile?.district || '-'}

                                    </strong>

                                )}

                            </div>


                            {/* STATE */}

                            <div className="profile-detail">

                                <span>

                                    {t('state')}

                                </span>

                                {editing ? (

                                    <input
                                        type="text"
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />

                                ) : (

                                    <strong>

                                        {profile?.state || '-'}

                                    </strong>

                                )}

                            </div>


                            {/* ==============================
                                IDENTIFICATION
                                ============================== */}

                            <div className="profile-section-title">

                                <h3>

                                    {t('identification')}

                                </h3>

                            </div>


                            {/* AADHAAR */}

                            <div className="profile-detail">

                                <span>

                                    {t('aadhaarNumber')}

                                </span>

                                {editing ? (

                                    <input
                                        type="text"
                                        name="aadhaarNo"
                                        value={form.aadhaarNo}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />

                                ) : (

                                    <strong>

                                        {profile?.aadhaar_no || '-'}

                                    </strong>

                                )}

                            </div>


                            {/* GOVERNMENT ID */}

                            <div className="profile-detail">

                                <span>

                                    {t('farmerGovernmentId')}

                                </span>

                                {editing ? (

                                    <input
                                        type="text"
                                        name="farmerGovtId"
                                        value={form.farmerGovtId}
                                        onChange={handleChange}
                                        placeholder={t('optional')}
                                        className="profile-input"
                                    />

                                ) : (

                                    <strong>

                                        {profile?.farmer_govt_id || '-'}

                                    </strong>

                                )}

                            </div>


                            {/* ==============================
                                BANK DETAILS
                                ============================== */}

                            <div className="profile-section-title">

                                <h3>

                                    {t('bankDetails')}

                                </h3>

                            </div>


                            {/* BANK NAME */}

                            <div className="profile-detail">

                                <span>

                                    {t('bankName')}

                                </span>

                                {editing ? (

                                    <input
                                        type="text"
                                        name="bankName"
                                        value={form.bankName}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />

                                ) : (

                                    <strong>

                                        {profile?.bank_name || '-'}

                                    </strong>

                                )}

                            </div>


                            {/* BANK ACCOUNT NUMBER */}

                            <div className="profile-detail">

                                <span>

                                    {t('bankAccountNumber')}

                                </span>

                                {editing ? (

                                    <input
                                        type="text"
                                        name="bankAccountNo"
                                        value={form.bankAccountNo}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />

                                ) : (

                                    <strong>

                                        {profile?.bank_account_no || '-'}

                                    </strong>

                                )}

                            </div>


                            {/* ==============================
                                ACCOUNT INFORMATION
                                ============================== */}

                            <div className="profile-section-title">

                                <h3>

                                    {t('accountInformation')}

                                </h3>

                            </div>


                            {/* FARMER ID */}

                            <div className="profile-detail">

                                <span>

                                    {t('farmerId')}

                                </span>

                                <strong>

                                    #{profile?.farmer_id || '-'}

                                </strong>

                            </div>


                            {/* ==============================
                                EDIT ACTIONS
                                ============================== */}

                            {editing && (

                                <div className="profile-actions">

                                    <button
                                        type="button"
                                        className="profile-cancel-button"
                                        onClick={handleCancel}
                                    >

                                        {t('cancel')}

                                    </button>


                                    <button
                                        type="submit"
                                        className="profile-save-button"
                                    >

                                        {t('saveChanges')}

                                    </button>

                                </div>

                            )}

                        </form>

                    </section>


                    {/* ==================================================
                        ACCOUNT INFORMATION
                        ================================================== */}

                    <section className="profile-info">

                        <div className="profile-info__icon">

                            🔒

                        </div>

                        <div>

                            <h3>

                                {t('accountSecure')}

                            </h3>

                            <p>

                                {t('accountSecureDescription')}

                            </p>

                        </div>

                    </section>


                </div>

            </main>

        </>

    );

}


export default Profile;