import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/authService.js';
import AdminSidebar from './AdminSidebar.jsx';

import './AdminProcurement.css';

function AdminProcurement() {

    const navigate = useNavigate();

    const [procurements, setProcurements] = useState([]);
    const [centres, setCentres] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const adminSession = localStorage.getItem(
            'kisansetu_admin_session'
        );

        if (!adminSession) {
            navigate('/admin/login');
            return;
        }

        loadData();

    }, [navigate]);

    async function loadData() {

        try {

            setLoading(true);
            setError('');

            const [
                procurementResponse,
                centreResponse
            ] = await Promise.all([

                api.get(
                    '/admin/procurement/'
                ),

                api.get(
                    '/admin/centres/'
                )

            ]);

            setProcurements(
                procurementResponse.data
            );

            setCentres(
                centreResponse.data
            );

        } catch (error) {

            console.error(error);

            setError(
                'Unable to load procurement data.'
            );

        } finally {

            setLoading(false);

        }
    }

    function getCentreProcurements(
        centreId
    ) {

        return procurements.filter(
            (procurement) =>
                Number(procurement.centre_id) ===
                Number(centreId)
        );
    }

    function getTotalQuantity(
        centreProcurements
    ) {

        return centreProcurements.reduce(
            (total, procurement) => {

                return (
                    total +
                    Number(
                        procurement.quantity || 0
                    )
                );

            },
            0
        );
    }

    function formatQuantity(
        quantity
    ) {

        return Number(quantity)
            .toLocaleString('en-IN', {
                maximumFractionDigits: 2
            });
    }

    return (
       <div className="admin-layout">

        <AdminSidebar />

        <main className="admin-main admin-procurement-page">

            <div className="admin-procurement-container">

                {/* Header */}

                <div className="admin-procurement-header">

                    <div>

                        <span className="admin-eyebrow">
                            PROCUREMENT MANAGEMENT
                        </span>

                        <h1>
                            Procurement
                        </h1>

                        <p>
                            Monitor crop quantities received
                            across procurement centres.
                        </p>

                    </div>

                    <button
                        className="admin-refresh-button"
                        onClick={loadData}
                    >
                        Refresh
                    </button>

                </div>

                {/* Loading */}

                {loading && (

                    <div className="admin-procurement-message">
                        Loading procurement data...
                    </div>

                )}

                {/* Error */}

                {error && (

                    <div className="admin-procurement-error">
                        {error}
                    </div>

                )}

                {/* Centres */}

                {!loading && !error && (

                    <>

                        {centres.length === 0 ? (

                            <div className="admin-procurement-card">

                                <div className="empty-procurement">
                                    No procurement centres found.
                                </div>

                            </div>

                        ) : (

                            <div className="admin-centre-grid">

                                {centres.map(
                                    (centre) => {

                                        const centreProcurements =
                                            getCentreProcurements(
                                                centre.centre_id
                                            );

                                        const totalQuantity =
                                            getTotalQuantity(
                                                centreProcurements
                                            );

                                        return (

                                            <div
                                                key={
                                                    centre.centre_id
                                                }
                                                className="admin-centre-card"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/procurement/${centre.centre_id}`
                                                    )
                                                }
                                            >

                                                <div className="centre-card-top">

                                                    <span className="admin-eyebrow">
                                                        PROCUREMENT CENTRE
                                                    </span>

                                                    <span className="centre-card-arrow">
                                                        →
                                                    </span>

                                                </div>

                                                <h2>
                                                    {
                                                        centre.centre_name
                                                    }
                                                </h2>

                                                <p className="centre-card-location">

                                                    {
                                                        centre.district ||
                                                        'District not available'
                                                    }

                                                    {centre.state && (
                                                        <>
                                                            {', '}
                                                            {
                                                                centre.state
                                                            }
                                                        </>
                                                    )}

                                                </p>

                                                <div className="centre-card-stats">

                                                    <div>

                                                        <span>
                                                            Procurement Records
                                                        </span>

                                                        <strong>
                                                            {
                                                                centreProcurements.length
                                                            }
                                                        </strong>

                                                    </div>

                                                    <div>

                                                        <span>
                                                            Total Quantity
                                                        </span>

                                                        <strong>
                                                            {
                                                                formatQuantity(
                                                                    totalQuantity
                                                                )
                                                            } kg
                                                        </strong>

                                                    </div>

                                                </div>

                                                <button
                                                    className="centre-view-button"
                                                    onClick={(event) => {

                                                        event.stopPropagation();

                                                        navigate(
                                                            `/admin/procurement/${centre.centre_id}`
                                                        );

                                                    }}
                                                >
                                                    View Procurement
                                                    <span>
                                                        →
                                                    </span>
                                                </button>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </>

                )}

            </div>

        </main>

        </div>
    );
}

export default AdminProcurement;