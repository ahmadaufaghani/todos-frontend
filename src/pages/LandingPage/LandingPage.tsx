import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import axios, {AxiosError} from 'axios';
import {useNavigate} from 'react-router-dom';
import "../LandingPage/LandingPage.css"

export default function LandingPage() {
    interface StatsPayload {
        total : number,
        finish : number,
        usersTotal : number
    }

    interface AxiosErrorPayload {
        message : string
    }

    const [stats, setStats] = useState<StatsPayload | null>(null);

    const navigate = useNavigate();

    const getStats = async () => {
        try {
            await axios.get<StatsPayload>("https://todosbackendapi.azurewebsites.net/")
            .then(res => {
            setStats(res.data);
            })
        } catch (err) {
            const error = (err as AxiosError<AxiosErrorPayload>).response?.data.message;
            console.log(error);
        }
    }

    useEffect(()=>{
        getStats();
    },[])

  return (
    <div className="landing-page d-flex vh-100 justify-content-center align-items-center">
      <div className="card shadow landing-page-content text-center p-5 m-3">
        <h1 className="mb-4">Welcome to To<span className="highlight">Do</span>.</h1>
        <p className="text-secondary mb-4" >Boost your day to day activities with us! So you never miss a beat about your daily activity with the help of our powerful note taking app. See our achievement below to prove that our app is beneficial.</p>
        <div className="d-flex justify-content-center mb-5">
          <div className="row text-center">
            <span className="fs-1 fw-medium mb-2">{stats?.total}</span>
            <span className="fw-semibold">Activities</span>
          </div>
          <div className="row text-center">
            <span className="fs-1 fw-medium mb-2">{stats?.finish}</span>
            <span className="fw-semibold">Finished Activities</span>
          </div>
          <div className="row text-center">
            <span className="fs-1 fw-medium mb-2">{stats?.usersTotal}</span>
            <span className="fw-semibold">Users</span>
          </div>
        </div>
        <div className="d-flex justify-content-center gap-2">
          <button className="btn btn-dark px-5 fw-semibold"  onClick={()=>navigate("/register")}>Join now!</button>
          <button className="btn btn-outline-dark fw-bold" onClick={()=>navigate("/login")}>Login</button>
        </div>
       
      </div>
    </div>
  );
}