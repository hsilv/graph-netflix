import React from 'react'
import styles from './Card.module.scss'

const Card = ({ title, onClick }) => (
  <span className={`${styles.card}`}>
    <div className={`${styles.text}`} onClick={onClick}>
      <h1>{title}</h1>
    </div>
  </span>
)

export default Card