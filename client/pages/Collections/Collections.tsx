import React, {useEffect, useState} from 'react'
import NavBar from '../../components/NavBar/NavBar'
import Footer from '../../components/Footer/Footer'
import Card from '../../components/Card/Card'
import styles from './Collections.module.scss'
import useCollections from '../../hooks/useCollections'
import { useNavigate } from 'react-router-dom'

const Collection = () => {

    const navigate = useNavigate()

    const { collections, loading, error, getCollections } = useCollections()

    const [page, setPage] = useState<number>(1)

    React.useEffect(() => {
        getCollections(30, page)
    }, [page])

    const prevPage = () => {
        if (page > 1) {
          setPage(page - 1)
        }
      }
    
      const nextPage = () => {
        setPage(page + 1)
      }


  return (
    <div className={`${styles.language}`}>
        <header>
            <NavBar />
        </header>
        <div className={`${styles.languages}`}>
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            {collections && collections.map((language, index) => (
                <Card key={index} title={language} onClick={() => {navigate(`/collection?name=${language}`)}} />
            ))}
        </div>
        <div className={`${styles.pagination}`}>
            <button onClick={prevPage}>Previous</button>
            <button onClick={nextPage}>Next</button>
        </div>
        <footer>
        <Footer />
        </footer>
    </div>
  )
}

export default Collection