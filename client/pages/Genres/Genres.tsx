import React from 'react'
import NavBar from '../../components/NavBar/NavBar'
import Footer from '../../components/Footer/Footer'
import Card from '../../components/Card/Card'
import styles from './Genres.module.scss'
import useGenres from '../../hooks/useGenres'
import { useNavigate } from 'react-router-dom'

const Collection = () => {

    const navigate = useNavigate()

    const { genres, loading, error, getGenres } = useGenres()

    React.useEffect(() => {
        getGenres()
    }, [])


  return (
    <div className={`${styles.language}`}>
        <header>
            <NavBar />
        </header>
        <div className={`${styles.languages}`}>
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            {genres && genres.map((language, index) => (
                <Card key={index} title={language} onClick={() => {navigate(`/genre?name=${language}`)}} />
            ))}
        </div>
        <footer>
        <Footer />
        </footer>
    </div>
  )
}

export default Collection