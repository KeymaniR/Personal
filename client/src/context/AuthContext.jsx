import { createContext, useCallback, useState, useEffect } from "react";
import { baseUrl, postRequest } from "../utils/services";


export const AuthContext = createContext();  {/*Whenever this jsx file is called just send back the user data*/}

export const AuthContextProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: ""
    });

    console.log("User", user);
    console.log("LoginInfo", loginInfo);
    
    useEffect(() =>{
        const user = localStorage.getItem("User");

        setUser(JSON.parse(user));

    }, []);

    const updateRegisterInfo = useCallback((info) =>{
        setRegisterInfo(info);
    }, []);       {/*Callback is used to optimize the function so its not called each time*/}
   
   
    const updateLoginInfo = useCallback((info) =>{
        setLoginInfo(info);
    }, []);       {/*Callback is used to optimize the function so its not called each time*/}



    const registerUser = useCallback(async (e) => {

        e.preventDefault(); //Prevent form from refreshing the page

        setIsRegisterLoading(true);
        setRegisterError(null);

       const response =  await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));

       setIsRegisterLoading(false);

       if (response.error){
            return setRegisterError(response);
       }

       //If we have our actual data and no error then set the user data and then use local storage

       localStorage.setItem("User", JSON.stringify(response));
       setUser(response); 
    }, [registerInfo]);



    const loginUser = useCallback(async(e) =>{ //Login the user

        e.preventDefault();


        setIsLoginLoading(true);
        setLoginError(null);

        const response =  await postRequest(
            `${baseUrl}/users/login`, 
            JSON.stringify(loginInfo));

        setIsLoginLoading(false);

            if(response.error){
                return setLoginError(response);
            }

            localStorage.setItem("User", JSON.stringify(response));
            setUser(response);

    }, [loginInfo]);

    const logoutUser = useCallback(() =>{
        localStorage.removeItem("User");    //Empty the localStorage on logout
        setUser(null); //When this setUse is set to null, the program routes back to the main page
},[])

    return(<AuthContext.Provider value = {{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading
    }}
    >
        {children}
    </AuthContext.Provider>
    );
};