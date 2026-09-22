import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/authService.js';
import AdminSidebar from './AdminSidebar.jsx';
import './AdminPrices.css';

function AdminPrices() {
    const navigate = useNavigate();

    const [prices, setPrices] = useState([]);
    const [crops, setCrops] = useState([]);
    const [centres, setCentres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedCentre, setSelectedCentre] = useState('ALL');

    const [editingId, setEditingId] = useState(null);
    const [editPrice, setEditPrice] = useState('');

    const [showAddForm, setShowAddForm] = useState(false);

    const [newCentre, setNewCentre] = useState('');
    const [newCrop, setNewCrop] = useState('');
    const [newPrice, setNewPrice] = useState('');

    useEffect(() => {
        const session = localStorage.getItem(
            'kisansetu_admin_session'
        );

        if (!session) {
            navigate('/admin/login');
            return;
        }

        loadData();
    }, [navigate]);

const loadData = async () => {
    try {
        setLoading(true);
        setError('');

        const [
            priceResponse,
            cropResponse,
            centreResponse
        ] = await Promise.all([
            api.get('/crop-prices/'),
            api.get('/crops/'),
            api.get('/admin/centres/')
        ]);

        setPrices(priceResponse.data);
        setCrops(cropResponse.data);
        setCentres(centreResponse.data);

    } catch (err) {
        console.error('PRICE DATA LOAD ERROR:', err);

        setError(
            err.response?.data?.message ||
            'Unable to load price data.'
        );
    } finally {
        setLoading(false);
    }
};

    // Get unique centres from price data
    // const centres = [];

    // prices.forEach((price) => {
    //     const alreadyExists = centres.some(
    //         (centre) => centre.id === price.centre
    //     );

    //     if (!alreadyExists) {
    //         centres.push({
    //             id: price.centre,
    //             name: price.centre_name
    //         });
    //     }
    // });

    // Show prices only for selected centre
    const filteredPrices =
        selectedCentre === 'ALL'
            ? prices
            : prices.filter(
                (price) =>
                    String(price.centre) ===
                    String(selectedCentre)
            );

    const startEditing = (price) => {
        setEditingId(price.price_id);
        setEditPrice(price.price_per_kg);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditPrice('');
    };

    const savePrice = async (priceId) => {
        if (!editPrice || Number(editPrice) <= 0) {
            alert('Please enter a valid price.');
            return;
        }

        try {
            await api.put(
                `/crop-prices/${priceId}/`,
                {
                    price_per_kg: editPrice
                }
            );

            alert('Price updated successfully.');

            setEditingId(null);
            setEditPrice('');

            loadData();

        } catch (err) {
            console.error('PRICE UPDATE ERROR:', err);

            alert(
                err.response?.data?.message ||
                'Unable to update price.'
            );
        }
    };

    const addPrice = async (e) => {
        e.preventDefault();

        if (!newCentre) {
            alert('Please select a procurement centre.');
            return;
        }

        if (!newCrop) {
            alert('Please select a crop.');
            return;
        }

        if (!newPrice || Number(newPrice) <= 0) {
            alert('Please enter a valid price.');
            return;
        }

        // Check duplicate crop + centre
        const duplicate = prices.some(
            (price) =>
                String(price.centre) === String(newCentre) &&
                String(price.crop) === String(newCrop)
        );

        if (duplicate) {
            alert(
                'A price already exists for this crop at this centre.'
            );
            return;
        }

        try {
            await api.post(
                '/crop-prices/',
                {
                    crop: Number(newCrop),
                    centre: Number(newCentre),
                    price_per_kg: Number(newPrice)
                }
            );

            alert('Crop price added successfully.');

            setNewCentre('');
            setNewCrop('');
            setNewPrice('');
            setShowAddForm(false);

            loadData();

        } catch (err) {
            console.error('PRICE ADD ERROR:', err);

            alert(
                err.response?.data?.message ||
                'Unable to add crop price.'
            );
        }
    };

    return (
        <div className="admin-layout">

            <AdminSidebar />

            <main className="admin-main">

                <div className="admin-topbar">

                    <div>
                        <h1>Procurement Prices</h1>

                        <p>
                            Manage current crop prices at procurement centres.
                        </p>
                    </div>

                    <div className="admin-account">
                        <span>Authority</span>
                    </div>

                </div>

                <section className="price-page">

                    <div className="price-page-header">

                        <div>
                            <h2>Current Crop Prices</h2>

                            <p>
                                Select a procurement centre to view and manage prices.
                            </p>
                        </div>

                        <div className="price-header-actions">

                            <div className="price-unit">
                                Price / KG
                            </div>

                            <button
                                className="price-add-btn"
                                onClick={() =>
                                    setShowAddForm(!showAddForm)
                                }
                            >
                                {showAddForm
                                    ? 'Cancel'
                                    : '+ Add Price'}
                            </button>

                        </div>

                    </div>

                    {/* Add Price Form */}

                    {showAddForm && (

                        <form
                            className="price-add-form"
                            onSubmit={addPrice}
                        >

                            <div className="price-form-title">
                                Add New Crop Price
                            </div>

                            <div className="price-form-grid">

                                <div className="price-form-field">

                                    <label>
                                        Procurement Centre
                                    </label>

                                    <select
                                        value={newCentre}
                                        onChange={(e) =>
                                            setNewCentre(e.target.value)
                                        }
                                    >

                                        <option value="">
                                            Select Centre
                                        </option>

                                       {centres.map((centre) => (

    <option
        key={centre.centre_id}
        value={centre.centre_id}
    >
        {centre.centre_name}
    </option>

))}

                                    </select>

                                </div>

                                <div className="price-form-field">

                                    <label>
                                        Crop
                                    </label>

                                    <select
                                        value={newCrop}
                                        onChange={(e) =>
                                            setNewCrop(e.target.value)
                                        }
                                    >

                                        <option value="">
                                            Select Crop
                                        </option>

                                        {crops.map((crop) => (

                                            <option
                                                key={crop.crop_id}
                                                value={crop.crop_id}
                                            >
                                                {crop.crop_name}
                                                {crop.variety
                                                    ? ` - ${crop.variety}`
                                                    : ''}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                <div className="price-form-field">

                                    <label>
                                        Price / KG
                                    </label>

                                    <div className="price-input-wrapper">

                                        <span>₹</span>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Enter price"
                                            value={newPrice}
                                            onChange={(e) =>
                                                setNewPrice(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                                <div className="price-form-field price-submit-field">

                                    <button
                                        type="submit"
                                        className="price-submit-btn"
                                    >
                                        Add Price
                                    </button>

                                </div>

                            </div>

                        </form>

                    )}

                    {/* Centre Selection */}

                    {!loading &&
                        !error &&
                        prices.length > 0 && (

                            <div className="price-centre-selector">

                                <label htmlFor="centre">
                                    Procurement Centre
                                </label>

                                <select
                                    id="centre"
                                    value={selectedCentre}
                                    onChange={(e) =>
                                        setSelectedCentre(e.target.value)
                                    }
                                >

                                    <option value="ALL">
                                        All Centres
                                    </option>

{centres.map((centre) => (

    <option
        key={centre.centre_id}
        value={centre.centre_id}
    >
        {centre.centre_name}
    </option>

))}

                                </select>

                            </div>

                        )}

                    {loading && (
                        <div className="price-message">
                            Loading crop prices...
                        </div>
                    )}

                    {error && !loading && (
                        <div className="price-error">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        prices.length === 0 && (

                            <div className="price-message">
                                No crop prices have been added yet.
                            </div>

                        )}

                    {!loading &&
                        !error &&
                        prices.length > 0 &&
                        filteredPrices.length === 0 && (

                            <div className="price-message">
                                No prices available for this centre.
                            </div>

                        )}

                    {!loading &&
                        !error &&
                        filteredPrices.length > 0 && (

                            <div className="price-table-wrapper">

                                <table className="price-table">

                                    <thead>

                                        <tr>
                                            <th>Crop</th>
                                            <th>Variety</th>
                                            <th>Procurement Centre</th>
                                            <th>Current Price</th>
                                            <th>Effective Date</th>
                                            <th>Action</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredPrices.map((price) => (

                                            <tr key={price.price_id}>

                                                <td>
                                                    <strong>
                                                        {price.crop_name}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {price.variety || '—'}
                                                </td>

                                                <td>
                                                    {price.centre_name}
                                                </td>

                                                <td>

                                                    {editingId === price.price_id ? (

                                                        <div className="price-edit-box">

                                                            <span>₹</span>

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={editPrice}
                                                                onChange={(e) =>
                                                                    setEditPrice(
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />

                                                        </div>

                                                    ) : (

                                                        <span className="price-value">
                                                            ₹{price.price_per_kg}
                                                        </span>

                                                    )}

                                                </td>

                                                <td>
                                                    {price.effective_date || '—'}
                                                </td>

                                                <td>

                                                    {editingId === price.price_id ? (

                                                        <div className="price-actions">

                                                            <button
                                                                className="price-save-btn"
                                                                onClick={() =>
                                                                    savePrice(
                                                                        price.price_id
                                                                    )
                                                                }
                                                            >
                                                                Save
                                                            </button>

                                                            <button
                                                                className="price-cancel-btn"
                                                                onClick={
                                                                    cancelEditing
                                                                }
                                                            >
                                                                Cancel
                                                            </button>

                                                        </div>

                                                    ) : (

                                                        <button
                                                            className="price-edit-btn"
                                                            onClick={() =>
                                                                startEditing(price)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                    )}

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                </section>

            </main>

        </div>
    );
}

export default AdminPrices;