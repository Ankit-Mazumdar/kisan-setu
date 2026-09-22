import React, { useCallback, useEffect, useState } from 'react';

import { jsPDF } from 'jspdf';

import Navbar from '../../components/Navbar.jsx';

import { useAuth } from '../../context/AuthContext.jsx';

import api from '../../services/authService.js';

import { useTranslation } from '../../translation/useTranslation.js';

import './MyToken.css';


function MyToken() {

    const { farmer } = useAuth();

    const { t } = useTranslation();

    const [tokens, setTokens] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');


    const loadTokens = useCallback(async () => {

        if (!farmer?.farmerId) {

            setLoading(false);

            return;

        }


        try {

            const response = await api.get(
                `/bookings/farmer/${farmer.farmerId}/`
            );


            const bookings = Array.isArray(response.data)
                ? response.data
                : [];


            // Only active bookings

            const activeTokens = bookings
                .filter(
                    (booking) =>
                        booking.status === 'CONFIRMED' ||
            booking.status === 'IN_PROGRESS'
                )
                .sort((a, b) => {

                    const dateA = new Date(
                        `${a.booking_date}T${a.slot_time || '00:00:00'}`
                    );

                    const dateB = new Date(
                        `${b.booking_date}T${b.slot_time || '00:00:00'}`
                    );


                    if (dateA - dateB !== 0) {

                        return dateA - dateB;

                    }


                    return (
                        Number(a.booking_id) -
                        Number(b.booking_id)
                    );

                });


            setTokens(activeTokens);

            setError('');

        } catch (err) {

            console.error(
                'Failed to load tokens:',
                err
            );

            setError(
                t('unableToLoadActiveTokens')
            );

        } finally {

            setLoading(false);

        }

    }, [farmer, t]);


    useEffect(() => {

        loadTokens();


        const interval = setInterval(() => {

            loadTokens();

        }, 10000);


        return () => clearInterval(interval);

    }, [loadTokens]);


    const formatDate = (dateString) => {

        if (!dateString) return '—';


        const date = new Date(
            `${dateString}T00:00:00`
        );


        return date.toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );

    };


    const formatTime = (timeString) => {

        if (!timeString) {

            return t('notAssigned');

        }


        const parts = timeString.split(':');


        if (parts.length < 2) {

            return timeString;

        }


        let hour = Number(parts[0]);

        const minute = parts[1];


        const period =
            hour >= 12
                ? 'PM'
                : 'AM';


        hour = hour % 12;


        if (hour === 0) {

            hour = 12;

        }


        return `${hour}:${minute} ${period}`;

    };


    // ==========================================
    // DOWNLOAD TOKEN
    // ==========================================

    const downloadToken = (booking) => {

        const doc = new jsPDF();


        const pageWidth =
            doc.internal.pageSize.getWidth();


        // ======================================
        // HEADER
        // ======================================

        doc.setFillColor(
            18,
            48,
            71
        );


        doc.rect(
            0,
            0,
            pageWidth,
            38,
            'F'
        );


        doc.setTextColor(
            255,
            255,
            255
        );


        doc.setFontSize(22);

        doc.setFont('helvetica', 'bold');

        doc.text(
            'KISANSETU',
            pageWidth / 2,
            17,
            {
                align: 'center'
            }
        );


        doc.setFontSize(10);

        doc.setFont(
            'helvetica',
            'normal'
        );

        doc.text(
            'Smart Procurement Platform',
            pageWidth / 2,
            27,
            {
                align: 'center'
            }
        );


        // ======================================
        // TITLE
        // ======================================

        doc.setTextColor(
            18,
            48,
            71
        );


        doc.setFontSize(18);

        doc.setFont(
            'helvetica',
            'bold'
        );


        doc.text(
            'PROCUREMENT TOKEN',
            pageWidth / 2,
            55,
            {
                align: 'center'
            }
        );


        // ======================================
        // TOKEN NUMBER
        // ======================================

        doc.setFillColor(
            232,
            244,
            237
        );


        doc.roundedRect(
            25,
            65,
            pageWidth - 50,
            35,
            5,
            5,
            'F'
        );


        doc.setTextColor(
            31,
            107,
            69
        );


        doc.setFontSize(11);

        doc.setFont(
            'helvetica',
            'normal'
        );


        doc.text(
            'TOKEN NUMBER',
            pageWidth / 2,
            76,
            {
                align: 'center'
            }
        );


        doc.setFontSize(22);

        doc.setFont(
            'helvetica',
            'bold'
        );


        doc.text(
            booking.token_number || '—',
            pageWidth / 2,
            91,
            {
                align: 'center'
            }
        );


        // ======================================
        // BOOKING DETAILS
        // ======================================

        let y = 120;


        doc.setTextColor(
            32,
            41,
            35
        );


        const addDetail = (
            label,
            value
        ) => {

            doc.setFontSize(10);

            doc.setFont(
                'helvetica',
                'bold'
            );


            doc.text(
                label,
                30,
                y
            );


            doc.setFont(
                'helvetica',
                'normal'
            );


            doc.text(
                String(value || '—'),
                85,
                y
            );


            y += 13;

        };


        addDetail(
            'Farmer',
            farmer?.fullName || '—'
        );


        addDetail(
            'Booking ID',
            `#${booking.booking_id}`
        );


        addDetail(
            'Crop',
            booking.crop_name || '—'
        );


        addDetail(
            'Variety',
            booking.variety || 'Not specified'
        );


        addDetail(
            'Procurement Centre',
            booking.centre_name || '—'
        );


        addDetail(
            'Date',
            formatDate(booking.booking_date)
        );


        addDetail(
            'Slot',
            formatTime(booking.slot_time)
        );


        addDetail(
            'Status',
            booking.status
        );


        // ======================================
        // IMPORTANT NOTE
        // ======================================

        y += 8;


        doc.setFillColor(
            247,
            245,
            238
        );


        doc.roundedRect(
            25,
            y,
            pageWidth - 50,
            32,
            4,
            4,
            'F'
        );


        doc.setTextColor(
            18,
            48,
            71
        );


        doc.setFontSize(10);

        doc.setFont(
            'helvetica',
            'bold'
        );


        doc.text(
            'Important',
            32,
            y + 11
        );


        doc.setFont(
            'helvetica',
            'normal'
        );


        doc.setFontSize(9);


        doc.text(
            'Please carry this token or show the token number',
            32,
            y + 19
        );


        doc.text(
            'at the procurement centre.',
            32,
            y + 26
        );


        // ======================================
        // FOOTER
        // ======================================

        doc.setTextColor(
            120,
            132,
            126
        );


        doc.setFontSize(8);


        doc.text(
            'Generated by KisanSetu',
            pageWidth / 2,
            285,
            {
                align: 'center'
            }
        );


        // ======================================
        // SAVE PDF
        // ======================================

        const tokenName =
            booking.token_number
                ? booking.token_number
                : `booking-${booking.booking_id}`;


        doc.save(
            `KisanSetu-Token-${tokenName}.pdf`
        );

    };


    return (

        <>

            <Navbar />


            <main className="my-token-page">

                <div className="my-token-container">


                    {/* Header */}

                    <div className="my-token-header">

                        <div>

                            <p className="my-token-eyebrow">

                                {t('activeBookings')}

                            </p>


                            <h1>

                                {t('myTokenPageTitle')}

                            </h1>


                            <p className="my-token-subtitle">

                                {t('myTokenSubtitle')}

                            </p>

                        </div>


                        <div className="my-token-count">

                            {tokens.length} {t('active')}

                        </div>

                    </div>


                    {/* Loading */}

                    {loading ? (

                        <div className="my-token-empty">

                            <div className="my-token-empty-icon">

                                ...

                            </div>


                            <h2>

                                {t('loadingYourTokens')}

                            </h2>


                            <p>

                                {t(
                                    'loadingYourTokensDescription'
                                )}

                            </p>

                        </div>

                    ) : error ? (

                        /* Error */

                        <div className="my-token-empty">

                            <div className="my-token-empty-icon">

                                !

                            </div>


                            <h2>

                                {t('somethingWentWrong')}

                            </h2>


                            <p>

                                {error}

                            </p>

                        </div>

                    ) : tokens.length === 0 ? (

                        /* No active tokens */

                        <div className="my-token-empty">

                            <div className="my-token-empty-icon">

                                ✓

                            </div>


                            <h2>

                                {t('noActiveTokens')}

                            </h2>


                            <p>

                                {t(
                                    'noActiveTokensDescription'
                                )}

                            </p>

                        </div>

                    ) : (

                        /* Token list */

                        <div className="my-token-list">

                            {tokens.map((booking) => (

                                <div
                                    className="my-token-card"
                                    key={booking.booking_id}
                                >

                                    <div className="my-token-card-main">

                                        <div className="my-token-number">

                                            {booking.token_number || '—'}

                                        </div>


                                        <div className="my-token-details">

                                            <h2>

                                                {booking.crop_name ||
                                                    t('crop')}

                                            </h2>


                                            <p>

                                                {booking.variety
                                                    ? booking.variety
                                                    : t(
                                                        'varietyNotSpecified'
                                                    )}

                                            </p>


                                            <span>

                                                {booking.centre_name ||
                                                    t(
                                                        'procurementCentre'
                                                    )}

                                            </span>

                                        </div>

                                    </div>


                                    <div className="my-token-card-info">

                                        <div className="my-token-info-item">

                                            <span>

                                                {t('dateLabel')}

                                            </span>


                                            <strong>

                                                {formatDate(
                                                    booking.booking_date
                                                )}

                                            </strong>

                                        </div>


                                        <div className="my-token-info-item">

                                            <span>

                                                {t('slot')}

                                            </span>


                                            <strong>

                                                {formatTime(
                                                    booking.slot_time
                                                )}

                                            </strong>

                                        </div>


                                        <div className="my-token-status">

                                            {booking.status}

                                        </div>


                                        {/* Download Token */}

                                        <button
                                            type="button"
                                            className="my-token-download"
                                            onClick={() =>
                                                downloadToken(
                                                    booking
                                                )
                                            }
                                        >

                                            ↓ Download Token

                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>

        </>

    );

}


export default MyToken;





// import React, { useCallback, useEffect, useState } from 'react';

// import Navbar from '../../components/Navbar.jsx';

// import { useAuth } from '../../context/AuthContext.jsx';

// import api from '../../services/authService.js';

// import { useTranslation } from '../../translation/useTranslation.js';

// import './MyToken.css';

// function MyToken() {
//     const { farmer } = useAuth();
//     const { t } = useTranslation();

//     const [tokens, setTokens] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     const loadTokens = useCallback(async () => {
//         if (!farmer?.farmerId) {
//             setLoading(false);
//             return;
//         }

//         try {
//             const response = await api.get(
//                 `/bookings/farmer/${farmer.farmerId}/`
//             );

//             const bookings = Array.isArray(response.data)
//                 ? response.data
//                 : [];

//             // Only active bookings
//             const activeTokens = bookings
//                 .filter(
//                     (booking) =>
//                         booking.status === 'APPROVED' ||
//                         booking.status === 'IN_PROGRESS'
//                 )
//                 .sort((a, b) => {
//                     const dateA = new Date(
//                         `${a.booking_date}T${a.slot_time || '00:00:00'}`
//                     );

//                     const dateB = new Date(
//                         `${b.booking_date}T${b.slot_time || '00:00:00'}`
//                     );

//                     if (dateA - dateB !== 0) {
//                         return dateA - dateB;
//                     }

//                     return (
//                         Number(a.booking_id) -
//                         Number(b.booking_id)
//                     );
//                 });

//             setTokens(activeTokens);
//             setError('');
//         } catch (err) {
//             console.error('Failed to load tokens:', err);
//             setError(t('unableToLoadActiveTokens'));
//         } finally {
//             setLoading(false);
//         }
//     }, [farmer, t]);

//     useEffect(() => {
//         loadTokens();

//         const interval = setInterval(() => {
//             loadTokens();
//         }, 10000);

//         return () => clearInterval(interval);
//     }, [loadTokens]);

//     const formatDate = (dateString) => {
//         if (!dateString) return '—';

//         const date = new Date(
//             `${dateString}T00:00:00`
//         );

//         return date.toLocaleDateString('en-IN', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric'
//         });
//     };

//     const formatTime = (timeString) => {
//         if (!timeString) {
//             return t('notAssigned');
//         }

//         const parts = timeString.split(':');

//         if (parts.length < 2) {
//             return timeString;
//         }

//         let hour = Number(parts[0]);
//         const minute = parts[1];

//         const period = hour >= 12 ? 'PM' : 'AM';

//         hour = hour % 12;

//         if (hour === 0) {
//             hour = 12;
//         }

//         return `${hour}:${minute} ${period}`;
//     };

//     return (
//         <>
//             <Navbar />

//             <main className="my-token-page">
//                 <div className="my-token-container">

//                     {/* Header */}
//                     <div className="my-token-header">
//                         <div>
//                             <p className="my-token-eyebrow">
//                                 {t('activeBookings')}
//                             </p>

//                             <h1>
//                                 {t('myTokenPageTitle')}
//                             </h1>

//                             <p className="my-token-subtitle">
//                                 {t('myTokenSubtitle')}
//                             </p>
//                         </div>

//                         <div className="my-token-count">
//                             {tokens.length} {t('active')}
//                         </div>
//                     </div>

//                     {/* Loading */}
//                     {loading ? (
//                         <div className="my-token-empty">

//                             <div className="my-token-empty-icon">
//                                 ...
//                             </div>

//                             <h2>
//                                 {t('loadingYourTokens')}
//                             </h2>

//                             <p>
//                                 {t(
//                                     'loadingYourTokensDescription'
//                                 )}
//                             </p>
//                         </div>

//                     ) : error ? (

//                         /* Error */
//                         <div className="my-token-empty">

//                             <div className="my-token-empty-icon">
//                                 !
//                             </div>

//                             <h2>
//                                 {t('somethingWentWrong')}
//                             </h2>

//                             <p>
//                                 {error}
//                             </p>
//                         </div>

//                     ) : tokens.length === 0 ? (

//                         /* No active tokens */
//                         <div className="my-token-empty">

//                             <div className="my-token-empty-icon">
//                                 ✓
//                             </div>

//                             <h2>
//                                 {t('noActiveTokens')}
//                             </h2>

//                             <p>
//                                 {t(
//                                     'noActiveTokensDescription'
//                                 )}
//                             </p>
//                         </div>

//                     ) : (

//                         /* Token list */
//                         <div className="my-token-list">

//                             {tokens.map((booking) => (

//                                 <div
//                                     className="my-token-card"
//                                     key={booking.booking_id}
//                                 >

//                                     <div className="my-token-card-main">

//                                         <div className="my-token-number">
//                                             {booking.token_number || '—'}
//                                         </div>

//                                         <div className="my-token-details">

//                                             <h2>
//                                                 {booking.crop_name ||
//                                                     t('crop')}
//                                             </h2>

//                                             <p>
//                                                 {booking.variety
//                                                     ? booking.variety
//                                                     : t(
//                                                         'varietyNotSpecified'
//                                                     )}
//                                             </p>

//                                             <span>
//                                                 {booking.centre_name ||
//                                                     t(
//                                                         'procurementCentre'
//                                                     )}
//                                             </span>

//                                         </div>

//                                     </div>

//                                     <div className="my-token-card-info">

//                                         <div className="my-token-info-item">

//                                             <span>
//                                                 {t('dateLabel')}
//                                             </span>

//                                             <strong>
//                                                 {formatDate(
//                                                     booking.booking_date
//                                                 )}
//                                             </strong>

//                                         </div>

//                                         <div className="my-token-info-item">

//                                             <span>
//                                                 {t('slot')}
//                                             </span>

//                                             <strong>
//                                                 {formatTime(
//                                                     booking.slot_time
//                                                 )}
//                                             </strong>

//                                         </div>

//                                         <div className="my-token-status">
//                                             {booking.status}
//                                         </div>

//                                     </div>

//                                 </div>

//                             ))}

//                         </div>
//                     )}

//                 </div>
//             </main>
//         </>
//     );
// }

// export default MyToken;