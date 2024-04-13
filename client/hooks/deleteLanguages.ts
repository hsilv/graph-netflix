import { useState } from "react";
import { SpokenLanguages, MovieError } from "../../schema/movie.schema";
import axios, { AxiosError } from "axios";

const deleteLanguages = () => {
    const [languages, setLanguages] = useState<SpokenLanguages[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<MovieError | null>(null)

    const deleteLanguage = async (id: string, name: string) => {
        setLoading(true)
        console.log(id, name)
        try {
            const response = await axios.patch<SpokenLanguages[] | MovieError>(`http://localhost:3000/movies/${id}/language/delete?name=${name}`);
            if (response.status === 200) {
                setLanguages(response.data as SpokenLanguages[])
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

    return { languages, loading, error, deleteLanguage }
}

export default deleteLanguages