import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import requestApi from '../../helpers/api'
import {toast} from 'react-toastify'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomUploadAdapter from '../../helpers/CustomUploadAdapter'

const CategoryAdd = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {register, setValue, handleSubmit, trigger, formState: {errors}} = useForm()

    const handleSubmitFormAdd = async (data) => {
        let formData = new FormData()
        
        for(let key in data) {
            if(key === 'thumbnail'){
                formData.append(key, data[key][0])
            }else{
                formData.append(key, data[key])
            }
        }

        dispatch(actions.controlLoading(true))

        requestApi('/categories', 'POST', formData).then((res) => {
            dispatch(actions.controlLoading(false))
            toast.success('Category has been created successfully!', {position:'top-center', autoClose: 2000})
            setTimeout(() => navigate('/category'), 3000)
        }).catch((err) => {
            console.log('error submit category =>', err)
            dispatch(actions.controlLoading(false))
        })

    }

    function uploadPlugin( editor ) {
        editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
            // Configure the URL to the upload script in your back-end here!
            return new CustomUploadAdapter( loader );
        };
    }

    return (
        <div id='layoutSidenav_content'>
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">New category</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to="/category">Category</Link></li>
                        <li className="breadcrumb-item active">Add new</li>
                    </ol>
                    <div className='card mb-4'>
                        <div className='card-header'>
                            <i className='fas fa-plus me-1'></i> Add
                        </div>
                        <div className='card-body'>
                            <div className='row mb-3'>
                                
                                <form>
                                    <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label for="inputName" className="form-label">Name</label>
                                        <input {...register('name', {required: 'Name is required.'})} type="text" className="form-control" id="inputName" />
                                        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label for="inputDescription" className="form-label">Description</label>
                                        <CKEditor
                                            editor={ ClassicEditor }
                                            onReady={ editor => {
                                                // You can store the "editor" and use when it is needed.
                                                register('description', {required: 'Description is required.'})
                                            } }
                                            onChange={ ( event, editor ) => {
                                                const data = editor.getData();
                                                console.log( { event, editor, data } );
                                                setValue('description', data)
                                                trigger('description')
                                            } }
                                            onBlur={ ( event, editor ) => {
                                                console.log( 'Blur.', editor );
                                            } }
                                            onFocus={ ( event, editor ) => {
                                                console.log( 'Focus.', editor );
                                            } }
                                            config={{
                                                extraPlugins: [ uploadPlugin ],
                                            }}
                                        />
                                        {errors.description && <p style={{ color: 'red' }}>{errors.description.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Status</label>
                                        <select {...register('status')} className='form-select'>
                                            <option value="1">Active</option>
                                            <option value="2">InActive</option>
                                        </select>
                                        {errors.status && <p style={{ color: 'red' }}>{errors.status.message}</p>}
                                    </div>
                                    <button type="submit" onClick={handleSubmit(handleSubmitFormAdd)} className="btn btn-primary">Submit</button>
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

export default CategoryAdd