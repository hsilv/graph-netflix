import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import styles from './Movie.module.scss'

const Movie = ({ index, imgSrc, title, tagline, runtime, genres, vote_average, spoken_languages, id }) => {
  const [showInfo, setShowInfo] = useState(false)
  const random = Math.floor(Math.random() * runtime) + 1
  const navigate = useNavigate();

  return (
    <div
      className={`${styles.movie}`}
      style={{ left: showInfo ? (index * 233.5 + index * 3.5) : undefined }}
      onMouseEnter={() => setShowInfo(true)}
      onClick={() => {navigate(`/movies/${id}`)}}
    >
      <img
        src={imgSrc}
        alt=""
      />
      {
            showInfo
              ? (
                <div className={`${styles.info}`}>
                  <div className={`${styles.chapterInfo}`}>
                    <span className={`${styles.episode}`}>{title}</span>
                    <span className={`${styles.title}`}>{tagline}</span>
                  </div>
                  <div className={`${styles.genres}`}>
                    {
                      genres.map((genre) => (
                        <span key={genre.name} className={`${styles.genre}`}>{genre.name}</span>
                      ))
                    }
                  </div>
                  <div className={`${styles.popularity}`}>
                    <span className={`${styles.popularityText}`}>Punteo: {Number(vote_average).toFixed(2)}</span>
                  </div>
                  <div className={`${styles.duration}`}>
                    <progress value={random} max={runtime} className={`${styles.colored}`} />
                    <span className={`${styles.time}`}> {random} de {runtime} min </span>
                  </div>
                  <div className={`${styles.languages}`}>
                    {
                      spoken_languages.map((language) => (
                        <span key={language.name} className={`${styles.language}`}>{language.name}</span>
                      ))
                    }
                    </div>
                </div>
              ) : null
        }
    </div>
  )
}

export default Movie
