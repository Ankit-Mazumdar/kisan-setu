import React, { useEffect, useState } from 'react';

import api from '../../services/authService';

import { useAuth } from '../../context/AuthContext.jsx';

import Navbar from '../../components/Navbar.jsx';

import { useTranslation } from '../../translation/useTranslation.js';

import './Procurement.css';


function Procurement() {

    const { farmer } = useAuth();

    const { t, language } = useTranslation();

    const [procurements, setProcurements] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');


    useEffect(() => {

        if (farmer?.farmerId) {

            loadProcurements();

        } else {

            setLoading(false);

        }

    }, [farmer]);


    async function loadProcurements() {

        try {

            setLoading(true);

            setError('');

            setProcurements([]);


            // Get all bookings of this farmer
            const bookingResponse = await api.get(
                `/bookings/farmer/${farmer.farmerId}/`
            );

            const bookings = Array.isArray(bookingResponse.data)
                ? bookingResponse.data
                : [];


            // Keep only completed bookings
            const completedBookings = bookings.filter(
                (booking) =>
                    booking.status === 'COMPLETED'
            );


            if (completedBookings.length === 0) {

                setError(
                    t('noCompletedProcurement')
                );

                return;
            }


            // Get procurement details for every completed booking
            const procurementResults = await Promise.all(

                completedBookings.map(
                    async (booking) => {

                        try {

                            const response = await api.get(
                                `/procurement/booking/${booking.booking_id}/`
                            );

                            return {

                                procurement: response.data,

                                booking: booking

                            };

                        } catch (error) {

                            console.log(
                                `No procurement for booking ${booking.booking_id}`
                            );

                            return null;

                        }

                    }
                )

            );


            // Remove bookings where procurement does not exist
            const validProcurements =
                procurementResults.filter(
                    (item) => item !== null
                );


            // Newest procurement first
            validProcurements.sort(
                (a, b) => {

                    const dateA =
                        new Date(
                            a.procurement.procurement_date
                        ).getTime();

                    const dateB =
                        new Date(
                            b.procurement.procurement_date
                        ).getTime();

                    return dateB - dateA;

                }
            );


            if (validProcurements.length === 0) {

                setError(
                    t('procurementDetailsNotAvailable')
                );

                return;
            }


            setProcurements(
                validProcurements
            );


        } catch (error) {

            console.error(
                'Procurement error:',
                error
            );

            setError(
                t('unableToLoadProcurement')
            );

        } finally {

            setLoading(false);

        }

    }


    function formatDate(date) {

        if (!date) {

            return t('notAvailable');

        }

        return new Date(date).toLocaleDateString(
            language === 'bn' ? 'bn-IN' : 'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );

    }


    function formatAmount(amount) {

        return Number(
            amount || 0
        ).toLocaleString(
            language === 'bn' ? 'bn-IN' : 'en-IN',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }


    return (

        <div>

            <Navbar />


            <main className="procurement-page">

                <div className="procurement-container">


                    {/* Header */}

                    <section className="procurement-header">

                        <div>

                            <span className="procurement-label">
                                {t('procurement')}
                            </span>

                            <h1>
                                {t('procurementDetails')}
                            </h1>

                            <p>
                                {t('procurementHistoryDescription')}
                            </p>

                        </div>

                    </section>


                    {/* Loading */}

                    {loading && (

                        <div className="procurement-card">

                            <p>
                                {t('loadingProcurementDetails')}
                            </p>

                        </div>

                    )}


                    {/* Farmer not available */}

                    {!loading && !farmer?.farmerId && (

                        <div className="procurement-card empty-card">

                            <div className="empty-icon">
                                🔐
                            </div>

                            <h2>
                                {t('pleaseLoginToContinue')}
                            </h2>

                            <p>
                                {t('farmerInformationNotAvailable')}
                            </p>

                        </div>

                    )}


                    {/* Error / Empty */}

                    {!loading &&
                        farmer?.farmerId &&
                        error && (

                            <div className="procurement-card empty-card">

                                <div className="empty-icon">
                                    📋
                                </div>

                                <h2>
                                    {error}
                                </h2>

                                <p>
                                    {t(
                                        'procurementDetailsWillAppear'
                                    )}
                                </p>

                            </div>

                        )}


                    {/* Procurement History */}

                    {!loading &&
                        procurements.length > 0 && (

                            <div className="procurement-content">

                                {procurements.map(
                                    (item) => {

                                        const procurement =
                                            item.procurement;

                                        const booking =
                                            item.booking;


                                        return (

                                            <div
                                                className="procurement-entry"
                                                key={
                                                    procurement.procurement_id
                                                }
                                            >


                                                {/* Total Amount */}

                                                <div className="procurement-status-card">

                                                    <div>

                                                        <span className="status-label">
                                                            {t(
                                                                'procurementCompleted'
                                                            )}
                                                        </span>

                                                        <h2>
                                                            ₹
                                                            {formatAmount(
                                                                procurement.total_amount
                                                            )}
                                                        </h2>

                                                        <p>
                                                            {t(
                                                                'totalProcurementAmount'
                                                            )}
                                                        </p>

                                                    </div>


                                                    <div className="success-icon">
                                                        ✓
                                                    </div>

                                                </div>


                                                {/* Procurement Summary */}

                                                <div className="procurement-card">

                                                    <h2>
                                                        {t(
                                                            'procurementSummary'
                                                        )}
                                                    </h2>


                                                    <div className="procurement-grid">


                                                        <div className="detail-item">

                                                            <span>
                                                                {t('bookingId')}
                                                            </span>

                                                            <strong>
                                                                #{procurement.booking}
                                                            </strong>

                                                        </div>


                                                        <div className="detail-item">

                                                            <span>
                                                                {t('quantity')}
                                                            </span>

                                                            <strong>
                                                                {procurement.quantity}
                                                                {' '}
                                                                kg
                                                            </strong>

                                                        </div>


                                                        <div className="detail-item">

                                                            <span>
                                                                {t('quality')}
                                                            </span>

                                                            <strong>
                                                                {procurement.quality ||
                                                                    t(
                                                                        'notSpecified'
                                                                    )}
                                                            </strong>

                                                        </div>


                                                        <div className="detail-item">

                                                            <span>
                                                                {t('pricePerKg')}
                                                            </span>

                                                            <strong>
                                                                ₹
                                                                {formatAmount(
                                                                    procurement.price_per_unit
                                                                )}
                                                            </strong>

                                                        </div>


                                                        <div className="detail-item">

                                                            <span>
                                                                {t('totalAmount')}
                                                            </span>

                                                            <strong>
                                                                ₹
                                                                {formatAmount(
                                                                    procurement.total_amount
                                                                )}
                                                            </strong>

                                                        </div>


                                                        <div className="detail-item">

                                                            <span>
                                                                {t('procurementDate')}
                                                            </span>

                                                            <strong>
                                                                {formatDate(
                                                                    procurement.procurement_date
                                                                )}
                                                            </strong>

                                                        </div>


                                                    </div>

                                                </div>


                                                {/* Booking Information */}

                                                <div className="procurement-card">

                                                    <h2>
                                                        {t(
                                                            'bookingInformation'
                                                        )}
                                                    </h2>


                                                    <div className="procurement-grid">


                                                        <div className="detail-item">

                                                            <span>
                                                                {t('token')}
                                                            </span>

                                                            <strong>
                                                                {booking.token_number ||
                                                                    'N/A'}
                                                            </strong>

                                                        </div>


                                                        <div className="detail-item">

                                                            <span>
                                                                {t('crop')}
                                                            </span>

                                                            <strong>
                                                                {booking.crop_name ||
                                                                    'N/A'}
                                                            </strong>

                                                        </div>


                                                        <div className="detail-item">

                                                            <span>
                                                                {t('variety')}
                                                            </span>

                                                            <strong>
                                                                {booking.variety ||
                                                                    'N/A'}
                                                            </strong>

                                                        </div>


                                                        <div className="detail-item">

                                                            <span>
                                                                {t('centre')}
                                                            </span>

                                                            <strong>
                                                                {booking.centre_name ||
                                                                    'N/A'}
                                                            </strong>

                                                        </div>


                                                        <div className="detail-item">

                                                            <span>
                                                                {t('bookingDate')}
                                                            </span>

                                                            <strong>
                                                                {booking.booking_date
                                                                    ? formatDate(
                                                                        booking.booking_date
                                                                    )
                                                                    : 'N/A'}
                                                            </strong>

                                                        </div>


                                                        <div className="detail-item">

                                                            <span>
                                                                {t(
                                                                    'procurementStatus'
                                                                )}
                                                            </span>

                                                            <strong>
                                                                {t('completed')}
                                                            </strong>

                                                        </div>


                                                        <div className="detail-item">

                                                            <span>
                                                                {t(
                                                                    'paymentStatus'
                                                                )}
                                                            </span>

                                                            <strong
                                                                className={
                                                                    procurement.payment_status === 'PAID'
                                                                        ? 'payment-status-paid'
                                                                        : 'payment-status-pending'
                                                                }
                                                            >

                                                                {procurement.payment_status === 'PAID'
                                                                    ? `✓ ${t('paid')}`
                                                                    : `⏳ ${t('pending')}`}

                                                            </strong>

                                                        </div>


                                                    </div>

                                                </div>


                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                </div>

            </main>

        </div>

    );

}


export default Procurement;