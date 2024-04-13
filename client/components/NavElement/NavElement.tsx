import React from 'react'
import styles from './NavElement.module.scss'

const NavElement = ({text, onClick}) => (
  <span onClick = {onClick ? onClick : () => {} }className={`${styles.text}`}>{text}</span>
)


export default NavElement
