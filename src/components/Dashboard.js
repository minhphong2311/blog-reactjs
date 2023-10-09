import React, { useEffect, useState } from "react";
import requestApi from "../helpers/api";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as actions from "../redux/actions"

const Dashboard = () => {
    const dispatch = useDispatch()
    const [dashboardData , setDashboardData] = useState({})

    useEffect(() => {
        // requestApi('/users', 'GET', []).then(response => {
        //     console.log(response)
        //     setDashboardData({
        //         ...dashboardData, totalUser: response.data.total
        //     })
        // }).catch(err => {
        //     console.log(err)
        // })

        const promiseUser = requestApi('/users', 'GET')
        const promisePost = requestApi('/posts', 'GET')
        dispatch(actions.controlLoading(true))
        Promise.all([promiseUser, promisePost]).then((res) => {
            console.log('Dashboard', res)
            setDashboardData({
                ...dashboardData, totalUser: res[0].data.total, totalPost: res[1].data.total
            })
            dispatch(actions.controlLoading(false))
        }).catch(error => {
            console.log('Dashboard error', error)
            dispatch(actions.controlLoading(false))
        })
    }, [])

    return (
    <div id="layoutSidenav_content">
        <main>
            <div className="container-fluid px-4">
                <h1 className="mt-4">Dashboard</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Dashboard</li>
                </ol>
                <div className="row">
                    <div className="col-xl-3 col-md-6">
                        <div className="card bg-primary text-white mb-4">
                            <div className="card-body">Total Users
                            {dashboardData.totalUser && (<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {dashboardData.totalUser}
                            </span>)}
                            
                            </div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/users">View Details</Link>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <div className="card bg-warning text-white mb-4">
                            <div className="card-body">Total Posts
                            {dashboardData.totalPost && (<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {dashboardData.totalPost}
                            </span>)}
                            </div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/posts">View Details</Link>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-6">
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-chart-area me-1"></i>
                                Area Chart Example
                            </div>
                            <div className="card-body"><canvas id="myAreaChart" width="100%" height="40"></canvas></div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-chart-bar me-1"></i>
                                Bar Chart Example
                            </div>
                            <div className="card-body"><canvas id="myBarChart" width="100%" height="40"></canvas></div>
                        </div>
                    </div>
                </div>
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-table me-1"></i>
                        DataTable Example
                    </div>
                    
                </div>
            </div>
        </main>
        <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
                <div className="d-flex align-items-center justify-content-between small">
                    <div className="text-muted">Copyright &copy; Your Website 2021</div>
                    <div>
                        <a href="#">Privacy Policy</a>
                        &middot;
                        <a href="#">Terms &amp; Conditions</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
    );
};

export default Dashboard;
