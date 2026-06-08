import { useState, useEffect } from "react"
import { useAuth } from "../../utils/auth";
import { ClipLoader } from "react-spinners";
import {NavLink} from 'react-router';

import "../Register/Register.css";

export default function Register() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const auth = useAuth();

    const processRegister = () => {
        auth.register(username, password);
        setTimeout(()=> {
                setIsLoading(false);
        },2500)
    }

    useEffect(() => {
        document.title= "ToDo - Register"
    },[])

    return (
        <div className="login-page d-flex vh-100 justify-content-center align-items-center">
      <div className="card shadow login-page-content p-5 m-3">
        <h4 className="mb-4 fw-semibold text-center">Register</h4>
        <div>
            <label className="form-label fw-semibold fs-7">Username</label>
            <br />
            <input type="text" className="form-control" placeholder="Enter your username" onChange={(e) => {
                e.preventDefault();
                setUsername(e.target.value);
            }}/>
        </div>
        <br />
        <div className="mb-4">
            <label className="form-label fw-semibold fs-7">Password</label>
            <br />
            <input type="password" className="form-control" placeholder="Enter your password" onChange={(e) => {
                e.preventDefault();
                setPassword(e.target.value);
            }} onKeyDown={(e) => {
                    if(e.key === "Enter") {
                        setIsLoading(true);
                        processRegister();
                    }
                }}/>
        </div>
        <div className="mb-3">
          <button className="btn btn-dark w-100 fw-bold" onClick={()=> {
            setIsLoading(!isLoading);
            processRegister();
            
          }}>{
                isLoading === true
                    ?
                    <ClipLoader
                        color={"#ffff"}
                        loading={isLoading}
                        size={15}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                    :
                <span>Register</span> 
            }
            </button>
        </div>
        <span>Already have an account? <NavLink to="/login" className="text-decoration-none">Login</NavLink></span>
      </div>
    </div>
    )
}