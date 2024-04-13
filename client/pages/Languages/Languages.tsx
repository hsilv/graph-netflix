import React from 'react'
import NavBar from '../../components/NavBar/NavBar'
import Footer from '../../components/Footer/Footer'
import Card from '../../components/Card/Card'
import styles from './Languages.module.scss'
import useLanguages from '../../hooks/useLanguages'
import { useNavigate } from 'react-router-dom'

const Languages = () => {

    const navigate = useNavigate()

    const { languages, loading, error, getLanguages } = useLanguages()

    React.useEffect(() => {
        getLanguages()
    }, [])


  return (
    <div className={`${styles.language}`}>
        <header>
            <NavBar />
        </header>
        <div className={`${styles.languages}`}>
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            {languages && languages.map((language, index) => (
                <Card key={index} title={language} onClick={() => {navigate(`/language?name=${language}`)}} />
            ))}
        </div>
        <footer>
        <Footer />
        </footer>
    </div>
  )
}

export default Languages