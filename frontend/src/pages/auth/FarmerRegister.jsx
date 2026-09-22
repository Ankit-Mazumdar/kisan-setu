import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField.jsx';
import Button from '../../components/Button.jsx';
import {
  validateRegisterForm,
  isFormValid
} from '../../utils/validators.js';
import { useAuth } from '../../context/AuthContext.jsx';

import { useTranslation } from '../../translation/useTranslation.js';
import LanguageSwitcher from '../../translation/LanguageSwitcher.jsx';

import './Auth.css';

const initialForm = {
  // Basic Information
  fullName: '',
  mobile: '',
  email: '',

  // Account Security
  password: '',
  confirmPassword: '',

  // Address Details
  address: '',
  village: '',
  district: '',
  state: '',

  // Identification
  aadhaarNo: '',
  farmerGovtId: '',

  // Bank Details
  bankName: '',
  bankAccountNo: '',
};

function FarmerRegister() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const { t } = useTranslation();

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const validationErrors = validateRegisterForm(form);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) {
      return;
    }

    setSubmitting(true);

    try {
      await register(form);

      navigate('/login', {
        state: {
          registered: true
        }
      });
    } catch (err) {
      setServerError(
        err.message || t('registrationFailed')
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">

      {/* ============================================================
          LANGUAGE SWITCHER
          ============================================================ */}
      <div className="auth-page__language">
        <LanguageSwitcher floating={false} />
      </div>

      {/* ============================================================
          LEFT — BRAND / HERO
          ============================================================ */}
      <section className="auth-page__hero">
        <div className="auth-page__hero-content">

          {/* Brand */}
          <Link to="/login" className="auth-page__brand">
            <span className="auth-page__brand-icon">🌾</span>

            <span className="auth-page__brand-name">
              Kisan<span>Setu</span>
            </span>
          </Link>

          {/* Hero Content */}
          <div className="auth-page__hero-copy">

            <span className="auth-page__eyebrow">
              {t('registerHeroEyebrow')}
            </span>

            <h1>
              {t('registerHeroTitle')}
              <br />
              <span>{t('registerHeroTitleHighlight')}</span>
            </h1>

            <p>
              {t('registerHeroDescription')}
            </p>

          </div>

          {/* Agricultural Visual */}
          <div className="auth-page__visual">

            <div className="auth-page__sun"></div>

            <div className="auth-page__hill auth-page__hill--back"></div>

            <div className="auth-page__hill auth-page__hill--front"></div>

            <div className="auth-page__field">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            {/* Floating card */}
            <div className="auth-page__visual-card">

              <span className="auth-page__visual-card-icon">
                ✓
              </span>

              <div>
                <strong>
                  {t('registerVisualTitle')}
                </strong>

                <small>
                  {t('registerVisualSubtitle')}
                </small>
              </div>

            </div>

            {/* Decorative elements */}
            <div className="auth-page__leaf auth-page__leaf--one">
              🌿
            </div>

            <div className="auth-page__leaf auth-page__leaf--two">
              🌱
            </div>

          </div>

          {/* Hero Footer */}
          <div className="auth-page__hero-footer">

            <span>
              {t('builtForFarmers')}
            </span>

            <span className="auth-page__footer-dot">
              •
            </span>

            <span>
              {t('designedForSimplerTrade')}
            </span>

          </div>

        </div>
      </section>

      {/* ============================================================
          RIGHT — REGISTER FORM
          ============================================================ */}
      <section className="auth-page__form-section">

        <div className="auth-page__form-wrapper auth-page__form-wrapper--register">

          {/* Mobile Brand */}
          <div className="auth-page__mobile-brand">

            <span className="auth-page__brand-icon">
              🌾
            </span>

            <span className="auth-page__brand-name">
              Kisan<span>Setu</span>
            </span>

          </div>

          {/* Form Header */}
          <div className="auth-page__form-header">

            <span className="auth-page__form-eyebrow">
              {t('farmerRegistration')}
            </span>

            <h2>
              {t('createYourAccount')}
            </h2>

            <p>
              {t('registerDescription')}
            </p>

          </div>

          {/* Server Error */}
          {serverError && (
            <div className="auth-page__message auth-page__message--error">

              <span>!</span>

              <div>
                <strong>
                  {t('registrationUnsuccessful')}
                </strong>

                <small>
                  {serverError}
                </small>
              </div>

            </div>
          )}

          {/* ========================================================
              REGISTRATION FORM
              ======================================================== */}
          <form
            className="auth-page__form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* ======================================================
                1. BASIC INFORMATION
                ====================================================== */}
            <div className="register-section">

              <div className="register-section__header">
                <h3>
                  {t('basicInformation')}
                </h3>

                <p>
                  {t('basicInformationDescription')}
                </p>
              </div>

              {/* Full Name */}
              <div className="auth-page__field">
                <InputField
                  label={t('fullName')}
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder={t('fullNamePlaceholder')}
                  error={errors.fullName}
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="auth-page__field">
                <InputField
                  label={t('mobileNumber')}
                  name="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder={t('mobileNumberPlaceholder')}
                  error={errors.mobile}
                  required
                />
              </div>

              {/* Email */}
              <div className="auth-page__field">
                <InputField
                  label={t('emailOptional')}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  error={errors.email}
                />
              </div>

            </div>

            {/* ======================================================
                2. ACCOUNT SECURITY
                ====================================================== */}
            <div className="register-section">

              <div className="register-section__header">
                <h3>
                  {t('accountSecurity')}
                </h3>

                <p>
                  {t('accountSecurityDescription')}
                </p>
              </div>

              {/* Password */}
              <div className="auth-page__field">
                <InputField
                  label={t('password')}
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={t('passwordPlaceholder')}
                  error={errors.password}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="auth-page__field">
                <InputField
                  label={t('confirmPassword')}
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder={t('confirmPasswordPlaceholder')}
                  error={errors.confirmPassword}
                  required
                />
              </div>

            </div>

            {/* ======================================================
                3. ADDRESS DETAILS
                ====================================================== */}
            <div className="register-section">

              <div className="register-section__header">
                <h3>
                  {t('addressDetails')}
                </h3>

                <p>
                  {t('addressDetailsDescription')}
                </p>
              </div>

              {/* Address */}
              <div className="auth-page__field">
                <InputField
                  label={t('address')}
                  required
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder={t('addressPlaceholder')}
                  error={errors.address}
                />
              </div>

              {/* Village */}
              <div className="auth-page__field">
                <InputField
                  label={t('village')}
                  required
                  name="village"
                  value={form.village}
                  onChange={handleChange}
                  placeholder={t('villagePlaceholder')}
                  error={errors.village}
                />
              </div>

              {/* District */}
              <div className="auth-page__field">
                <InputField
                  label={t('district')}
                  required
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder={t('districtPlaceholder')}
                  error={errors.district}
                />
              </div>

              {/* State */}
              <div className="auth-page__field">
                <InputField
                  label={t('state')}
                  required
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder={t('statePlaceholder')}
                  error={errors.state}
                />
              </div>

            </div>

            {/* ======================================================
                4. IDENTIFICATION
                ====================================================== */}
            <div className="register-section">

              <div className="register-section__header">
                <h3>
                  {t('identification')}
                </h3>

                <p>
                  {t('identificationDescription')}
                </p>
              </div>

              {/* Aadhaar */}
              <div className="auth-page__field">
                <InputField
                  label={t('aadhaarNumber')}
                  required
                  name="aadhaarNo"
                  type="tel"
                  value={form.aadhaarNo}
                  onChange={handleChange}
                  placeholder={t('aadhaarPlaceholder')}
                  error={errors.aadhaarNo}
                />
              </div>

              {/* Farmer Government ID */}
              <div className="auth-page__field">
                <InputField
                  label={t('farmerGovernmentIdOptional')}
                  name="farmerGovtId"
                  value={form.farmerGovtId}
                  onChange={handleChange}
                  placeholder={t('farmerGovernmentIdPlaceholder')}
                  error={errors.farmerGovtId}
                />
              </div>

            </div>

            {/* ======================================================
                5. BANK DETAILS
                ====================================================== */}
            <div className="register-section">

              <div className="register-section__header">
                <h3>
                  {t('bankDetails')}
                </h3>

                <p>
                  {t('bankDetailsDescription')}
                </p>
              </div>

              {/* Bank Name */}
              <div className="auth-page__field">
                <InputField
                  label={t('bankName')}
                  required
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  placeholder={t('bankNamePlaceholder')}
                  error={errors.bankName}
                />
              </div>

              {/* Bank Account Number */}
              <div className="auth-page__field">
                <InputField
                  label={t('bankAccountNumber')}
                  required
                  name="bankAccountNo"
                  type="tel"
                  value={form.bankAccountNo}
                  onChange={handleChange}
                  placeholder={t('bankAccountNumberPlaceholder')}
                  error={errors.bankAccountNo}
                />
              </div>

            </div>

            {/* ======================================================
                CREATE ACCOUNT
                ====================================================== */}
            <div className="auth-page__form-action">

              <Button
                type="submit"
                fullWidth
                disabled={submitting}
              >
                {submitting
                  ? t('creatingAccount')
                  : t('createAccount')}
              </Button>

            </div>

          </form>

          {/* ========================================================
              LOGIN LINK
              ======================================================== */}
          <div className="auth-page__divider">
            <span>
              {t('alreadyRegistered')}
            </span>
          </div>

          <div className="auth-page__register">

            <p>
              {t('alreadyHaveFarmerAccount')}
            </p>

            <Link to="/login">
              {t('loginToYourAccount')}
              <span>→</span>
            </Link>

          </div>

          {/* Security */}
          <p className="auth-page__security">
            🔒 {t('accountSecurityMessage')}
          </p>

        </div>
      </section>

    </div>
  );
}

export default FarmerRegister;