from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import timezone as dt_timezone
from django.utils import timezone

from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Case, When, Value, IntegerField, Count
# from django.db.models import Count

# from .models import Farmer,Crop,Centre , Booking , Procurement,Payment,Officer, Authority,    CentreSchedule, Notification, crop_prices, update_crop_price
from .models import (
    Farmer,
    Crop,
    Centre,
    Booking,
    
    Procurement,
    Payment,
    Officer,
    Authority,
    CentreSchedule,
    Notification,
    CropPrice
   
)
from .serializers import FarmerSerializer , CropSerializer , CentreSerializer ,  BookingSerializer, ProcurementSerializer,PaymentSerializer,NotificationSerializer,CropPriceSerializer


# @api_view(['POST'])
# def register_farmer(request):

#     data = request.data.copy()

#     # Hash password before saving
#     data['password'] = make_password(data['password'])

#     serializer = FarmerSerializer(data=data)

#     if serializer.is_valid():
#         serializer.save()

#         return Response(
#             {
#                 'message': 'Farmer registered successfully',
#                 'farmer': {
#                     'farmer_id': serializer.instance.farmer_id,
#                     'full_name': serializer.instance.full_name,
#                     'email': serializer.instance.email,
#                     'phone': serializer.instance.phone
#                 }
#             },
#             status=status.HTTP_201_CREATED
#         )

#     return Response(
#         serializer.errors,
#         status=status.HTTP_400_BAD_REQUEST
#     )


@api_view(['POST'])
def register_farmer(request):

    data = request.data.copy()

    # Email is optional
    if not data.get('email'):
        data['email'] = None

    # Hash password
    data['password'] = make_password(
        data['password']
    )

    serializer = FarmerSerializer(data=data)

    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                'message': 'Farmer registered successfully',

                'farmer': {
                    'farmer_id':
                        serializer.instance.farmer_id,

                    'full_name':
                        serializer.instance.full_name,

                    'email':
                        serializer.instance.email,

                    'phone':
                        serializer.instance.phone
                }
            },

            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['POST'])
def login_farmer(request):

    identifier = request.data.get(
        'identifier',
        ''
    ).strip()

    password = request.data.get(
        'password',
        ''
    )

    if not identifier or not password:

        return Response(
            {
                'message':
                    'Email or mobile number and password are required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ==========================================
    # FIND FARMER BY EMAIL OR MOBILE NUMBER
    # ==========================================

    farmer = None

    if '@' in identifier:

        # Login using email
        farmer = Farmer.objects.filter(
            email__iexact=identifier
        ).first()

    else:

        # Login using mobile number
        farmer = Farmer.objects.filter(
            phone=identifier
        ).first()


    # ==========================================
    # CHECK FARMER
    # ==========================================

    if not farmer:

        return Response(
            {
                'message':
                    'Invalid email/mobile number or password'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )


    # ==========================================
    # CHECK PASSWORD
    # ==========================================

    if not check_password(
        password,
        farmer.password
    ):

        return Response(
            {
                'message':
                    'Invalid email/mobile number or password'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )


    # ==========================================
    # LOGIN SUCCESSFUL
    # ==========================================

    return Response(
        {
            'message':
                'Login successful',

            'farmer': {

                'farmer_id':
                    farmer.farmer_id,

                'full_name':
                    farmer.full_name,

                'email':
                    farmer.email,

                'phone':
                    farmer.phone,

                'address':
                    farmer.address,

                'village':
                    farmer.village,

                'district':
                    farmer.district,

                'state':
                    farmer.state
            }
        },

        status=status.HTTP_200_OK
    )


# ==========================================
# GET FARMER PROFILE
# ==========================================

# ==========================================
# FORGOT PASSWORD - VERIFY FARMER
# ==========================================

@api_view(['POST'])
def forgot_password(request):

    phone = request.data.get(
        'phone',
        ''
    ).strip()

    # ==========================================
    # CHECK MOBILE NUMBER
    # ==========================================

    if not phone:

        return Response(
            {
                'message':
                    'Mobile number is required.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # ==========================================
    # FIND FARMER
    # ==========================================

    farmer = Farmer.objects.filter(
        phone=phone
    ).first()

    # ==========================================
    # FARMER NOT FOUND
    # ==========================================

    if not farmer:

        return Response(
            {
                'message':
                    'No farmer account found with this mobile number.'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # ==========================================
    # FARMER FOUND
    # ==========================================

    return Response(
        {
            'message':
                'Farmer account verified successfully.',
            'farmer_id':
                farmer.farmer_id,
            'phone':
                farmer.phone
        },
        status=status.HTTP_200_OK
    )

# ==========================================
# RESET FARMER PASSWORD
# ==========================================

@api_view(['POST'])
def reset_farmer_password(request):

    farmer_id = request.data.get(
        'farmer_id'
    )

    new_password = request.data.get(
        'new_password'
    )

    # ==========================================
    # CHECK REQUIRED DATA
    # ==========================================

    if not farmer_id or not new_password:

        return Response(
            {
                'message':
                    'Farmer ID and new password are required.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # ==========================================
    # CHECK PASSWORD LENGTH
    # ==========================================

    if len(new_password) < 6:

        return Response(
            {
                'message':
                    'New password must be at least 6 characters long.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # ==========================================
    # FIND FARMER
    # ==========================================

    try:

        farmer = Farmer.objects.get(
            farmer_id=farmer_id
        )

    except Farmer.DoesNotExist:

        return Response(
            {
                'message':
                    'Farmer account not found.'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # ==========================================
    # UPDATE PASSWORD
    # ==========================================

    farmer.password = make_password(
        new_password
    )

    farmer.save(
        update_fields=['password']
    )

    # ==========================================
    # SUCCESS
    # ==========================================

    return Response(
        {
            'message':
                'Password reset successfully.'
        },
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def get_farmer_profile(request, farmer_id):

    try:

        farmer = Farmer.objects.get(
            farmer_id=farmer_id
        )

        return Response(
            {
                'farmer_id':
                    farmer.farmer_id,

                'full_name':
                    farmer.full_name,

                'email':
                    farmer.email,

                'phone':
                    farmer.phone,

                'address':
                    farmer.address,

                'village':
                    farmer.village,

                'district':
                    farmer.district,

                'state':
                    farmer.state,

                'aadhaar_no':
                    farmer.aadhaar_no,

                'farmer_govt_id':
                    farmer.farmer_govt_id,

                'bank_name':
                    farmer.bank_name,

                'bank_account_no':
                    farmer.bank_account_no,

                'created_at':
                    farmer.created_at
            },

            status=status.HTTP_200_OK
        )

    except Farmer.DoesNotExist:

        return Response(
            {
                'message':
                    'Farmer not found'
            },

            status=status.HTTP_404_NOT_FOUND
        )

# ==========================================
# UPDATE FARMER PROFILE
# ==========================================

@api_view(['PUT'])
def update_farmer_profile(request, farmer_id):

    try:

        farmer = Farmer.objects.get(
            farmer_id=farmer_id
        )

    except Farmer.DoesNotExist:

        return Response(
            {
                'message':
                    'Farmer not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )


    # ==========================================
    # GET DATA FROM REQUEST
    # ==========================================

    full_name = request.data.get(
        'full_name'
    )

    phone = request.data.get(
        'phone'
    )

    email = request.data.get(
        'email'
    )

    address = request.data.get(
        'address'
    )

    village = request.data.get(
        'village'
    )

    district = request.data.get(
        'district'
    )

    state = request.data.get(
        'state'
    )

    aadhaar_no = request.data.get(
        'aadhaar_no'
    )

    farmer_govt_id = request.data.get(
        'farmer_govt_id'
    )

    bank_name = request.data.get(
        'bank_name'
    )

    bank_account_no = request.data.get(
        'bank_account_no'
    )


    # ==========================================
    # UPDATE FARMER DETAILS
    # ==========================================

    if full_name is not None:
        farmer.full_name = full_name

    if phone is not None:
        farmer.phone = phone

    if email is not None:
        farmer.email = email or None

    if address is not None:
        farmer.address = address or None

    if village is not None:
        farmer.village = village or None

    if district is not None:
        farmer.district = district or None

    if state is not None:
        farmer.state = state or None

    if aadhaar_no is not None:
        farmer.aadhaar_no = aadhaar_no or None

    if farmer_govt_id is not None:
        farmer.farmer_govt_id = farmer_govt_id or None

    if bank_name is not None:
        farmer.bank_name = bank_name or None

    if bank_account_no is not None:
        farmer.bank_account_no = bank_account_no or None


    # ==========================================
    # SAVE TO DATABASE
    # ==========================================

    farmer.save(
        update_fields=[
            'full_name',
            'phone',
            'email',
            'address',
            'village',
            'district',
            'state',
            'aadhaar_no',
            'farmer_govt_id',
            'bank_name',
            'bank_account_no'
        ]
    )


    # ==========================================
    # RETURN UPDATED PROFILE
    # ==========================================

    return Response(
        {
            'message':
                'Farmer profile updated successfully',

            'farmer': {

                'farmer_id':
                    farmer.farmer_id,

                'full_name':
                    farmer.full_name,

                'email':
                    farmer.email,

                'phone':
                    farmer.phone,

                'address':
                    farmer.address,

                'village':
                    farmer.village,

                'district':
                    farmer.district,

                'state':
                    farmer.state,

                'aadhaar_no':
                    farmer.aadhaar_no,

                'farmer_govt_id':
                    farmer.farmer_govt_id,

                'bank_name':
                    farmer.bank_name,

                'bank_account_no':
                    farmer.bank_account_no,

                'created_at':
                    farmer.created_at
            }
        },

        status=status.HTTP_200_OK
    )


@api_view(['POST'])
def login_officer(request):

    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {
                'message': 'Email and password are required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        officer = Officer.objects.select_related('centre').get(
            email=email
        )

    except Officer.DoesNotExist:

        return Response(
            {
                'message': 'Invalid email or password'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not check_password(password, officer.password):

        return Response(
            {
                'message': 'Invalid email or password'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    if officer.status != 'ACTIVE':
        return Response(
        {
            'message':
                'Your officer account has been deactivated by the authority right now. Please contact the administrator for assistance.'
        },
        status=status.HTTP_403_FORBIDDEN
    )

    return Response(
        {
            'message': 'Officer login successful',

            'officer': {
                'officer_id': officer.officer_id,
                'full_name': officer.full_name,
                'email': officer.email,
                'phone': officer.phone,
                'centre_id': officer.centre.centre_id,
                'centre_name': officer.centre.centre_name,
                'status': officer.status
            }
        },
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
def login_authority(request):

    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {
                'message': 'Email and password are required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        authority = Authority.objects.get(
            email=email
        )

    except Authority.DoesNotExist:

        return Response(
            {
                'message': 'Invalid email or password'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not check_password(
        password,
        authority.password
    ):

        return Response(
            {
                'message': 'Invalid email or password'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    if authority.status != 'ACTIVE':

        return Response(
            {
                'message': 'Authority account is inactive'
            },
            status=status.HTTP_403_FORBIDDEN
        )

    return Response(
        {
            'message': 'Authority login successful',

            'authority': {
                'admin_id':
                    authority.admin_id,

                'full_name':
                    authority.full_name,

                'email':
                    authority.email,

                'status':
                    authority.status
            }
        },
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def get_crops(request):

    crops = Crop.objects.all()

    serializer = CropSerializer(crops, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def get_centres(request):

    centres = Centre.objects.all()

    serializer = CentreSerializer(centres, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
def create_booking(request):

    print("BOOKING DATA RECEIVED:", request.data)

    data = request.data.copy()

    farmer_id = data.get('farmer')
    crop_id = data.get('crop')
    centre_id = data.get('centre')
    booking_date = data.get('booking_date')

    # =================================================
    # REQUIRED FIELDS
    # =================================================

    if not farmer_id:
        return Response(
            {'message': 'Farmer is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not crop_id:
        return Response(
            {'message': 'Crop is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not centre_id:
        return Response(
            {'message': 'Procurement centre is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not booking_date:
        return Response(
            {'message': 'Booking date is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # CHECK FARMER
    # =================================================

    try:

        farmer = Farmer.objects.get(
            farmer_id=farmer_id
        )

    except Farmer.DoesNotExist:

        return Response(
            {'message': 'Farmer not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # =================================================
    # CHECK CROP
    # =================================================

    try:

        crop = Crop.objects.get(
            crop_id=crop_id
        )

    except Crop.DoesNotExist:

        return Response(
            {'message': 'Crop not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # =================================================
    # CHECK CENTRE
    # =================================================

    try:

        centre = Centre.objects.get(
            centre_id=centre_id
        )

    except Centre.DoesNotExist:

        return Response(
            {'message': 'Procurement centre not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # =================================================
    # CONVERT BOOKING DATE
    # =================================================

    try:

        from datetime import date

        selected_date = date.fromisoformat(
            booking_date
        )

    except ValueError:

        return Response(
            {
                'message':
                    'Invalid booking date.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # TODAY
    # =================================================

    from django.utils import timezone

    today = timezone.localdate()

    # =================================================
    # PREVIOUS DATE CHECK
    # =================================================

    if selected_date < today:

        return Response(
            {
                'message':
                    'You cannot book a previous date.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # CHECK CENTRE SCHEDULE
    # =================================================

    schedule = CentreSchedule.objects.filter(
        centre_id=centre_id,
        schedule_date=selected_date
    ).first()

    if schedule is None:

        return Response(
            {
                'message':
                    'Centre schedule has not been created for this date.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # CHECK CENTRE STATUS
    # =================================================

    if schedule.status != 'OPEN':

        return Response(
            {
                'message':
                    'This procurement centre is currently closed.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # CHECK OPENING / CLOSING TIME
    # =================================================

    if (
        schedule.opening_time is None
        or schedule.closing_time is None
    ):

        return Response(
            {
                'message':
                    'Centre operating time has not been configured.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # CHECK PROCESSING TIME
    # =================================================

    processing_minutes = schedule.processing_time

    if (
        not processing_minutes
        or processing_minutes <= 0
    ):

        return Response(
            {
                'message':
                    'Centre processing time is not configured correctly.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # CHECK DUPLICATE ACTIVE BOOKING
    # =================================================

    existing_farmer_booking = Booking.objects.filter(
        farmer_id=farmer_id,
        booking_date=selected_date,
        status__in=[
            'CONFIRMED',
            'IN_PROGRESS'
        ]
    ).first()

    if existing_farmer_booking is not None:

        return Response(
            {
                'message':
                    'You already have an active booking for this date.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # CHECK DAILY CAPACITY
    # =================================================

    active_bookings = Booking.objects.filter(
        centre_id=centre_id,
        booking_date=selected_date
    ).exclude(
        status__in=[
            'REJECTED',
            'NO_SHOW'
        ]
    )

    active_booking_count = active_bookings.count()

    if (
        schedule.daily_capacity is not None
        and active_booking_count >= schedule.daily_capacity
    ):

        return Response(
            {
                'message':
                    'Daily booking capacity is full for this centre.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # GET CURRENT CONFIRMED BOOKINGS
    # =================================================

    confirmed_bookings = Booking.objects.filter(
        centre_id=centre_id,
        booking_date=selected_date,
        status__in=[
            'CONFIRMED',
            'IN_PROGRESS',
            'COMPLETED'
        ]
    ).order_by(
        'slot_time',
        'booking_id'
    )

    confirmed_count = confirmed_bookings.count()

    # =================================================
    # GENERATE TOKEN
    # =================================================

    token_number = confirmed_count + 1

    token = (
        'KS-'
        + str(centre.centre_id)
        + '-'
        + selected_date.strftime('%Y%m%d')
        + '-'
        + str(token_number)
    )

    # =================================================
    # CALCULATE SLOT TIME
    # =================================================

    from datetime import datetime, timedelta

    # -------------------------------------------------
    # FUTURE DATE
    # -------------------------------------------------

    if selected_date > today:

        slot_datetime = datetime.combine(
            selected_date,
            schedule.opening_time
        )

        slot_datetime = (
            slot_datetime
            + timedelta(
                minutes=(
                    confirmed_count
                    * processing_minutes
                )
            )
        )

    # -------------------------------------------------
    # TODAY
    # -------------------------------------------------

    else:

        now = timezone.localtime()

        current_datetime = now.replace(
            tzinfo=None,
            second=0,
            microsecond=0
        )

        opening_datetime = datetime.combine(
            selected_date,
            schedule.opening_time
        )

        # Start from centre opening time
        # or current time, whichever is later

        base_datetime = max(
            opening_datetime,
            current_datetime
        )

        # ---------------------------------------------
        # ROUND CURRENT TIME UP
        # ---------------------------------------------

        if base_datetime > opening_datetime:

            minutes_from_midnight = (
                base_datetime.hour * 60
                + base_datetime.minute
            )

            remainder = (
                minutes_from_midnight
                % processing_minutes
            )

            if remainder != 0:

                minutes_to_add = (
                    processing_minutes
                    - remainder
                )

                base_datetime = (
                    base_datetime
                    + timedelta(
                        minutes=minutes_to_add
                    )
                )

        # ---------------------------------------------
        # CHECK LATEST CONFIRMED SLOT
        # ---------------------------------------------

        latest_booking = confirmed_bookings.filter(
            slot_time__isnull=False
        ).order_by(
            '-slot_time'
        ).first()

        if latest_booking is not None:

            latest_slot_datetime = datetime.combine(
                selected_date,
                latest_booking.slot_time
            )

            next_after_latest = (
                latest_slot_datetime
                + timedelta(
                    minutes=processing_minutes
                )
            )

            if next_after_latest > base_datetime:

                base_datetime = next_after_latest

        slot_datetime = base_datetime

    # =================================================
    # CHECK CLOSING TIME
    # =================================================

    closing_datetime = datetime.combine(
        selected_date,
        schedule.closing_time
    )

    slot_end_datetime = (
        slot_datetime
        + timedelta(
            minutes=processing_minutes
        )
    )

    if slot_end_datetime > closing_datetime:

        return Response(
            {
                'message':
                    'No available slot remains before the centre closing time.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # CREATE BOOKING
    # =================================================

    data['status'] = 'CONFIRMED'

    data['token_number'] = token

    data['slot_time'] = slot_datetime.time()

    serializer = BookingSerializer(
        data=data
    )

    if serializer.is_valid():

        booking = serializer.save()

        # =============================================
        # FARMER NOTIFICATION
        # =============================================

        Notification.objects.create(
            farmer=booking.farmer,
            title='Booking Confirmed',
            message=(
                'Your booking for '
                + booking.crop.crop_name
                + ' on '
                + booking.booking_date.strftime('%d %b %Y')
                + ' has been confirmed. '
                + 'Your token number is '
                + booking.token_number
                + '. Your slot time is '
                + booking.slot_time.strftime('%I:%M %p')
                + '.'
            ),
            notification_type='BOOKING'
        )

        # =============================================
        # RESPONSE
        # =============================================

        return Response(
            {
                'message':
                    'Booking confirmed successfully.',

                'booking': {

                    'booking_id':
                        booking.booking_id,

                    'farmer':
                        booking.farmer.farmer_id,

                    'crop':
                        booking.crop.crop_name,

                    'centre':
                        centre.centre_name,

                    'booking_date':
                        booking.booking_date,

                    'status':
                        booking.status,

                    'token_number':
                        booking.token_number,

                    'slot_time':
                        booking.slot_time
                }
            },
            status=status.HTTP_201_CREATED
        )

    # =================================================
    # SERIALIZER ERROR
    # =================================================

    print(
        "BOOKING SERIALIZER ERRORS:",
        serializer.errors
    )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )
@api_view(['GET'])
def get_farmer_bookings(request, farmer_id):

    bookings = Booking.objects.filter(
        farmer_id=farmer_id
    ).order_by('-created_at')

    serializer = BookingSerializer(
        bookings,
        many=True
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )



@api_view(['GET'])
def get_queue(request, booking_id):

    from datetime import datetime, timedelta
    from django.utils import timezone

    try:
        booking = Booking.objects.select_related(
            'centre'
        ).get(
            booking_id=booking_id
        )

    except Booking.DoesNotExist:
        return Response(
            {
                'message': 'Booking not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Get schedule for exact booking date
    schedule = CentreSchedule.objects.filter(
        centre_id=booking.centre_id,
        schedule_date=booking.booking_date
    ).first()

    if schedule is None:
        return Response(
            {
                'message':
                    'Centre schedule has not been created.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find approved/in-progress farmers
    # before this farmer
    bookings_ahead = Booking.objects.filter(
        centre_id=booking.centre_id,
        booking_date=booking.booking_date,
        status__in=[
            # 'APPROVED',
            'CONFIRMED',
            'IN_PROGRESS'
        ],
        booking_id__lt=booking.booking_id
    ).count()

    # Queue position
    queue_position = bookings_ahead + 1

    # Processing time
    average_service_minutes = (
        schedule.processing_time
    )

    # Estimated waiting time
    estimated_wait_minutes = (
        bookings_ahead
        * average_service_minutes
    )

    # =================================================
    # ESTIMATED TURN
    # =================================================

    if booking.slot_time is not None:

        booking_datetime = datetime.combine(
            booking.booking_date,
            booking.slot_time
        )

    else:

        booking_datetime = datetime.combine(
            booking.booking_date,
            schedule.opening_time
        )

    estimated_turn_datetime = (
        booking_datetime
        + timedelta(
            minutes=estimated_wait_minutes
        )
    )

    # Current local time
    now = timezone.localtime()

    now_naive = now.replace(
        tzinfo=None,
        second=0,
        microsecond=0
    )

    # =================================================
    # IF ESTIMATED TURN HAS ALREADY PASSED
    # =================================================

    if (
        booking.booking_date == now.date()
        and estimated_turn_datetime <= now_naive
        and booking.status == 'APPROVED'
    ):

        estimated_wait_minutes = 0

        estimated_turn_datetime = now_naive

    estimated_turn_time = (
        estimated_turn_datetime.strftime(
            '%I:%M %p'
        )
    )

    return Response(
        {
            'booking_id':
                booking.booking_id,

            'token_number':
                booking.token_number,

            'queue_position':
                queue_position,

            'people_ahead':
                bookings_ahead,

            'estimated_wait_minutes':
                estimated_wait_minutes,

            'estimated_turn_time':
                estimated_turn_time,

            'processing_time':
                average_service_minutes,

            'status':
                booking.status
        },
        status=status.HTTP_200_OK
    )
@api_view(['GET'])
def get_centre_queue(request, centre_id):

    from django.utils import timezone
    from datetime import timedelta

    today = timezone.localdate()

    bookings = list(
        Booking.objects.filter(
            centre_id=centre_id,
            booking_date=today,
            status__in=[
                # 'APPROVED',
                'CONFIRMED',
                'IN_PROGRESS'
            ]
        ).order_by(
            'slot_time',
            'booking_id'
        )
    )

    # Get centre processing time
    schedule = CentreSchedule.objects.filter(
        centre_id=centre_id
    ).first()

    if schedule is None:
        return Response(
            {
                'message':
                'Centre schedule has not been created.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    processing_time = schedule.processing_time

    # Current Indian time
    now = timezone.localtime()

    response_data = []

    for index, booking in enumerate(bookings):

        booking_data = BookingSerializer(
            booking
        ).data

        # --------------------------------
        # LIVE QUEUE TIME
        # --------------------------------

        if booking.status == 'IN_PROGRESS':

            booking_data['live_time'] = 'NOW'

        else:

            live_datetime = (
                now +
                timedelta(
                    minutes=index *
                    processing_time
                )
            )

            booking_data['live_time'] = (
                timezone.localtime(
                    live_datetime
                ).strftime('%I:%M %p')
            )

        response_data.append(
            booking_data
        )

    return Response(
        response_data,
        status=status.HTTP_200_OK
    )
@api_view(['PUT'])
def officer_update_booking_status(request, booking_id):

    new_status = request.data.get('status')

    if not new_status:

        return Response(
            {
                'message': 'Status is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        booking = Booking.objects.get(
            booking_id=booking_id
        )

    except Booking.DoesNotExist:

        return Response(
            {
                'message': 'Booking not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # CONFIRMED → IN_PROGRESS
    if new_status == 'IN_PROGRESS':

        if booking.status != 'CONFIRMED':

            return Response(
                {
                    'message':
                    'Only confirmed bookings can be started.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'IN_PROGRESS'

    # IN_PROGRESS → COMPLETED
    elif new_status == 'COMPLETED':

        if booking.status != 'IN_PROGRESS':

            return Response(
                {
                    'message':
                    'Only bookings in progress can be completed.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'COMPLETED'

    else:

        return Response(
            {
                'message':
                'Invalid status transition.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    booking.save(
        update_fields=['status']
    )

    return Response(
        {
            'message':
            'Booking status updated successfully',

            'booking_id':
            booking.booking_id,

            'status':
            booking.status
        },
        status=status.HTTP_200_OK
    )
@api_view(['POST'])
def officer_mark_booking_no_show(request, booking_id):

    try:
        booking = Booking.objects.get(
            booking_id=booking_id
        )

    except Booking.DoesNotExist:

        return Response(
            {
                'message': 'Booking not found.'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Only CONFIRMED bookings can be marked as NO_SHOW
    if booking.status != 'CONFIRMED':

        return Response(
            {
                'message':
                'Only confirmed bookings can be marked as no-show.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    booking.status = 'NO_SHOW'

    booking.save(
        update_fields=['status']
    )

    Notification.objects.create(
        farmer=booking.farmer,

        title='Appointment Marked as No-Show',

        message=(
            'Your procurement appointment for '
            + booking.crop.crop_name
            + ' on '
            + booking.booking_date.strftime('%d %b %Y')
            + ' was marked as no-show because you did not arrive '
              'at the scheduled appointment time.'
        ),

        notification_type='BOOKING'
    )

    return Response(
        {
            'message':
            'Booking marked as no-show successfully',

            'booking_id':
            booking.booking_id,

            'status':
            booking.status
        },

        status=status.HTTP_200_OK
    )

@api_view(['POST'])
def create_procurement(request):

    booking_id = request.data.get('booking')
    quantity = request.data.get('quantity')
    quality = request.data.get('quality')
    price_per_unit = request.data.get('price_per_unit')

    if not booking_id:

        return Response(
            {
                'message': 'Booking is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not quantity:

        return Response(
            {
                'message': 'Quantity is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not price_per_unit:

        return Response(
            {
                'message': 'Price per unit is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        booking = Booking.objects.select_related(
            'farmer',
            'crop'
        ).get(
            booking_id=booking_id
        )

    except Booking.DoesNotExist:

        return Response(
            {
                'message': 'Booking not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # =========================
    # CHECK BOOKING STATUS
    # =========================

    if booking.status != 'IN_PROGRESS':

        return Response(
            {
                'message':
                'Procurement can only be created for a booking in progress.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =========================
    # CREATE PROCUREMENT
    # =========================

    total_amount = (
        float(quantity)
        * float(price_per_unit)
    )

    procurement = Procurement.objects.create(

        booking=booking,

        quantity=quantity,

        quality=quality,

        price_per_unit=price_per_unit,

        total_amount=total_amount

    )

    # =========================
    # MARK BOOKING COMPLETED
    # =========================

    booking.status = 'COMPLETED'

    booking.save(
        update_fields=['status']
    )

    # =========================
    # CREATE PAYMENT
    # =========================

    Payment.objects.create(

        procurement=procurement,

        amount=total_amount,

        payment_status='PENDING'

    )

    # =========================
    # CREATE FARMER NOTIFICATION
    # =========================

    Notification.objects.create(

        farmer=booking.farmer,

        title='Procurement Completed',

        message=(

            'Your procurement of '

            + str(quantity)

            + ' kg '

            + booking.crop.crop_name

            + ' has been completed successfully.'

        ),

        notification_type='PROCUREMENT'

    )

    # =========================
    # RESPONSE
    # =========================

    serializer = ProcurementSerializer(
        procurement
    )

    return Response(

        serializer.data,

        status=status.HTTP_201_CREATED

    )
@api_view(['GET'])
def get_procurement(request, booking_id):

    try:
        procurement = Procurement.objects.get(
            booking_id=booking_id
        )
    except Procurement.DoesNotExist:
        return Response(
            {'message': 'Procurement not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProcurementSerializer(procurement)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
def create_payment(request):

    procurement_id = request.data.get('procurement')
    payment_method = request.data.get('payment_method')
    transaction_id = request.data.get('transaction_id')
    payment_status = request.data.get(
        'payment_status',
        'PAID'
    )

    if not procurement_id:
        return Response(
            {'message': 'Procurement is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        procurement = Procurement.objects.get(
            procurement_id=procurement_id
        )
    except Procurement.DoesNotExist:
        return Response(
            {'message': 'Procurement not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Use procurement total amount
    amount = procurement.total_amount

    # Check if payment already exists
    try:
        payment = Payment.objects.get(
            procurement_id=procurement_id
        )

        payment.amount = amount
        payment.payment_status = payment_status
        payment.payment_method = payment_method
        payment.transaction_id = transaction_id

        payment.save(
            update_fields=[
                'amount',
                'payment_status',
                'payment_method',
                'transaction_id'
            ]
        )

    except Payment.DoesNotExist:

        payment = Payment.objects.create(
            procurement=procurement,
            amount=amount,
            payment_status=payment_status,
            payment_method=payment_method,
            transaction_id=transaction_id
        )

    serializer = PaymentSerializer(payment)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def get_payment(request, procurement_id):

    try:
        payment = Payment.objects.get(
            procurement_id=procurement_id
        )
    except Payment.DoesNotExist:
        return Response(
            {'message': 'Payment not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = PaymentSerializer(payment)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )

@api_view(['PUT'])
def update_payment(request, procurement_id):

    payment_status = request.data.get(
        'payment_status'
    )

    payment_method = request.data.get(
        'payment_method'
    )

    transaction_id = request.data.get(
        'transaction_id'
    )

    if not payment_status:
        return Response(
            {'message': 'Payment status is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    allowed_statuses = [
        'PENDING',
        'PAID'
    ]

    if payment_status not in allowed_statuses:
        return Response(
            {'message': 'Invalid payment status'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        payment = Payment.objects.get(
            procurement_id=procurement_id
        )

    except Payment.DoesNotExist:

        return Response(
            {'message': 'Payment not found'},
            status=status.HTTP_404_NOT_FOUND
        )


    payment.payment_status = payment_status

    payment.payment_method = payment_method

    payment.transaction_id = transaction_id


    payment.save(
        update_fields=[
            'payment_status',
            'payment_method',
            'transaction_id'
        ]
    )


    # ------------------------------------------------
    # CREATE FARMER NOTIFICATION WHEN PAYMENT IS PAID
    # ------------------------------------------------

    if payment_status == 'PAID':

        procurement = payment.procurement

        booking = procurement.booking

        farmer = booking.farmer

        Notification.objects.create(

            farmer_id=farmer.farmer_id,

            title='Payment Completed',

            message=(
                f'Your payment of '
                f'₹{procurement.total_amount} '
                f'for {booking.crop.crop_name} '
                f'procurement has been completed. '
                f'Transaction ID: {transaction_id}'
            ),

            notification_type='PAYMENT'

        )


    serializer = PaymentSerializer(
        payment
    )


    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def get_pending_payments(request, centre_id):

    completed_bookings = Booking.objects.select_related(
        'farmer',
        'crop'
    ).filter(
        centre_id=centre_id,
        status='COMPLETED'
    ).order_by(
        'booking_date',
        'slot_time',
        'booking_id'
    )

    pending_payments = []

    for booking in completed_bookings:

        try:
            procurement = Procurement.objects.get(
                booking_id=booking.booking_id
            )
        except Procurement.DoesNotExist:
            continue

        try:
            payment = Payment.objects.get(
                procurement_id=procurement.procurement_id
            )
        except Payment.DoesNotExist:
            continue

        if payment.payment_status == 'PENDING':

            pending_payments.append({

                # =========================
                # BOOKING DETAILS
                # =========================

                'booking_id':
                    booking.booking_id,

                'token_number':
                    booking.token_number,

                'booking_date':
                    booking.booking_date,

                'slot_time':
                    booking.slot_time,


                # =========================
                # FARMER DETAILS
                # =========================

                'farmer_id':
                    booking.farmer.farmer_id,

                'farmer_name':
                    booking.farmer.full_name,

                'farmer_phone':
                    booking.farmer.phone,

                'farmer_govt_id':
                    booking.farmer.farmer_govt_id,

                'aadhaar_no':
                    booking.farmer.aadhaar_no,


                # =========================
                # BANK DETAILS
                # =========================

                'bank_name':
                    booking.farmer.bank_name,

                'bank_account_no':
                    booking.farmer.bank_account_no,


                # =========================
                # CROP DETAILS
                # =========================

                'crop_name':
                    booking.crop.crop_name,

                'variety':
                    booking.crop.variety,


                # =========================
                # PROCUREMENT DETAILS
                # =========================

                'procurement_id':
                    procurement.procurement_id,

                'quantity':
                    procurement.quantity,

                'quality':
                    procurement.quality,

                'price_per_unit':
                    procurement.price_per_unit,

                'total_amount':
                    procurement.total_amount,

                'procurement_date':
                    procurement.procurement_date,


                # =========================
                # PAYMENT DETAILS
                # =========================

                'payment_id':
                    payment.payment_id,

                'payment_status':
                    payment.payment_status,

                'payment_method':
                    payment.payment_method,

                'transaction_id':
                    payment.transaction_id

            })

    return Response(
        pending_payments,
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def get_admin_dashboard(request):

    # ==========================================
    # BASIC COUNTS
    # ==========================================

    total_farmers = Farmer.objects.count()

    total_officers = Officer.objects.count()

    total_centres = Centre.objects.count()

    total_bookings = Booking.objects.count()

    pending_bookings = Booking.objects.filter(
        status='PENDING'
    ).count()


    # ==========================================
    # TODAY'S BOOKINGS
    # ==========================================

    from django.utils import timezone

    today = timezone.localdate()

    todays_bookings = Booking.objects.filter(
        booking_date=today
    ).count()


    # ==========================================
    # TOTAL PROCUREMENT
    # ==========================================

    procurements = Procurement.objects.all()

    total_procurement_quantity = 0

    for procurement in procurements:

        if procurement.quantity:
            total_procurement_quantity += float(
                procurement.quantity
            )


    # ==========================================
    # TODAY'S PROCUREMENT
    # ==========================================

    todays_procurements = Procurement.objects.filter(
        procurement_date__date=today
    )

    todays_procurement_quantity = 0

    for procurement in todays_procurements:

        if procurement.quantity:
            todays_procurement_quantity += float(
                procurement.quantity
            )


    # ==========================================
    # TOTAL MONEY PAID
    # ==========================================

    paid_payments = Payment.objects.filter(
        payment_status='PAID'
    )

    total_amount_paid = 0

    for payment in paid_payments:

        if payment.amount:
            total_amount_paid += float(
                payment.amount
            )


    # ==========================================
    # TODAY'S MONEY PAID
    # ==========================================

    todays_paid_payments = Payment.objects.filter(
        payment_status='PAID',
        payment_date__date=today
    )

    todays_amount_paid = 0

    for payment in todays_paid_payments:

        if payment.amount:
            todays_amount_paid += float(
                payment.amount
            )


    # ==========================================
    # PENDING PAYMENTS
    # ==========================================

    pending_payments = Payment.objects.filter(
        payment_status='PENDING'
    ).count()


    # ==========================================
    # CROP-WISE PROCUREMENT
    # ==========================================

    crop_summary = {}

    for procurement in procurements:

        try:

            crop_name = (
                procurement.booking.crop.crop_name
            )

        except Exception:

            crop_name = 'Unknown Crop'


        if crop_name not in crop_summary:

            crop_summary[crop_name] = {
                'crop_name': crop_name,
                'quantity': 0,
                'amount_paid': 0
            }


        if procurement.quantity:

            crop_summary[crop_name]['quantity'] += float(
                procurement.quantity
            )


    # ==========================================
    # CROP-WISE PAID AMOUNT
    # ==========================================

    for payment in paid_payments:

        try:

            crop_name = (
                payment.procurement
                .booking
                .crop
                .crop_name
            )

        except Exception:

            crop_name = 'Unknown Crop'


        if crop_name not in crop_summary:

            crop_summary[crop_name] = {
                'crop_name': crop_name,
                'quantity': 0,
                'amount_paid': 0
            }


        if payment.amount:

            crop_summary[crop_name]['amount_paid'] += float(
                payment.amount
            )


    # ==========================================
    # FINAL RESPONSE
    # ==========================================

    return Response(
        {
            'total_farmers':
                total_farmers,

            'total_officers':
                total_officers,

            'total_centres':
                total_centres,

            'total_bookings':
                total_bookings,

            'pending_bookings':
                pending_bookings,

            'todays_bookings':
                todays_bookings,

            'total_procurement_quantity':
                total_procurement_quantity,

            'todays_procurement_quantity':
                todays_procurement_quantity,

            'total_amount_paid':
                total_amount_paid,

            'todays_amount_paid':
                todays_amount_paid,

            'pending_payments':
                pending_payments,

            'crop_summary':
                list(crop_summary.values())
        },
        status=status.HTTP_200_OK
    )



@api_view(['GET'])
def get_all_farmers(request):

    farmers = Farmer.objects.all().order_by(
        '-farmer_id'
    )

    data = []

    for farmer in farmers:

        data.append({

            'farmer_id':
                farmer.farmer_id,

            'full_name':
                farmer.full_name,

            'email':
                farmer.email,

            'phone':
                farmer.phone,

            'address':
                farmer.address,

            'village':
                farmer.village,

            'district':
                farmer.district,

            'state':
                farmer.state,

            'aadhaar_no':
                farmer.aadhaar_no,

            'farmer_govt_id':
                farmer.farmer_govt_id,

            'bank_name':
                farmer.bank_name,

            'bank_account_no':
                farmer.bank_account_no,

            'created_at':
                farmer.created_at
        })

    return Response(
        data,
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def get_all_officers(request):

    officers = Officer.objects.select_related(
        'centre'
    ).all().order_by(
        '-officer_id'
    )

    data = []

    for officer in officers:

        data.append({

            'officer_id':
                officer.officer_id,

            'full_name':
                officer.full_name,

            'email':
                officer.email,

            'phone':
                officer.phone,

            'centre_id':
                officer.centre.centre_id,

            'centre_name':
                officer.centre.centre_name,

            'status':
                officer.status,

            'created_at':
                officer.created_at
        })

    return Response(
        data,
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
def create_officer(request):

    full_name = request.data.get('full_name')
    email = request.data.get('email')
    phone = request.data.get('phone')
    password = request.data.get('password')
    centre_id = request.data.get('centre_id')


    # ==========================================
    # REQUIRED FIELDS
    # ==========================================

    if not full_name:
        return Response(
            {
                'message': 'Full name is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not email:
        return Response(
            {
                'message': 'Email is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not phone:
        return Response(
            {
                'message': 'Mobile number is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not password:
        return Response(
            {
                'message': 'Password is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not centre_id:
        return Response(
            {
                'message': 'Procurement centre is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ==========================================
    # CHECK EMAIL
    # ==========================================

    if Officer.objects.filter(
        email=email
    ).exists():

        return Response(
            {
                'message':
                    'This email is already registered.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ==========================================
    # CHECK MOBILE
    # ==========================================

    if Officer.objects.filter(
        phone=phone
    ).exists():

        return Response(
            {
                'message':
                    'This mobile number is already registered.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ==========================================
    # CHECK CENTRE
    # ==========================================

    try:

        centre = Centre.objects.get(
            centre_id=centre_id
        )

    except Centre.DoesNotExist:

        return Response(
            {
                'message':
                    'Selected procurement centre was not found.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ==========================================
    # CREATE OFFICER
    # ==========================================

    officer = Officer.objects.create(

        full_name=full_name,

        email=email,

        phone=phone,

        password=make_password(password),

        centre=centre,

        status='ACTIVE'

    )


    # ==========================================
    # RESPONSE
    # ==========================================

    return Response(
        {
            'message':
                'Officer created successfully',

            'officer': {

                'officer_id':
                    officer.officer_id,

                'full_name':
                    officer.full_name,

                'email':
                    officer.email,

                'phone':
                    officer.phone,

                'centre_id':
                    officer.centre.centre_id,

                'centre_name':
                    officer.centre.centre_name,

                'status':
                    officer.status

            }
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['GET'])
def get_all_centres(request):

    centres = Centre.objects.all().order_by(
        '-centre_id'
    )

    data = []

    for centre in centres:

        officer_count = Officer.objects.filter(
            centre_id=centre.centre_id
        ).count()

        data.append({
            'centre_id': centre.centre_id,
            'centre_name': centre.centre_name,
            'address': centre.address,
            'district': centre.district,
            'state': centre.state,
            'latitude': centre.latitude,
            'longitude': centre.longitude,
            'capacity': centre.capacity,
            'officer_count': officer_count
        })

    return Response(
        data,
        status=status.HTTP_200_OK
    )




@api_view(['GET'])
def get_admin_centre_details(request, centre_id):

    try:
        centre = Centre.objects.get(
            centre_id=centre_id
        )

    except Centre.DoesNotExist:

        return Response(
            {
                'message': 'Procurement centre not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )


    officers = Officer.objects.filter(
        centre_id=centre.centre_id
    ).order_by(
        '-officer_id'
    )


    officer_data = []

    for officer in officers:

        officer_data.append({
            'officer_id': officer.officer_id,
            'full_name': officer.full_name,
            'email': officer.email,
            'phone': officer.phone,
            'status': officer.status
        })


    return Response(
        {
            'centre_id': centre.centre_id,
            'centre_name': centre.centre_name,
            'address': centre.address,
            'district': centre.district,
            'state': centre.state,
            'latitude': centre.latitude,
            'longitude': centre.longitude,
            'capacity': centre.capacity,
            'officer_count': len(officer_data),
            'officers': officer_data
        },
        status=status.HTTP_200_OK
    )



@api_view(['POST'])
def create_centre(request):

    centre_name = request.data.get('centre_name')
    address = request.data.get('address')
    district = request.data.get('district')
    state = request.data.get('state')
    latitude = request.data.get('latitude')
    longitude = request.data.get('longitude')
    capacity = request.data.get('capacity')


    if not centre_name:
        return Response(
            {
                'message': 'Centre name is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    centre = Centre.objects.create(
        centre_name=centre_name,
        address=address or None,
        district=district or None,
        state=state or None,
        latitude=latitude or None,
        longitude=longitude or None,
        capacity=capacity or None
    )


    return Response(
        {
            'message': 'Procurement centre created successfully',

            'centre': {
                'centre_id': centre.centre_id,
                'centre_name': centre.centre_name,
                'address': centre.address,
                'district': centre.district,
                'state': centre.state,
                'latitude': centre.latitude,
                'longitude': centre.longitude,
                'capacity': centre.capacity
            }
        },
        status=status.HTTP_201_CREATED
    )


@api_view(['GET', 'POST', 'PUT'])
def centre_schedule(request, centre_id):

    try:

        centre = Centre.objects.get(
            centre_id=centre_id
        )

    except Centre.DoesNotExist:

        return Response(
            {
                'message':
                    'Procurement centre not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )


    # ==========================================
    # GET SCHEDULES
    # ==========================================

    if request.method == 'GET':

        schedules = CentreSchedule.objects.filter(
            centre_id=centre_id
        ).order_by(
            'schedule_date'
        )

        data = []

        for schedule in schedules:

            data.append({

                'schedule_id':
                    schedule.schedule_id,

                'centre_id':
                    centre.centre_id,

                'centre_name':
                    centre.centre_name,

                'schedule_date':
                    schedule.schedule_date,

                'opening_time':
                    schedule.opening_time,

                'closing_time':
                    schedule.closing_time,

                'daily_capacity':
                    schedule.daily_capacity,

                'processing_time':
                    schedule.processing_time,

                'status':
                    schedule.status,

                'closure_reason':
                    schedule.closure_reason

            })

        return Response(
            data,
            status=status.HTTP_200_OK
        )


    # ==========================================
    # CREATE SCHEDULE
    # ==========================================

    if request.method == 'POST':

        schedule_date = request.data.get(
            'schedule_date'
        )

        schedule_status = request.data.get(
            'status',
            'OPEN'
        )

        opening_time = request.data.get(
            'opening_time'
        )

        closing_time = request.data.get(
            'closing_time'
        )

        daily_capacity = request.data.get(
            'daily_capacity'
        )

        processing_time = request.data.get(
            'processing_time'
        )

        closure_reason = request.data.get(
            'closure_reason'
        )


        # ------------------------------------------
        # DATE REQUIRED
        # ------------------------------------------

        if not schedule_date:

            return Response(
                {
                    'message':
                        'Schedule date is required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # ------------------------------------------
        # CHECK DUPLICATE DATE
        # ------------------------------------------

        existing_schedule = (
            CentreSchedule.objects.filter(
                centre_id=centre_id,
                schedule_date=schedule_date
            ).first()
        )

        if existing_schedule:

            return Response(
                {
                    'message':
                        'Schedule already exists for this date.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # ------------------------------------------
        # OPEN SCHEDULE
        # ------------------------------------------

        if schedule_status == 'OPEN':

            if not opening_time:

                return Response(
                    {
                        'message':
                            'Opening time is required.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not closing_time:

                return Response(
                    {
                        'message':
                            'Closing time is required.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not daily_capacity:

                return Response(
                    {
                        'message':
                            'Daily capacity is required.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not processing_time:

                processing_time = 15


        # ------------------------------------------
        # CLOSED SCHEDULE
        # ------------------------------------------

        else:

            opening_time = None

            closing_time = None

            daily_capacity = None

            processing_time = (
                processing_time or 15
            )


        schedule = CentreSchedule.objects.create(

            centre=centre,

            schedule_date=schedule_date,

            opening_time=opening_time,

            closing_time=closing_time,

            daily_capacity=daily_capacity,

            processing_time=processing_time,

            status=schedule_status,

            closure_reason=closure_reason

        )


        return Response(
            {
                'message':
                    'Centre schedule created successfully',

                'schedule': {

                    'schedule_id':
                        schedule.schedule_id,

                    'centre_id':
                        centre.centre_id,

                    'centre_name':
                        centre.centre_name,

                    'schedule_date':
                        schedule.schedule_date,

                    'opening_time':
                        schedule.opening_time,

                    'closing_time':
                        schedule.closing_time,

                    'daily_capacity':
                        schedule.daily_capacity,

                    'processing_time':
                        schedule.processing_time,

                    'status':
                        schedule.status,

                    'closure_reason':
                        schedule.closure_reason

                }
            },
            status=status.HTTP_201_CREATED
        )


    # ==========================================
    # UPDATE SCHEDULE
    # ==========================================

    if request.method == 'PUT':

        schedule_date = request.data.get(
            'schedule_date'
        )

        if not schedule_date:

            return Response(
                {
                    'message':
                        'Schedule date is required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        try:

            schedule = CentreSchedule.objects.get(
                centre_id=centre_id,
                schedule_date=schedule_date
            )

        except CentreSchedule.DoesNotExist:

            return Response(
                {
                    'message':
                        'Schedule not found for this date.'
                },
                status=status.HTTP_404_NOT_FOUND
            )


        schedule_status = request.data.get(
            'status'
        )

        opening_time = request.data.get(
            'opening_time'
        )

        closing_time = request.data.get(
            'closing_time'
        )

        daily_capacity = request.data.get(
            'daily_capacity'
        )

        processing_time = request.data.get(
            'processing_time'
        )

        closure_reason = request.data.get(
            'closure_reason'
        )


        # ------------------------------------------
        # UPDATE STATUS
        # ------------------------------------------

        if schedule_status:

            schedule.status = schedule_status


        # ------------------------------------------
        # OPEN
        # ------------------------------------------

        if schedule.status == 'OPEN':

            if opening_time is not None:

                schedule.opening_time = (
                    opening_time
                )

            if closing_time is not None:

                schedule.closing_time = (
                    closing_time
                )

            if daily_capacity is not None:

                schedule.daily_capacity = (
                    daily_capacity
                )

            if processing_time is not None:

                schedule.processing_time = (
                    processing_time
                )

            if not schedule.opening_time:

                return Response(
                    {
                        'message':
                            'Opening time is required for an open centre.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not schedule.closing_time:

                return Response(
                    {
                        'message':
                            'Closing time is required for an open centre.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if schedule.daily_capacity is None:

                return Response(
                    {
                        'message':
                            'Daily capacity is required for an open centre.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            schedule.closure_reason = None


        # ------------------------------------------
        # CLOSED
        # ------------------------------------------

        else:

            schedule.opening_time = None

            schedule.closing_time = None

            schedule.daily_capacity = None

            if closure_reason is not None:

                schedule.closure_reason = (
                    closure_reason
                )


        schedule.save(
            update_fields=[
                'opening_time',
                'closing_time',
                'daily_capacity',
                'processing_time',
                'status',
                'closure_reason'
            ]
        )


        return Response(
            {
                'message':
                    'Centre schedule updated successfully',

                'schedule': {

                    'schedule_id':
                        schedule.schedule_id,

                    'centre_id':
                        centre.centre_id,

                    'centre_name':
                        centre.centre_name,

                    'schedule_date':
                        schedule.schedule_date,

                    'opening_time':
                        schedule.opening_time,

                    'closing_time':
                        schedule.closing_time,

                    'daily_capacity':
                        schedule.daily_capacity,

                    'processing_time':
                        schedule.processing_time,

                    'status':
                        schedule.status,

                    'closure_reason':
                        schedule.closure_reason

                }
            },
            status=status.HTTP_200_OK
        )


@api_view(['GET'])
def get_admin_bookings(request):

    centre_id = request.GET.get('centre_id')

    booking_date = request.GET.get('booking_date')

    # Get all bookings
    bookings = Booking.objects.select_related(
        'farmer',
        'crop',
        'centre'
    ).all().order_by(

        Case(

            When(status='CONFIRMED', then=Value(1)),

            When(status='IN_PROGRESS', then=Value(2)),

            When(status='COMPLETED', then=Value(3)),

            When(status='NO_SHOW', then=Value(4)),

            When(status='REJECTED', then=Value(5)),

            default=Value(6),

            output_field=IntegerField()

        ),

        '-booking_id'

    )

    # Filter by centre if selected
    if centre_id:

        bookings = bookings.filter(
            centre_id=centre_id
        )

    # Filter by date if selected
    if booking_date:

        bookings = bookings.filter(
            booking_date=booking_date
        )

    data = []

    for booking in bookings:

        # =========================
        # GET CENTRE SCHEDULE
        # =========================

        try:

            schedule = CentreSchedule.objects.get(
                centre_id=booking.centre_id
            )

            opening_time = schedule.opening_time

            closing_time = schedule.closing_time

            daily_capacity = schedule.daily_capacity

            processing_time = schedule.processing_time

            centre_status = schedule.status

        except CentreSchedule.DoesNotExist:

            opening_time = None

            closing_time = None

            daily_capacity = None

            processing_time = None

            centre_status = 'NOT_CONFIGURED'

        # =========================
        # COUNT BOOKINGS
        # =========================

        centre_date_bookings = Booking.objects.filter(

            centre_id=booking.centre_id,

            booking_date=booking.booking_date

        ).exclude(

            status='REJECTED'

        )

        confirmed_count = centre_date_bookings.filter(

            status='CONFIRMED'

        ).count()

        in_progress_count = centre_date_bookings.filter(

            status='IN_PROGRESS'

        ).count()

        completed_count = centre_date_bookings.filter(

            status='COMPLETED'

        ).count()

        no_show_count = Booking.objects.filter(

            centre_id=booking.centre_id,

            booking_date=booking.booking_date,

            status='NO_SHOW'

        ).count()

        rejected_count = Booking.objects.filter(

            centre_id=booking.centre_id,

            booking_date=booking.booking_date,

            status='REJECTED'

        ).count()

        total_count = centre_date_bookings.count()

        # =========================
        # RESPONSE DATA
        # =========================

        data.append({

            'booking_id':
                booking.booking_id,

            'farmer_id':
                booking.farmer.farmer_id,

            'farmer_name':
                booking.farmer.full_name,

            'farmer_phone':
                booking.farmer.phone,

            'crop_id':
                booking.crop.crop_id,

            'crop_name':
                booking.crop.crop_name,

            'crop_variety':
                booking.crop.variety,

            'centre_id':
                booking.centre.centre_id,

            'centre_name':
                booking.centre.centre_name,

            'booking_date':
                booking.booking_date,

            'status':
                booking.status,

            'token_number':
                booking.token_number,

            'slot_time':
                booking.slot_time,

            'created_at':
                booking.created_at,

            # Centre schedule
            'opening_time':
                opening_time,

            'closing_time':
                closing_time,

            'daily_capacity':
                daily_capacity,

            'processing_time':
                processing_time,

            'centre_status':
                centre_status,

            # Centre-wise booking counts
            'total_centre_bookings':
                total_count,

            'confirmed_centre_bookings':
                confirmed_count,

            'in_progress_centre_bookings':
                in_progress_count,

            'completed_centre_bookings':
                completed_count,

            'no_show_centre_bookings':
                no_show_count,

            'rejected_centre_bookings':
                rejected_count

        })

    return Response(

        data,

        status=status.HTTP_200_OK

    )

@api_view(['PUT'])
def admin_update_booking_status(request, booking_id):

    from datetime import datetime, timedelta
    from django.utils import timezone

    try:
        booking = Booking.objects.select_related(
            'centre',
            'farmer',
            'crop'
        ).get(
            booking_id=booking_id
        )

    except Booking.DoesNotExist:
        return Response(
            {
                'message': 'Booking not found.'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    new_status = request.data.get('status')

    if new_status not in ['APPROVED', 'REJECTED']:
        return Response(
            {
                'message':
                    'Status must be APPROVED or REJECTED.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Prevent changing an already processed booking
    if booking.status != 'PENDING':
        return Response(
            {
                'message':
                    'This booking has already been processed.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # REJECT BOOKING
    # =================================================

    if new_status == 'REJECTED':

        booking.status = 'REJECTED'
        booking.token_number = None
        booking.slot_time = None

        booking.save(
            update_fields=[
                'status',
                'token_number',
                'slot_time'
            ]
        )

        # Create farmer notification
        Notification.objects.create(
            farmer=booking.farmer,
            title='Booking Rejected',
            message=(
                'Your booking for '
                + booking.crop.crop_name
                + ' on '
                + booking.booking_date.strftime('%d %b %Y')
                + ' has been rejected.'
            ),
            notification_type='BOOKING'
        )

        return Response(
            {
                'message':
                    'Booking rejected successfully.',

                'booking': {

                    'booking_id':
                        booking.booking_id,

                    'status':
                        booking.status,

                    'token_number':
                        booking.token_number,

                    'slot_time':
                        booking.slot_time
                }
            },
            status=status.HTTP_200_OK
        )

    # =================================================
    # APPROVE BOOKING
    # =================================================

    schedule = CentreSchedule.objects.filter(
        centre_id=booking.centre.centre_id,
        schedule_date=booking.booking_date
    ).first()

    if schedule is None:
        return Response(
            {
                'message':
                    'Centre schedule has not been created for this date.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if schedule.status != 'OPEN':
        return Response(
            {
                'message':
                    'This procurement centre is currently closed.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # COUNT ALREADY APPROVED BOOKINGS
    # =================================================

    approved_bookings = Booking.objects.filter(
        centre_id=booking.centre.centre_id,
        booking_date=booking.booking_date,
        status='APPROVED'
    ).order_by(
        'booking_id'
    )

    approved_count = approved_bookings.count()

    # =================================================
    # CHECK DAILY CAPACITY
    # =================================================

    if (
        schedule.daily_capacity is not None
        and approved_count >= schedule.daily_capacity
    ):
        return Response(
            {
                'message':
                    'Daily booking capacity is full.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # GENERATE TOKEN NUMBER
    # =================================================

    token_number = approved_count + 1

    booking.token_number = (
        'KS-'
        + str(
            booking.centre.centre_id
        )
        + '-'
        + booking.booking_date.strftime(
            '%Y%m%d'
        )
        + '-'
        + str(token_number)
    )

    # =================================================
    # CALCULATE SLOT TIME
    # =================================================

    today = timezone.localdate()
    now = timezone.localtime()

    processing_minutes = schedule.processing_time

    # -----------------------------------------------
    # FUTURE DATE
    # -----------------------------------------------

    if booking.booking_date > today:

        slot_datetime = datetime.combine(
            booking.booking_date,
            schedule.opening_time
        )

        # Add time for already approved bookings
        slot_datetime = (
            slot_datetime
            + timedelta(
                minutes=(
                    approved_count
                    * processing_minutes
                )
            )
        )

    # -----------------------------------------------
    # TODAY
    # -----------------------------------------------

    else:

        # Current time in local timezone
        current_datetime = now.replace(
            tzinfo=None,
            second=0,
            microsecond=0
        )

        opening_datetime = datetime.combine(
            booking.booking_date,
            schedule.opening_time
        )

        # Start from the later of:
        # centre opening time OR current time
        base_datetime = max(
            opening_datetime,
            current_datetime
        )

        # -------------------------------------------
        # Round current time UP to the next
        # processing interval.
        #
        # Example:
        # 11:08 + 10 min processing
        # -> 11:10
        #
        # 11:13 -> 11:20
        # -------------------------------------------

        if base_datetime > opening_datetime:

            minutes_from_midnight = (
                base_datetime.hour * 60
                + base_datetime.minute
            )

            remainder = (
                minutes_from_midnight
                % processing_minutes
            )

            if remainder != 0:

                minutes_to_add = (
                    processing_minutes
                    - remainder
                )

                base_datetime = (
                    base_datetime
                    + timedelta(
                        minutes=minutes_to_add
                    )
                )

        # -------------------------------------------
        # Check already approved bookings.
        # New slot must be after the latest
        # approved slot.
        # -------------------------------------------

        latest_booking = approved_bookings.filter(
            slot_time__isnull=False
        ).order_by(
            '-slot_time'
        ).first()

        if latest_booking is not None:

            latest_slot_datetime = datetime.combine(
                booking.booking_date,
                latest_booking.slot_time
            )

            next_after_latest = (
                latest_slot_datetime
                + timedelta(
                    minutes=processing_minutes
                )
            )

            if next_after_latest > base_datetime:
                base_datetime = next_after_latest

        slot_datetime = base_datetime

    # =================================================
    # CHECK CLOSING TIME
    # =================================================

    closing_datetime = datetime.combine(
        booking.booking_date,
        schedule.closing_time
    )

    slot_end_datetime = (
        slot_datetime
        + timedelta(
            minutes=processing_minutes
        )
    )

    if slot_end_datetime > closing_datetime:

        return Response(
            {
                'message':
                    'No available slot remains before the centre closing time.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =================================================
    # SAVE SLOT
    # =================================================

    booking.slot_time = slot_datetime.time()

    # =================================================
    # APPROVE BOOKING
    # =================================================

    booking.status = 'APPROVED'

    booking.save(
        update_fields=[
            'status',
            'token_number',
            'slot_time'
        ]
    )

    # =================================================
    # CREATE FARMER NOTIFICATION
    # =================================================

    Notification.objects.create(
        farmer=booking.farmer,
        title='Booking Approved',
        message=(
            'Your booking for '
            + booking.crop.crop_name
            + ' on '
            + booking.booking_date.strftime(
                '%d %b %Y'
            )
            + ' has been approved. '
            + 'Your token number is '
            + booking.token_number
            + '. '
            + 'Your slot time is '
            + booking.slot_time.strftime(
                '%I:%M %p'
            )
            + '.'
        ),
        notification_type='BOOKING'
    )

    # =================================================
    # QUEUE INFORMATION
    # =================================================

    people_ahead = Booking.objects.filter(
        centre_id=booking.centre.centre_id,
        booking_date=booking.booking_date,
        status='APPROVED',
        booking_id__lt=booking.booking_id
    ).count()

    estimated_datetime = (
        slot_datetime
        + timedelta(
            minutes=(
                people_ahead
                * processing_minutes
            )
        )
    )

    estimated_arrival = (
        estimated_datetime.strftime(
            '%I:%M %p'
        )
    )

    # =================================================
    # FINAL RESPONSE
    # =================================================

    return Response(
        {
            'message':
                'Booking approved successfully.',

            'booking': {

                'booking_id':
                    booking.booking_id,

                'status':
                    booking.status,

                'token_number':
                    booking.token_number,

                'slot_time':
                    booking.slot_time
            },

            'queue_info': {

                'people_ahead':
                    people_ahead,

                'estimated_arrival':
                    estimated_arrival,

                'processing_time':
                    processing_minutes
            }
        },
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def get_admin_booking_overview(request):

    centre_id = request.GET.get('centre_id')
    booking_date = request.GET.get('booking_date')

    centres = Centre.objects.all().order_by(
        'centre_id'
    )

    if centre_id:
        centres = centres.filter(
            centre_id=centre_id
        )

    overview = []

    for centre in centres:

        # Get centre schedule
        try:
            schedule = CentreSchedule.objects.filter(
                centre_id=centre.centre_id
            ).first()
        except Exception:
            schedule = None

        # Start with all bookings for this centre
        bookings = Booking.objects.select_related(
            'farmer',
            'crop',
            'centre'
        ).filter(
            centre_id=centre.centre_id
        )

        # Filter by date if selected
        if booking_date:
            bookings = bookings.filter(
                booking_date=booking_date
            )

        bookings = bookings.order_by(
            'booking_date',
            'booking_id'
        )

        # Booking counts
        total_bookings = bookings.count()

        pending_bookings = bookings.filter(
            status='PENDING'
        ).count()

        approved_bookings = bookings.filter(
            status='APPROVED'
        ).count()

        rejected_bookings = bookings.filter(
            status='REJECTED'
        ).count()

        # Booking data
        booking_data = []

        for booking in bookings:
            booking_data.append({
                'booking_id': booking.booking_id,
                'farmer_id': booking.farmer.farmer_id,
                'farmer_name': booking.farmer.full_name,
                'farmer_phone': booking.farmer.phone,
                'crop_id': booking.crop.crop_id,
                'crop_name': booking.crop.crop_name,
                'crop_variety': booking.crop.variety,
                'centre_id': booking.centre.centre_id,
                'centre_name': booking.centre.centre_name,
                'booking_date': booking.booking_date,
                'status': booking.status,
                'token_number': booking.token_number,
                'slot_time': booking.slot_time,
                'created_at': booking.created_at
            })

        # Centre information
        overview.append({
            'centre_id': centre.centre_id,
            'centre_name': centre.centre_name,
            'address': centre.address,
            'district': centre.district,
            'state': centre.state,

            'opening_time':
                schedule.opening_time
                if schedule else None,

            'closing_time':
                schedule.closing_time
                if schedule else None,

            'daily_capacity':
                schedule.daily_capacity
                if schedule else None,

            'processing_time':
                schedule.processing_time
                if schedule else None,

            'centre_status':
                schedule.status
                if schedule else 'NOT_CONFIGURED',

            'total_bookings': total_bookings,
            'pending_bookings': pending_bookings,
            'approved_bookings': approved_bookings,
            'rejected_bookings': rejected_bookings,
            'bookings': booking_data
        })

    return Response(
        overview,
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def get_admin_procurements(request):

    procurements = Procurement.objects.select_related(
        'booking',
        'booking__farmer',
        'booking__crop',
        'booking__centre'
    ).all().order_by(
        '-procurement_id'
    )

    data = []

    for procurement in procurements:

        data.append({

            'procurement_id':
                procurement.procurement_id,

            'booking_id':
                procurement.booking.booking_id,

            'farmer_id':
                procurement.booking.farmer.farmer_id,

            'farmer_name':
                procurement.booking.farmer.full_name,

            'farmer_phone':
                procurement.booking.farmer.phone,

            'crop_id':
                procurement.booking.crop.crop_id,

            'crop_name':
                procurement.booking.crop.crop_name,

            'crop_variety':
                procurement.booking.crop.variety,

            'centre_id':
                procurement.booking.centre.centre_id,

            'centre_name':
                procurement.booking.centre.centre_name,

            'quantity':
                procurement.quantity,

            'quality':
                procurement.quality,

            'price_per_unit':
                procurement.price_per_unit,

            'total_amount':
                procurement.total_amount,

            'procurement_date':
                procurement.procurement_date
        })

    return Response(
        data,
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def get_farmer_notifications(request, farmer_id):

    notifications = Notification.objects.filter(
        farmer_id=farmer_id
    ).order_by(
        '-created_at'
    )

    serializer = NotificationSerializer(
        notifications,
        many=True
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


@api_view(['PUT'])
def mark_notification_read(request, notification_id):

    try:
        notification = Notification.objects.get(
            notification_id=notification_id
        )

    except Notification.DoesNotExist:

        return Response(
            {
                'message': 'Notification not found.'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    notification.is_read = True

    notification.save(
        update_fields=['is_read']
    )

    return Response(
        {
            'message': 'Notification marked as read.',
            'notification': {
                'notification_id':
                    notification.notification_id,
                'is_read':
                    notification.is_read
            }
        },
        status=status.HTTP_200_OK
    )

@api_view(['GET', 'POST'])
def crop_prices(request):

    # GET — show all prices
    if request.method == 'GET':

        prices = CropPrice.objects.select_related(
            'crop',
            'centre'
        ).order_by(
            'centre_id',
            'crop_id'
        )

        serializer = CropPriceSerializer(
            prices,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # POST — add a new price
    if request.method == 'POST':

        serializer = CropPriceSerializer(
            data=request.data
        )

        if serializer.is_valid():
            price = serializer.save()

            return Response(
                {
                    'message': 'Crop price added successfully.',
                    'price': CropPriceSerializer(price).data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['PUT'])
def update_crop_price(request, price_id):

    try:
        price = CropPrice.objects.get(
            price_id=price_id
        )
    except CropPrice.DoesNotExist:
        return Response(
            {'message': 'Crop price not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = CropPriceSerializer(
        price,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        price = serializer.save()

        return Response(
            {
                'message': 'Crop price updated successfully.',
                'price': CropPriceSerializer(price).data
            },
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
def smart_centre_recommendation(request):

    crop_id = request.GET.get('crop_id')
    booking_date = request.GET.get('booking_date')
    latitude = request.GET.get('latitude')
    longitude = request.GET.get('longitude')

    if not crop_id:
        return Response(
            {'message': 'crop_id is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not booking_date:
        return Response(
            {'message': 'booking_date is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not latitude or not longitude:
        return Response(
            {
                'message': 'latitude and longitude are required.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        crop_id = int(crop_id)
        latitude = float(latitude)
        longitude = float(longitude)

    except ValueError:
        return Response(
            {'message': 'Invalid location or crop_id.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    prices = CropPrice.objects.select_related(
        'crop',
        'centre'
    ).filter(
        crop_id=crop_id
    )

    recommendations = []

    for price in prices:

        centre = price.centre

        if centre.latitude is None or centre.longitude is None:
            continue

        schedule = CentreSchedule.objects.filter(
            centre_id=centre.centre_id,
            status='OPEN'
        ).order_by('-schedule_id').first()

        if not schedule:
            continue

        booked_count = Booking.objects.filter(
            centre_id=centre.centre_id,
            booking_date=booking_date,
            status__in=[
                'PENDING',
                'APPROVED',
                'IN_PROGRESS'
            ]
        ).count()

        available_slots = (
            schedule.daily_capacity - booked_count
        )

        if available_slots < 0:
            available_slots = 0

        # Haversine distance calculation

        from math import radians, sin, cos, sqrt, atan2

        earth_radius = 6371.0

        farmer_lat = radians(latitude)
        farmer_lon = radians(longitude)

        centre_lat = radians(float(centre.latitude))
        centre_lon = radians(float(centre.longitude))

        delta_lat = centre_lat - farmer_lat
        delta_lon = centre_lon - farmer_lon

        a = (
            sin(delta_lat / 2) ** 2
            +
            cos(farmer_lat)
            *
            cos(centre_lat)
            *
            sin(delta_lon / 2) ** 2
        )

        c = 2 * atan2(
            sqrt(a),
            sqrt(1 - a)
        )

        distance_km = earth_radius * c

        recommendations.append(
            {
                'centre_id': centre.centre_id,
                'centre_name': centre.centre_name,
                'centre_address': centre.address,
                'price': float(price.price_per_kg),
                'distance_km': round(distance_km, 2),
                'daily_capacity': schedule.daily_capacity,
                'booked_count': booked_count,
                'available_slots': available_slots,
                'status': schedule.status
            }
        )

    if not recommendations:
        return Response(
            {'message': 'No suitable centres found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Sort by distance first

    recommendations.sort(
        key=lambda x: x['distance_km']
    )

    recommended = recommendations[0]

    return Response(
        {
            'recommended_centre': recommended,
            'centres': recommendations
        },
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def get_centre_procurement_history(request, centre_id):

    procurements = Procurement.objects.select_related(
        'booking',
        'booking__farmer',
        'booking__crop'
    ).filter(
        booking__centre_id=centre_id,
        booking__status='COMPLETED'
    ).order_by(
        '-procurement_date'
    )

    data = []

    for procurement in procurements:

        booking = procurement.booking
        farmer = booking.farmer
        crop = booking.crop

        data.append({

            'procurement_id': procurement.procurement_id,

            'booking_id': booking.booking_id,

            'farmer_name': farmer.full_name,

            'farmer_govt_id': farmer.farmer_govt_id,

            'crop_name': crop.crop_name,

            'variety': crop.variety,

            'booking_date': booking.booking_date,

            'slot_time': booking.slot_time,

            'token_number': booking.token_number,

            'quantity': procurement.quantity,

            'quality': procurement.quality,

            'price_per_kg': procurement.price_per_unit,

            'total_amount': procurement.total_amount,

            'procurement_date': procurement.procurement_date
        })

    return Response(
        data,
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def get_centre_upcoming_queue(request, centre_id):

    from django.utils import timezone

    today = timezone.localdate()

    bookings = Booking.objects.filter(
        centre_id=centre_id,
        booking_date__gt=today,
        status='APPROVED'
    ).order_by(
        'booking_date',
        'slot_time',
        'booking_id'
    )

    serializer = BookingSerializer(
        bookings,
        many=True
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def get_farmer_payment_history(request, farmer_id):

    payments = Payment.objects.select_related(
        'procurement',
        'procurement__booking',
        'procurement__booking__farmer',
        'procurement__booking__crop'
    ).filter(
        procurement__booking__farmer_id=farmer_id
    ).order_by(
        '-payment_date'
    )

    payment_history = []

    for payment in payments:

        procurement = payment.procurement
        booking = procurement.booking
        farmer = booking.farmer
        crop = booking.crop

        payment_history.append({

            # =========================
            # PAYMENT DETAILS
            # =========================

            'payment_id':
                payment.payment_id,

            'amount':
                payment.amount,

            'payment_status':
                payment.payment_status,

            'payment_method':
                payment.payment_method,

            'transaction_id':
                payment.transaction_id,

            'payment_date':
                payment.payment_date,


            # =========================
            # PROCUREMENT DETAILS
            # =========================

            'procurement_id':
                procurement.procurement_id,

            'quantity':
                procurement.quantity,

            'quality':
                procurement.quality,

            'price_per_kg':
                procurement.price_per_unit,

            'total_amount':
                procurement.total_amount,


            # =========================
            # BOOKING DETAILS
            # =========================

            'booking_id':
                booking.booking_id,

            'token_number':
                booking.token_number,

            'booking_date':
                booking.booking_date,

            'slot_time':
                booking.slot_time,


            # =========================
            # CROP DETAILS
            # =========================

            'crop_name':
                crop.crop_name,

            'variety':
                crop.variety,

            'centre_name':
                booking.centre.centre_name

        })

    return Response(
        payment_history,
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
def admin_update_officer_status(request, officer_id):

    new_status = request.data.get('status')

    if new_status not in ['ACTIVE', 'INACTIVE']:
        return Response(
            {
                'message': 'Invalid officer status.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        officer = Officer.objects.get(
            officer_id=officer_id
        )

    except Officer.DoesNotExist:

        return Response(
            {
                'message': 'Officer not found.'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    officer.status = new_status

    officer.save(
        update_fields=['status']
    )

    return Response(
        {
            'message':
                'Officer status updated successfully.',
            'officer_id':
                officer.officer_id,
            'status':
                officer.status
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
def change_officer_password(request):

    officer_id = request.data.get('officer_id')
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not officer_id or not current_password or not new_password:
        return Response(
            {
                'message':
                    'Officer ID, current password and new password are required.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(new_password) < 6:
        return Response(
            {
                'message':
                    'New password must be at least 6 characters long.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        officer = Officer.objects.get(
            officer_id=officer_id
        )

    except Officer.DoesNotExist:

        return Response(
            {
                'message':
                    'Officer not found.'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Check current password

    if not check_password(
        current_password,
        officer.password
    ):
        return Response(
            {
                'message':
                    'Current password is incorrect.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Save new password

    officer.password = make_password(
        new_password
    )

    officer.save(
        update_fields=['password']
    )

    return Response(
        {
            'message':
                'Password changed successfully.'
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def get_officer_status(request, officer_id):

    try:

        officer = Officer.objects.get(
            officer_id=officer_id
        )

    except Officer.DoesNotExist:

        return Response(
            {
                'message': 'Officer not found.'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(
        {
            'officer_id': officer.officer_id,
            'status': officer.status
        },
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def officer_no_show_history(request, centre_id):

    bookings = Booking.objects.filter(
        centre_id=centre_id,
        status='NO_SHOW'
    ).select_related(
        'farmer',
        'crop',
        'centre'
    ).order_by(
        '-booking_date',
        '-booking_id'
    )

    data = []

    for booking in bookings:

        data.append({
            'booking_id': booking.booking_id,
            'farmer_name': booking.farmer.full_name,
            'farmer_govt_id': booking.farmer.farmer_govt_id,
            'crop_name': booking.crop.crop_name,
            'variety': booking.crop.variety,
            'booking_date': booking.booking_date,
            'slot_time': booking.slot_time,
            'token_number': booking.token_number,
            'status': booking.status
        })

    return Response(
        data,
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
def officer_verify_token(request):

    token_number = request.data.get('token_number')
    centre_id = request.data.get('centre_id')

    # CHECK TOKEN
    if not token_number:
        return Response(
            {
                'message': 'Token number is required.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # CHECK CENTRE
    if not centre_id:
        return Response(
            {
                'message': 'Centre is required.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # FIND BOOKING
    try:
        booking = Booking.objects.select_related(
            'farmer',
            'crop',
            'centre'
        ).get(
            token_number=token_number
        )

    except Booking.DoesNotExist:
        return Response(
            {
                'message': 'Invalid token number.'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # CHECK CENTRE
    if str(booking.centre_id) != str(centre_id):
        return Response(
            {
                'message':
                    'This token does not belong to this procurement centre.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # CHECK BOOKING STATUS
    if booking.status != 'CONFIRMED':
        return Response(
            {
                'message':
                    'This booking cannot be verified.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # MARK BOOKING IN PROGRESS
    booking.status = 'IN_PROGRESS'

    booking.save(
        update_fields=['status']
    )

    # RESPONSE
    return Response(
        {
            'message':
                'Token verified successfully. Procurement can now begin.',

            'booking': {

                'booking_id':
                    booking.booking_id,

                'farmer_id':
                    booking.farmer.farmer_id,

                'farmer_name':
                    booking.farmer.full_name,

                'farmer_phone':
                    booking.farmer.phone,

                'crop_id':
                    booking.crop.crop_id,

                'crop_name':
                    booking.crop.crop_name,

                'crop_variety':
                    booking.crop.variety,

                'centre_id':
                    booking.centre.centre_id,

                'centre_name':
                    booking.centre.centre_name,

                'booking_date':
                    booking.booking_date,

                'slot_time':
                    booking.slot_time,

                'token_number':
                    booking.token_number,

                'status':
                    booking.status
            }
        },
        status=status.HTTP_200_OK
    )