import { useState } from "react";
import { Movie, MovieError } from "../../schema/movie.schema";
import axios, { AxiosError } from "axios";

const updateVotes = () => {
    const [movie, setMovie] = useState<Movie | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<MovieError | null>(null)

    const patchVotes = async (id: string, votes: number) => {
        setLoading(true)
        console.log(id, votes)
        try {
            const response = await axios.patch<Movie | MovieError>(`http://localhost:3000/movies/${id}/vote?vote=${votes}`);
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

    return { movie, loading, error, patchVotes }
}

export default updateVotes