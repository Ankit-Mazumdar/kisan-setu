from django.db import models


# class Farmer(models.Model):

#     farmer_id = models.AutoField(primary_key=True)
#     full_name = models.CharField(max_length=100)
#     email = models.EmailField(max_length=150, unique=True)
#     phone = models.CharField(max_length=10, unique=True)
#     password = models.CharField(max_length=255)
#     address = models.CharField(max_length=255, blank=True, null=True)
#     village = models.CharField(max_length=100, blank=True, null=True)
#     district = models.CharField(max_length=100, blank=True, null=True)
#     state = models.CharField(max_length=100, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = 'farmer'
#         managed = False

#     def __str__(self):
#         return self.full_name

class Farmer(models.Model):

    farmer_id = models.AutoField(primary_key=True)

    full_name = models.CharField(max_length=100)

    email = models.CharField(
        max_length=150,
        unique=True,
        null=True,
        blank=True
    )

    phone = models.CharField(
        max_length=10,
        unique=True
    )

    password = models.CharField(max_length=255)

    address = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    village = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    district = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    state = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    aadhaar_no = models.CharField(
        max_length=12,
        null=True,
        blank=True
    )

    farmer_govt_id = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    bank_name = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    bank_account_no = models.CharField(
        max_length=30,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        managed = False
        db_table = 'farmer'

    def __str__(self):
        return self.full_name


class Notification(models.Model):

    notification_id = models.AutoField(
        primary_key=True
    )

    farmer = models.ForeignKey(
        Farmer,
        on_delete=models.DO_NOTHING,
        db_column='farmer_id'
    )

    title = models.CharField(
        max_length=150
    )

    message = models.CharField(
        max_length=500
    )

    notification_type = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        managed = False
        db_table = 'notification'

    def __str__(self):
        return self.title

    

class Crop(models.Model):

    crop_id = models.AutoField(primary_key=True)
    crop_name = models.CharField(max_length=100)
    variety = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'crop'
        managed = False

    def __str__(self):
        return self.crop_name


class Centre(models.Model):

    centre_id = models.AutoField(primary_key=True)
    centre_name = models.CharField(max_length=150)
    address = models.CharField(max_length=255, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        blank=True,
        null=True
    )
    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        blank=True,
        null=True
    )
    capacity = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'centre'
        managed = False

    def __str__(self):
        return self.centre_name


class CentreSchedule(models.Model):

    schedule_id = models.AutoField(
        primary_key=True
    )

    centre = models.ForeignKey(
        Centre,
        on_delete=models.DO_NOTHING,
        db_column='centre_id'
    )

    schedule_date = models.DateField()

    opening_time = models.TimeField(
        null=True,
        blank=True
    )

    closing_time = models.TimeField(
        null=True,
        blank=True
    )

    daily_capacity = models.IntegerField(
        null=True,
        blank=True
    )

    processing_time = models.IntegerField(
        default=15
    )

    status = models.CharField(
        max_length=20,
        default='OPEN'
    )

    closure_reason = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        db_table = 'centre_schedule'

        managed = False

    def __str__(self):

        return (
            self.centre.centre_name
            + ' Schedule'
        )
class Booking(models.Model):

    booking_id = models.AutoField(primary_key=True)

    farmer = models.ForeignKey(
        Farmer,
        on_delete=models.DO_NOTHING,
        db_column='farmer_id'
    )

    crop = models.ForeignKey(
        Crop,
        on_delete=models.DO_NOTHING,
        db_column='crop_id'
    )

    centre = models.ForeignKey(
        Centre,
        on_delete=models.DO_NOTHING,
        db_column='centre_id'
    )

    booking_date = models.DateField()
    slot_time = models.TimeField()
    status = models.CharField(
        max_length=30,
        default='BOOKED'
    )
    token_number = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = 'booking'
        managed = False

    def __str__(self):
        return str(self.booking_id)


class Procurement(models.Model):
    procurement_id = models.AutoField(primary_key=True)
    booking = models.OneToOneField(
        Booking,
        on_delete=models.DO_NOTHING,
        db_column='booking_id'
    )
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    quality = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )
    price_per_unit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )
    procurement_date = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = 'procurement'
        managed = False

    def __str__(self):
        return str(self.procurement_id)

class Payment(models.Model):

    payment_id = models.AutoField(primary_key=True)

    procurement = models.OneToOneField(
        Procurement,
        on_delete=models.DO_NOTHING,
        db_column='procurement_id'
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    payment_status = models.CharField(
        max_length=30,
        default='PENDING'
    )

    payment_method = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    transaction_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    payment_date = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = 'payment'
        managed = False

    def __str__(self):
        return str(self.payment_id)

class Officer(models.Model):
    officer_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=100)
    email = models.CharField(max_length=150, unique=True)
    phone = models.CharField(max_length=10, unique=True)
    password = models.CharField(max_length=255)
    centre = models.ForeignKey(
        Centre,
        on_delete=models.DO_NOTHING,
        db_column='centre_id'
    )
    status = models.CharField(max_length=20, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'officer'

    def __str__(self):
        return self.full_name


class Authority(models.Model):

    admin_id = models.AutoField(
        primary_key=True
    )

    full_name = models.CharField(
        max_length=100
    )

    email = models.CharField(
        max_length=150,
        unique=True
    )

    password = models.CharField(
        max_length=255
    )

    status = models.CharField(
        max_length=20,
        default='ACTIVE'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        managed = False
        db_table = 'authority'

    def __str__(self):
        return self.full_name

class CropPrice(models.Model):
    price_id = models.AutoField(primary_key=True)

    crop = models.ForeignKey(
        Crop,
        on_delete=models.DO_NOTHING,
        db_column='crop_id'
    )

    centre = models.ForeignKey(
        Centre,
        on_delete=models.DO_NOTHING,
        db_column='centre_id'
    )

    price_per_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    effective_date = models.DateField(
        auto_now_add=False,
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'crop_price'
        managed = False

    def __str__(self):
        return (
            self.crop.crop_name
            + ' - '
            + self.centre.centre_name
        )