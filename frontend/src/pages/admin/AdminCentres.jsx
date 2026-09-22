import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/authService.js';

import AdminSidebar from '../../pages/admin/AdminSidebar';

import './AdminDashboard.css';
import './AdminCentres.css';


function AdminCentres() {

    const navigate = useNavigate();

    const [authority, setAuthority] = useState(null);

    const [centres, setCentres] = useState([]);

    const [search, setSearch] = useState('');
    const [searchText, setSearchText] = useState('');

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');


    useEffect(() => {

        const session =
            localStorage.getItem(
                'kisansetu_admin_session'
            );

        if (!session) {
            navigate('/admin/login');
            return;
        }

        try {

            const admin =
                JSON.parse(session);

            setAuthority(admin);

        } catch (error) {

            localStorage.removeItem(
                'kisansetu_admin_session'
            );

            navigate('/admin/login');
        }

    }, [navigate]);


    useEffect(() => {

        const loadCentres = async () => {

            try {

                setLoading(true);
                setError('');

                const { data } =
                    await api.get(
                        '/admin/centres/'
                    );

                setCentres(data);

            } catch (error) {

                console.error(
                    'Centre loading error:',
                    error
                );

                setError(
                    'Unable to load procurement centres.'
                );

            } finally {

                setLoading(false);

            }
        };

        loadCentres();

    }, []);


    const handleSearch = () => {

        setSearch(
            searchText.trim().toLowerCase()
        );

    };


    const filteredCentres =
        centres.filter((centre) => {

            if (!search) {
                return true;
            }

            return (
                String(
                    centre.centre_name || ''
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    centre.address || ''
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    centre.district || ''
                )
                    .toLowerCase()
                    .includes(search)

                ||

                String(
                    centre.state || ''
                )
                    .toLowerCase()
                    .includes(search)
            );

        });


    const handleLogout = () => {

        localStorage.removeItem(
            'kisansetu_admin_session'
        );

        navigate('/admin/login');
    };


    return (
        <div className="admin-layout">

            {/* SIDEBAR */}

           <AdminSidebar />

            {/* MAIN */}

            <main className="admin-main">

                <header className="admin-topbar">

                    <div>

                        <h1>
                            Procurement Centres
                        </h1>

                        <p>
                            Manage and monitor procurement centres.
                        </p>

                    </div>


                    <div className="admin-account">

                        <div className="admin-account-avatar">

                            {authority?.full_name
                                ?.charAt(0)
                                ?.toUpperCase() || 'A'}

                        </div>

                        <div>

                            <strong>
                                {authority?.full_name ||
                                    'Authority'}
                            </strong>

                            <span>
                                Authority
                            </span>

                        </div>

                    </div>

                </header>


                {/* SEARCH + ADD */}

                <section className="centres-toolbar">

                    <div className="centres-search">

                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) =>
                                setSearchText(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {

                                if (
                                    e.key === 'Enter'
                                ) {
                                    handleSearch();
                                }

                            }}
                            placeholder="Search centre, district or state..."
                        />

                        <button
                            onClick={
                                handleSearch
                            }
                        >
                            Search
                        </button>

                    </div>


                    <button
                        className="add-centre-button"
                        onClick={() =>
                            navigate(
                                '/admin/centres/add'
                            )
                        }
                    >
                        + Add Centre
                    </button>

                </section>


                {/* ERROR */}

                {error && (

                    <div className="centres-error">
                        {error}
                    </div>

                )}


                {/* SUMMARY */}

                <div className="centres-summary">

                    <div className="centre-summary-card">

                        <span>
                            Total Centres
                        </span>

                        <strong>
                            {centres.length}
                        </strong>

                    </div>


                    <div className="centre-summary-card">

                        <span>
                            Assigned Officers
                        </span>

                        <strong>

                            {centres.reduce(
                                (
                                    total,
                                    centre
                                ) =>
                                    total +
                                    Number(
                                        centre.officer_count || 0
                                    ),
                                0
                            )}

                        </strong>

                    </div>


                    <div className="centre-summary-card">

                        <span>
                            Total Capacity
                        </span>

                        <strong>

                            {centres.reduce(
                                (
                                    total,
                                    centre
                                ) =>
                                    total +
                                    Number(
                                        centre.capacity || 0
                                    ),
                                0
                            )}

                        </strong>

                        <small>
                            farmers / day
                        </small>

                    </div>

                </div>


                {/* CENTRE TABLE */}

                <section className="centres-card">

                    <div className="centres-card-header">

                        <div>

                            <h2>
                                Centre List
                            </h2>

                            <p>
                                {filteredCentres.length}
                                {' '}
                                centre
                                {filteredCentres.length !== 1
                                    ? 's'
                                    : ''}
                                {' '}
                                found
                            </p>

                        </div>

                    </div>


                    {loading ? (

                        <div className="centres-state">
                            Loading centres...
                        </div>

                    ) : filteredCentres.length === 0 ? (

                        <div className="centres-state">

                            <strong>
                                No centres found
                            </strong>

                            <span>
                                Try a different search.
                            </span>

                        </div>

                    ) : (

                        <div className="centres-table-wrapper">

                            <table className="centres-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Centre
                                        </th>

                                        <th>
                                            Location
                                        </th>

                                        <th>
                                            District
                                        </th>

                                        <th>
                                            State
                                        </th>

                                        <th>
                                            Capacity
                                        </th>

                                        <th>
                                            Officers
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredCentres.map(
                                        (centre) => (

                                            <tr
                                                key={
                                                    centre.centre_id
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/centres/${centre.centre_id}`
                                                    )
                                                }
                                            >

                                                <td>

                                                    <div className="centre-name">

                                                        <div className="centre-icon">
                                                            📍
                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    centre.centre_name
                                                                }
                                                            </strong>

                                                            <span>
                                                                Centre ID: {
                                                                    centre.centre_id
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>
                                                    {
                                                        centre.address ||
                                                        '—'
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        centre.district ||
                                                        '—'
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        centre.state ||
                                                        '—'
                                                    }
                                                </td>


                                                <td>

                                                    {centre.capacity
                                                        ? `${centre.capacity} farmers/day`
                                                        : '—'}

                                                </td>


                                                <td>

                                                    <span className="officer-count">

                                                        {
                                                            centre.officer_count || 0
                                                        }

                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}


export default AdminCentres;