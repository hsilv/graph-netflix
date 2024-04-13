import React from 'react'
import styles from './Notifications.module.scss'
import NotificationElement from './NotificationElement'

const Notifications = () => (
  <div className={`${styles.notifications}`}>
    <NotificationElement
      src="https://logowik.com/content/uploads/images/breaking-bad-tv-series9511.logowik.com.webp"
      header="Continuar viendo"
      text="Breaking Bad"
      date="Hace 1 día"
    />
    <NotificationElement
      src="https://logowik.com/content/uploads/images/breaking-bad-tv-series9511.logowik.com.webp"
      header="Continuar viendo"
      text="Breaking Bad"
      date="Hace 1 día"
    />
    <NotificationElement
      src="https://logowik.com/content/uploads/images/breaking-bad-tv-series9511.logowik.com.webp"
      header="Continuar viendo"
      text="Breaking Bad"
      date="Hace 1 día"
    />
    <NotificationElement
      src="https://logowik.com/content/uploads/images/breaking-bad-tv-series9511.logowik.com.webp"
      header="Continuar viendo"
      text="Breaking Bad"
      date="Hace 1 día"
    />
    <NotificationElement
      src="https://logowik.com/content/uploads/images/breaking-bad-tv-series9511.logowik.com.webp"
      header="Continuar viendo"
      text="Breaking Bad"
      date="Hace 1 día"
    />
    <NotificationElement
      src="https://logowik.com/content/uploads/images/breaking-bad-tv-series9511.logowik.com.webp"
      header="Continuar viendo"
      text="Breaking Bad"
      date="Hace 1 día"
    />
  </div>
)

export default Notifications
