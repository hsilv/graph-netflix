import {useState} from "react";
import axios, { AxiosError } from "axios";

const postImage = () => {
    const [image, setImage] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const postImage = async (file: File) => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post<any>(`http://localhost:3000/files`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data)
            setImage('http://localhost:3000/files/' + response.data[0].id)
        } catch (error) {
            const axiosError = error as AxiosError<string>;
            if (axiosError && axiosError.response) {
                setError(axiosError.response.data);
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false)
        }
    }

    return { image, loading, error, postImage }
}

export default postImage