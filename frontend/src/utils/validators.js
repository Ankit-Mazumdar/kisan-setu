/**
 * Reusable validation helpers for KisanSetu forms.
 * Each function returns an error string, or '' when the value is valid.
 */


/* ============================================================
   FULL NAME
   ============================================================ */

export function validateFullName(value) {

  if (!value || !value.trim()) {
    return 'Full name is required.';
  }

  if (value.trim().length < 3) {
    return 'Full name must be at least 3 characters.';
  }

  if (!/^[A-Za-z\s.]+$/.test(value.trim())) {
    return 'Full name can only contain letters and spaces.';
  }

  return '';
}


/* ============================================================
   MOBILE NUMBER
   ============================================================ */

export function validateMobile(value) {

  if (!value || !value.trim()) {
    return 'Mobile number is required.';
  }

  if (!/^[6-9]\d{9}$/.test(value.trim())) {
    return 'Enter a valid 10-digit Indian mobile number.';
  }

  return '';
}


/* ============================================================
   EMAIL
   Used for registration where email is optional.
   ============================================================ */

export function validateEmail(value) {

  // Email is optional during registration
  if (!value || !value.trim()) {
    return '';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return 'Enter a valid email address.';
  }

  return '';
}


/* ============================================================
   LOGIN IDENTIFIER
   Accepts either:
   - Email
   - 10-digit Indian mobile number
   ============================================================ */

export function validateLoginIdentifier(value) {

  if (!value || !value.trim()) {
    return 'Email or mobile number is required.';
  }

  const identifier = value.trim();

  // Valid mobile number
  if (/^[6-9]\d{9}$/.test(identifier)) {
    return '';
  }

  // Valid email address
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
    return '';
  }

  return 'Enter a valid email address or 10-digit mobile number.';
}


/* ============================================================
   PASSWORD
   ============================================================ */

export function validatePassword(value) {

  if (!value) {
    return 'Password is required.';
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return 'Password must contain at least one letter and one number.';
  }

  return '';
}


/* ============================================================
   CONFIRM PASSWORD
   ============================================================ */

export function validateConfirmPassword(
  password,
  confirmPassword
) {

  if (!confirmPassword) {
    return 'Please confirm your password.';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  return '';
}


/* ============================================================
   REQUIRED FIELD
   ============================================================ */

export function validateRequired(
  value,
  fieldLabel = 'This field'
) {

  if (!value || !value.trim()) {
    return `${fieldLabel} is required.`;
  }

  return '';
}


/* ============================================================
   AADHAAR
   ============================================================ */

export function validateAadhaar(value) {

  if (!value || !value.trim()) {
    return '';
  }

  if (!/^\d{12}$/.test(value.trim())) {
    return 'Aadhaar number must be 12 digits.';
  }

  return '';
}


/* ============================================================
   BANK ACCOUNT NUMBER
   ============================================================ */

export function validateBankAccount(value) {

  if (!value || !value.trim()) {
    return '';
  }

  if (!/^\d{6,30}$/.test(value.trim())) {
    return 'Enter a valid bank account number.';
  }

  return '';
}


/* ============================================================
   REGISTRATION FORM
   ============================================================ */

export function validateRegisterForm({

  fullName,
  mobile,
  email,
  password,
  confirmPassword,

  address,
  village,
  district,
  state,

  aadhaarNo,
  farmerGovtId,

  bankName,
  bankAccountNo

}) {

  return {

    fullName:
      validateFullName(fullName),

    mobile:
      validateMobile(mobile),

    // Email is optional
    email:
      validateEmail(email),

    password:
      validatePassword(password),

    confirmPassword:
      validateConfirmPassword(
        password,
        confirmPassword
      ),

    address:
      validateRequired(
        address,
        'Address'
      ),

    village:
      validateRequired(
        village,
        'Village'
      ),

    district:
      validateRequired(
        district,
        'District'
      ),

    state:
      validateRequired(
        state,
        'State'
      ),

    // Aadhaar is required
    aadhaarNo:
      (!aadhaarNo || !aadhaarNo.trim())
        ? 'Aadhaar number is required.'
        : validateAadhaar(aadhaarNo),

    // Farmer Government ID is optional
    farmerGovtId:
      '',

    bankName:
      validateRequired(
        bankName,
        'Bank name'
      ),

    // Bank account number is required
    bankAccountNo:
      (!bankAccountNo || !bankAccountNo.trim())
        ? 'Bank account number is required.'
        : validateBankAccount(bankAccountNo)

  };
}


/* ============================================================
   LOGIN FORM
   ============================================================ */

export function validateLoginForm({
  identifier,
  password
}) {

  return {

    identifier:
      validateLoginIdentifier(identifier),

    password:
      validateRequired(
        password,
        'Password'
      )

  };
}


/* ============================================================
   CHECK FORM VALIDITY
   ============================================================ */

export function isFormValid(errors) {

  return Object.values(errors).every(
    (message) => !message
  );

}