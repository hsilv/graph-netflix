import { useState } from "react"
import { BelongsToCollection, MovieError } from "../../schema/movie.schema"
import axios, { AxiosError } from "axios"

const useCollections = () => {
    const [collections, setCollections] = useState<BelongsToCollection[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<MovieError | null>(null)

    const getCollections = async (limit: number, page: number) => {
        setLoading(true)
        try {
            const response = await axios.get<BelongsToCollection[] | MovieError>(`http://localhost:3000/collections?page=${page}&limit=${limit}`);
            if (response.status === 200) {
                setCollections(response.data as BelongsToCollection[])
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

    return { collections, loading, error, getCollections }
}

export default useCollections