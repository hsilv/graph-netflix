import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar/NavBar'
import Footer from '../../components/Footer/Footer'
import MovieCard from '../../components/Movie/Movie'
import useMoviesByType from '../../hooks/useMoviesByType'
import useMoviesByGenreAndPopular from '../../hooks/useMoviesByGenreAndPopular'
import useMoviesByGenreAndNew from '../../hooks/useMoviesByGenreAndNew'
import useMoviesByCollectionAndNew from '../../hooks/useMoviesByCollectionAndNew'
import useMoviesByCollectionAndPopular from '../../hooks/useMoviesByCollectionAndPopular'
import useMoviesByLanguageAndNew from '../../hooks/useMoviesByLanguageAndNew'
import useMoviesByLanguageAndPopular from '../../hooks/useMoviesByLanguageAndPopular'
import styles from './Movies.module.scss'
import { MovieError, Movie } from "../../schema/movie.schema"

const Movies = ({type, filter}) => {

  const [movies , setMovies] = useState<Movie[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<MovieError | null>(null)

  const [page, setPage] = useState<number>(1)

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const nextPage = () => {
    setPage(page + 1)
  }


  const {
    movies: moviesByType, loading: loadingByType, error: errorByType, getMoviesByType
  } = useMoviesByType()

  const {
    movies: moviesByGenrePopular, loading: loadingByGenrePopular, error: errorByGenrePopular, getMoviesByGenreAndPopular
  } = useMoviesByGenreAndPopular()

  const {
    movies: moviesByGenreNew, loading: loadingByGenreNew, error: errorByGenreNew, getMoviesByGenreAndNew
  } = useMoviesByGenreAndNew()

  const {
    movies: moviesByCollectionNew, loading: loadingByCollectionNew, error: errorByCollectionNew, getMoviesByCollectionAndNew
  } = useMoviesByCollectionAndNew()

  const {
    movies: moviesByCollectionPopular, loading: loadingByCollectionPopular, error: errorByCollectionPopular, getMoviesByCollectionAndPopular
  } = useMoviesByCollectionAndPopular()

  const {
    movies: moviesByLanguageNew, loading: loadingByLanguageNew, error: errorByLanguageNew, getMoviesByLanguageAndNew
  } = useMoviesByLanguageAndNew()

  const {
    movies: moviesByLanguagePopular, loading: loadingByLanguagePopular, error: errorByLanguagePopular, getMoviesByLanguageAndPopular
  } = useMoviesByLanguageAndPopular()



  const [sort, setSort] = useState<string>('')

  useEffect(() => {
    const set = async () => {
      getMoviesByType(type as string, filter as string, 30, page)
      setMovies(moviesByType)
      setLoading(loadingByType)
      setError(errorByType)  
    } 
    if (type && filter) {
      set()
    }
  }, [])

  useEffect(() => {
    setMovies(moviesByType)
    setLoading(loadingByType)
  }, [moviesByType, loadingByType])

  useEffect(() => {
    setMovies(moviesByGenreNew)
    setLoading(loadingByGenreNew)
  }, [moviesByGenreNew, loadingByGenreNew])

  useEffect(() => {
    setMovies(moviesByGenrePopular)
    setLoading(loadingByGenrePopular)
  }, [moviesByGenrePopular, loadingByGenrePopular])

  useEffect(() => {
    setMovies(moviesByCollectionPopular)
    setLoading(loadingByCollectionPopular)
  }, [moviesByCollectionPopular, loadingByCollectionPopular])

  useEffect(() => {
    setMovies(moviesByCollectionNew)
    setLoading(loadingByCollectionNew)
  }, [moviesByCollectionNew, loadingByCollectionNew])

  useEffect(() => {
    setMovies(moviesByLanguagePopular)
    setLoading(loadingByLanguagePopular)
  }, [moviesByLanguagePopular, loadingByLanguagePopular])

  useEffect(() => {
    setMovies(moviesByLanguageNew)
    setLoading(loadingByLanguageNew)
  }, [moviesByLanguageNew, loadingByLanguageNew])

  useEffect(() => {
    if (sort === 'popular' && type === 'genre') {
      getMoviesByGenreAndPopular(filter as string, 30, page)
      setMovies(moviesByGenrePopular)
      setLoading(loadingByGenrePopular)
      setError(errorByGenrePopular)
    }
    else if (sort === 'newest' && type === 'genre') {
      getMoviesByGenreAndNew(filter as string, 30, page)
      setMovies(moviesByGenreNew)
      setLoading(loadingByGenreNew)
      setError(errorByGenreNew)
    }
    else if (sort === 'popular' && type === 'collection') {
      getMoviesByCollectionAndPopular(filter as string, 30, page)
      setMovies(moviesByCollectionPopular)
      setLoading(loadingByCollectionPopular)
      setError(errorByCollectionPopular)
    }
    else if (sort === 'newest' && type === 'collection') {
      getMoviesByCollectionAndNew(filter as string, 30, page)
      setMovies(moviesByCollectionNew)
      setLoading(loadingByCollectionNew)
      setError(errorByCollectionNew)
    }
    else if (sort === 'popular' && type === 'language') {
      getMoviesByLanguageAndPopular(filter as string, 30, page)
      setMovies(moviesByLanguagePopular)
      setLoading(loadingByLanguagePopular)
      setError(errorByLanguagePopular)
    }
    else if (sort === 'newest' && type === 'language') {
      getMoviesByLanguageAndNew(filter as string, 30, page)
      setMovies(moviesByLanguageNew)
      setLoading(loadingByLanguageNew)
      setError(errorByLanguageNew)
    }
    else {
      getMoviesByType(type as string, filter as string, 30, page)
      setMovies(moviesByType)
      setLoading(loadingByType)
      setError(errorByType)
    }
  }, [sort, type, page])


  return (
    <div className={`${styles.movies}`}>
      <header>
        <NavBar />
      </header>
      <div className={`${styles.sort}`}>
        <label htmlFor="sort">Sort by:</label>
        <select name="sort" id="sort" onChange={(e) => setSort(e.target.value)}>
          <option value="">Select</option>
          <option value="popular">Best rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>
      <div className={`${styles.movie}`}>
          {loading && <p>Loading...</p>}
          {error && <p>{error.message}</p>}
          {movies?.map((movie) => (
            <MovieCard
            imgSrc={movie.poster_path}
            title={movie.title}
            tagline={movie.tagline || ''}
            runtime={movie.runtime}
            genres={movie.genres}
            vote_average={movie.vote_average}
            spoken_languages={movie.spoken_languages}
            id={movie.id}   
                      />
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

export default Movies