import React,{ useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router";
import axios, { AxiosError } from "axios";
import {toast} from "react-toastify";

interface UserPayload {
    token: string
    data: {
        id: string,
        username: string,
    }
}

interface AuthContextProps {
    user : UserPayload | null,
    token : string | null,
    register : (username: string, password: string) => void,
    login : (username : string, password: string) => void,
    isLoggedIn : () => boolean,
    logout : () => void
}

interface ApiErrorResponse {
  message: string;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);


export const AuthProvider = ({children} : {children : React.ReactNode}) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserPayload | null>(null);
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(()=> {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if(user && token) {
            setUser(JSON.parse(user));
            setToken(token);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
        setIsReady(true);
    }, []);

    const register = async (
        username: string,
        password: string
    ) => {
        try {
            await axios.post<UserPayload>(
            "https://todosbackendapi.azurewebsites.net//api/users/register",
            {
                username: username,
                password: password
            }).then(res => {
                if(res) {
                    localStorage.setItem("token", res.data.token);
                    const userObj = {
                        token:res.data.token,
                        data: {
                            id: res.data.data.id,
                            username: res.data.data.username,
                        }
                        
                    };
                    localStorage.setItem("user", JSON.stringify(userObj));
                    setToken(res.data.token!);
                    setUser(userObj!);
                    toast.success("Your registration is success!")
                    navigate("/home");
                }
            })
        } catch (err) {
            const error = (err as AxiosError<ApiErrorResponse>);
            toast.error(error.response?.data.message);
            console.log((err as Error).message);
        }
        
    }

    const login = async (username: string, password: string) => {
        try {
            await axios.post<UserPayload>(
                "https://todosbackendapi.azurewebsites.net//api/users/login",
                {
                    username: username,
                    password : password
                }
            ).then(res => {
                if(res) {
                    localStorage.setItem("token", res.data.token);
                    const userObj = {
                        token:res.data.token,
                        data: {
                            id: res.data.data.id,
                            username: res.data.data.username,
                        }  
                    };
                    localStorage.setItem("user", JSON.stringify(userObj));
                    setToken(res.data.token!);
                    setUser(userObj!);
                    toast.success("Your login attempt is success!")
                    navigate("/home", {replace:true});
                }
            })
        } catch (err) {
            const error = (err as AxiosError<ApiErrorResponse>);
            toast.error(error.response?.data.message);
            console.log((err as Error).message);
        }
    }

    const isLoggedIn = () => {
        return !!user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken("");
        navigate("/login");
  };
    
    return (
        <AuthContext.Provider value={{user, token, register, login, isLoggedIn, logout}}>
            {isReady ? children: null}
        </AuthContext.Provider>
    )

};

export const useAuth = () => React.useContext(AuthContext);