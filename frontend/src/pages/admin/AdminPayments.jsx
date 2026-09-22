import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/authService.js';
import AdminSidebar from './AdminSidebar.jsx';
import './AdminPayments.css';


function AdminPayments() {

    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);
    const [centres, setCentres] = useState([]);

    const [selectedCentre, setSelectedCentre] = useState('');

    const [selectedPayment, setSelectedPayment] =
        useState(null);

    const [transactionId, setTransactionId] =
    useState('');

const [paymentUpdating, setPaymentUpdating] =
    useState(false);

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

        loadCentres();

    }, [navigate]);


    useEffect(() => {

        if (selectedCentre) {

            loadPayments(selectedCentre);

        } else {

            setPayments([]);
            setLoading(false);

        }

    }, [selectedCentre]);


    async function loadCentres() {

        try {

            const response = await api.get(
                '/admin/centres/'
            );

            setCentres(response.data);

            /*
             * If there is only one centre,
             * select it automatically.
             */

            if (response.data.length === 1) {

                setSelectedCentre(
                    response.data[0].centre_id
                );

            }

        } catch (error) {

            console.error(
                'Unable to load centres:',
                error
            );

            setError(
                'Unable to load procurement centres.'
            );

            setLoading(false);

        }

    }


    async function loadPayments(centreId) {

        try {

            setLoading(true);
            setError('');

            const response = await api.get(
                `/centre/${centreId}/pending-payments/`
            );

            setPayments(
                response.data
            );

        } catch (error) {

            console.error(
                'Unable to load payments:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Unable to load pending payments.'
            );

            setPayments([]);

        } finally {

            setLoading(false);

        }

    }


    function formatDate(dateValue) {

        if (!dateValue) {
            return '-';
        }

        const date = new Date(dateValue);

        return date.toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );

    }


    function formatAmount(amount) {

        if (
            amount === null ||
            amount === undefined
        ) {

            return '₹0.00';

        }

        return Number(amount).toLocaleString(
            'en-IN',
            {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2
            }
        );

    }


    function maskAadhaar(aadhaar) {

        if (!aadhaar) {
            return '-';
        }

        const value =
            String(aadhaar);

        if (value.length !== 12) {
            return value;
        }

        return (
            'XXXX XXXX ' +
            value.slice(-4)
        );

    }


    function maskAccount(account) {

        if (!account) {
            return '-';
        }

        const value =
            String(account);

        if (value.length <= 4) {
            return value;
        }

        return (
            'XXXXXXXX' +
            value.slice(-4)
        );

    }


    function openPayment(payment) {

    setSelectedPayment(payment);

    setTransactionId('');

}


    function closePayment() {

        setSelectedPayment(null);

    }

    async function markAsPaid() {

    if (!transactionId.trim()) {

        alert('Please enter the transaction ID.');

        return;

    }

    try {

        setPaymentUpdating(true);

        const response = await api.put(
            `/payment/procurement/${selectedPayment.procurement_id}/update/`,
            {
                payment_status: 'PAID',
                payment_method: 'Bank Transfer',
                transaction_id: transactionId.trim()
            }
        );

        alert('Payment marked as paid successfully.');

        setSelectedPayment(null);

        setTransactionId('');

        if (selectedCentre) {

            loadPayments(selectedCentre);

        }

    } catch (error) {

        console.error(
            'Unable to update payment:',
            error
        );

        alert(
            error.response?.data?.message ||
            'Unable to mark payment as paid.'
        );

    } finally {

        setPaymentUpdating(false);

    }

}


    return (

        <div className="admin-layout">

            <AdminSidebar />


            <main className="admin-main admin-payments-page">

                <div className="admin-payments-container">


                    {/* Header */}

                    <div className="admin-payments-header">

                        <div>

                            <span className="admin-eyebrow">
                                PAYMENT MANAGEMENT
                            </span>

                            <h1>
                                Payments
                            </h1>

                            <p>
                                Review pending farmer
                                payments after procurement.
                            </p>

                        </div>


                        <button
                            className="admin-refresh-button"
                            onClick={() => {

                                if (selectedCentre) {

                                    loadPayments(
                                        selectedCentre
                                    );

                                }

                            }}
                        >
                            Refresh
                        </button>

                    </div>


                    {/* Centre Selection */}

                    <div className="admin-payment-filter">

                        <div className="admin-filter-group">

                            <label htmlFor="payment-centre">

                                Procurement Centre

                            </label>


                            <select
                                id="payment-centre"
                                value={selectedCentre}
                                onChange={(event) =>
                                    setSelectedCentre(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">

                                    Select Centre

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

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="admin-payments-error">

                            {error}

                        </div>

                    )}


                    {/* Loading */}

                    {loading && (

                        <div className="admin-payments-message">

                            Loading pending payments...

                        </div>

                    )}


                    {/* No Centre */}

                    {!loading &&
                        !error &&
                        !selectedCentre && (

                            <div className="admin-payments-card">

                                <div className="empty-payments">

                                    Select a procurement centre
                                    to view pending payments.

                                </div>

                            </div>

                        )}


                    {/* No Payments */}

                    {!loading &&
                        !error &&
                        selectedCentre &&
                        payments.length === 0 && (

                            <div className="admin-payments-card">

                                <div className="empty-payments">

                                    <div className="empty-payments-icon">
                                        ✓
                                    </div>

                                    <h3>
                                        No Pending Payments
                                    </h3>

                                    <p>
                                        All completed procurements
                                        for this centre have been
                                        paid.
                                    </p>

                                </div>

                            </div>

                        )}


                    {/* Payment Table */}

                    {!loading &&
                        !error &&
                        payments.length > 0 && (

                            <div className="admin-payments-card">

                                <div className="admin-payment-summary">

                                    <div>

                                        <span>
                                            Pending Payments
                                        </span>

                                        <strong>
                                            {
                                                payments.length
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Total Amount
                                        </span>

                                        <strong>

                                            {formatAmount(
                                                payments.reduce(
                                                    (
                                                        total,
                                                        payment
                                                    ) =>
                                                        total +
                                                        Number(
                                                            payment.total_amount ||
                                                            0
                                                        ),
                                                    0
                                                )
                                            )}

                                        </strong>

                                    </div>

                                </div>


                                <div className="admin-payments-table-wrapper">

                                    <table className="admin-payments-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Payment
                                                </th>

                                                <th>
                                                    Farmer
                                                </th>

                                                <th>
                                                    Crop
                                                </th>

                                                <th>
                                                    Quantity
                                                </th>

                                                <th>
                                                    Amount
                                                </th>

                                                <th>
                                                    Procurement Date
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

                                            {payments.map(
                                                (payment) => (

                                                    <tr
                                                        key={
                                                            payment.payment_id
                                                        }
                                                    >


                                                        <td>

                                                            <strong>
                                                                #
                                                                {
                                                                    payment.payment_id
                                                                }
                                                            </strong>

                                                            <span className="payment-subtext">

                                                                Procurement #
                                                                {
                                                                    payment.procurement_id
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <strong>
                                                                {
                                                                    payment.farmer_name
                                                                }
                                                            </strong>

                                                            <span className="payment-subtext">

                                                                {
                                                                    payment.farmer_phone
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <strong>
                                                                {
                                                                    payment.crop_name
                                                                }
                                                            </strong>


                                                            {payment.variety && (

                                                                <span className="payment-subtext">

                                                                    {
                                                                        payment.variety
                                                                    }

                                                                </span>

                                                            )}

                                                        </td>


                                                        <td>

                                                            {
                                                                payment.quantity
                                                            }

                                                            {' kg'}

                                                        </td>


                                                        <td>

                                                            <strong className="payment-amount">

                                                                {formatAmount(
                                                                    payment.total_amount
                                                                )}

                                                            </strong>

                                                        </td>


                                                        <td>

                                                            {
                                                                formatDate(
                                                                    payment.procurement_date
                                                                )
                                                            }

                                                        </td>


                                                        <td>

                                                            <span className="payment-status payment-status--pending">

                                                                PENDING

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <button
                                                                className="payment-view-button"
                                                                onClick={() =>
                                                                    openPayment(
                                                                        payment
                                                                    )
                                                                }
                                                            >

                                                                View Payment

                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        )}


                </div>


                {/* Payment Details Modal */}

                {selectedPayment && (

                    <div
                        className="admin-payment-modal-overlay"
                        onClick={closePayment}
                    >

                        <div
                            className="admin-payment-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >


                            <div className="admin-payment-modal-header">

                                <div>

                                    <span className="admin-eyebrow">
                                        PAYMENT DETAILS
                                    </span>

                                    <h2>
                                        Payment #
                                        {
                                            selectedPayment.payment_id
                                        }
                                    </h2>

                                </div>


                                <button
                                    className="payment-modal-close"
                                    onClick={closePayment}
                                >
                                    ×
                                </button>

                            </div>


                            {/* Farmer Information */}

                            <div className="payment-detail-section">

                                <h3>
                                    Farmer Information
                                </h3>


                                <div className="payment-detail-grid">

                                    <div>

                                        <span>
                                            Farmer Name
                                        </span>

                                        <strong>
                                            {
                                                selectedPayment.farmer_name
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Mobile
                                        </span>

                                        <strong>
                                            {
                                                selectedPayment.farmer_phone
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Government ID
                                        </span>

                                        <strong>
                                            {
                                                selectedPayment.farmer_govt_id ||
                                                '-'
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Aadhaar
                                        </span>

                                        <strong>
                                            {
                                                maskAadhaar(
                                                    selectedPayment.aadhaar_no
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* Bank Details */}

                            <div className="payment-detail-section">

                                <h3>
                                    Bank Details
                                </h3>


                                <div className="payment-detail-grid">

                                    <div>

                                        <span>
                                            Bank Name
                                        </span>

                                        <strong>
                                            {
                                                selectedPayment.bank_name ||
                                                '-'
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Account Number
                                        </span>

                                        <strong>
                                            {
                                                maskAccount(
                                                    selectedPayment.bank_account_no
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* Procurement Details */}

                            <div className="payment-detail-section">

                                <h3>
                                    Procurement Details
                                </h3>


                                <div className="payment-detail-grid">

                                    <div>

                                        <span>
                                            Crop
                                        </span>

                                        <strong>
                                            {
                                                selectedPayment.crop_name
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Variety
                                        </span>

                                        <strong>
                                            {
                                                selectedPayment.variety ||
                                                '-'
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Quantity
                                        </span>

                                        <strong>
                                            {
                                                selectedPayment.quantity
                                            }
                                            {' kg'}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Quality
                                        </span>

                                        <strong>
                                            {
                                                selectedPayment.quality ||
                                                '-'
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Price Per Unit
                                        </span>

                                        <strong>
                                            {formatAmount(
                                                selectedPayment.price_per_unit
                                            )}
                                            {' / kg'}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Total Amount
                                        </span>

                                        <strong className="payment-detail-total">

                                            {formatAmount(
                                                selectedPayment.total_amount
                                            )}

                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* Payment Information */}

                            <div className="payment-detail-section">

                                <h3>
                                    Payment Information
                                </h3>


                                <div className="payment-detail-grid">

                                    <div>

                                        <span>
                                            Payment ID
                                        </span>

                                        <strong>
                                            #
                                            {
                                                selectedPayment.payment_id
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Status
                                        </span>

                                        <strong>

                                            <span className="payment-status payment-status--pending">

                                                PENDING

                                            </span>

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Payment Method
                                        </span>

                                        <strong>
                                            Bank Transfer
                                        </strong>

                                    </div>
                                    <div>

    <span>
        Transaction ID
    </span>

    <input
        type="text"
        value={transactionId}
        onChange={(event) =>
            setTransactionId(
                event.target.value
            )
        }
        placeholder="Enter transaction ID"
        className="payment-transaction-input"
    />

</div>

                                </div>

                            </div>


                            {/* Footer */}

                            <div className="payment-modal-footer">

    <p>
        The authority can make the
        payment through the official
        bank/UPI system and record the
        transaction ID here.
    </p>


    <div className="payment-modal-actions">

        <button
            className="payment-modal-close-button"
            onClick={closePayment}
            disabled={paymentUpdating}
        >
            Close
        </button>


        <button
            className="payment-mark-paid-button"
            onClick={markAsPaid}
            disabled={paymentUpdating}
        >
            {paymentUpdating
                ? 'Processing...'
                : 'Mark as Paid'}
        </button>

    </div>

</div>

                        </div>

                    </div>

                )}

            </main>

        </div>

    );

}


export default AdminPayments;