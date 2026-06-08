import React, { useEffect, useState } from 'react';
import axios, {AxiosError} from 'axios';
import { useAuth } from '../../utils/auth';
import "../HomePage/HomePage.css"

export default function HomePage() {
    interface TodoPayload {
        data : [
            { 
                id: number,
                content: string,
                status: string,
                user_id: number,
                created_at: string,
                updated_at: string,
                user: {
                    id: number,
                    username: string
                }
            }
        ]
    }

    interface AxiosErrorPayload {
        message : string
    }

    const [todos, setTodos] = useState<TodoPayload | null>(null);
    const [content, setContent] = useState<string>("");
    const [todoId, setTodoId] = useState<number>(0);

    const auth = useAuth();

    const getTodos = async () => {
        try {
            await axios.get<TodoPayload>("https://todosbackendapi.azurewebsites.net/api/todos", {
                headers: {
                    "Authorization": `Bearer ${auth.token}`
                }
            })
            .then(res => {
                setTodos(res.data);
            })
        } catch (err) {
            const error = (err as AxiosError<AxiosErrorPayload>).response?.data.message;
            console.log(error);
        }
    }

    const addTodo = async () => {
        try {
            await axios.post<TodoPayload>("https://todosbackendapi.azurewebsites.net/api/todos",
            {
                content : content,
                status : "undone"
            },   
            {
                headers: {
                    "Authorization": `Bearer ${auth.token}`
                }
            })
            getTodos();
            setContent("");
        } catch (err) {
            const error = (err as AxiosError<AxiosErrorPayload>).response?.data.message;
            console.log(error);
        }
    }
    

    const updateTodo = async (id : number) => {
        try {
            await axios.patch<TodoPayload>(`https://todosbackendapi.azurewebsites.net/api/todos/${id}`,
            {
               content : content
            },   
            {
                headers: {
                    "Authorization": `Bearer ${auth.token}`
                }
            })
            getTodos();
            setContent("");
            setTodoId(0);
        } catch (err) {
            const error = (err as AxiosError<AxiosErrorPayload>).response?.data.message;
            console.log(error);
        }
    }

    const updateTodoStatus = async (id : number, val : string) => {
        try {
            await axios.patch<TodoPayload>(`https://todosbackendapi.azurewebsites.net/api/todos/${id}`,
            {
                status : (val === "done") ? "undone" : "done"
            },   
            {
                headers: {
                    "Authorization": `Bearer ${auth.token}`
                }
            })
            getTodos();
        } catch (err) {
            const error = (err as AxiosError<AxiosErrorPayload>).response?.data.message;
            console.log(error);
        }
    }

    const deleteTodo = async (id : number) => {
        try {
            await axios.delete<TodoPayload>(`https://todosbackendapi.azurewebsites.net/api/todos/${id}`,  
            {
                headers: {
                    "Authorization": `Bearer ${auth.token}`
                }
            })
            getTodos();
        } catch (err) {
            const error = (err as AxiosError<AxiosErrorPayload>).response?.data.message;
            console.log(error);
        }
    }

    useEffect(()=>{
        document.title="ToDo | Homepage"
        getTodos();
    }, []);

    useEffect(()=>{
        getTodos();
    },[todos]);

  return (
    <div className="landing-page d-flex vh-100 justify-content-center align-items-center">
      <div className="card shadow landing-page-content p-5 m-3">
            <div className="d-flex justify-content-between">
                <h5 className="text-left mb-4">To-do</h5>
                <div>
                    <span className="mx-1">{auth.user?.data.username}</span>
                    <span className="mx-2">|</span>
                    <a className="text-center text-decoration-none text-secondary" href="#" onClick={()=> auth.logout()}>Logout</a>
                </div>
            </div>
            <div className="input-group input-group-sm mb-3">
                <input type="text" className="form-control" placeholder="What is your plan today?" value={content} onChange={(e) => {
                    e.preventDefault();
                    setContent(e.target.value);
                }}/>
                <button onClick={() => {
                    if(!todoId) {
                        addTodo();
                    } else {
                        updateTodo(todoId);
                    }

                }} className="btn btn-dark fw-semibold px-4">{todoId ? "Edit" : "Add"}</button>
            </div>
            <hr/>
            <div className="table-responsive">
            { todos?.data.length as number === 0 || todos === null
                            ?
                    <div className="text-center">To-do list empty!</div>
                            :
                todos?.data.map((val) => {
                    return (
                    <div key={val.id} className="d-flex justify-content-between mb-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" checked={val.status === "done"} onClick={()=>updateTodoStatus(val.id, val.status)} readOnly/>
                            <span className={"form-check-label " + (val.status==="done" ? "line" : "")}>
                                {val.content}
                            </span>
                        </div>
                        <div className="d-flex">
                            <button className="btn btn-sm fw-semibold" onClick={()=>{
                                if(!todoId) {
                                    setContent(val.content);
                                    setTodoId(val.id);
                                } else {
                                    setContent("");
                                    setTodoId(0);
                                }
                            }}>{todoId? "Cancel": "Edit"}</button>
                            <button className="btn btn-sm fw-semibold" onClick={() => deleteTodo(val.id)}>Delete</button>
                        </div>
                    </div>
                )
                }) 
            }
        </div>
      </div>
    </div>
  );
}