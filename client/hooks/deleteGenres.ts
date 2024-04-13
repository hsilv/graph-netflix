import { useState } from "react";
import { Genre, MovieError } from "../../schema/movie.schema";
import axios, { AxiosError } from "axios";

const deleteGenres = () => {
    const [genres, setGenres] = useState<Genre[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<MovieError | null>(null)

    const deleteGenre = async (id: string, name: string) => {
        setLoading(true)
        console.log(id, name)
        try {
            const response = await axios.patch<Genre[] | MovieError>(`http://localhost:3000/movies/${id}/genre/delete?name=${name}`);
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

    return { genres, loading, error, deleteGenre }
}

export default deleteGenres