import React, { useEffect, useState } from 'react';
import axios, {AxiosError} from 'axios';
import {useNavigate} from 'react-router';
import "../LandingPage/LandingPage.css"
import { BeatLoader, BounceLoader, CircleLoader, ClipLoader, DotLoader, PacmanLoader, RotateLoader } from 'react-spinners';
import { toast } from 'react-toastify';

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
            toast.error("There is something wrong. Please reload the page!")
        }
    }

    useEffect(()=>{
        document.title = "ToDo - Landing Page"
        getStats();
    },[])

  return (
    <div className="landing-page d-flex justify-content-center">
      <div className="card shadow landing-page-content text-center p-5 m-3">
        <h4 className="mb-4 fw-bold">Welcome to To<span className="highlight">Do</span>.</h4>
        <p className="text-secondary mb-4" >Boost your day to day activities with us and say goodbye to your skipped activity.</p>
        <div className="d-flex justify-content-center mb-5">
          {!stats 
            ?
            <div className="p-4">
              <BeatLoader className="mb-3"/>
              <span className='fw-medium'>Loading the data, please wait!</span>
            </div>
            :
            <>
              <div className="row text-center">
                <span className="fs-1 fw-bold mb-2">{stats?.total}</span>
                <span className="fw-semibold">Activities</span>
              </div>
              <div className="row text-center">
                <span className="fs-1 fw-bold mb-2">{stats?.finish}</span>
                <span className="fw-semibold">Finished</span>
              </div>
              <div className="row text-center">
                <span className="fs-1 fw-bold mb-2">{stats?.usersTotal}</span>
                <span className="fw-semibold">Users</span>
              </div>
            </>
          }
        </div>
        <div className="row">
          <button className="btn btn-dark fw-semibold mb-3"  onClick={()=>navigate("/register")}>Register</button>
          <button className="btn btn-outline-dark fw-bold" onClick={()=>navigate("/login")}>Login</button>
        </div>
       
      </div>
    </div>
  );
}