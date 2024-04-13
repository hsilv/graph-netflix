import { useState } from "react"
import { Movie, MovieError, MovieProjection } from "../../schema/movie.schema"
import axios, { AxiosError } from "axios"

const useMovies = () => {
    const [movies, setMovies] = useState<MovieProjection[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<MovieError | null>(null)

    const getMovies = async () => {
        setLoading(true)
        try {
            const response = await axios.get<MovieProjection[] | MovieError>(`http://localhost:3000/movies/projections?limit=50`);
            if (response.status === 200) {
                setMovies(response.data as MovieProjection[])
            } else {
                setError(response.data as MovieError)
            }
        } catch (error) {
            const axiosError = error as AxiosError<MovieError>;
            if (axiosError && axiosError.response) {
                setError(axiosError.response.data);
            } else {
                setError({ message: error.message } as MovieError);
            }
        } finally {
            setLoading(false)
        }
    }

    return { movies, loading, error, getMovies }
}

export default useMovies