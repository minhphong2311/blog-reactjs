import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import requestApi from '../../helpers/api'
import {toast} from 'react-toastify'

const UserUpdate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const {register, setValue, handleSubmit, formState: {errors}} = useForm()

    useEffect(() => {
        dispatch(actions.controlLoading(true))
        try{
            const getDetailUser = async() => {
                const res = await requestApi(`/users/${params.id}`, 'GET')
                console.log('Detail user ', res)
                dispatch(actions.controlLoading(false))

                const fields = ['first_name', 'last_name', 'status']
                fields.forEach((field) => setValue(field, res.data[field]))
            }
            getDetailUser();
        }catch(error){
            console.log('Detail user error ',error)
            dispatch(actions.controlLoading(false))
        }

    },[])

    const handleSubmitFormUpdate = async(data) => {
        console.log(data)
        dispatch(actions.controlLoading(true))
        try{
            const res = await requestApi(`/users/${params.id}`, 'PUT', data)
            console.log('res =>', res)
            dispatch(actions.controlLoading(false))
            toast.success('User has been updated successfully!', {position:'top-center', autoClose: 2000})
            setTimeout(() => navigate('/users'), 3000)
        }catch(error){
            console.log('error =>', error)
            dispatch(actions.controlLoading(false))
        }
    }

    return (
        <div id='layoutSidenav_content'>
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Update user</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to="/users">Users</Link></li>
                        <li className="breadcrumb-item active">Update new</li>
                    </ol>
                    <div className='card mb-4'>
                        <div className='card-header'>
                            <i className='fas fa-plus me-1'></i> Update
                        </div>
                        <div className='card-body'>
                            <div className='row mb-3'>
                                
                                <form>
                                    <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label for="inputFirstName" className="form-label">First name</label>
                                        <input {...register('first_name', {required: 'First name is required.'})} type="text" className="form-control" id="inputFirstName" />
                                        {errors.first_name && <p style={{ color: 'red' }}>{errors.first_name.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label for="inputLastName" className="form-label">Last name</label>
                                        <input {...register('last_name', {required: 'Last name is required.'})} type="text" className="form-control" id="inputLastName" />
                                        {errors.last_name && <p style={{ color: 'red' }}>{errors.last_name.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Status</label>
                                        <select {...register('status')} className='form-select'>
                                            <option value="1">Active</option>
                                            <option value="2">InActive</option>
                                        </select>
                                        {errors.status && <p style={{ color: 'red' }}>{errors.status.message}</p>}
                                    </div>
                                    <button type="submit" onClick={handleSubmit(handleSubmitFormUpdate)} className="btn btn-primary">Submit</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                    
                </div>
            </main>
        </div>
    )
}

export default UserUpdate