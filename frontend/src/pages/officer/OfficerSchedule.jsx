import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/authService.js';
import OfficerNavbar from '../../components/OfficerNavbar.jsx';

import './OfficerDashboard.css';
import './OfficerSchedule.css';


function OfficerSchedule() {

    const navigate = useNavigate();


    const [officer, setOfficer] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');

    const [success, setSuccess] = useState('');


    // All schedules received from Django

    const [schedules, setSchedules] = useState([]);


    // Currently selected calendar date

    const [selectedDate, setSelectedDate] =
        useState(new Date());


    // Current month shown in calendar

    const [currentMonth, setCurrentMonth] =
        useState(new Date());


    // ==========================================
    // FORM
    // ==========================================

    const [form, setForm] = useState({

        openingTime: '09:00',

        closingTime: '17:00',

        dailyCapacity: '50',

        processingTime: '15',

        status: 'OPEN',

        closureReason: ''

    });


    // ==========================================
    // LOAD OFFICER SESSION
    // ==========================================

    useEffect(() => {

        const session =
            localStorage.getItem(
                'kisansetu_officer_session'
            );


        if (!session) {

            navigate('/officer/login');

            return;

        }


        try {

            const officerData =
                JSON.parse(session);

            setOfficer(officerData);


            loadSchedules(
                officerData.centre_id
            );

        } catch (error) {

            console.error(
                'Officer session error:',
                error
            );


            localStorage.removeItem(
                'kisansetu_officer_session'
            );

            navigate('/officer/login');

        }

    }, [navigate]);


    // ==========================================
    // FORMAT DATE FOR API
    // ==========================================

    const formatDateForApi = (date) => {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, '0');

        const day =
            String(
                date.getDate()
            ).padStart(2, '0');


        return (
            `${year}-${month}-${day}`
        );

    };


    // ==========================================
    // LOAD ALL SCHEDULES
    // ==========================================

    const loadSchedules = async (centreId) => {

        try {

            const response =
                await api.get(
                    `/centre/${centreId}/schedule/`
                );


            setSchedules(
                response.data || []
            );


            /*
             * If today's date has a schedule,
             * select today.
             *
             * Otherwise select the first
             * available schedule.
             */

            const today =
                new Date();

            const todayString =
                formatDateForApi(today);


            const todaySchedule =
                (response.data || []).find(
                    (schedule) =>
                        schedule.schedule_date ===
                        todayString
                );


            if (todaySchedule) {

                setSelectedDate(
                    today
                );

            } else if (
                response.data &&
                response.data.length > 0
            ) {

                const firstDate =
                    new Date(
                        response.data[0].schedule_date +
                        'T00:00:00'
                    );

                setSelectedDate(
                    firstDate
                );

                setCurrentMonth(
                    firstDate
                );

            }


        } catch (error) {

            console.error(
                'Schedule loading error:',
                error
            );


            setError(
                'Unable to load centre schedules.'
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // FIND SCHEDULE FOR SELECTED DATE
    // ==========================================

    const getScheduleForDate = (date) => {

        const dateString =
            formatDateForApi(date);


        return schedules.find(
            (schedule) =>
                schedule.schedule_date ===
                dateString
        );

    };


    // ==========================================
    // LOAD SELECTED DATE INTO FORM
    // ==========================================

    useEffect(() => {

        if (!schedules.length) {

            return;

        }


        const schedule =
            getScheduleForDate(
                selectedDate
            );


        if (schedule) {

            setForm({

                openingTime:
                    schedule.opening_time
                        ? schedule.opening_time.slice(0, 5)
                        : '09:00',

                closingTime:
                    schedule.closing_time
                        ? schedule.closing_time.slice(0, 5)
                        : '17:00',

                dailyCapacity:
                    schedule.daily_capacity !== null &&
                    schedule.daily_capacity !== undefined
                        ? String(
                            schedule.daily_capacity
                        )
                        : '50',

                processingTime:
                    schedule.processing_time !== null &&
                    schedule.processing_time !== undefined
                        ? String(
                            schedule.processing_time
                        )
                        : '15',

                status:
                    schedule.status ||
                    'OPEN',

                closureReason:
                    schedule.closure_reason ||
                    ''

            });

        } else {

            /*
             * No schedule exists for this date.
             * Start with normal OPEN defaults.
             */

            setForm({

                openingTime: '09:00',

                closingTime: '17:00',

                dailyCapacity: '50',

                processingTime: '15',

                status: 'OPEN',

                closureReason: ''

            });

        }


        setError('');

        setSuccess('');

    }, [selectedDate, schedules]);


    // ==========================================
    // HANDLE FORM CHANGE
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm((previous) => ({

            ...previous,

            [name]: value

        }));


        setError('');

        setSuccess('');

    };


    // ==========================================
    // SELECT DATE
    // ==========================================

    const handleDateSelect = (date) => {

        setSelectedDate(
            date
        );

        setSuccess('');

        setError('');

    };


    // ==========================================
    // CALENDAR MONTH NAVIGATION
    // ==========================================

    const goToPreviousMonth = () => {

        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
            )
        );

    };


    const goToNextMonth = () => {

        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
            )
        );

    };


    // ==========================================
    // CALENDAR DAYS
    // ==========================================

    const getCalendarDays = () => {

        const year =
            currentMonth.getFullYear();

        const month =
            currentMonth.getMonth();


        const firstDay =
            new Date(
                year,
                month,
                1
            );


        const lastDay =
            new Date(
                year,
                month + 1,
                0
            );


        /*
         * Convert Sunday = 0
         * to Monday = 0
         */

        const startDay =
            (firstDay.getDay() + 6) % 7;


        const totalDays =
            lastDay.getDate();


        const days = [];


        /*
         * Empty cells before first day
         */

        for (
            let i = 0;
            i < startDay;
            i++
        ) {

            days.push(null);

        }


        /*
         * Actual dates
         */

        for (
            let day = 1;
            day <= totalDays;
            day++
        ) {

            days.push(

                new Date(
                    year,
                    month,
                    day
                )

            );

        }


        return days;

    };


    // ==========================================
    // FORMAT SELECTED DATE
    // ==========================================

    const formatSelectedDate = () => {

        return selectedDate.toLocaleDateString(
            'en-IN',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }
        );

    };


    // ==========================================
    // FORMAT MONTH
    // ==========================================

    const formatMonth = () => {

        return currentMonth.toLocaleDateString(
            'en-IN',
            {
                month: 'long',
                year: 'numeric'
            }
        );

    };


    // ==========================================
    // FORMAT TIME
    // ==========================================

    const formatTime = (time) => {

        if (!time) {

            return '--';

        }


        const [
            hour,
            minute
        ] = time.split(':');


        let hourNumber =
            Number(hour);


        const period =
            hourNumber >= 12
                ? 'PM'
                : 'AM';


        hourNumber =
            hourNumber % 12 || 12;


        return (

            String(
                hourNumber
            ).padStart(2, '0')

            +

            ':'

            +

            minute

            +

            ' '

            +

            period

        );

    };


    // ==========================================
    // CHECK SAME DATE
    // ==========================================

    const isSameDate = (
        firstDate,
        secondDate
    ) => {

        return (

            firstDate.getFullYear() ===
            secondDate.getFullYear()

            &&

            firstDate.getMonth() ===
            secondDate.getMonth()

            &&

            firstDate.getDate() ===
            secondDate.getDate()

        );

    };


    // ==========================================
    // SAVE SCHEDULE
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setError('');

        setSuccess('');


        const scheduleDate =
            formatDateForApi(
                selectedDate
            );


        // ======================================
        // CLOSED
        // ======================================

        if (
            form.status === 'CLOSED'
        ) {

            if (
                !form.closureReason.trim()
            ) {

                setError(
                    'Please enter a reason for closing the centre.'
                );

                return;

            }

        }


        // ======================================
        // OPEN
        // ======================================

        if (
            form.status === 'OPEN'
        ) {

            if (!form.openingTime) {

                setError(
                    'Opening time is required.'
                );

                return;

            }


            if (!form.closingTime) {

                setError(
                    'Closing time is required.'
                );

                return;

            }


            if (
                !form.dailyCapacity ||
                Number(
                    form.dailyCapacity
                ) <= 0
            ) {

                setError(
                    'Enter a valid daily capacity.'
                );

                return;

            }


            if (
                !form.processingTime ||
                Number(
                    form.processingTime
                ) <= 0
            ) {

                setError(
                    'Enter a valid processing time.'
                );

                return;

            }


            if (
                form.openingTime >=
                form.closingTime
            ) {

                setError(
                    'Closing time must be after opening time.'
                );

                return;

            }

        }


        setSaving(true);


        try {

            const existingSchedule =
                getScheduleForDate(
                    selectedDate
                );


            const requestData = {

                schedule_date:
                    scheduleDate,

                status:
                    form.status,

                opening_time:
                    form.status === 'OPEN'
                        ? form.openingTime
                        : null,

                closing_time:
                    form.status === 'OPEN'
                        ? form.closingTime
                        : null,

                daily_capacity:
                    form.status === 'OPEN'
                        ? Number(
                            form.dailyCapacity
                        )
                        : null,

                processing_time:
                    Number(
                        form.processingTime
                    ) || 15,

                closure_reason:
                    form.status === 'CLOSED'
                        ? form.closureReason.trim()
                        : null

            };


            let response;


            // ==================================
            // UPDATE EXISTING DATE
            // ==================================

            if (existingSchedule) {

                response =
                    await api.put(

                        `/centre/${officer.centre_id}/schedule/`,

                        requestData

                    );

            }


            // ==================================
            // CREATE NEW DATE
            // ==================================

            else {

                response =
                    await api.post(

                        `/centre/${officer.centre_id}/schedule/`,

                        requestData

                    );

            }


            // ==================================
            // UPDATE LOCAL SCHEDULE LIST
            // ==================================

            const savedSchedule =
                response.data.schedule;


            setSchedules(
                (previous) => {

                    const exists =
                        previous.some(
                            (schedule) =>
                                schedule.schedule_id ===
                                savedSchedule.schedule_id
                        );


                    if (exists) {

                        return previous.map(
                            (schedule) =>

                                schedule.schedule_id ===
                                savedSchedule.schedule_id

                                    ? savedSchedule

                                    : schedule

                        );

                    }


                    return [
                        ...previous,
                        savedSchedule
                    ].sort(
                        (a, b) =>
                            a.schedule_date.localeCompare(
                                b.schedule_date
                            )
                    );

                }
            );


            setSuccess(
                'Schedule saved successfully.'
            );


        } catch (error) {

            console.error(
                'Schedule save error:',
                error
            );


            if (
                error.response &&
                error.response.data
            ) {

                setError(

                    error.response.data.message ||

                    'Unable to save schedule.'

                );

            } else {

                setError(
                    'Unable to connect to the server.'
                );

            }

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="officer-dashboard">

                <OfficerNavbar />

                <main className="officer-page">

                    <div className="officer-container">

                        <div className="officer-loading">

                            Loading centre schedule...

                        </div>

                    </div>

                </main>

            </div>

        );

    }


    // ==========================================
    // CALENDAR DAYS
    // ==========================================

    const calendarDays =
        getCalendarDays();


    // ==========================================
    // SELECTED DATE SCHEDULE
    // ==========================================

    const selectedSchedule =
        getScheduleForDate(
            selectedDate
        );


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="officer-dashboard">


            <OfficerNavbar />


            <main className="officer-page">

                <div className="officer-container">


                    {/* =====================================
                        HEADER
                    ====================================== */}

                    <section className="officer-header">

                        <div>

                            <span className="officer-eyebrow">
                                CENTRE MANAGEMENT
                            </span>

                            <h1>
                                Centre Schedule
                            </h1>

                            <p>
                                Manage your centre's operating hours and availability for upcoming procurement dates.
                            </p>

                        </div>


                        <div className="officer-header-badge">

                            <span className="officer-header-badge__icon">
                                📍
                            </span>

                            <div>

                                <strong>
                                    {
                                        officer?.centre_name ||
                                        'Procurement Centre'
                                    }
                                </strong>

                                <small>
                                    Centre ID: {
                                        officer?.centre_id ||
                                        '-'
                                    }
                                </small>

                            </div>

                        </div>

                    </section>


                    {/* =====================================
                        ERROR
                    ====================================== */}

                    {error && (

                        <div className="officer-error">

                            {error}

                        </div>

                    )}


                    {/* =====================================
                        SUCCESS
                    ====================================== */}

                    {success && (

                        <div className="schedule-success">

                            {success}

                        </div>

                    )}


                    <section className="schedule-page">


                        <div className="schedule-calendar-card">


                            {/* =================================
                                CALENDAR
                            ================================== */}

                            <div className="schedule-calendar">


                                <div className="schedule-calendar-header">

                                    <button
                                        type="button"
                                        className="schedule-calendar-nav"
                                        onClick={
                                            goToPreviousMonth
                                        }
                                    >
                                        ←
                                    </button>


                                    <h2>
                                        {formatMonth()}
                                    </h2>


                                    <button
                                        type="button"
                                        className="schedule-calendar-nav"
                                        onClick={
                                            goToNextMonth
                                        }
                                    >
                                        →
                                    </button>

                                </div>


                                <div className="schedule-calendar-weekdays">

                                    <span>
                                        Mon
                                    </span>

                                    <span>
                                        Tue
                                    </span>

                                    <span>
                                        Wed
                                    </span>

                                    <span>
                                        Thu
                                    </span>

                                    <span>
                                        Fri
                                    </span>

                                    <span>
                                        Sat
                                    </span>

                                    <span>
                                        Sun
                                    </span>

                                </div>


                                <div className="schedule-calendar-grid">

                                    {calendarDays.map(
                                        (
                                            date,
                                            index
                                        ) => {

                                            if (!date) {

                                                return (

                                                    <div
                                                        key={
                                                            `empty-${index}`
                                                        }
                                                        className="schedule-calendar-day empty"
                                                    />

                                                );

                                            }


                                            const dateSchedule =
                                                getScheduleForDate(
                                                    date
                                                );


                                            const isSelected =
                                                isSameDate(
                                                    date,
                                                    selectedDate
                                                );


                                            const isToday =
                                                isSameDate(
                                                    date,
                                                    new Date()
                                                );


                                            return (

                                                <button
                                                    type="button"
                                                    key={
                                                        formatDateForApi(
                                                            date
                                                        )
                                                    }
                                                    className={

                                                        'schedule-calendar-day'

                                                        +

                                                        (
                                                            isSelected
                                                                ? ' selected'
                                                                : ''
                                                        )

                                                        +

                                                        (
                                                            isToday
                                                                ? ' today'
                                                                : ''
                                                        )

                                                        +

                                                        (
                                                            dateSchedule
                                                                ? ` ${dateSchedule.status.toLowerCase()}`
                                                                : ''
                                                        )

                                                    }
                                                    onClick={() =>
                                                        handleDateSelect(
                                                            date
                                                        )
                                                    }
                                                >

                                                    <span className="schedule-calendar-day-number">

                                                        {
                                                            date.getDate()
                                                        }

                                                    </span>


                                                    {dateSchedule && (

                                                        <span
                                                            className="schedule-calendar-day-status"
                                                        >

                                                            {
                                                                dateSchedule.status ===
                                                                'OPEN'
                                                                    ? 'Open'
                                                                    : 'Closed'
                                                            }

                                                        </span>

                                                    )}

                                                </button>

                                            );

                                        }
                                    )}

                                </div>


                                {/* LEGEND */}

                                <div className="schedule-calendar-legend">

                                    <span>

                                        <i className="legend-dot open"></i>

                                        Open

                                    </span>


                                    <span>

                                        <i className="legend-dot closed"></i>

                                        Closed

                                    </span>


                                    <span>

                                        <i className="legend-dot unscheduled"></i>

                                        Not scheduled

                                    </span>

                                </div>


                            </div>


                            {/* =================================
                                SELECTED DATE FORM
                            ================================== */}

                            <div className="schedule-editor">


                                <div className="schedule-editor-header">

                                    <div>

                                        <span className="schedule-editor-eyebrow">
                                            SELECTED DATE
                                        </span>

                                        <h2>
                                            {formatSelectedDate()}
                                        </h2>

                                    </div>


                                    <div
                                        className={

                                            form.status === 'OPEN'

                                                ? 'schedule-status open'

                                                : 'schedule-status closed'

                                        }
                                    >

                                        <span></span>

                                        {
                                            form.status === 'OPEN'
                                                ? 'OPEN'
                                                : 'CLOSED'
                                        }

                                    </div>

                                </div>


                                {selectedSchedule ? (

                                    <p className="schedule-date-note">

                                        This date already has a schedule.
                                        You can update it below.

                                    </p>

                                ) : (

                                    <p className="schedule-date-note">

                                        No schedule has been created for
                                        this date yet.

                                    </p>

                                )}


                                <form
                                    className="schedule-form"
                                    onSubmit={
                                        handleSubmit
                                    }
                                >


                                    {/* =================================
                                        CENTRE STATUS
                                    ================================== */}

                                    <div className="schedule-section">

                                        <h3>
                                            Centre Status
                                        </h3>

                                        <p>
                                            Choose whether the centre will operate on this date.
                                        </p>


                                        <div className="schedule-status-options">


                                            <label>

                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="OPEN"
                                                    checked={
                                                        form.status ===
                                                        'OPEN'
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                                <span>
                                                    Open
                                                </span>

                                            </label>


                                            <label>

                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="CLOSED"
                                                    checked={
                                                        form.status ===
                                                        'CLOSED'
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                                <span>
                                                    Closed
                                                </span>

                                            </label>


                                        </div>

                                    </div>


                                    {/* =================================
                                        OPEN SETTINGS
                                    ================================== */}

                                    {form.status === 'OPEN' && (

                                        <>

                                            <div className="schedule-section">

                                                <h3>
                                                    Centre Hours
                                                </h3>

                                                <p>
                                                    Set the operating hours for this date.
                                                </p>


                                                <div className="schedule-grid">


                                                    <div className="schedule-field">

                                                        <label>
                                                            Opening Time
                                                        </label>

                                                        <input
                                                            type="time"
                                                            name="openingTime"
                                                            value={
                                                                form.openingTime
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            required
                                                        />

                                                        <small>
                                                            {
                                                                formatTime(
                                                                    form.openingTime
                                                                )
                                                            }
                                                        </small>

                                                    </div>


                                                    <div className="schedule-field">

                                                        <label>
                                                            Closing Time
                                                        </label>

                                                        <input
                                                            type="time"
                                                            name="closingTime"
                                                            value={
                                                                form.closingTime
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            required
                                                        />

                                                        <small>
                                                            {
                                                                formatTime(
                                                                    form.closingTime
                                                                )
                                                            }
                                                        </small>

                                                    </div>


                                                </div>

                                            </div>


                                            <div className="schedule-section">

                                                <h3>
                                                    Queue Settings
                                                </h3>

                                                <p>
                                                    These values are used to estimate farmer waiting time.
                                                </p>


                                                <div className="schedule-grid">


                                                    <div className="schedule-field">

                                                        <label>
                                                            Daily Capacity
                                                        </label>

                                                        <input
                                                            type="number"
                                                            name="dailyCapacity"
                                                            value={
                                                                form.dailyCapacity
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            min="1"
                                                            required
                                                        />

                                                        <small>
                                                            Maximum farmers accepted per day.
                                                        </small>

                                                    </div>


                                                    <div className="schedule-field">

                                                        <label>
                                                            Average Processing Time
                                                        </label>


                                                        <div className="schedule-number-input">

                                                            <input
                                                                type="number"
                                                                name="processingTime"
                                                                value={
                                                                    form.processingTime
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                min="1"
                                                                required
                                                            />

                                                            <span>
                                                                minutes
                                                            </span>

                                                        </div>


                                                        <small>
                                                            Average time required for one farmer.
                                                        </small>

                                                    </div>


                                                </div>

                                            </div>

                                        </>

                                    )}


                                    {/* =================================
                                        CLOSED SETTINGS
                                    ================================== */}

                                    {form.status === 'CLOSED' && (

                                        <div className="schedule-section">

                                            <h3>
                                                Closure Details
                                            </h3>

                                            <p>
                                                Tell farmers why procurement is unavailable on this date.
                                            </p>


                                            <div className="schedule-field">

                                                <label>
                                                    Closure Reason
                                                </label>

                                                <input
                                                    type="text"
                                                    name="closureReason"
                                                    value={
                                                        form.closureReason
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="Example: Centre closed for local holiday"
                                                    maxLength="255"
                                                    required
                                                />

                                                <small>
                                                    This reason can be shown to farmers when they select this date.
                                                </small>

                                            </div>

                                        </div>

                                    )}


                                    {/* =================================
                                        PREVIEW
                                    ================================== */}

                                    <div className="schedule-preview">


                                        <div>

                                            <span>
                                                Date
                                            </span>

                                            <strong>
                                                {
                                                    formatSelectedDate()
                                                }
                                            </strong>

                                        </div>


                                        {form.status === 'OPEN' ? (

                                            <>

                                                <div>

                                                    <span>
                                                        Centre Hours
                                                    </span>

                                                    <strong>

                                                        {
                                                            formatTime(
                                                                form.openingTime
                                                            )
                                                        }

                                                        {' — '}

                                                        {
                                                            formatTime(
                                                                form.closingTime
                                                            )
                                                        }

                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Daily Capacity
                                                    </span>

                                                    <strong>

                                                        {
                                                            form.dailyCapacity
                                                        }

                                                        {' farmers'}

                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Processing Time
                                                    </span>

                                                    <strong>

                                                        {
                                                            form.processingTime
                                                        }

                                                        {' min / farmer'}

                                                    </strong>

                                                </div>

                                            </>

                                        ) : (

                                            <div>

                                                <span>
                                                    Centre Status
                                                </span>

                                                <strong>
                                                    Closed
                                                </strong>

                                            </div>

                                        )}


                                    </div>


                                    {/* =================================
                                        ACTIONS
                                    ================================== */}

                                    <div className="schedule-actions">


                                        <button
                                            type="button"
                                            className="schedule-cancel"
                                            onClick={() =>
                                                navigate(
                                                    '/officer/dashboard'
                                                )
                                            }
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="submit"
                                            className="schedule-save"
                                            disabled={saving}
                                        >

                                            {
                                                saving
                                                    ? 'Saving...'
                                                    : 'Save Schedule'
                                            }

                                        </button>


                                    </div>


                                </form>


                            </div>


                        </div>


                    </section>


                </div>

            </main>

        </div>

    );

}


export default OfficerSchedule;