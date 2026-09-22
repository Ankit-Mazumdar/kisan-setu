from rest_framework import serializers

from .models import Farmer, Crop, Centre, Booking ,  Procurement, Payment , Notification, CropPrice


class FarmerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Farmer

        fields = [
            'farmer_id',
            'full_name',
            'email',
            'phone',
            'password',

            'address',
            'village',
            'district',
            'state',

            'aadhaar_no',
            'farmer_govt_id',

            'bank_name',
            'bank_account_no',

            'created_at'
        ]

        extra_kwargs = {
            'email': {
                'required': False,
                'allow_blank': True,
                'allow_null': True
            },

            'address': {
                'required': False,
                'allow_blank': True,
                'allow_null': True
            },

            'village': {
                'required': False,
                'allow_blank': True,
                'allow_null': True
            },

            'district': {
                'required': False,
                'allow_blank': True,
                'allow_null': True
            },

            'state': {
                'required': False,
                'allow_blank': True,
                'allow_null': True
            },

            'aadhaar_no': {
                'required': False,
                'allow_blank': True,
                'allow_null': True
            },

            'farmer_govt_id': {
                'required': False,
                'allow_blank': True,
                'allow_null': True
            },

            'bank_name': {
                'required': False,
                'allow_blank': True,
                'allow_null': True
            },

            'bank_account_no': {
                'required': False,
                'allow_blank': True,
                'allow_null': True
            }
        }


class CropSerializer(serializers.ModelSerializer):

    class Meta:
        model = Crop
        fields = [
            'crop_id',
            'crop_name',
            'variety'
        ]


class CentreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Centre
        fields = [
            'centre_id',
            'centre_name',
            'address',
            'district',
            'state',
            'latitude',
            'longitude',
            'capacity'
        ]




class BookingSerializer(serializers.ModelSerializer):

    farmer_name = serializers.CharField(
        source='farmer.full_name',
        read_only=True
    )

    farmer_govt_id = serializers.CharField(
        source='farmer.farmer_govt_id',
        read_only=True
    )

    crop_name = serializers.CharField(
        source='crop.crop_name',
        read_only=True
    )

    variety = serializers.CharField(
        source='crop.variety',
        read_only=True
    )

    

    centre_name = serializers.CharField(
        source='centre.centre_name',
        read_only=True
    )

    centre_address = serializers.CharField(
        source='centre.address',
        read_only=True
    )

    class Meta:

        model = Booking

        fields = [
            'booking_id',

            'farmer',
            'farmer_name',
            'farmer_govt_id',

            'crop',
            'crop_name',
            'variety',

            'centre',
            'centre_name',
            'centre_address',

            'booking_date',
            'slot_time',
            'status',
            'token_number',
            'created_at'
        ]

        extra_kwargs = {

            'slot_time': {
                'required': False,
                'allow_null': True
            },

            'status': {
                'required': False
            },

            'token_number': {
                'required': False,
                'allow_null': True
            }

        }
class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification

        fields = [
            'notification_id',
            'farmer',
            'title',
            'message',
            'notification_type',
            'is_read',
            'created_at'
        ]

        extra_kwargs = {
            'farmer': {
                'required': True
            },
            'notification_type': {
                'required': False,
                'allow_blank': True,
                'allow_null': True
            },
            'is_read': {
                'required': False
            }
        }

class ProcurementSerializer(serializers.ModelSerializer):

    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Procurement
        fields = [
            'procurement_id',
            'booking',
            'quantity',
            'quality',
            'price_per_unit',
            'total_amount',
            'procurement_date',
            'payment_status'
        ]

    def get_payment_status(self, obj):

        try:
            payment = Payment.objects.get(
                procurement_id=obj.procurement_id
            )

            return payment.payment_status

        except Payment.DoesNotExist:

            return 'PENDING'
class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = [
            'payment_id',
            'procurement',
            'amount',
            'payment_status',
            'payment_method',
            'transaction_id',
            'payment_date'
        ]

class CropPriceSerializer(serializers.ModelSerializer):

    crop_name = serializers.CharField(
        source='crop.crop_name',
        read_only=True
    )

    variety = serializers.CharField(
        source='crop.variety',
        read_only=True
    )

    centre_name = serializers.CharField(
        source='centre.centre_name',
        read_only=True
    )

    class Meta:
        model = CropPrice
        fields = [
            'price_id',
            'crop',
            'crop_name',
            'variety',
            'centre',
            'centre_name',
            'price_per_kg',
            'effective_date'
        ]