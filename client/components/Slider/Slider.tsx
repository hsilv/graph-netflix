import React, { useState, useEffect, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos'
import styles from './Slider.module.scss'
import Movie from '../Movie/Movie'
import useMovies from '../../hooks/useMovies'

interface RandomMovies {
  index: number;
  imgSrc: string;
}


const Slider = ({ title }) => {

  

  const [slideNumber, setSlideNumber] = useState<number>(0)
  const [showExplore, setShowExplore] = useState<boolean>(false)
  const moviesRef = useRef<HTMLDivElement | null>(null);

  const [randomMovies, setRandomMovies] = useState<RandomMovies[]>([])

  const moveLeft = (distance) => {
    setSlideNumber(slideNumber - 1)
    return `translateX(${237 + distance}px)`
  }

  const moveRight = (distance) => {
    setSlideNumber(slideNumber + 1)
    return `translateX(${-237 + distance}px)`
  }

  const handleClick = (direction) => {
    if (moviesRef.current){
      const distance = moviesRef.current.getBoundingClientRect().x - 60
      moviesRef.current.style.transform = direction === 'left'
        ? moveLeft(distance) : moveRight(distance)

    }
  }

  const { movies, loading, error, getMovies } = useMovies()

  useMemo(() => {
    getMovies()
  }, [])

  return (
    <div className={`${styles.slider}`}>
      <div
        className={`${styles.titleContainer}`}
        onMouseOver={() => setShowExplore(true)}
        onMouseLeave={() => setShowExplore(false)}
        onFocus={() => setShowExplore(false)}
      >
        <span className={`${styles.title}`}>
          {title}
        </span>
        {
            showExplore
              ? (
                <div
                  className={`${styles.exploreContainer}`}
                >
                  <span className={`${styles.explore}`}>Explorar todos</span>
                  <ArrowForwardIcon
                    className={`${styles.arrowExplore}`}
                    style={{
                      fontSize: '1em',
                      marginLeft: '5px',
                      marginTop: '-1px',
                    }}
                  />
                </div>
              )
              : null
        }
      </div>
      <div className={`${styles.container}`}>
        {
          slideNumber > 0
            ? <ArrowBackIosIcon className={`${styles.arrow} ${styles.left}`} onClick={() => handleClick('left')} />
            : null
        }
        <div className={`${styles.movies}`} ref={moviesRef}>
          {
            movies?.map((movie, index) => {
              return (
                <Movie
                  key={index}
                  index={index}
                  imgSrc={movie.poster_path}
                  title={movie.title}
                  tagline={movie.tagline || ''}
                  runtime={movie.runtime}
                  genres={movie.genres}
                  vote_average={movie.vote_average}
                  spoken_languages={movie.spoken_languages}
                  id={movie.id}   
                            />
              )
            })
          }
        </div>
        {
          slideNumber < 5
            ? <ArrowForwardIcon className={`${styles.arrow} ${styles.right}`} onClick={() => handleClick('right')} />
            : null
        }
      </div>
    </div>
  )
}

Slider.propTypes = {
  title: PropTypes.string.isRequired,
}

export default Slider
