import React, { useEffect, useMemo } from 'react'
import styles from './Movie.module.scss'
import Poster from '../../components/Poster/Poster'
import { Movie, MovieProjection } from '../../../schema/movie.schema'
import useMovie from '../../hooks/useMovie'
import NavBar from '../../components/NavBar/NavBar'

export interface MovieComponentProps {
  movieID: string
}

const MovieComponent : React.FC<MovieComponentProps> = ({
  movieID 
}) => {
  const [actualMovie, setActualMovie] = React.useState<MovieProjection>({} as MovieProjection)
  const {movie, error, getMovie, loading} = useMovie()

  useMemo(async () => {
    await getMovie(movieID)
    if (movie) {
      setActualMovie(movie)
    }
  }, [movie])


/* 
  useEffect(() => {
    setActualMovie({...movie})
  }, [
    movie
  ]) */

  return (
  <div className={styles.movie}>
    <header>
      <NavBar />
    </header>
    
    <Poster
    {...actualMovie}
    />
  </div>)
}

export default MovieComponent
