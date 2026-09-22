import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../../services/authService.js';

import AdminSidebar from './AdminSidebar.jsx';

import './AdminProcurementDetails.css';


function AdminProcurementDetails() {

    const navigate = useNavigate();

    const { centreId } = useParams();

    const [procurements, setProcurements] = useState([]);

    const [centre, setCentre] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');


    // ==========================================
    // CHECK ADMIN + LOAD DATA
    // ==========================================

    useEffect(() => {

        const adminSession = localStorage.getItem(
            'kisansetu_admin_session'
        );

        if (!adminSession) {

            navigate('/admin/login');

            return;
        }

        loadData();

    }, [centreId, navigate]);


    // ==========================================
    // LOAD PROCUREMENT + CENTRE
    // ==========================================

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


            const allProcurements =
                procurementResponse.data;


            const allCentres =
                centreResponse.data;


            const selectedCentre =
                allCentres.find(
                    (item) =>
                        Number(item.centre_id) ===
                        Number(centreId)
                );


            if (!selectedCentre) {

                setError(
                    'Procurement centre not found.'
                );

                return;

            }


            const centreProcurements =
                allProcurements.filter(
                    (procurement) =>
                        Number(
                            procurement.centre_id
                        ) === Number(centreId)
                );


            setCentre(selectedCentre);

            setProcurements(
                centreProcurements
            );


        } catch (error) {

            console.error(error);

            setError(
                'Unable to load procurement details.'
            );

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // TOTAL QUANTITY
    // ==========================================

    function getTotalQuantity() {

        return procurements.reduce(
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


    // ==========================================
    // CROP QUANTITY
    // ==========================================

    function getCropQuantity(cropName) {

        return procurements
            .filter(
                (procurement) =>
                    procurement.crop_name ===
                    cropName
            )
            .reduce(
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


    // ==========================================
    // UNIQUE CROPS
    // ==========================================

    function getCropSummary() {

        const summary = {};

        procurements.forEach(
            (procurement) => {

                const cropName =
                    procurement.crop_name ||
                    'Unknown Crop';

                if (!summary[cropName]) {

                    summary[cropName] = 0;

                }

                summary[cropName] +=
                    Number(
                        procurement.quantity || 0
                    );

            }
        );

        return Object.entries(summary);

    }


    // ==========================================
    // FORMAT QUANTITY
    // ==========================================

    function formatQuantity(quantity) {

        return Number(quantity)
            .toLocaleString(
                'en-IN',
                {
                    maximumFractionDigits: 2
                }
            );

    }


    // ==========================================
    // FORMAT DATE
    // ==========================================

    function formatDate(dateValue) {

        if (!dateValue) {

            return '-';

        }

        const date =
            new Date(dateValue);


        return date.toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="admin-layout">

                <AdminSidebar />

                <main className="admin-main admin-procurement-details-page">

                    <div className="admin-procurement-details-message">

                        Loading procurement details...

                    </div>

                </main>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="admin-layout">

                <AdminSidebar />

                <main className="admin-main admin-procurement-details-page">

                    <div className="admin-procurement-details-error">

                        <h2>
                            Unable to load procurement
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            className="procurement-back-button"
                            onClick={() =>
                                navigate(
                                    '/admin/procurement'
                                )
                            }
                        >
                            ← Back to Procurement
                        </button>

                    </div>

                </main>

            </div>

        );

    }


    const cropSummary =
        getCropSummary();


    return (

        <div className="admin-layout">


            <AdminSidebar />


            <main className="admin-main admin-procurement-details-page">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="admin-procurement-details-header">


                    <div>

                        <button
                            className="procurement-back-button"
                            onClick={() =>
                                navigate(
                                    '/admin/procurement'
                                )
                            }
                        >
                            ← Back to Procurement
                        </button>


                        <span className="admin-eyebrow">

                            PROCUREMENT CENTRE

                        </span>


                        <h1>

                            {centre.centre_name}

                        </h1>


                        <p>

                            {centre.address ||
                                'Address not available'}

                        </p>

                    </div>


                    <button
                        className="admin-refresh-button"
                        onClick={loadData}
                    >
                        Refresh
                    </button>


                </div>


                {/* ==================================
                    SUMMARY
                ================================== */}

                <section className="procurement-summary-grid">


                    <div className="procurement-summary-card">

                        <span>
                            Procurement Records
                        </span>

                        <strong>
                            {procurements.length}
                        </strong>

                    </div>


                    <div className="procurement-summary-card">

                        <span>
                            Total Quantity
                        </span>

                        <strong>
                            {formatQuantity(
                                getTotalQuantity()
                            )}{' '}
                            kg
                        </strong>

                    </div>


                    <div className="procurement-summary-card">

                        <span>
                            Farmers
                        </span>

                        <strong>
                            {
                                new Set(
                                    procurements.map(
                                        (procurement) =>
                                            procurement.farmer_id
                                    )
                                ).size
                            }
                        </strong>

                    </div>


                </section>


                {/* ==================================
                    CROP SUMMARY
                ================================== */}

                <section className="admin-procurement-details-section">


                    <div className="admin-procurement-details-section-heading">

                        <div>

                            <h2>
                                Crop Summary
                            </h2>

                            <p>
                                Total quantity received
                                for each crop.
                            </p>

                        </div>

                    </div>


                    <div className="crop-summary-grid">


                        {cropSummary.length === 0 ? (

                            <div className="procurement-empty">

                                No procurement recorded
                                for this centre.

                            </div>

                        ) : (

                            cropSummary.map(
                                ([cropName, quantity]) => (

                                    <div
                                        key={cropName}
                                        className="crop-summary-card"
                                    >

                                        <span>
                                            {cropName}
                                        </span>

                                        <strong>
                                            {formatQuantity(
                                                quantity
                                            )}{' '}
                                            kg
                                        </strong>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </section>


                {/* ==================================
                    FARMER PROCUREMENT
                ================================== */}

                <section className="admin-procurement-details-section">


                    <div className="admin-procurement-details-section-heading">

                        <div>

                            <h2>
                                Farmer Procurement
                            </h2>

                            <p>
                                Farmers who delivered crops
                                at this centre.
                            </p>

                        </div>

                    </div>


                    <div className="admin-procurement-details-card">


                        {procurements.length === 0 ? (

                            <div className="procurement-empty">

                                No procurement records
                                available.

                            </div>

                        ) : (

                            <div className="admin-procurement-details-table-wrapper">

                                <table className="admin-procurement-details-table">


                                    <thead>

                                        <tr>

                                            <th>
                                                Farmer
                                            </th>

                                            <th>
                                                Phone
                                            </th>

                                            <th>
                                                Crop
                                            </th>

                                            <th>
                                                Quantity
                                            </th>

                                            <th>
                                                Quality
                                            </th>

                                            <th>
                                                Procurement Date
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {procurements.map(
                                            (procurement) => (

                                                <tr
                                                    key={
                                                        procurement.procurement_id
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            {
                                                                procurement.farmer_name
                                                            }
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        {
                                                            procurement.farmer_phone
                                                        }

                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {
                                                                procurement.crop_name
                                                            }
                                                        </strong>

                                                        {procurement.crop_variety && (

                                                            <span className="procurement-subtext">

                                                                {
                                                                    procurement.crop_variety
                                                                }

                                                            </span>

                                                        )}

                                                    </td>


                                                    <td>

                                                        <strong>

                                                            {formatQuantity(
                                                                procurement.quantity
                                                            )}{' '}
                                                            kg

                                                        </strong>

                                                    </td>


                                                    <td>

                                                        {
                                                            procurement.quality ||
                                                            '-'
                                                        }

                                                    </td>


                                                    <td>

                                                        {formatDate(
                                                            procurement.procurement_date
                                                        )}

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>


                                </table>

                            </div>

                        )}

                    </div>

                </section>


            </main>

        </div>

    );

}


export default AdminProcurementDetails;