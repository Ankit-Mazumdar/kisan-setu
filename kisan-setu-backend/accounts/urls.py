from django.urls import path

from .views import (
    register_farmer,
    login_farmer,
    forgot_password,
    reset_farmer_password,
     get_farmer_profile,
      update_farmer_profile,
     login_officer,
     login_authority,
     get_admin_dashboard,
    get_crops,
    get_centres,
    create_booking,
    get_farmer_bookings,
    get_queue,
    get_centre_queue,
    officer_update_booking_status,
    create_procurement,
    get_procurement,
     create_payment,
    get_payment,
    update_payment,
     get_pending_payments,
     get_all_farmers,
     get_all_officers,
     create_officer,
     get_all_centres,
     get_admin_centre_details,
     create_centre,
     centre_schedule,
     get_admin_bookings,
     admin_update_booking_status,
     officer_mark_booking_no_show,
     get_admin_booking_overview,
     get_admin_procurements,
     get_farmer_notifications,
     mark_notification_read,
     crop_prices, update_crop_price,
     smart_centre_recommendation,
     get_centre_procurement_history,
     get_centre_upcoming_queue,
     get_farmer_payment_history,
     admin_update_officer_status,
     change_officer_password,
     get_officer_status,
     officer_no_show_history,
     officer_verify_token

)


urlpatterns = [

    path(
        'register/',
        register_farmer,
        name='register_farmer'
    ),

    path(
        'login/',
        login_farmer,
        name='login_farmer'
    ),

    path(
    'forgot-password/',
    forgot_password,
    name='forgot_password'
),

path(
    'reset-password/',
    reset_farmer_password,
    name='reset_farmer_password'
),

path(
    'farmer/<int:farmer_id>/',
    get_farmer_profile,
    name='get_farmer_profile'
),

path(
    'farmer/<int:farmer_id>/update/',
    update_farmer_profile,
    name='update_farmer_profile'
),

    path(
    'officer/login/',
    login_officer,
    name='login_officer'
),

path(
    'admin/login/',
    login_authority,
    name='login_authority'
),

path(
    'admin/dashboard/',
    get_admin_dashboard,
    name='get_admin_dashboard'
),

    path(
        'crops/',
        get_crops,
        name='get_crops'
    ),

    path(
        'centres/',
        get_centres,
        name='get_centres'
    ),

    path(
        'bookings/',
        create_booking,
        name='create_booking'
    ),

    path(
        'bookings/farmer/<int:farmer_id>/',
        get_farmer_bookings,
        name='get_farmer_bookings'
    ),

    path(
        'queue/<int:booking_id>/',
        get_queue,
        name='get_queue'
    ),

    path(
        'centre/<int:centre_id>/queue/',
        get_centre_queue,
        name='get_centre_queue'
    ),

   path(
    'bookings/<int:booking_id>/status/',
    officer_update_booking_status,
    name='officer_update_booking_status'
),

path(
    'officer/bookings/<int:booking_id>/no-show/',
    officer_mark_booking_no_show,
    name='officer_mark_booking_no_show'
),
    path(
        'procurement/',
        create_procurement,
        name='create_procurement'
    ),
    path(
    'procurement/booking/<int:booking_id>/',
    get_procurement,
    name='get_procurement'
),
path(
    'payment/',
    create_payment,
    name='create_payment'
),

path(
    'payment/procurement/<int:procurement_id>/',
    get_payment,
    name='get_payment'
),
path(
    'payment/procurement/<int:procurement_id>/update/',
    update_payment,
    name='update_payment'
),
path(
    'centre/<int:centre_id>/pending-payments/',
    get_pending_payments,
    name='get_pending_payments'
),


path(
    'admin/farmers/',
    get_all_farmers,
    name='get_all_farmers'
),

path(
    'admin/officers/',
    get_all_officers,
    name='get_all_officers'
),

path(
    'admin/officers/create/',
    create_officer,
    name='create_officer'
),
path(
    'admin/centres/',
    get_all_centres,
    name='get_all_centres'
),

path(
    'admin/centres/<int:centre_id>/',
    get_admin_centre_details,
    name='get_admin_centre_details'
),

path(
    'admin/centres/create/',
    create_centre,
    name='create_centre'
),

path(
    'centre/<int:centre_id>/schedule/',
    centre_schedule,
    name='centre_schedule'
),

path(
    'admin/bookings/',
    get_admin_bookings,
    name='get_admin_bookings'
),

path(
    'admin/bookings/<int:booking_id>/status/',
    admin_update_booking_status,
    name='admin_update_booking_status'
),

path(
    'admin/booking-overview/',
    get_admin_booking_overview,
    name='get_admin_booking_overview'
),

path(
    'admin/procurement/',
    get_admin_procurements,
    name='get_admin_procurements'
),

path(
    'farmer/<int:farmer_id>/notifications/',
    get_farmer_notifications,
    name='get_farmer_notifications'
),

path(
    'notification/<int:notification_id>/read/',
    mark_notification_read,
    name='mark_notification_read'
),

path(
    'crop-prices/',
    crop_prices,
    name='crop-prices'
),

path(
    'crop-prices/<int:price_id>/',
    update_crop_price,
    name='update-crop-price'
),

path(
    'smart-centre/',
    smart_centre_recommendation,
    name='smart-centre-recommendation'
),

path(
    'centre/<int:centre_id>/procurement-history/',
    get_centre_procurement_history,
    name='get_centre_procurement_history'
),

path(
    'centre/<int:centre_id>/upcoming-queue/',
    get_centre_upcoming_queue,
    name='get_centre_upcoming_queue'
),

path(
    'payments/farmer/<int:farmer_id>/',
    get_farmer_payment_history,
    name='get_farmer_payment_history'
),

path(
    'admin/officers/<int:officer_id>/status/',
    admin_update_officer_status,
    name='admin_update_officer_status'
),

path(
    'officer/change-password/',
    change_officer_password,
    name='change_officer_password'
),

path(
    'officer/<int:officer_id>/status/',
    get_officer_status,
    name='get_officer_status'
),

path(
    'centre/<int:centre_id>/no-show-history/',
    officer_no_show_history,
    name='officer_no_show_history'
),
path(
    'officer/verify-token/',
    officer_verify_token,
    name='officer_verify_token'
),
]

