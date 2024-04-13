import { useState } from "react";
import { Movie, MovieError } from "../../schema/movie.schema";
import axios, { AxiosError } from "axios";

const updateMovie = () => {
    const [movie, setMovie] = useState<Movie | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<MovieError | null>(null)

    const patchMovie = async (id: string, title: string, overview: string, budget: number, revenue: number, releaseDate: string, runtime: number, popularity: number, collection: string) => {
        setLoading(true)
        try {
            const response = await axios.patch<Movie | MovieError>(`http://localhost:3000/movies/${id}/update`, {
                title: title,
                overview: overview,
                budget: budget,
                revenue: revenue,
                release_date: releaseDate,
                runtime: runtime,
                popularity: popularity,
            });
            if (response.status === 200) {
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

    return { movie, loading, error, patchMovie }
}

export default updateMovie