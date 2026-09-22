import React, { useEffect, useState } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

import api from '../services/authService.js';

import Button from './Button.jsx';

import { useTranslation } from '../translation/useTranslation.js';
import LanguageSwitcher from '../translation/LanguageSwitcher.jsx';

import './navbar.css';


/**
 * Navbar for logged-in farmer screens.
 *
 * Reads the current farmer + logout action from AuthContext.
 * Loads farmer notifications from the backend.
 * It does not own any authentication logic itself.
 */

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const { farmer, logout } = useAuth();

  const { t, language } = useTranslation();

  const navigate = useNavigate();

  const location = useLocation();


  /*
   * Load farmer notifications
   */

  useEffect(() => {

    if (!farmer?.farmerId) {
      return;
    }

    // Load notifications immediately
    loadNotifications();

    // Check for new notifications every 10 seconds
    const notificationInterval = setInterval(() => {
      loadNotifications();
    }, 10000);

    // Stop checking when navbar is removed
    return () => {
      clearInterval(notificationInterval);
    };

  }, [farmer?.farmerId]);


  async function loadNotifications() {

    try {

      const response = await api.get(
        `/farmer/${farmer.farmerId}/notifications/`
      );

      setNotifications(
        response.data
      );

    } catch (error) {

      console.error(
        'Unable to load notifications:',
        error
      );

      setNotifications([]);

    }

  }


  /*
   * Count unread notifications
   */

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.is_read
    ).length;


  /*
   * Logout
   */

  const handleLogout = () => {

    setMenuOpen(false);

    setNotificationOpen(false);

    logout();

    navigate('/login');

  };


  /*
   * Active navigation link
   */

  const isActive = (path) =>
    location.pathname === path;


  /*
   * Open / close notification box
   */

  const toggleNotifications = () => {

    setNotificationOpen(
      (open) => !open
    );

  };


  /*
   * Mark notification as read
   */

  async function handleNotificationClick(
    notification
  ) {

    try {

      if (!notification.is_read) {

        await api.put(
          `/notification/${notification.notification_id}/read/`
        );

      }

      setNotifications(
        (currentNotifications) =>
          currentNotifications.map(
            (item) =>
              item.notification_id ===
              notification.notification_id
                ? {
                    ...item,
                    is_read: true
                  }
                : item
          )
      );

    } catch (error) {

      console.error(
        'Unable to mark notification as read:',
        error
      );

    }

  }


  /*
   * Format notification date/time
   */

/*
 * Format notification date/time
 */

const formatNotificationDate = (date) => {

  if (!date) {
    return '';
  }

  return new Date(date).toLocaleString(
    language === 'bn' ? 'bn-IN' : 'en-IN',
    {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
  );

};


  /*
   * Navigation links
   */

  const links = (

    <>

      <Link
        to="/farmer/dashboard"
        className={`navbar-link ${
          isActive('/farmer/dashboard')
            ? 'navbar-link--active'
            : ''
        }`}
        onClick={() =>
          setMenuOpen(false)
        }
      >

        <span className="navbar-link__icon">
          ⌂
        </span>

        {t('dashboard')}

      </Link>


      <Link
        to="/farmer/profile"
        className={`navbar-link ${
          isActive('/farmer/profile')
            ? 'navbar-link--active'
            : ''
        }`}
        onClick={() =>
          setMenuOpen(false)
        }
      >

        <span className="navbar-link__icon">
          ◉
        </span>

        {t('profile')}

      </Link>

    </>

  );


  return (

    <header className="navbar">

      <div className="navbar__inner">


        {/* Brand */}

        <Link
          to="/farmer/dashboard"
          className="navbar-brand"
          onClick={() =>
            setMenuOpen(false)
          }
        >

          <span className="navbar-brand__icon">
            🌾
          </span>

          <span className="navbar-brand__text">

            Kisan<span>Setu</span>

          </span>

        </Link>


        {/* Desktop Navigation */}

        <nav className="navbar__desktop">

          <div className="navbar__links">

            {links}

          </div>


          <div className="navbar__account">


            {/* Language */}

            <LanguageSwitcher floating={false} />


            {/* Notification */}

            <div className="navbar__notification">

              <button
                className="navbar__notification-button"
                onClick={toggleNotifications}
                aria-label={t('notifications')}
              >

                <span className="navbar__notification-icon">
                  🔔
                </span>


                {unreadCount > 0 && (

                  <span className="navbar__notification-badge">

                    {unreadCount}

                  </span>

                )}

              </button>


              {notificationOpen && (

                <div className="navbar__notification-dropdown">

                  <div className="navbar__notification-header">

                    <strong>
                      {t('notifications')}
                    </strong>

                    {unreadCount > 0 && (

                      <span>
                        {t('unreadNotifications', {
                          count: unreadCount
                        })}
                      </span>

                    )}

                  </div>


                  {notifications.length === 0 ? (

                    <div className="navbar__notification-empty">

                      {t('noNotifications')}

                    </div>

                  ) : (

                    <div className="navbar__notification-list">

                      {notifications.map(
                        (notification) => (

                          <button
                            key={
                              notification.notification_id
                            }
                            className={`navbar__notification-item ${
                              !notification.is_read
                                ? 'navbar__notification-item--unread'
                                : ''
                            }`}
                            onClick={() =>
                              handleNotificationClick(
                                notification
                              )
                            }
                          >

                            <div className="navbar__notification-item-title">

                              <span>
                                {notification.title}
                              </span>

                              {!notification.is_read && (

                                <span className="navbar__notification-dot">
                                </span>

                              )}

                            </div>


                            <p>

                              {
                                notification.message
                              }

                            </p>


                            <small>

                              {
                                formatNotificationDate(
                                  notification.created_at
                                )
                              }

                            </small>

                          </button>

                        )
                      )}

                    </div>

                  )}

                </div>

              )}

            </div>


            {/* Farmer Account */}

            <div className="navbar__farmer">

              <div className="navbar__avatar">

                {(farmer?.fullName || 'Farmer')
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div className="navbar__farmer-info">

                <span className="navbar__farmer-label">

                  {t('farmer')}

                </span>

                <span className="navbar__farmer-name">

                  {farmer?.fullName || t('farmer')}

                </span>

              </div>


              <span className="navbar__arrow">
                ⌄
              </span>

            </div>


            <Button
              variant="outline"
              onClick={handleLogout}
              className="navbar__logout"
            >

              {t('logout')}

            </Button>

          </div>

        </nav>


        {/* Mobile Menu Button */}

        <button
          className="navbar__toggle"
          onClick={() =>
            setMenuOpen(
              (open) => !open
            )
          }
          aria-label={t('toggleNavigation')}
          aria-expanded={menuOpen}
        >

          <span></span>
          <span></span>
          <span></span>

        </button>

      </div>


      {/* Mobile Navigation */}

      {menuOpen && (

        <div className="navbar__mobile">

          <nav className="navbar__mobile-links">

            {links}

          </nav>


          <div className="navbar__mobile-account">


            {/* Language */}

            <LanguageSwitcher floating={false} />


            {/* Mobile Notification */}

            <div className="navbar__notification navbar__notification--mobile">

              <button
                className="navbar__notification-button"
                onClick={toggleNotifications}
                aria-label={t('notifications')}
              >

                <span className="navbar__notification-icon">
                  🔔
                </span>


                {unreadCount > 0 && (

                  <span className="navbar__notification-badge">

                    {unreadCount}

                  </span>

                )}

              </button>


              {notificationOpen && (

                <div className="navbar__notification-dropdown">

                  <div className="navbar__notification-header">

                    <strong>
                      {t('notifications')}
                    </strong>

                    {unreadCount > 0 && (

                      <span>
                        {t('unreadNotifications', {
                          count: unreadCount
                        })}
                      </span>

                    )}

                  </div>


                  {notifications.length === 0 ? (

                    <div className="navbar__notification-empty">

                      {t('noNotifications')}

                    </div>

                  ) : (

                    <div className="navbar__notification-list">

                      {notifications.map(
                        (notification) => (

                          <button
                            key={
                              notification.notification_id
                            }
                            className={`navbar__notification-item ${
                              !notification.is_read
                                ? 'navbar__notification-item--unread'
                                : ''
                            }`}
                            onClick={() =>
                              handleNotificationClick(
                                notification
                              )
                            }
                          >

                            <div className="navbar__notification-item-title">

                              <span>
                                {notification.title}
                              </span>

                              {!notification.is_read && (

                                <span className="navbar__notification-dot">
                                </span>

                              )}

                            </div>


                            <p>

                              {
                                notification.message
                              }

                            </p>


                            <small>

                              {
                                formatNotificationDate(
                                  notification.created_at
                                )
                              }

                            </small>

                          </button>

                        )
                      )}

                    </div>

                  )}

                </div>

              )}

            </div>


            {/* Mobile Farmer */}

            <div className="navbar__farmer">

              <div className="navbar__avatar">

                {(farmer?.fullName || 'Farmer')
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div className="navbar__farmer-info">

                <span className="navbar__farmer-label">

                  {t('farmer')}

                </span>

                <span className="navbar__farmer-name">

                  {farmer?.fullName || t('farmer')}

                </span>

              </div>

            </div>


            <Button
              variant="outline"
              onClick={handleLogout}
              className="navbar__mobile-logout"
            >

              {t('logout')}

            </Button>

          </div>

        </div>

      )}

    </header>

  );

}


export default Navbar;