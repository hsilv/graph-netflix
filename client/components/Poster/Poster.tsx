import React, { useState, useEffect } from 'react'
import styles from './Poster.module.scss'
import { Movie } from '../../../schema/movie.schema'
import useGenres from '../../hooks/useGenres'
import useLanguages from '../../hooks/useLanguages'
import updateGenres from '../../hooks/updateGenres'
import updateLanguages from '../../hooks/updateLanguages'
import deleteGenres from '../../hooks/deleteGenres'
import deleteLanguages from '../../hooks/deleteLanguages'
import updateVotes from '../../hooks/updateVotes'
import updateMovie from '../../hooks/updateMovie'
import deleteMovies from '../../hooks/deleteMovies'
import newMovie from '../../hooks/newMovie'
import postImage from '../../hooks/postImage'
import { useNavigate } from 'react-router-dom';

const Poster : React.FC<Movie> = ({
  poster_path, overview, title, budget, revenue, adult, genres, status, vote_average, spoken_languages, production_companies, id, belongs_to_collection, release_date, runtime, popularity, _id
}) => {
  const [titleMovie, setTitle] = useState(title)
  const [rankingMovie, setRanking] = useState(0)
  const [overviewMovie, setOverview] = useState(overview)
  const [budgetMovie, setBudget] = useState(budget)
  const [revenueMovie, setRevenue] = useState(revenue)
  const [genresMovie, setGenres] = useState([])
  const [languagesMovie, setLanguages] = useState([])
  const [releaseDateMovie, setReleaseDate] = useState(release_date)
  const [runtimeMovie, setRuntime] = useState(runtime)
  const [popularityMovie, setPopularity] = useState(popularity)
  const [collectionMovie, setCollection] = useState(belongs_to_collection)
  const [imageMovie, setImage] = useState(poster_path)

  const { genres: allGenres, loading, error, getGenres } = useGenres()
  const { languages: allLanguages, loading: loadingLanguages, error: errorLanguages, getLanguages } = useLanguages()
  const { genres: genresUpdated, loading: loadingGenres, error: errorGenres, patchGenres } = updateGenres()
  const { languages: languagesUpdated, loading: loadingLanguagesUpdated, error: errorLanguagesUpdated, patchLanguages } = updateLanguages()
  const { genres: genresDeleted, loading: loadingGenresDeleted, error: errorGenresDeleted, deleteGenre } = deleteGenres()
  const { languages: languagesDeleted, loading: loadingLanguagesDeleted, error: errorLanguagesDeleted, deleteLanguage } = deleteLanguages()

  const { movie: votesUpdated, loading: loadingVotes, error: errorVotes, patchVotes } = updateVotes()

  const { movie: movieUpdated, loading: loadingMovie, error: errorMovie, patchMovie } = updateMovie()
  const { movie: movieDeleted, loading: loadingMovieDeleted, error: errorMovieDeleted, removeMovie: deleteMovie } = deleteMovies()
  const { movie: movieAdded, loading: loadingMovieAdded, error: errorMovieAdded, addMovie } = newMovie()

  const { image: imageUploaded, loading: loadingImage, error: errorImage, postImage: uploadImage } = postImage()

  const [genresAvailable, setGenresAvailable] = useState(allGenres)
  const [languagesAvailable, setLanguagesAvailable] = useState(allLanguages)

  const [genreSelected, setGenreSelected] = useState('')
  const [languageSelected, setLanguageSelected] = useState('')

  const [image, setImageMovie] = useState('' as unknown as File)

  const navigate = useNavigate()

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

  const setGenresMovie = () => {
    const genresArray = []
    genres?.map((genre) => {
      genresArray.push(genre.name)
    })
    setGenres(genresArray)
  }

  const setLanguagesMovie = () => {
    const languagesArray = []
    spoken_languages?.map((language) => {
      languagesArray.push(language.name)
    })
    setLanguages(languagesArray)
  }

  // Function that set genresAvailable based on are allGenres that are not in genresMovie
  const setNewGenresAvailable = () => {
    const genresAvailableArray = allGenres?.filter((genre) => {
      return !genresMovie?.includes(genre)
    })
    setGenresAvailable(genresAvailableArray)
  }

  const setNewLanguagesAvailable = () => {
    const languagesAvailableArray = allLanguages?.filter((language) => {
      return !languagesMovie?.includes(language)
    })
    setLanguagesAvailable(languagesAvailableArray)
  }

  const patchGenresMovie = ({id, name}) => {
    if (id && name) {
      console.log(id, name)
      patchGenres(id, name)
    }
  }

  const patchLanguagesMovie = ({id, name}) => {
    if (id && name) {
      console.log(id, name)
      patchLanguages(id, name)
    }
  }

  const deleteGenresMovie = ({id, name}) => {
    if (id && name) {
      console.log(id, name)
      deleteGenre(id, name)
    }
  }

  const deleteLanguagesMovie = ({id, name}) => {
    if (id && name) {
      console.log(id, name)
      deleteLanguage(id, name)
    }
  }

  const patchVotesMovie = ({id, ranking}) => {
    if (id && ranking) {
      console.log(id, ranking)
      patchVotes(id, ranking)
    }
  }

  const saveMovie = ({id, title, overview, budget, revenue, release_date, runtime, popularity, belongs_to_collection}) => {
    if (id) {
      patchMovie(id, title, overview, Number(budget), Number(revenue), release_date, Number(runtime), Number(popularity), belongs_to_collection)
    }
    else {
      // Make a random id for the new movie from 1 000 000 to 2 000 000
      const id = Math.floor(Math.random() * 1000000) + 1000000
      const newMovie : Movie = {
        title: title,
        id: id.toString(),
        overview: overview,
        budget: Number(budget),
        revenue: Number(revenue),
        release_date: release_date,
        runtime: Number(runtime),
        popularity: Number(popularity),
        poster_path: imageMovie,
        vote_average: 0,
        vote_count: 0,
      }
      console.log(title, overview, budget, revenue, release_date, runtime, popularity, belongs_to_collection)
      console.log(newMovie)
      addMovie(newMovie)
      navigate(`/movies/${id}`)
    }
  }

  const removeMovie = (id) => {
    if (id) {
      deleteMovie(id)
    }
  }

  useEffect(() => {
    setTitle(title)
    setOverview(overview)
    setBudget(budget)
    setRevenue(revenue)
    setCollection(belongs_to_collection)
    setReleaseDate(release_date)
    setRuntime(runtime)
    setPopularity(popularity)
  }, [id])
    

  useEffect(() => {
    setGenresMovie()
    setLanguagesMovie()
    getGenres()
    getLanguages()
    setNewGenresAvailable()
  }, [poster_path, overview, title, budget, revenue, adult, genres, status, vote_average, spoken_languages, production_companies, id, belongs_to_collection, release_date, runtime, popularity, genresUpdated, languagesUpdated, genresDeleted, languagesDeleted, votesUpdated])

  useEffect(() => {
    setNewGenresAvailable()
  }, [genresMovie])

  useEffect(() => {
    setNewLanguagesAvailable()
  }, [languagesMovie])

  useEffect(() => {
    console.log(image)
    if (image) {
      toBase64(image).then((response) => {
        console.log(response)
      })
      uploadImage(image)
    }
  }, [image])

  useEffect(() => {
    if (imageUploaded) {
      console.log(imageUploaded)
      setImage(imageUploaded)
    }
  }, [imageUploaded])

  return (
    <div className={styles.poster}>
      <div >
      {(id || _id) && (
        <div className={`${styles.photo}`}>
          <img
            src={poster_path || '../../../empty.jpg'}
            alt={title}
          />
          <div className={`${styles.tag}`}>
            <span>{Number(vote_average).toFixed(2)}/10</span>
          </div>
          <div className={`${styles.tag}`}>
            <span>{adult ? '18+' : '13+'}</span>
          </div>
          <div className={`${styles.tag}`}>
            <span>{status}</span>
          </div>
        </div>
      ) || (
        <div className={`${styles.photo}`}>
          <input type="file" onChange={(e) => setImageMovie(e.target.files[0])} />
        </div>
      )}
      </div>

        <div className={styles.info}>
          <div className={styles.header}>
            <div className={styles.inputGroup}>
              <span>Título</span>
              <input type="text" value={titleMovie} className={styles.title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <span>Popularidad: </span>
              <input
                type="number"
                className={styles.number}
                value={popularityMovie}
                onChange={(e) => setPopularity(e.target.value as unknown as number)}
              />
            </div>
            <div>
              {(id || _id) && (
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    className={styles.number}
                    value={rankingMovie}
                    onChange={(e) => setRanking(e.target.value as unknown as number)}
                  />
                  <button onClick={() => patchVotesMovie({id, ranking: rankingMovie})}>Votar</button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.data}>
            <div className={styles.inputGroup}>
              <span>Fecha de estreno</span>
              <input 
                type="text" 
                value={releaseDateMovie}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <span>Duración</span>
              <input 
                type="number"
                value={runtimeMovie}
                onChange={(e) => setRuntime(e.target.value)}
               />
            </div>
          </div>
          <div className={styles.collection}>
            <div className={styles.inputGroup}>
              <span>Colección</span>
              <input type="text" value={collectionMovie?.name} />
            </div>
          </div>
          <div className={styles.description}>
            <span>Descripción</span>
            <textarea  value={overviewMovie} className={`${styles.desc}`} onChange={(e) => setOverview(e.target.value)} />
          </div>
          <div>
          {(id || _id) && (
          <div className={styles.genres}>
              {genres?.map((genre) => (
                <span key={genre.id}className={`${styles.genre}`} onClick={() => deleteGenresMovie({id, name: genre.name})}>{genre.name}</span>
              ))}
              <select
                onChange={(e) => {
                  setGenreSelected(e.target.value)
                  const genre = allGenres?.find((genre) => genre.name === e.target.value)
                  if (genre) {
                    setGenres([...genresMovie, genre])
                  }
                }}
              >
                <option value="">Seleccionar</option>
                {allGenres?.map((genre) => (
                  <option key={genre.id} value={genre}>{genre}</option>
                ))}
              </select>
              <button
                onClick={() => patchGenresMovie({id, name: genreSelected})}
              >
                +
              </button>
          </div>
          )}
          </div>
          <div className={styles.money}>
            <div className={styles.inputGroup}>
              <span>Presupuesto</span>
              <input type="number" value={budgetMovie} onChange={(e) => setBudget(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <span>Ingresos</span>

              <input type="number" value={revenueMovie} onChange={(e) => setRevenue(e.target.value)} />
            </div>
          </div>
          <div>
          {(id || _id) && (
          <div className={styles.languages}>
            {spoken_languages?.map((language) => (
              <span key={language.iso_639_1} className={`${styles.language}`} onClick={() => deleteLanguagesMovie({id, name: language.name})}>{language.name}</span>
            ))}
            <select
                onChange={(e) => {
                  setLanguageSelected(e.target.value)
                  const language = allLanguages?.find((language) => language.name === e.target.value)
                  if (language) {
                    setGenres([...languagesMovie, language])
                  }
                }}
              >
                <option value="">Seleccionar</option>
                {allLanguages?.map((language) => (
                  <option value={language}>{language}</option>
                ))}
              </select>
              <button
                onClick={() => patchLanguagesMovie({id, name: languageSelected})}
              >
                +
              </button>
          </div>
          )}
          </div>
        <div className={styles.buttons}>
          <button
            type="submit"
            onClick={() => saveMovie({id, title: titleMovie, overview: overviewMovie, budget: budgetMovie, revenue: revenueMovie, release_date: releaseDateMovie, runtime: runtimeMovie, popularity: popularityMovie, belongs_to_collection: collectionMovie})}
          >
            Guardar
          </button>
          <button
            type="submit"
            onClick={() => removeMovie(id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Poster
