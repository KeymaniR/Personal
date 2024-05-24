//Performing our http request (Post and Get Requests)

export const baseUrl = "http://localhost:5000/api"

export const postRequest = async(url, body) => { //This is how the front-end is communicating with the backend 
     const response = await fetch(url, {
        method: "POST", //Must specify it to be a post request because otherwise it will think its a GET request
        headers: {
            "Content-Type" : "application/json"
        },
        body
     })

     const data  = await response.json();

     if(!response.ok){
        let message

        if(data?.message){
            message = data.message;
        }else{
            message = data;
        }
        return {error: true, message};
     }
     return data;
};

export const getRequest = async(url) =>{ // Get info back from our server side using get request

    const response = await fetch(url);

    const data = await response.json();

    if(!response.ok){
        let message = "An error occured...";

        if(data?.message){
            message = data.message;
        }

        return {error: true, message};
    }

    return data;



}