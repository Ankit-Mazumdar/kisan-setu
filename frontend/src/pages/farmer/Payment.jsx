import React, { useEffect, useState } from 'react';

import api from '../../services/authService';

import { useAuth } from '../../context/AuthContext.jsx';

import Navbar from '../../components/Navbar.jsx';

import { useTranslation } from '../../translation/useTranslation.js';

import './Payment.css';


function Payment() {

  const { farmer } = useAuth();

  const { t, language } = useTranslation();

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');


  useEffect(() => {

    if (farmer?.farmerId) {

      loadPayments();

    } else {

      setLoading(false);

    }

  }, [farmer]);


  async function loadPayments() {

    try {

      setLoading(true);

      setError('');

      const response = await api.get(
        `/payments/farmer/${farmer.farmerId}/`
      );

      const paymentData = response.data || [];

      setPayments(paymentData);

    } catch (error) {

      console.error(
        'Payment history error:',
        error
      );

      setError(
        t('unableToLoadPaymentHistory')
      );

    } finally {

      setLoading(false);

    }

  }


  /*
   * Only PAID payments are counted
   * as money actually received.
   */

  const paidPayments = payments.filter(
    (payment) =>
      payment.payment_status === 'PAID'
  );


  const totalMoneyReceived =
    paidPayments.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );


  function formatAmount(amount) {

    return Number(amount || 0).toLocaleString(
      language === 'bn' ? 'bn-IN' : 'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

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


  function formatTime(time) {

    if (!time) {

      return t('notAvailable');

    }

    const [hours, minutes] =
      time.split(':');

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes)
    );

    return date.toLocaleTimeString(
      language === 'bn' ? 'bn-IN' : 'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


  if (loading) {

    return (
      <>
        <Navbar />

        <main className="payment-page">

          <div className="payment-message">

            {t('loadingPaymentHistory')}

          </div>

        </main>
      </>
    );

  }


  return (
    <>
      <Navbar />

      <main className="payment-page">

        {/* PAGE HEADER */}

        <div className="payment-header">

          <div>

            <p className="payment-eyebrow">
              {t('kisanSetuPayment')}
            </p>

            <h1>
              {t('payment')}
            </h1>

            <p>
              {t('paymentDescription')}
            </p>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="payment-message">

            {error}

          </div>

        )}


        {/* NO PAYMENT */}

        {!error && payments.length === 0 && (

          <div className="payment-message">

            {t('noPaymentRecords')}

          </div>

        )}


        {payments.length > 0 && (

          <>

            {/* PAYMENT OVERVIEW */}

            <section className="payment-overview">

              <div className="payment-overview-card">

                <span className="overview-label">
                  {t('totalMoneyReceived')}
                </span>

                <strong className="overview-amount">

                  ₹
                  {formatAmount(
                    totalMoneyReceived
                  )}

                </strong>

                <span className="overview-description">

                  {t(
                    'moneyReceivedFromPaidProcurements'
                  )}

                </span>

              </div>


              <div className="payment-overview-card">

                <span className="overview-label">
                  {t('paymentsReceived')}
                </span>

                <strong className="overview-count">

                  {paidPayments.length}

                </strong>

                <span className="overview-description">

                  {t(
                    'completedPaymentTransactions'
                  )}

                </span>

              </div>

            </section>


            {/* PAYMENT HISTORY */}

            <section className="payment-history-section">

              <div className="section-heading">

                <div>

                  <p className="section-eyebrow">
                    {t('transactionRecords')}
                  </p>

                  <h2>
                    {t('paymentHistory')}
                  </h2>

                </div>

              </div>


              <div className="payment-history-list">

                {payments.map(
                  (payment) => (

                    <article
                      className="payment-history-card"
                      key={payment.payment_id}
                    >

                      {/* TOP */}

                      <div className="payment-history-top">

                        <div>

                          <span className="payment-date">

                            {formatDate(
                              payment.payment_date
                            )}

                          </span>

                          <h3>

                            {payment.crop_name}

                            {payment.variety && (
                              <>
                                {' • '}
                                {payment.variety}
                              </>
                            )}

                          </h3>

                        </div>


                        <div className="payment-history-right">

                          <span
                            className={
                              payment.payment_status === 'PAID'
                                ? 'payment-badge payment-badge-paid'
                                : 'payment-badge payment-badge-pending'
                            }
                          >

                            {payment.payment_status === 'PAID'
                              ? `✓ ${t('paid')}`
                              : `⏳ ${t('pending')}`}

                          </span>


                          <strong className="payment-history-amount">

                            ₹
                            {formatAmount(
                              payment.amount
                            )}

                          </strong>

                        </div>

                      </div>


                      {/* PROCUREMENT SUMMARY */}

                      <div className="payment-procurement-summary">

                        <div>

                          <span>
                            {t('quantity')}
                          </span>

                          <strong>
                            {payment.quantity} kg
                          </strong>

                        </div>


                        <div>

                          <span>
                            {t('pricePerKg')}
                          </span>

                          <strong>
                            ₹
                            {formatAmount(
                              payment.price_per_kg
                            )}
                          </strong>

                        </div>


                        <div>

                          <span>
                            {t('quality')}
                          </span>

                          <strong>
                            {payment.quality ||
                              t('notAvailable')}
                          </strong>

                        </div>

                      </div>


                      {/* DETAILS */}

                      <div className="payment-history-details">

                        <div>

                          <span>
                            {t('bookingId')}
                          </span>

                          <strong>
                            #{payment.booking_id}
                          </strong>

                        </div>


                        <div>

                          <span>
                            {t('token')}
                          </span>

                          <strong>
                            {payment.token_number ||
                              t('notAvailable')}
                          </strong>

                        </div>


                        <div>

                          <span>
                            {t('centre')}
                          </span>

                          <strong>
                            {payment.centre_name}
                          </strong>

                        </div>


                        <div>

                          <span>
                            {t('bookingDate')}
                          </span>

                          <strong>
                            {formatDate(
                              payment.booking_date
                            )}
                          </strong>

                        </div>


                        <div>

                          <span>
                            {t('slotTime')}
                          </span>

                          <strong>
                            {formatTime(
                              payment.slot_time
                            )}
                          </strong>

                        </div>


                        <div>

                          <span>
                            {t('paymentMethod')}
                          </span>

                          <strong>
                            {payment.payment_method ||
                              t('notAvailable')}
                          </strong>

                        </div>


                        <div>

                          <span>
                            {t('transactionId')}
                          </span>

                          <strong>
                            {payment.transaction_id ||
                              t('notAvailable')}
                          </strong>

                        </div>


                        <div>

                          <span>
                            {t('paymentId')}
                          </span>

                          <strong>
                            #{payment.payment_id}
                          </strong>

                        </div>

                      </div>


                      {/* TOTAL PROCUREMENT */}

                      <div className="payment-history-total">

                        <span>
                          {t('totalProcurementAmount')}
                        </span>

                        <strong>

                          ₹
                          {formatAmount(
                            payment.total_amount
                          )}

                        </strong>

                      </div>

                    </article>

                  )
                )}

              </div>

            </section>

          </>

        )}

      </main>
    </>
  );

}


export default Payment;