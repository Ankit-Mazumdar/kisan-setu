import React, { useState } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import InputField from '../../components/InputField.jsx';

import Button from '../../components/Button.jsx';

import {
  validateLoginForm,
  isFormValid
} from '../../utils/validators.js';

import { useAuth } from '../../context/AuthContext.jsx';

import { useTranslation } from '../../translation/useTranslation.js';

import LanguageSwitcher from '../../translation/LanguageSwitcher.jsx';

import Chatbot from '../../components/Chatbot/Chatbot.jsx';

import './Auth.css';

const initialForm = {
  identifier: '',
  password: ''
};

function FarmerLogin() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const { login } = useAuth();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const justRegistered = location.state?.registered;

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

    const validationErrors = validateLoginForm(form);

    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) return;

    setSubmitting(true);

    try {
      await login(form);
      navigate('/farmer/dashboard');
    } catch (err) {
      setServerError(
        err.message || t('loginFailed')
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">

      {/* ============================================================
          LANGUAGE SWITCHER
          Farmer pages only: English / বাংলা
          ============================================================ */}

      <LanguageSwitcher floating={true} />


      {/* ============================================================
          LEFT — BRAND / HERO
          ============================================================ */}

      <section className="auth-page__hero">

        <div className="auth-page__hero-content">

          <Link
            to="/farmer/dashboard"
            className="auth-page__brand"
          >

            <span className="auth-page__brand-icon">
              🌾
            </span>

            <span className="auth-page__brand-name">
              Kisan<span>Setu</span>
            </span>

          </Link>


          <div className="auth-page__hero-copy">

            <span className="auth-page__eyebrow">
              {t('smartProcurementForFarmers')}
            </span>

            <h1>
              {t('sellSmarter')}
              <br />

              <span>
                {t('growWithConfidence')}
              </span>
            </h1>

            <p>
              {t('loginHeroDescription')}
            </p>

          </div>


          {/* Agricultural visual area */}

          <div className="auth-page__visual">

            <div className="auth-page__sun"></div>

            <div className="auth-page__hill auth-page__hill--back"></div>

            <div className="auth-page__hill auth-page__hill--front"></div>

            <div className="auth-page__crop-field">

              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>

            </div>


            <div className="auth-page__visual-card">

              <span className="auth-page__visual-card-icon">
                ✓
              </span>

              <div>

                <strong>
                  {t('procurementMadeSimple')}
                </strong>

                <small>
                  {t('bookTrackGetPaid')}
                </small>

              </div>

            </div>


            <div className="auth-page__leaf auth-page__leaf--one">
              🌿
            </div>

            <div className="auth-page__leaf auth-page__leaf--two">
              🌱
            </div>

          </div>


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
          RIGHT — LOGIN FORM
          ============================================================ */}

      <section className="auth-page__form-section">

        <div className="auth-page__form-wrapper">


          <div className="auth-page__mobile-brand">

            <span className="auth-page__brand-icon">
              🌾
            </span>

            <span className="auth-page__brand-name">
              Kisan<span>Setu</span>
            </span>

          </div>


          <div className="auth-page__form-header">

            <span className="auth-page__form-eyebrow">
              {t('farmerAccount')}
            </span>

            <h2>
              {t('welcomeBack')}
            </h2>

            <p>
              {t('loginDescription')}
            </p>

          </div>


          {/* Success message */}

          {justRegistered && (

            <div className="auth-page__message auth-page__message--success">

              <span>
                ✓
              </span>

              <div>

                <strong>
                  {t('accountCreatedSuccessfully')}
                </strong>

                <small>
                  {t('pleaseLoginToContinue')}
                </small>

              </div>

            </div>

          )}


          {/* Server error */}

          {serverError && (

            <div className="auth-page__message auth-page__message--error">

              <span>
                !
              </span>

              <div>

                <strong>
                  {t('loginUnsuccessful')}
                </strong>

                <small>
                  {serverError}
                </small>

              </div>

            </div>

          )}


          <form
            className="auth-page__form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* Email OR Mobile Number */}

            <div className="auth-page__field">

              <InputField
                label={t('emailOrMobileNumber')}
                name="identifier"
                type="text"
                value={form.identifier}
                onChange={handleChange}
                placeholder={t('emailOrMobilePlaceholder')}
                error={errors.identifier}
                required
              />

            </div>


            {/* Password */}

            <div className="auth-page__field">

              <InputField
                label={t('password')}
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={t('enterYourPassword')}
                error={errors.password}
                required
              />

            </div>


            <div className="auth-page__forgot-password">

              <Link to="/forgot-password">
                {t('forgotPassword')}
              </Link>

            </div>


            <div className="auth-page__form-action">

              <Button
                type="submit"
                fullWidth
                disabled={submitting}
              >

                {submitting
                  ? t('loggingIn')
                  : t('login')}

              </Button>

            </div>

          </form>


          <div className="auth-page__divider">

            <span>
              {t('newToKisanSetu')}
            </span>

          </div>


          <div className="auth-page__register">

            <p>
              {t('dontHaveFarmerAccount')}
            </p>

            <Link to="/register">

              {t('createYourAccount')}

              <span>
                →
              </span>

            </Link>

          </div>


          <div className="auth-page__officer-login">

            <p>
              {t('areYouProcurementOfficer')}
            </p>

            <Link to="/officer/login">

              {t('officerLogin')}

              <span>
                →
              </span>

            </Link>

          </div>


          <p className="auth-page__security">
            🔒 {t('accountSecurityMessage')}
          </p>

        </div>

      </section>

      <Chatbot />

    </div>
  );
}

export default FarmerLogin;