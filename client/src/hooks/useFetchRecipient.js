//How to get the other user
import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) =>{
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null)

    const recipientID = chat?.members?.find((id) => id !== user?._id) //Since we have access to the members array. Now we must find the ID not equal to current user id

    useEffect(() => {
        const getUser = async() =>{

            if (!recipientID) return null;

            const response = await getRequest(`${baseUrl}/users/find/${recipientID}`);

            if(response.error){
                return setError(response);
            }

            setRecipientUser(response);

        }

        getUser();
    }, [recipientID]);

    return {recipientUser};
};