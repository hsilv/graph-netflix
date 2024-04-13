import { useState } from "react"
import { MovieError, Movie } from "../../schema/movie.schema"
import axios, { AxiosError } from "axios"

const useMoviesByCollectionAndNew = () => {
    const [movies, setMovies] = useState<Movie[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<MovieError | null>(null)

    const getMoviesByCollectionAndNew = async (filter: string, limit: number, page: number) => {
        setLoading(true)
        try {
            const response = await axios.get<Movie[] | MovieError>(`http://localhost:3000/movies/new/collection?filter=${filter}&page=${page}&limit=${limit}`);
            if (response.status === 200) {
                setMovies(response.data as Movie[])
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

    return { movies, loading, error, getMoviesByCollectionAndNew }
}

export default useMoviesByCollectionAndNew