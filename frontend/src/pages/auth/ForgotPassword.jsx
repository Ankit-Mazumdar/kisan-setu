import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/Button.jsx';

import { useTranslation } from '../../translation/useTranslation.js';
import LanguageSwitcher from '../../translation/LanguageSwitcher.jsx';

import './Auth.css';

function ForgotPassword() {

  const { t } = useTranslation();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [farmerId, setFarmerId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);


  // ==========================================
  // VERIFY FARMER MOBILE NUMBER
  // ==========================================

  async function handleSubmit(e) {

    e.preventDefault();

    setError('');
    setVerified(false);
    setResetSuccess(false);

    if (!phone) {
      setError(
        t('enterRegisteredMobile')
      );
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError(
        t('invalidMobileNumber')
      );
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/api/forgot-password/',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            phone: phone
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          t('unableToVerifyMobile')
        );

        return;
      }

      // FARMER VERIFIED SUCCESSFULLY

      setFarmerId(data.farmer_id);
      setVerified(true);

    } catch (error) {

      console.error(
        'Forgot password error:',
        error
      );

      setError(
        t('unableToConnectServer')
      );

    } finally {

      setLoading(false);

    }
  }


  // ==========================================
  // RESET FARMER PASSWORD
  // ==========================================

  async function handleResetPassword(e) {

    e.preventDefault();

    setError('');
    setResetSuccess(false);

    if (!newPassword) {

      setError(
        t('enterNewPassword')
      );

      return;
    }

    if (newPassword.length < 6) {

      setError(
        t('passwordMinimumSix')
      );

      return;
    }

    if (!confirmPassword) {

      setError(
        t('confirmNewPassword')
      );

      return;
    }

    if (newPassword !== confirmPassword) {

      setError(
        t('passwordsDoNotMatch')
      );

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/api/reset-password/',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            farmer_id: farmerId,
            new_password: newPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          t('unableToResetPassword')
        );

        return;
      }

      // PASSWORD RESET SUCCESSFUL

      setResetSuccess(true);

      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {

      console.error(
        'Reset password error:',
        error
      );

      setError(
        t('unableToConnectServer')
      );

    } finally {

      setLoading(false);

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


      {/* ==========================================
          LEFT — BRAND / HERO
          ========================================== */}

      <section className="auth-page__hero">

        <div className="auth-page__hero-content">

          <Link
            to="/login"
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
              {t('forgotHeroEyebrow')}
            </span>

            <h1>
              {t('forgotHeroTitle')}
              <br />
              <span>{t('forgotHeroTitleHighlight')}</span>
            </h1>

            <p>
              {t('forgotHeroDescription')}
            </p>

          </div>


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
                🔒
              </span>

              <div>

                <strong>
                  {t('accountSecurity')}
                </strong>

                <small>
                  {t('secureFarmerAccount')}
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


      {/* ==========================================
          RIGHT — FORGOT PASSWORD
          ========================================== */}

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
              {t('accountRecovery')}
            </span>

            <h2>
              {verified
                ? t('createNewPassword')
                : t('forgotYourPassword')}
            </h2>

            <p>
              {verified
                ? t('chooseNewPassword')
                : t('enterRegisteredMobileToContinue')}
            </p>

          </div>


          {/* ERROR MESSAGE */}

          {error && (

            <div className="auth-page__message auth-page__message--error">

              <span>
                !
              </span>

              <div>

                <strong>
                  {t('unableToContinue')}
                </strong>

                <small>
                  {error}
                </small>

              </div>

            </div>

          )}


          {/* MOBILE VERIFICATION SUCCESS */}

          {verified && (

            <div className="auth-page__message auth-page__message--success">

              <span>
                ✓
              </span>

              <div>

                <strong>
                  {t('mobileNumberVerified')}
                </strong>

                <small>
                  {t('farmerAccountFound')}
                </small>

              </div>

            </div>

          )}


          {/* PASSWORD RESET SUCCESS */}

          {resetSuccess && (

            <div className="auth-page__message auth-page__message--success">

              <span>
                ✓
              </span>

              <div>

                <strong>
                  {t('passwordResetSuccessfully')}
                </strong>

                <small>
                  {t('passwordChangedLogin')}
                </small>

              </div>

            </div>

          )}


          {/* MOBILE VERIFICATION FORM */}

          {!verified ? (

            <form
              className="auth-page__form"
              onSubmit={handleSubmit}
              noValidate
            >

              <div className="auth-page__field">

                <label>
                  {t('registeredMobileNumber')}
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {

                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ''
                      );

                    setPhone(
                      value.slice(0, 10)
                    );

                    setError('');
                    setVerified(false);

                  }}
                  placeholder={t('mobileNumberPlaceholder')}
                  maxLength="10"
                />

              </div>


              <div className="auth-page__form-action">

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                >

                  {loading
                    ? t('checking')
                    : t('continue')}

                </Button>

              </div>

            </form>

          ) : (

            /* NEW PASSWORD FORM */

            <form
              className="auth-page__form"
              onSubmit={handleResetPassword}
              noValidate
            >

              <div className="auth-page__field">

                <label>
                  {t('newPassword')}
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {

                    setNewPassword(
                      e.target.value
                    );

                    setError('');

                  }}
                  placeholder={t('newPasswordPlaceholder')}
                />

              </div>


              <div className="auth-page__field">

                <label>
                  {t('confirmNewPasswordLabel')}
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {

                    setConfirmPassword(
                      e.target.value
                    );

                    setError('');

                  }}
                  placeholder={t('confirmNewPasswordPlaceholder')}
                />

              </div>


              <div className="auth-page__form-action">

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                >

                  {loading
                    ? t('resetting')
                    : t('resetPassword')}

                </Button>

              </div>

            </form>

          )}


          <div className="auth-page__register">

            <p>
              {t('rememberYourPassword')}
            </p>

            <Link to="/login">

              {t('backToLogin')}

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

    </div>
  );
}

export default ForgotPassword;