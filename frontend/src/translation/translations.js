// English ↔ Bengali translation dictionary.
// Keep application text here; component code should only use translation keys.

const translations = {
  // =====================================================
  // ENGLISH
  // =====================================================
  en: {
    // =========================
    // COMMON
    // =========================
    dashboard: "Dashboard",
    bookSlot: "Book a Slot",
    payment: "Payment",
    logout: "Logout",
    profile: "Profile",
    notifications: "Notifications",
    unreadNotifications: "{count} unread",
    noNotifications: "No notifications yet.",
    farmer: "Farmer",
    toggleNavigation: "Toggle navigation menu",

    welcome: "Welcome",
    welcomeBack: "Welcome Back",
    bookingConfirmed: "Your booking is confirmed",
    myBooking: "My Booking",
    login: "Login",
    email: "Email",
    password: "Password",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    selectLanguage: "Select Language",

    // =========================
    // PROFILE
    // =========================
    account: "ACCOUNT",
    myProfile: "My Profile",
    profileDescription:
      "View and manage your KisanSetu farmer account information.",
    editProfile: "Edit Profile",
    kisanSetuFarmer: "KisanSetu Farmer",

    personalInformation: "Personal Information",
    fullName: "Full Name",
    mobileNumber: "Mobile Number",
    address: "Address",
    village: "Village",

    identification: "Identification",
    aadhaarNumber: "Aadhaar Number",
    farmerGovernmentId: "Farmer Government ID",

    bankDetails: "Bank Details",
    bankName: "Bank Name",
    bankAccountNumber: "Bank Account Number",

    accountInformation: "Account Information",
    farmerId: "Farmer ID",

    saveChanges: "Save Changes",
    optional: "Optional",

    loadingProfile: "Loading Profile...",
    loadingProfileDescription:
      "Please wait while we load your latest farmer information.",

    unableToLoadProfile: "Unable to Load Profile",
    unableToUpdateProfile:
      "Unable to update farmer profile.",

    pleaseLoginToViewProfile:
      "Please login again to view your profile.",

    accountSecure: "Your account is secure",

    accountSecureDescription:
      "Your farmer information is used to manage bookings, procurement, queue tracking and payments.",

    // =========================
    // FARMER DASHBOARD
    // =========================
    farmerDashboard: "FARMER DASHBOARD",
    goodMorning: "Good morning",
    procurementActivity:
      "Here's what's happening with your procurement.",
    smartProcurement: "Smart procurement",

    nextAppointment: "NEXT APPOINTMENT",
    loadingBooking: "Loading your booking...",
    loadingLatestBooking:
      "Please wait while we get your latest booking.",
    cropProcurement: "Crop Procurement",
    procurementCentre: "Procurement Centre",
    viewBooking: "View Booking",
    noAppointment: "No appointment booked",
    bookProcurementSlot:
      "Book your procurement slot to get started.",

    getStarted: "GET STARTED",
    quickActions: "Quick Actions",
    findCentre: "Find Centre",
    exploreNearbyCentres:
      "Explore nearby procurement centres.",
    explore: "Explore",
    myToken: "My Token",
    checkQueueToken:
      "Check your queue token when available.",
    view: "View",
    chooseCentreBookSlot:
      "Choose a procurement centre and book your slot.",
    getStartedButton: "Get started",

    liveStatus: "LIVE STATUS",
    recentQueue: "Recent Queue",
    loading: "LOADING",
    loadingQueue: "Loading queue...",
    loadingQueueStatus:
      "Please wait while we get your latest queue status.",
    noQueue: "NO QUEUE",
    noActiveQueue: "No active queue",
    queueWillAppear:
      "Your live queue information will appear here when you have an active booking.",
    viewQueue: "View Queue",
    viewQueueHistory: "View Queue History",
    queuePosition: "Queue Position",
    peopleAhead: "People Ahead",
    estimatedWaiting: "Estimated Waiting",
    estimatedTurn: "Estimated Turn",
    youAreNext: "You are next",
    minutes: "minutes",

    pastBookings: "PAST BOOKINGS",
    bookingHistory: "Booking History",
    record: "record",
    records: "records",
    loadingBookingHistory: "Loading booking history...",
    loadingPreviousBookings:
      "Please wait while we get your previous bookings.",
    viewAllBookings: "View All Bookings",
    noHistory: "NO HISTORY",
    noPastBookings: "No past bookings",
    pastBookingsWillAppear:
      "Your completed or rejected bookings will appear here.",

    yourActivity: "YOUR ACTIVITY",
    procurementOverview: "Procurement Overview",
    procurement: "Procurement",
    availableBookings: "booking available",
    availableBookingsPlural: "bookings available",
    noProcurementRecord: "No procurement record yet",
    viewStatus: "View Status",

    checkPaymentStatus: "Check your payment status",
    noPaymentRecord: "No payment record yet",
    viewPayment: "View Payment",

    help: "HELP",
    howKisanSetuWorks: "How KisanSetu works",
    howKisanSetuWorksDescription:
      "Book a procurement slot, visit the centre at your scheduled time, and track your procurement status from your dashboard.",

    // =========================
    // BOOKING
    // =========================
    bookProcurementSlot: "Book a Procurement Slot",
    selectCropCentreDate:
      "Select your crop, procurement centre and preferred procurement date.",

    loadingBookingOptions: "Loading booking options...",
    unableToLoadBookingData:
      "Unable to load booking data.",

    bookingDetails: "Booking Details",
    chooseProcurementPreferences:
      "Choose your procurement preferences",

    selectCrop: "Select Crop",
    selectACrop: "Select a crop",
    procurementDate: "Procurement Date",

    location: "LOCATION",
    gettingLocation:
      "Getting your location for smart centre recommendation...",
    locationNotSupported:
      "Location is not supported by this browser.",
    locationPermissionRequired:
      "Location permission is required for smart centre recommendation.",

    smartRecommendation: "SMART RECOMMENDATION",
    findingBestCentre:
      "Finding the best procurement centre...",
    currentPrice: "Current Price",
    distance: "Distance",
    availableSlots: "Available Slots",
    currentBookings: "Current Bookings",
    chooseRecommendedCentre:
      "Choose Recommended Centre",
    recommendedCentreSelected:
      "Recommended Centre Selected",
    recommendedCentreSelectedShort:
      "Recommended centre selected",

    selectCentre: "Select a centre",

    checkingCentreAvailability:
      "Checking centre availability...",
    noProcurementSchedule:
      "No procurement schedule is available for this date.",
    unableToCheckCentre:
      "Unable to check centre availability for this date.",

    centreClosed: "Centre Closed",
    centreOpen: "Centre Open",
    centreCurrentlyClosed:
      "This procurement centre is currently closed.",
    reason: "Reason",
    farmersCapacity: "farmers capacity",

    bookingRequestSubmitted:
      "BOOKING REQUEST SUBMITTED",
    bookingRequestSubmittedTitle:
      "Your booking request has been submitted",
    bookingApprovalMessage:
      "Your procurement booking is currently waiting for approval from the authority. You will receive a notification when your booking is approved or rejected.",

    bookingStatus: "BOOKING STATUS",
    bookingId: "Booking ID",
    date: "Date",
    token: "Token",
    willBeGeneratedAfterApproval:
      "Will be generated after approval",
    status: "Status",

    approvalNote:
      "Please wait for the authority to approve your booking. Once approved, your token number and queue details will become available.",

    pleaseSelectCrop:
      "Please select a crop.",
    pleaseSelectCentre:
      "Please select a procurement centre.",
    pleaseSelectDate:
      "Please select a date.",
    cannotBookPastDate:
      "You cannot book a past date.",
    farmerInformationNotFound:
      "Farmer information not found. Please login again.",
    centreClosedChooseDate:
      "Centre is currently closed. Please choose another date or book during centre working hours.",
    centreClosedOnDate:
      "Centre is closed on this date.",
    scheduleUnavailable:
      "No procurement schedule is available for this date.",
    unableToCreateBooking:
      "Unable to create booking.",
    unableToConnectServer:
      "Unable to connect to the server. Please try again.",

    submitting: "Submitting...",
    pastDate: "Past Date",
    scheduleUnavailableButton:
      "Schedule Unavailable",
    centreClosedButton:
      "Centre Closed",
    submitBookingRequest:
      "Submit Booking Request →",

    bookingPendingHelp:
      "Your booking will remain pending until it is approved by the authority.",

    howBookingWorks: "How booking works",
    submitBeforeVisiting:
      "Submit your procurement request before visiting the centre.",

    chooseYourCrop: "Choose your crop",
    chooseYourCropDescription:
      "Select the crop and variety you want to procure.",

    getSmartCentreRecommendation:
      "Get a smart centre recommendation",
    smartCentreRecommendationDescription:
      "KisanSetu considers distance, procurement price and available slots to recommend a suitable centre.",

    selectProcurementDate:
      "Select procurement date",
    selectProcurementDateDescription:
      "Choose the date on which you want to bring your crop.",

    waitForApproval: "Wait for approval",
    waitForApprovalDescription:
      "Authority approval will generate your token number and queue position.",

    // =========================
    // MY TOKEN
    // =========================
    activeBookings: "ACTIVE BOOKINGS",
    myTokenPageTitle: "My Token",
    myTokenSubtitle:
      "View your active procurement tokens and scheduled slots.",
    active: "active",

    loadingYourTokens: "Loading your tokens",
    loadingYourTokensDescription:
      "Please wait while we fetch your active bookings.",

    somethingWentWrong: "Something went wrong",
    unableToLoadActiveTokens:
      "Unable to load your active tokens.",

    noActiveTokens: "No active tokens",
    noActiveTokensDescription:
      "You currently do not have any approved or in-progress bookings.",

    varietyNotSpecified: "Variety not specified",
    dateLabel: "Date",
    slot: "Slot",
    notAssigned: "Not assigned",
    crop: "Crop",

    // =========================
    // PROCUREMENT
    // =========================
    procurementDetails: "Procurement Details",
    procurementHistoryDescription:
      "View your completed procurement history.",

    loadingProcurementDetails:
      "Loading procurement details...",

    pleaseLoginToContinue:
      "Please login to continue",

    farmerInformationNotAvailable:
      "Your farmer information is not available.",

    procurementCompleted:
      "PROCUREMENT COMPLETED",

    totalProcurementAmount:
      "Total Procurement Amount",

    procurementSummary:
      "Procurement Summary",

    quantity: "Quantity",
    quality: "Quality",
    pricePerKg: "Price per kg",
    totalAmount: "Total Amount",

    bookingInformation: "Booking Information",
    variety: "Variety",
    centre: "Centre",
    bookingDate: "Booking Date",

    procurementStatus: "Procurement Status",
    paymentStatus: "Payment Status",

    completed: "COMPLETED",
    paid: "PAID",
    pending: "PENDING",

    notAvailable: "Not available",
    notSpecified: "Not specified",

    noCompletedProcurement:
      "No completed procurement found yet.",

    procurementDetailsNotAvailable:
      "Procurement details are not available yet.",

    unableToLoadProcurement:
      "Unable to load procurement details.",

    procurementDetailsWillAppear:
      "Once your procurement is completed by the procurement officer, the details will appear here.",

    // =========================
    // PAYMENT
    // =========================
    kisanSetuPayment:
      "KISANSETU PAYMENT",

    paymentDescription:
      "Track the money received from your completed procurements.",

    loadingPaymentHistory:
      "Loading payment history...",

    unableToLoadPaymentHistory:
      "Unable to load payment history.",

    noPaymentRecords:
      "No payment records found yet.",

    totalMoneyReceived:
      "Total Money Received",

    moneyReceivedFromPaidProcurements:
      "Money received from paid procurements",

    paymentsReceived:
      "Payments Received",

    completedPaymentTransactions:
      "Completed payment transactions",

    transactionRecords:
      "TRANSACTION RECORDS",

    paymentHistory:
      "Payment History",

    paymentMethod:
      "Payment Method",

    transactionId:
      "Transaction ID",

    paymentId:
      "Payment ID",

    slotTime:
      "Slot Time",

    // =========================
    // CENTRES
    // =========================
    procurementNetwork:
      "PROCUREMENT NETWORK",

    exploreCentres:
      "Explore Centres",

    exploreCentresDescription:
      "Find procurement centres, compare distances and check crop prices near you.",

    findingCurrentLocation:
      "Finding your current location...",

    distancesCalculated:
      "Distances calculated from your current location",

    unableToGetLocation:
      "Unable to get your current location. Please allow location access.",

    loadingCentres:
      "Loading centres...",

    loadingCentresDescription:
      "Please wait while we find available procurement centres.",

    unableToLoadCentres:
      "Unable to load procurement centres. Please try again.",

    noCentresAvailable:
      "No centres available",

    noCentresDescription:
      "There are currently no procurement centres available.",

    tryAgain:
      "Try Again",

    available:
      "AVAILABLE",

    distanceFromYou:
      "Distance from you",

    locationUnavailable:
      "Location unavailable",

    locationLabel:
      "Location",

    district:
      "District",

    state:
      "State",

    capacity:
      "Capacity",

    procurementPrices:
      "Procurement Prices",

    riceSwarna:
      "Rice — Swarna",

    riceBasmati:
      "Rice — Basmati",

    wheatHd2967:
      "Wheat — HD-2967",

    potatoJyoti:
      "Potato — Jyoti",

    rupeesPerKg:
      "₹ / kg",

    selectCentreButton:
      "Select Centre",

    // =========================
    // QUEUE
    // =========================
    liveQueue:
      "LIVE QUEUE",

    myQueue:
      "My Queue",

    trackQueuePosition:
      "Track your position at the procurement centre.",

    yourToken:
      "YOUR TOKEN",

    currentStatus:
      "Current Status",

    estimatedWaitingTime:
      "Estimated Waiting Time",

    youAreNextReady:
      "You are next — please be ready",

    minutesApproximately:
      "minutes approximately",

    queueProgress:
      "Queue Progress",

    youAreNextInLine:
      "You are next in line",

    peopleAheadOfYou:
      "{count} people ahead of you",

    pastQueueActivity:
      "PAST QUEUE ACTIVITY",

    queueHistory:
      "Queue History",

    noToken:
      "No token",

    queueInformationError:
      "Unable to load your queue information.",

    noApprovedBookingLiveQueue:
      "You currently have no approved booking in the live queue.",

    // =========================
    // FARMER LOGIN
    // =========================
    smartProcurementForFarmers:
      "SMART PROCUREMENT FOR FARMERS",

    sellSmarter:
      "Sell smarter.",

    growWithConfidence:
      "Grow with confidence.",

    loginHeroDescription:
      "Manage your procurement bookings, track market opportunities and stay connected with a simpler farming journey.",

    procurementMadeSimple:
      "Procurement made simple",

    bookTrackGetPaid:
      "Book • Track • Get Paid",

    builtForFarmers:
      "Built for farmers",

    designedForSimplerTrade:
      "Designed for simpler trade",

    farmerAccount:
      "FARMER ACCOUNT",

    loginDescription:
      "Log in to continue managing your procurement activities.",

    accountCreatedSuccessfully:
      "Account created successfully.",

    loginUnsuccessful:
      "Login unsuccessful",

    emailOrMobileNumber:
      "Email or Mobile Number",

    emailOrMobilePlaceholder:
      "Email or 10-digit mobile number",

    enterYourPassword:
      "Enter your password",

    forgotPassword:
      "Forgot Password?",

    loggingIn:
      "Logging in…",

    newToKisanSetu:
      "New to KisanSetu?",

    dontHaveFarmerAccount:
      "Don't have a farmer account?",

    createYourAccount:
      "Create your account",

    areYouProcurementOfficer:
      "Are you a procurement officer?",

    officerLogin:
      "Officer Login",

    accountSecurityMessage:
      "Your account information is securely protected.",

    loginFailed:
      "Login failed. Please try again.",

    // =========================
    // FARMER REGISTRATION
    // =========================
    farmerRegistration:
      "FARMER REGISTRATION",

    registerDescription:
      "Register with KisanSetu to start managing your procurement activities.",

    registerHeroEyebrow:
      "A BETTER WAY TO SELL YOUR PRODUCE",

    registerHeroTitle:
      "Your produce.",

    registerHeroTitleHighlight:
      "Your opportunity.",

    registerHeroDescription:
      "Join KisanSetu and make procurement simpler. Book slots, track your activities and stay connected with a smarter farming experience.",

    registerVisualTitle:
      "Your farming journey, simplified",

    registerVisualSubtitle:
      "Book • Track • Get Paid",

    registrationUnsuccessful:
      "Registration unsuccessful",

    registrationFailed:
      "Registration failed. Please try again.",

    basicInformation:
      "Basic Information",

    basicInformationDescription:
      "Enter your basic contact details.",

    fullNamePlaceholder:
      "e.g. Ramesh Kumar",

    mobileNumberPlaceholder:
      "10-digit mobile number",

    emailOptional:
      "Email (Optional)",

    accountSecurity:
      "Account Security",

    accountSecurityDescription:
      "Create a secure password for your account.",

    passwordPlaceholder:
      "At least 8 characters",

    confirmPassword:
      "Confirm Password",

    confirmPasswordPlaceholder:
      "Re-enter your password",

    addressDetails:
      "Address Details",

    addressDetailsDescription:
      "Add your location details. These fields are optional.",

    addressPlaceholder:
      "House number, street or locality",

    villagePlaceholder:
      "Enter your village",

    districtPlaceholder:
      "Enter your district",

    statePlaceholder:
      "Enter your state",

    identificationDescription:
      "Provide identification details if available.",

    aadhaarPlaceholder:
      "12-digit Aadhaar number",

    farmerGovernmentIdOptional:
      "Farmer Government ID (Optional)",

    farmerGovernmentIdPlaceholder:
      "Enter government farmer ID",

    bankDetailsDescription:
      "Add your bank details for future payment processing.",

    bankNamePlaceholder:
      "e.g. State Bank of India",

    bankAccountNumberPlaceholder:
      "Enter your bank account number",

    creatingAccount:
      "Creating Account…",

    createAccount:
      "Create Account",

    alreadyRegistered:
      "Already registered?",

    alreadyHaveFarmerAccount:
      "Already have a farmer account?",

    loginToYourAccount:
      "Login to your account",

    // =========================
    // FORGOT PASSWORD / ACCOUNT RECOVERY
    // =========================
    forgotHeroEyebrow:
      "SMART PROCUREMENT FOR FARMERS",

    forgotHeroTitle:
      "Secure your",

    forgotHeroTitleHighlight:
      "farmer account.",

    forgotHeroDescription:
      "Reset your password and get back to managing your procurement activities with KisanSetu.",

    secureFarmerAccount:
      "Simple • Secure • Farmer-friendly",

    accountRecovery:
      "ACCOUNT RECOVERY",

    createNewPassword:
      "Create a new password",

    forgotYourPassword:
      "Forgot your password?",

    chooseNewPassword:
      "Choose a new password for your farmer account.",

    enterRegisteredMobileToContinue:
      "Enter your registered mobile number to continue.",

    unableToContinue:
      "Unable to continue",

    mobileNumberVerified:
      "Mobile number verified",

    farmerAccountFound:
      "Your farmer account has been found successfully.",

    passwordResetSuccessfully:
      "Password reset successfully",

    passwordChangedLogin:
      "Your password has been changed. You can now login with your new password.",

    registeredMobileNumber:
      "Registered Mobile Number",

    checking:
      "Checking...",

    continue:
      "Continue",

    newPassword:
      "New Password",

    newPasswordPlaceholder:
      "Enter new password",

    confirmNewPasswordLabel:
      "Confirm New Password",

    confirmNewPasswordPlaceholder:
      "Confirm new password",

    resetting:
      "Resetting...",

    resetPassword:
      "Reset Password",

    rememberYourPassword:
      "Remember your password?",

    backToLogin:
      "Back to Login",

    enterRegisteredMobile:
      "Please enter your registered mobile number.",

    invalidMobileNumber:
      "Please enter a valid 10-digit mobile number.",

    unableToVerifyMobile:
      "Unable to verify mobile number.",

    enterNewPassword:
      "Please enter your new password.",

    passwordMinimumSix:
      "Password must be at least 6 characters long.",

    confirmNewPassword:
      "Please confirm your new password.",

    passwordsDoNotMatch:
      "Passwords do not match.",

    unableToResetPassword:
      "Unable to reset password."
  },

  // =====================================================
  // BENGALI
  // =====================================================
  bn: {
    // =========================
    // COMMON
    // =========================
    dashboard: "ড্যাশবোর্ড",
    bookSlot: "স্লট বুক করুন",
    payment: "পেমেন্ট",
    logout: "লগআউট",
    profile: "প্রোফাইল",
    notifications: "নোটিফিকেশন",
    unreadNotifications: "{count}টি অপঠিত",
    noNotifications:
      "এখনও কোনও নোটিফিকেশন নেই।",
    farmer: "কৃষক",
    toggleNavigation:
      "নেভিগেশন মেনু খুলুন বা বন্ধ করুন",

    welcome: "স্বাগতম",
    welcomeBack: "স্বাগতম",
    bookingConfirmed:
      "আপনার বুকিং নিশ্চিত হয়েছে",
    myBooking: "আমার বুকিং",
    login: "লগইন",
    email: "ইমেল",
    password: "পাসওয়ার্ড",
    submit: "জমা দিন",
    cancel: "বাতিল করুন",
    save: "সংরক্ষণ করুন",
    selectLanguage: "ভাষা নির্বাচন করুন",

    // =========================
    // PROFILE
    // =========================
    account: "অ্যাকাউন্ট",
    myProfile: "আমার প্রোফাইল",
    profileDescription:
      "আপনার KisanSetu কৃষক অ্যাকাউন্টের তথ্য দেখুন এবং পরিচালনা করুন।",
    editProfile: "প্রোফাইল সম্পাদনা করুন",
    kisanSetuFarmer: "KisanSetu কৃষক",

    personalInformation:
      "ব্যক্তিগত তথ্য",
    fullName: "পুরো নাম",
    mobileNumber: "মোবাইল নম্বর",
    address: "ঠিকানা",
    village: "গ্রাম",

    identification:
      "পরিচয় তথ্য",
    aadhaarNumber:
      "আধার নম্বর",
    farmerGovernmentId:
      "কৃষকের সরকারি আইডি",

    bankDetails:
      "ব্যাঙ্কের বিবরণ",
    bankName:
      "ব্যাঙ্কের নাম",
    bankAccountNumber:
      "ব্যাঙ্ক অ্যাকাউন্ট নম্বর",

    accountInformation:
      "অ্যাকাউন্টের তথ্য",
    farmerId:
      "কৃষক আইডি",

    saveChanges:
      "পরিবর্তন সংরক্ষণ করুন",
    optional:
      "ঐচ্ছিক",

    loadingProfile:
      "প্রোফাইল লোড হচ্ছে...",
    loadingProfileDescription:
      "আপনার সর্বশেষ কৃষক তথ্য লোড করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।",

    unableToLoadProfile:
      "প্রোফাইল লোড করা যাচ্ছে না",
    unableToUpdateProfile:
      "কৃষকের প্রোফাইল আপডেট করা যাচ্ছে না।",

    pleaseLoginToViewProfile:
      "আপনার প্রোফাইল দেখতে অনুগ্রহ করে আবার লগইন করুন।",

    accountSecure:
      "আপনার অ্যাকাউন্ট সুরক্ষিত",

    accountSecureDescription:
      "আপনার কৃষক তথ্য বুকিং, ফসল সংগ্রহ, কিউ ট্র্যাকিং এবং পেমেন্ট পরিচালনার জন্য ব্যবহার করা হয়।",

    // =========================
    // FARMER DASHBOARD
    // =========================
    farmerDashboard:
      "কৃষক ড্যাশবোর্ড",

    goodMorning:
      "সুপ্রভাত",

    procurementActivity:
      "আপনার ফসল সংগ্রহ সংক্রান্ত তথ্য এখানে দেখুন।",

    smartProcurement:
      "স্মার্ট ফসল সংগ্রহ",

    nextAppointment:
      "পরবর্তী অ্যাপয়েন্টমেন্ট",

    loadingBooking:
      "আপনার বুকিং লোড হচ্ছে...",

    loadingLatestBooking:
      "আপনার সর্বশেষ বুকিংয়ের তথ্য আনা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।",

    cropProcurement:
      "ফসল সংগ্রহ",

    procurementCentre:
      "ফসল সংগ্রহ কেন্দ্র",

    viewBooking:
      "বুকিং দেখুন",

    noAppointment:
      "কোনও অ্যাপয়েন্টমেন্ট বুক করা হয়নি",

    bookProcurementSlot:
      "শুরু করতে আপনার ফসল সংগ্রহের স্লট বুক করুন।",

    getStarted:
      "শুরু করুন",

    quickActions:
      "দ্রুত কাজ",

    findCentre:
      "কেন্দ্র খুঁজুন",

    exploreNearbyCentres:
      "কাছাকাছি ফসল সংগ্রহ কেন্দ্রগুলি দেখুন।",

    explore:
      "দেখুন",

    myToken:
      "আমার টোকেন",

    checkQueueToken:
      "উপলব্ধ হলে আপনার কিউ টোকেন দেখুন।",

    view:
      "দেখুন",

    chooseCentreBookSlot:
      "একটি ফসল সংগ্রহ কেন্দ্র বেছে নিয়ে আপনার স্লট বুক করুন।",

    getStartedButton:
      "শুরু করুন",

    liveStatus:
      "লাইভ স্ট্যাটাস",

    recentQueue:
      "সাম্প্রতিক কিউ",

    loading:
      "লোড হচ্ছে",

    loadingQueue:
      "কিউ লোড হচ্ছে...",

    loadingQueueStatus:
      "আপনার সর্বশেষ কিউ স্ট্যাটাস আনা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।",

    noQueue:
      "কোনও কিউ নেই",

    noActiveQueue:
      "কোনও সক্রিয় কিউ নেই",

    queueWillAppear:
      "আপনার সক্রিয় বুকিং থাকলে এখানে লাইভ কিউ তথ্য দেখা যাবে।",

    viewQueue:
      "কিউ দেখুন",

    viewQueueHistory:
      "কিউ ইতিহাস দেখুন",

    queuePosition:
      "কিউ অবস্থান",

    peopleAhead:
      "সামনে থাকা ব্যক্তি",

    estimatedWaiting:
      "আনুমানিক অপেক্ষা",

    estimatedTurn:
      "আনুমানিক সময়",

    youAreNext:
      "আপনার পালা পরবর্তী",

    minutes:
      "মিনিট",

    pastBookings:
      "আগের বুকিং",

    bookingHistory:
      "বুকিংয়ের ইতিহাস",

    record:
      "রেকর্ড",

    records:
      "রেকর্ড",

    loadingBookingHistory:
      "বুকিংয়ের ইতিহাস লোড হচ্ছে...",

    loadingPreviousBookings:
      "আপনার আগের বুকিংগুলি আনা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।",

    viewAllBookings:
      "সব বুকিং দেখুন",

    noHistory:
      "কোনও ইতিহাস নেই",

    noPastBookings:
      "কোনও আগের বুকিং নেই",

    pastBookingsWillAppear:
      "আপনার সম্পন্ন বা বাতিল হওয়া বুকিংগুলি এখানে দেখা যাবে।",

    yourActivity:
      "আপনার কার্যক্রম",

    procurementOverview:
      "ফসল সংগ্রহের সারসংক্ষেপ",

    procurement:
      "ফসল সংগ্রহ",

    availableBookings:
      "টি বুকিং পাওয়া যাচ্ছে",

    availableBookingsPlural:
      "টি বুকিং পাওয়া যাচ্ছে",

    noProcurementRecord:
      "কোনও ফসল সংগ্রহের রেকর্ড নেই",

    viewStatus:
      "স্ট্যাটাস দেখুন",

    checkPaymentStatus:
      "আপনার পেমেন্টের স্ট্যাটাস দেখুন",

    noPaymentRecord:
      "কোনও পেমেন্টের রেকর্ড নেই",

    viewPayment:
      "পেমেন্ট দেখুন",

    help:
      "সহায়তা",

    howKisanSetuWorks:
      "KisanSetu কীভাবে কাজ করে",

    howKisanSetuWorksDescription:
      "একটি ফসল সংগ্রহের স্লট বুক করুন, নির্ধারিত সময়ে কেন্দ্রে যান এবং ড্যাশবোর্ড থেকে আপনার ফসল সংগ্রহের স্ট্যাটাস দেখুন।",

    // =========================
    // BOOKING
    // =========================
    bookProcurementSlot:
      "ফসল সংগ্রহের স্লট বুক করুন",

    selectCropCentreDate:
      "আপনার ফসল, ফসল সংগ্রহ কেন্দ্র এবং পছন্দের তারিখ নির্বাচন করুন।",

    loadingBookingOptions:
      "বুকিংয়ের বিকল্পগুলি লোড হচ্ছে...",

    unableToLoadBookingData:
      "বুকিংয়ের তথ্য লোড করা যাচ্ছে না।",

    bookingDetails:
      "বুকিংয়ের বিবরণ",

    chooseProcurementPreferences:
      "আপনার ফসল সংগ্রহের পছন্দ নির্বাচন করুন",

    selectCrop:
      "ফসল নির্বাচন করুন",

    selectACrop:
      "একটি ফসল নির্বাচন করুন",

    procurementDate:
      "ফসল সংগ্রহের তারিখ",

    location:
      "অবস্থান",

    gettingLocation:
      "স্মার্ট কেন্দ্রের সুপারিশের জন্য আপনার অবস্থান নেওয়া হচ্ছে...",

    locationNotSupported:
      "এই ব্রাউজারে অবস্থান পরিষেবা সমর্থিত নয়।",

    locationPermissionRequired:
      "স্মার্ট কেন্দ্রের সুপারিশের জন্য অবস্থানের অনুমতি প্রয়োজন।",

    smartRecommendation:
      "স্মার্ট সুপারিশ",

    findingBestCentre:
      "সেরা ফসল সংগ্রহ কেন্দ্র খোঁজা হচ্ছে...",

    currentPrice:
      "বর্তমান মূল্য",

    distance:
      "দূরত্ব",

    availableSlots:
      "উপলব্ধ স্লট",

    currentBookings:
      "বর্তমান বুকিং",

    chooseRecommendedCentre:
      "প্রস্তাবিত কেন্দ্র নির্বাচন করুন",

    recommendedCentreSelected:
      "প্রস্তাবিত কেন্দ্র নির্বাচিত হয়েছে",

    recommendedCentreSelectedShort:
      "প্রস্তাবিত কেন্দ্র নির্বাচিত হয়েছে",

    selectCentre:
      "একটি কেন্দ্র নির্বাচন করুন",

    checkingCentreAvailability:
      "কেন্দ্রের উপলব্ধতা পরীক্ষা করা হচ্ছে...",

    noProcurementSchedule:
      "এই তারিখের জন্য কোনও ফসল সংগ্রহের সময়সূচি নেই।",

    unableToCheckCentre:
      "এই তারিখের জন্য কেন্দ্রের উপলব্ধতা পরীক্ষা করা যাচ্ছে না।",

    centreClosed:
      "কেন্দ্র বন্ধ",

    centreOpen:
      "কেন্দ্র খোলা",

    centreCurrentlyClosed:
      "এই ফসল সংগ্রহ কেন্দ্রটি বর্তমানে বন্ধ।",

    reason:
      "কারণ",

    farmersCapacity:
      "কৃষকের ধারণক্ষমতা",

    bookingRequestSubmitted:
      "বুকিংয়ের অনুরোধ জমা হয়েছে",

    bookingRequestSubmittedTitle:
      "আপনার বুকিংয়ের অনুরোধ জমা হয়েছে",

    bookingApprovalMessage:
      "আপনার ফসল সংগ্রহের বুকিং বর্তমানে কর্তৃপক্ষের অনুমোদনের অপেক্ষায় রয়েছে। বুকিং অনুমোদিত বা প্রত্যাখ্যান হলে আপনি একটি নোটিফিকেশন পাবেন।",

    bookingStatus:
      "বুকিংয়ের স্ট্যাটাস",

    bookingId:
      "বুকিং আইডি",

    date:
      "তারিখ",

    token:
      "টোকেন",

    willBeGeneratedAfterApproval:
      "অনুমোদনের পরে তৈরি হবে",

    status:
      "স্ট্যাটাস",

    approvalNote:
      "অনুগ্রহ করে কর্তৃপক্ষের অনুমোদনের জন্য অপেক্ষা করুন। অনুমোদনের পরে আপনার টোকেন নম্বর এবং কিউ-এর তথ্য পাওয়া যাবে।",

    pleaseSelectCrop:
      "অনুগ্রহ করে একটি ফসল নির্বাচন করুন।",

    pleaseSelectCentre:
      "অনুগ্রহ করে একটি ফসল সংগ্রহ কেন্দ্র নির্বাচন করুন।",

    pleaseSelectDate:
      "অনুগ্রহ করে একটি তারিখ নির্বাচন করুন।",

    cannotBookPastDate:
      "আপনি অতীতের তারিখে বুকিং করতে পারবেন না।",

    farmerInformationNotFound:
      "কৃষকের তথ্য পাওয়া যায়নি। অনুগ্রহ করে আবার লগইন করুন।",

    centreClosedChooseDate:
      "কেন্দ্রটি বর্তমানে বন্ধ। অনুগ্রহ করে অন্য তারিখ নির্বাচন করুন অথবা কেন্দ্রের কাজের সময় বুকিং করুন।",

    centreClosedOnDate:
      "এই তারিখে কেন্দ্রটি বন্ধ।",

    scheduleUnavailable:
      "এই তারিখের জন্য কোনও ফসল সংগ্রহের সময়সূচি নেই।",

    unableToCreateBooking:
      "বুকিং তৈরি করা যায়নি।",

    unableToConnectServer:
      "সার্ভারের সাথে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।",

    submitting:
      "জমা দেওয়া হচ্ছে...",

    pastDate:
      "অতীতের তারিখ",

    scheduleUnavailableButton:
      "সময়সূচি উপলব্ধ নয়",

    centreClosedButton:
      "কেন্দ্র বন্ধ",

    submitBookingRequest:
      "বুকিংয়ের অনুরোধ জমা দিন →",

    bookingPendingHelp:
      "কর্তৃপক্ষ অনুমোদন না করা পর্যন্ত আপনার বুকিং পেন্ডিং থাকবে।",

    howBookingWorks:
      "বুকিং কীভাবে কাজ করে",

    submitBeforeVisiting:
      "কেন্দ্রে যাওয়ার আগে আপনার ফসল সংগ্রহের অনুরোধ জমা দিন।",

    chooseYourCrop:
      "আপনার ফসল নির্বাচন করুন",

    chooseYourCropDescription:
      "আপনি যে ফসল ও জাত সংগ্রহ করতে চান তা নির্বাচন করুন।",

    getSmartCentreRecommendation:
      "স্মার্ট কেন্দ্রের সুপারিশ পান",

    smartCentreRecommendationDescription:
      "KisanSetu দূরত্ব, ফসলের বর্তমান মূল্য এবং উপলব্ধ স্লট বিবেচনা করে একটি উপযুক্ত কেন্দ্রের সুপারিশ করে।",

    selectProcurementDate:
      "ফসল সংগ্রহের তারিখ নির্বাচন করুন",

    selectProcurementDateDescription:
      "যেদিন আপনি আপনার ফসল নিয়ে আসতে চান সেই তারিখ নির্বাচন করুন।",

    waitForApproval:
      "অনুমোদনের জন্য অপেক্ষা করুন",

    waitForApprovalDescription:
      "কর্তৃপক্ষের অনুমোদনের পরে আপনার টোকেন নম্বর এবং কিউ-এর অবস্থান তৈরি হবে।",

    // =========================
    // MY TOKEN
    // =========================
    activeBookings:
      "সক্রিয় বুকিং",

    myTokenPageTitle:
      "আমার টোকেন",

    myTokenSubtitle:
      "আপনার সক্রিয় ফসল সংগ্রহের টোকেন এবং নির্ধারিত স্লট দেখুন।",

    active:
      "সক্রিয়",

    loadingYourTokens:
      "আপনার টোকেন লোড হচ্ছে",

    loadingYourTokensDescription:
      "আপনার সক্রিয় বুকিংগুলি আনা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।",

    somethingWentWrong:
      "কিছু সমস্যা হয়েছে",

    unableToLoadActiveTokens:
      "আপনার সক্রিয় টোকেন লোড করা যাচ্ছে না।",

    noActiveTokens:
      "কোনও সক্রিয় টোকেন নেই",

    noActiveTokensDescription:
      "আপনার বর্তমানে কোনও অনুমোদিত বা প্রক্রিয়াধীন বুকিং নেই।",

    varietyNotSpecified:
      "জাত উল্লেখ করা হয়নি",

    dateLabel:
      "তারিখ",

    slot:
      "স্লট",

    notAssigned:
      "নির্ধারিত হয়নি",

    crop:
      "ফসল",

    // =========================
    // PROCUREMENT
    // =========================
    procurementDetails:
      "ফসল সংগ্রহের বিবরণ",

    procurementHistoryDescription:
      "আপনার সম্পন্ন হওয়া ফসল সংগ্রহের ইতিহাস দেখুন।",

    loadingProcurementDetails:
      "ফসল সংগ্রহের বিবরণ লোড হচ্ছে...",

    pleaseLoginToContinue:
      "চালিয়ে যেতে লগইন করুন",

    farmerInformationNotAvailable:
      "আপনার কৃষকের তথ্য পাওয়া যাচ্ছে না।",

    procurementCompleted:
      "ফসল সংগ্রহ সম্পন্ন",

    totalProcurementAmount:
      "মোট ফসল সংগ্রহের পরিমাণ",

    procurementSummary:
      "ফসল সংগ্রহের সারাংশ",

    quantity:
      "পরিমাণ",

    quality:
      "গুণমান",

    pricePerKg:
      "প্রতি কেজির মূল্য",

    totalAmount:
      "মোট পরিমাণ",

    bookingInformation:
      "বুকিংয়ের তথ্য",

    variety:
      "জাত",

    centre:
      "কেন্দ্র",

    bookingDate:
      "বুকিংয়ের তারিখ",

    procurementStatus:
      "ফসল সংগ্রহের অবস্থা",

    paymentStatus:
      "পেমেন্টের অবস্থা",

    completed:
      "সম্পন্ন",

    paid:
      "পরিশোধিত",

    pending:
      "অপেক্ষমাণ",

    notAvailable:
      "পাওয়া যাচ্ছে না",

    notSpecified:
      "উল্লেখ করা হয়নি",

    noCompletedProcurement:
      "এখনও কোনও সম্পন্ন ফসল সংগ্রহ পাওয়া যায়নি।",

    procurementDetailsNotAvailable:
      "ফসল সংগ্রহের বিবরণ এখনও পাওয়া যাচ্ছে না।",

    unableToLoadProcurement:
      "ফসল সংগ্রহের বিবরণ লোড করা যাচ্ছে না।",

    procurementDetailsWillAppear:
      "প্রকিউরমেন্ট অফিসার আপনার ফসল সংগ্রহ সম্পন্ন করার পর বিবরণ এখানে দেখা যাবে।",

    // =========================
    // PAYMENT
    // =========================
    kisanSetuPayment:
      "কিষানসেতু পেমেন্ট",

    paymentDescription:
      "আপনার সম্পন্ন হওয়া ফসল সংগ্রহ থেকে প্রাপ্ত অর্থের তথ্য দেখুন।",

    loadingPaymentHistory:
      "পেমেন্টের ইতিহাস লোড হচ্ছে...",

    unableToLoadPaymentHistory:
      "পেমেন্টের ইতিহাস লোড করা যাচ্ছে না।",

    noPaymentRecords:
      "এখনও কোনও পেমেন্টের রেকর্ড পাওয়া যায়নি।",

    totalMoneyReceived:
      "মোট প্রাপ্ত অর্থ",

    moneyReceivedFromPaidProcurements:
      "পরিশোধিত ফসল সংগ্রহ থেকে প্রাপ্ত অর্থ",

    paymentsReceived:
      "প্রাপ্ত পেমেন্ট",

    completedPaymentTransactions:
      "সম্পন্ন পেমেন্ট লেনদেন",

    transactionRecords:
      "লেনদেনের রেকর্ড",

    paymentHistory:
      "পেমেন্টের ইতিহাস",

    paymentMethod:
      "পেমেন্টের পদ্ধতি",

    transactionId:
      "লেনদেন আইডি",

    paymentId:
      "পেমেন্ট আইডি",

    slotTime:
      "স্লটের সময়",

    // =========================
    // CENTRES
    // =========================
    procurementNetwork:
      "ফসল সংগ্রহ নেটওয়ার্ক",

    exploreCentres:
      "কেন্দ্র দেখুন",

    exploreCentresDescription:
      "ফসল সংগ্রহ কেন্দ্র খুঁজুন, দূরত্ব তুলনা করুন এবং আপনার কাছাকাছি ফসলের মূল্য দেখুন।",

    findingCurrentLocation:
      "আপনার বর্তমান অবস্থান খোঁজা হচ্ছে...",

    distancesCalculated:
      "আপনার বর্তমান অবস্থান থেকে দূরত্ব গণনা করা হয়েছে",

    unableToGetLocation:
      "আপনার বর্তমান অবস্থান পাওয়া যাচ্ছে না। অনুগ্রহ করে লোকেশন অ্যাক্সেসের অনুমতি দিন।",

    loadingCentres:
      "কেন্দ্রগুলি লোড হচ্ছে...",

    loadingCentresDescription:
      "উপলব্ধ ফসল সংগ্রহ কেন্দ্রগুলি খুঁজে পাওয়া হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।",

    unableToLoadCentres:
      "ফসল সংগ্রহ কেন্দ্রগুলি লোড করা যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।",

    noCentresAvailable:
      "কোনও কেন্দ্র উপলব্ধ নেই",

    noCentresDescription:
      "বর্তমানে কোনও ফসল সংগ্রহ কেন্দ্র উপলব্ধ নেই।",

    tryAgain:
      "আবার চেষ্টা করুন",

    available:
      "উপলব্ধ",

    distanceFromYou:
      "আপনার থেকে দূরত্ব",

    locationUnavailable:
      "অবস্থান পাওয়া যাচ্ছে না",

    locationLabel:
      "অবস্থান",

    district:
      "জেলা",

    state:
      "রাজ্য",

    capacity:
      "ধারণক্ষমতা",

    procurementPrices:
      "ফসল সংগ্রহের মূল্য",

    riceSwarna:
      "চাল — স্বর্ণা",

    riceBasmati:
      "চাল — বাসমতি",

    wheatHd2967:
      "গম — HD-2967",

    potatoJyoti:
      "আলু — জ্যোতি",

    rupeesPerKg:
      "₹ / কেজি",

    selectCentreButton:
      "কেন্দ্র নির্বাচন করুন",

    // =========================
    // QUEUE
    // =========================
    liveQueue:
      "লাইভ কিউ",

    myQueue:
      "আমার কিউ",

    trackQueuePosition:
      "ফসল সংগ্রহ কেন্দ্রে আপনার অবস্থান দেখুন।",

    yourToken:
      "আপনার টোকেন",

    currentStatus:
      "বর্তমান অবস্থা",

    estimatedWaitingTime:
      "আনুমানিক অপেক্ষার সময়",

    youAreNextReady:
      "আপনার পালা পরবর্তী — প্রস্তুত থাকুন",

    minutesApproximately:
      "মিনিট প্রায়",

    queueProgress:
      "কিউ অগ্রগতি",

    youAreNextInLine:
      "আপনার পালা পরবর্তী",

    peopleAheadOfYou:
      "আপনার সামনে {count} জন",

    pastQueueActivity:
      "আগের কিউ কার্যকলাপ",

    queueHistory:
      "কিউ ইতিহাস",

    noToken:
      "কোনও টোকেন নেই",

    queueInformationError:
      "আপনার কিউয়ের তথ্য লোড করা যাচ্ছে না।",

    noApprovedBookingLiveQueue:
      "আপনার বর্তমানে লাইভ কিউতে কোনও অনুমোদিত বুকিং নেই।",

    // =========================
    // FARMER LOGIN
    // =========================
    smartProcurementForFarmers:
      "কৃষকদের জন্য স্মার্ট ফসল সংগ্রহ",

    sellSmarter:
      "আরও বুদ্ধিমানের মতো বিক্রি করুন।",

    growWithConfidence:
      "আত্মবিশ্বাসের সঙ্গে এগিয়ে যান।",

    loginHeroDescription:
      "আপনার ফসল সংগ্রহের বুকিং পরিচালনা করুন, বাজারের সুযোগগুলি দেখুন এবং আরও সহজ কৃষি যাত্রার সঙ্গে সংযুক্ত থাকুন।",

    procurementMadeSimple:
      "ফসল সংগ্রহ এখন আরও সহজ",

    bookTrackGetPaid:
      "বুক করুন • ট্র্যাক করুন • পেমেন্ট পান",

    builtForFarmers:
      "কৃষকদের জন্য তৈরি",

    designedForSimplerTrade:
      "সহজ বাণিজ্যের জন্য ডিজাইন করা",

    farmerAccount:
      "কৃষক অ্যাকাউন্ট",

    loginDescription:
      "আপনার ফসল সংগ্রহের কার্যক্রম পরিচালনা করতে লগ ইন করুন।",

    accountCreatedSuccessfully:
      "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",

    loginUnsuccessful:
      "লগইন সফল হয়নি",

    emailOrMobileNumber:
      "ইমেল অথবা মোবাইল নম্বর",

    emailOrMobilePlaceholder:
      "ইমেল অথবা ১০ সংখ্যার মোবাইল নম্বর",

    enterYourPassword:
      "আপনার পাসওয়ার্ড লিখুন",

    forgotPassword:
      "পাসওয়ার্ড ভুলে গেছেন?",

    loggingIn:
      "লগইন করা হচ্ছে…",

    newToKisanSetu:
      "KisanSetu-তে নতুন?",

    dontHaveFarmerAccount:
      "কৃষক অ্যাকাউন্ট নেই?",

    createYourAccount:
      "আপনার অ্যাকাউন্ট তৈরি করুন",

    areYouProcurementOfficer:
      "আপনি কি ফসল সংগ্রহের কর্মকর্তা?",

    officerLogin:
      "কর্মকর্তা লগইন",

    accountSecurityMessage:
      "আপনার অ্যাকাউন্টের তথ্য নিরাপদে সুরক্ষিত রাখা হয়।",

    loginFailed:
      "লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",

    // =========================
    // FARMER REGISTRATION
    // =========================
    farmerRegistration:
      "কৃষক নিবন্ধন",

    registerDescription:
      "আপনার ফসল সংগ্রহ কার্যক্রম পরিচালনা শুরু করতে KisanSetu-তে নিবন্ধন করুন।",

    registerHeroEyebrow:
      "আপনার ফসল বিক্রির আরও ভালো উপায়",

    registerHeroTitle:
      "আপনার ফসল।",

    registerHeroTitleHighlight:
      "আপনার সুযোগ।",

    registerHeroDescription:
      "KisanSetu-তে যোগ দিন এবং ফসল সংগ্রহের প্রক্রিয়া আরও সহজ করুন। স্লট বুক করুন, আপনার কার্যক্রম ট্র্যাক করুন এবং আরও স্মার্ট কৃষি অভিজ্ঞতার সঙ্গে যুক্ত থাকুন।",

    registerVisualTitle:
      "আপনার কৃষি যাত্রা আরও সহজ",

    registerVisualSubtitle:
      "বুক করুন • ট্র্যাক করুন • পেমেন্ট পান",

    registrationUnsuccessful:
      "নিবন্ধন সফল হয়নি",

    registrationFailed:
      "নিবন্ধন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",

    basicInformation:
      "মৌলিক তথ্য",

    basicInformationDescription:
      "আপনার মৌলিক যোগাযোগের তথ্য দিন।",

    fullNamePlaceholder:
      "যেমন: রমেশ কুমার",

    mobileNumberPlaceholder:
      "১০ সংখ্যার মোবাইল নম্বর",

    emailOptional:
      "ইমেল (ঐচ্ছিক)",

    accountSecurity:
      "অ্যাকাউন্ট নিরাপত্তা",

    accountSecurityDescription:
      "আপনার অ্যাকাউন্টের জন্য একটি নিরাপদ পাসওয়ার্ড তৈরি করুন।",

    passwordPlaceholder:
      "কমপক্ষে ৮টি অক্ষর",

    confirmPassword:
      "পাসওয়ার্ড নিশ্চিত করুন",

    confirmPasswordPlaceholder:
      "আবার আপনার পাসওয়ার্ড লিখুন",

    addressDetails:
      "ঠিকানার বিবরণ",

    addressDetailsDescription:
      "আপনার অবস্থানের তথ্য দিন। এই ক্ষেত্রগুলি ঐচ্ছিক।",

    addressPlaceholder:
      "বাড়ির নম্বর, রাস্তা বা এলাকার নাম",

    villagePlaceholder:
      "আপনার গ্রামের নাম লিখুন",

    districtPlaceholder:
      "আপনার জেলার নাম লিখুন",

    statePlaceholder:
      "আপনার রাজ্যের নাম লিখুন",

    identificationDescription:
      "সম্ভব হলে পরিচয়পত্রের তথ্য দিন।",

    aadhaarPlaceholder:
      "১২ সংখ্যার আধার নম্বর",

    farmerGovernmentIdOptional:
      "কৃষক সরকারি পরিচয়পত্র (ঐচ্ছিক)",

    farmerGovernmentIdPlaceholder:
      "সরকারি কৃষক পরিচয়পত্র লিখুন",

    bankDetailsDescription:
      "ভবিষ্যতের পেমেন্ট প্রক্রিয়ার জন্য আপনার ব্যাংকের তথ্য দিন।",

    bankNamePlaceholder:
      "যেমন: স্টেট ব্যাংক অফ ইন্ডিয়া",

    bankAccountNumberPlaceholder:
      "আপনার ব্যাংক অ্যাকাউন্ট নম্বর লিখুন",

    creatingAccount:
      "অ্যাকাউন্ট তৈরি হচ্ছে…",

    createAccount:
      "অ্যাকাউন্ট তৈরি করুন",

    alreadyRegistered:
      "ইতিমধ্যে নিবন্ধিত?",

    alreadyHaveFarmerAccount:
      "ইতিমধ্যে কৃষক অ্যাকাউন্ট আছে?",

    loginToYourAccount:
      "আপনার অ্যাকাউন্টে লগইন করুন",

    // =========================
    // FORGOT PASSWORD / ACCOUNT RECOVERY
    // =========================
    forgotHeroEyebrow:
      "কৃষকদের জন্য স্মার্ট ফসল সংগ্রহ",

    forgotHeroTitle:
      "আপনার",

    forgotHeroTitleHighlight:
      "কৃষক অ্যাকাউন্ট সুরক্ষিত রাখুন।",

    forgotHeroDescription:
      "আপনার পাসওয়ার্ড রিসেট করুন এবং KisanSetu-এর মাধ্যমে আপনার ফসল সংগ্রহ কার্যক্রম পরিচালনা করা আবার শুরু করুন।",

    secureFarmerAccount:
      "সহজ • নিরাপদ • কৃষকবান্ধব",

    accountRecovery:
      "অ্যাকাউন্ট পুনরুদ্ধার",

    createNewPassword:
      "নতুন পাসওয়ার্ড তৈরি করুন",

    forgotYourPassword:
      "পাসওয়ার্ড ভুলে গেছেন?",

    chooseNewPassword:
      "আপনার কৃষক অ্যাকাউন্টের জন্য একটি নতুন পাসওয়ার্ড নির্বাচন করুন।",

    enterRegisteredMobileToContinue:
      "চালিয়ে যেতে আপনার নিবন্ধিত মোবাইল নম্বর লিখুন।",

    unableToContinue:
      "চালিয়ে যাওয়া সম্ভব হয়নি",

    mobileNumberVerified:
      "মোবাইল নম্বর যাচাই করা হয়েছে",

    farmerAccountFound:
      "আপনার কৃষক অ্যাকাউন্ট সফলভাবে খুঁজে পাওয়া গেছে।",

    passwordResetSuccessfully:
      "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে",

    passwordChangedLogin:
      "আপনার পাসওয়ার্ড পরিবর্তন করা হয়েছে। এখন আপনি নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।",

    registeredMobileNumber:
      "নিবন্ধিত মোবাইল নম্বর",

    checking:
      "যাচাই করা হচ্ছে...",

    continue:
      "চালিয়ে যান",

    newPassword:
      "নতুন পাসওয়ার্ড",

    newPasswordPlaceholder:
      "নতুন পাসওয়ার্ড লিখুন",

    confirmNewPasswordLabel:
      "নতুন পাসওয়ার্ড নিশ্চিত করুন",

    confirmNewPasswordPlaceholder:
      "নতুন পাসওয়ার্ড আবার লিখুন",

    resetting:
      "রিসেট করা হচ্ছে...",

    resetPassword:
      "পাসওয়ার্ড রিসেট করুন",

    rememberYourPassword:
      "আপনার পাসওয়ার্ড মনে আছে?",

    backToLogin:
      "লগইনে ফিরে যান",

    enterRegisteredMobile:
      "আপনার নিবন্ধিত মোবাইল নম্বর লিখুন।",

    invalidMobileNumber:
      "একটি বৈধ ১০ সংখ্যার মোবাইল নম্বর লিখুন।",

    unableToVerifyMobile:
      "মোবাইল নম্বর যাচাই করা যায়নি।",

    enterNewPassword:
      "আপনার নতুন পাসওয়ার্ড লিখুন।",

    passwordMinimumSix:
      "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",

    confirmNewPassword:
      "আপনার নতুন পাসওয়ার্ড নিশ্চিত করুন।",

    passwordsDoNotMatch:
      "পাসওয়ার্ড দুটি মিলছে না।",

    unableToResetPassword:
      "পাসওয়ার্ড রিসেট করা যায়নি।"
  }
};

export default translations;



