import { useState } from "react";
import { Movie, MovieError } from "../../schema/movie.schema";
import axios, { AxiosError } from "axios";

const newMovie = () => {
    const [movie, setMovie] = useState<Movie | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<MovieError | null>(null)

    const addMovie = async (movieNew: Movie) => {
        setLoading(true)
        try {
            const response = await axios.post<Movie | MovieError>(`http://localhost:3000/movies/new`, {
                ...movieNew
            });
            if (response.status === 201) {
                setMovie(response.data as Movie)
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

    return { movie, loading, error, addMovie }
}

export default newMovie