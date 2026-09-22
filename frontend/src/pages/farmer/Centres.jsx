import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../components/Navbar.jsx';
import Button from '../../components/Button.jsx';
import api from '../../services/authService.js';

import { useTranslation } from '../../translation/useTranslation.js';

import './Centres.css';

function Centres() {

    const navigate = useNavigate();

    const { t, language } = useTranslation();

    const [centres, setCentres] = useState([]);
    const [prices, setPrices] = useState([]);

    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [locationError, setLocationError] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        async function loadData() {

            try {

                const [centresResponse, pricesResponse] =
                    await Promise.all([
                        api.get('/centres/'),
                        api.get('/crop-prices/')
                    ]);

                setCentres(centresResponse.data);
                setPrices(pricesResponse.data);

            } catch (err) {

                console.error(err);

                setError(
                    'Unable to load procurement centres. Please try again.'
                );

            } finally {

                setLoading(false);

            }
        }

        loadData();

    }, []);

    useEffect(() => {

        if (!navigator.geolocation) {

            setLocationError(
                t('locationNotSupported')
            );

            setLocationLoading(false);

            return;
        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });

                setLocationLoading(false);

            },

            (error) => {

                console.error(error);

                setLocationError(
                    t('unableToGetLocation')
                );

                setLocationLoading(false);

            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }

        );

    }, [language]);

    function calculateDistance(
        farmerLatitude,
        farmerLongitude,
        centreLatitude,
        centreLongitude
    ) {

        const earthRadius = 6371;

        const lat1 = farmerLatitude * Math.PI / 180;
        const lat2 = centreLatitude * Math.PI / 180;

        const deltaLat =
            (centreLatitude - farmerLatitude) *
            Math.PI / 180;

        const deltaLon =
            (centreLongitude - farmerLongitude) *
            Math.PI / 180;

        const a =
            Math.sin(deltaLat / 2) *
            Math.sin(deltaLat / 2) +
            Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);

        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

        return earthRadius * c;
    }

    function getDistance(centre) {

        if (!location) {
            return null;
        }

        if (
            centre.latitude === null ||
            centre.longitude === null
        ) {
            return null;
        }

        const distance = calculateDistance(
            location.latitude,
            location.longitude,
            Number(centre.latitude),
            Number(centre.longitude)
        );

        return distance;
    }

    function getCropPrice(centreId, cropId) {

        const price = prices.find(
            (item) =>
                Number(item.centre) === Number(centreId) &&
                Number(item.crop) === Number(cropId)
        );

        if (!price) {
            return null;
        }

        return price.price_per_kg;
    }

    return (

        <div className="centres-page">

            <Navbar />

            <main className="centres-main">

                <div className="centres-container">

                    {/* Header */}

                    <section className="centres-header">

                        <div>

                            <span className="centres-eyebrow">
                                {t('procurementNetwork')}
                            </span>

                            <h1>
                                {t('exploreCentres')}
                            </h1>

                            <p>
                                {t('exploreCentresDescription')}
                            </p>

                        </div>

                    </section>


                    {/* Location Status */}

                    {!loading && !error && (

                        <div className="centres-location-status">

                            {locationLoading && (

                                <>
                                    <span>📍</span>

                                    <span>
                                        {t('findingCurrentLocation')}
                                    </span>
                                </>

                            )}

                            {!locationLoading && location && (

                                <>
                                    <span>📍</span>

                                    <span>
                                        {t('distancesCalculated')}
                                    </span>
                                </>

                            )}

                            {!locationLoading && !location && (

                                <>
                                    <span>⚠️</span>

                                    <span>
                                        {locationError}
                                    </span>
                                </>

                            )}

                        </div>

                    )}


                    {/* Loading */}

                    {loading && (

                        <div className="centres-message">

                            <div className="centres-message__icon">
                                ⏳
                            </div>

                            <h2>
                                {t('loadingCentres')}
                            </h2>

                            <p>
                                {t('loadingCentresDescription')}
                            </p>

                        </div>

                    )}


                    {/* Error */}

                    {!loading && error && (

                        <div className="centres-message centres-message--error">

                            <div className="centres-message__icon">
                                ⚠️
                            </div>

                            <h2>
                                {t('somethingWentWrong')}
                            </h2>

                            <p>
                                {t('unableToLoadBookingData')}
                            </p>

                            <Button
                                onClick={() => window.location.reload()}
                            >
                                {t('tryAgain')}
                            </Button>

                        </div>

                    )}


                    {/* No Centres */}

                    {!loading &&
                        !error &&
                        centres.length === 0 && (

                            <div className="centres-message">

                                <div className="centres-message__icon">
                                    📍
                                </div>

                                <h2>
                                    {t('noCentresAvailable')}
                                </h2>

                                <p>
                                    {t('noCentresDescription')}
                                </p>

                            </div>

                        )}


                    {/* Centre Cards */}

                    {!loading &&
                        !error &&
                        centres.length > 0 && (

                            <section className="centres-grid">

                                {centres.map((centre) => {

                                    const distance =
                                        getDistance(centre);

                                    return (

                                        <article
                                            className="centre-card"
                                            key={centre.centre_id}
                                        >

                                            {/* Top */}

                                            <div className="centre-card__top">

                                                <div className="centre-card__icon">
                                                    📍
                                                </div>

                                                <span className="centre-card__status">
                                                    {t('available')}
                                                </span>

                                            </div>


                                            {/* Centre Name */}

                                            <h2>
                                                {centre.centre_name}
                                            </h2>


                                            {/* Distance */}

                                            <div className="centre-card__distance">

                                                <span>
                                                    📍
                                                </span>

                                                <div>

                                                    <strong>
                                                        {t('distanceFromYou')}
                                                    </strong>

                                                    <p>

                                                        {distance !== null
                                                            ? `${distance.toFixed(2)} km`
                                                            : t('locationUnavailable')
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            {/* Location */}

                                            <div className="centre-card__location">

                                                <span>
                                                    📌
                                                </span>

                                                <div>

                                                    <strong>
                                                        {t('locationLabel')}
                                                    </strong>

                                                    <p>
                                                        {centre.address || '-'}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Centre Details */}

                                            <div className="centre-card__details">

                                                <div>

                                                    <span>
                                                        {t('district')}
                                                    </span>

                                                    <strong>
                                                        {centre.district || '-'}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        {t('state')}
                                                    </span>

                                                    <strong>
                                                        {centre.state || '-'}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        {t('capacity')}
                                                    </span>

                                                    <strong>
                                                        {centre.capacity ?? '-'}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* Crop Prices */}

                                            <div className="centre-card__prices">

                                                <div className="centre-card__prices-header">

                                                    <h3>
                                                        {t('procurementPrices')}
                                                    </h3>

                                                    <span>
                                                        {t('rupeesPerKg')}
                                                    </span>

                                                </div>


                                                <div className="centre-price-row">

                                                    <span>
                                                        {t('riceSwarna')}
                                                    </span>

                                                    <strong>

                                                        {getCropPrice(
                                                            centre.centre_id,
                                                            1
                                                        ) !== null
                                                            ? `₹${getCropPrice(
                                                                centre.centre_id,
                                                                1
                                                            )}`
                                                            : '–'
                                                        }

                                                    </strong>

                                                </div>


                                                <div className="centre-price-row">

                                                    <span>
                                                        {t('riceBasmati')}
                                                    </span>

                                                    <strong>

                                                        {getCropPrice(
                                                            centre.centre_id,
                                                            2
                                                        ) !== null
                                                            ? `₹${getCropPrice(
                                                                centre.centre_id,
                                                                2
                                                            )}`
                                                            : '–'
                                                        }

                                                    </strong>

                                                </div>


                                                <div className="centre-price-row">

                                                    <span>
                                                        {t('wheatHd2967')}
                                                    </span>

                                                    <strong>

                                                        {getCropPrice(
                                                            centre.centre_id,
                                                            3
                                                        ) !== null
                                                            ? `₹${getCropPrice(
                                                                centre.centre_id,
                                                                3
                                                            )}`
                                                            : '–'
                                                        }

                                                    </strong>

                                                </div>


                                                <div className="centre-price-row">

                                                    <span>
                                                        {t('potatoJyoti')}
                                                    </span>

                                                    <strong>

                                                        {getCropPrice(
                                                            centre.centre_id,
                                                            4
                                                        ) !== null
                                                            ? `₹${getCropPrice(
                                                                centre.centre_id,
                                                                4
                                                            )}`
                                                            : '–'
                                                        }

                                                    </strong>

                                                </div>

                                            </div>


                                            {/* Action */}

                                            <div className="centre-card__actions">

                                                <Button
                                                    onClick={() =>
                                                        navigate(
                                                            `/farmer/booking?centre=${centre.centre_id}`
                                                        )
                                                    }
                                                >

                                                    {t('selectCentreButton')}

                                                    <span>
                                                        →
                                                    </span>

                                                </Button>

                                            </div>

                                        </article>

                                    );

                                })}

                            </section>

                        )}

                </div>

            </main>

        </div>

    );

}

export default Centres;