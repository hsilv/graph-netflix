import React from 'react'
import styles from './NewMovie.module.scss'
import Poster from '../../components/Poster/Poster'

const NewMovie = () => {
    return (
        <div className={styles.movie}>
        <Poster />
        </div>
    )
}

export default NewMovie