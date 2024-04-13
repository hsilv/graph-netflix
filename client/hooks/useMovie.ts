import { useState } from "react"
import { Movie, MovieError, MovieProjection } from "../../schema/movie.schema"
import axios, { AxiosError } from "axios"

const useMovie = () => {
    const [movie, setMovie] = useState<MovieProjection | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<MovieError | null>(null)

    const getMovie = async (id: string | number) => {
        setLoading(true)
        try {
            const response = await axios.get<MovieProjection | MovieError>(`http://localhost:3000/movies/${id}`);
            if (response.status === 200) {
                setMovie(response.data as MovieProjection)
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

    return { movie, loading, error, getMovie }
}

export default useMovie