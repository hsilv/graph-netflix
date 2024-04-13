import { useState } from "react"
import { Genre, MovieError } from "../../schema/movie.schema"
import axios, { AxiosError } from "axios"

const useGenres = () => {
    const [genres, setGenres] = useState<Genre[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<MovieError | null>(null)

    const getGenres = async () => {
        setLoading(true)
        try {
            const response = await axios.get<Genre[] | MovieError>(`http://localhost:3000/genres`);
            if (response.status === 200) {
                setGenres(response.data as Genre[])
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

    return { genres, loading, error, getGenres }
}

export default useGenres