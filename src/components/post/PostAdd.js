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

const PostAdd = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {register, setValue, handleSubmit, trigger, formState: {errors}} = useForm()
    const [thumbnail, setThumbnail] = useState('')
    const [categories, setCategories] = useState([])

    const handleSubmitFormAdd = async (data) => {
        console.log('data form', data)
        
        let formData = new FormData()
        
        for(let key in data) {
            if(key === 'thumbnail'){
                formData.append(key, data[key][0])
            }else{
                formData.append(key, data[key])
            }
        }

        dispatch(actions.controlLoading(true))

        // requestApi('/posts', 'POST', formData, 'json', 'multipart/form-data').then(res => {
        //     console.log('res =>', res)
        //     dispatch(actions.controlLoading(false))
        //     toast.success('Post has been created successfully!', {position:'top-center', autoClose: 2000})
        //     setTimeout(() => navigate('/posts'), 3000)
        // }).catch(err => {
        //     console.log('error submit post =>', err)
        //     dispatch(actions.controlLoading(false))
        // })

        try{
            const res = await requestApi('/posts', 'POST', formData, 'json', 'multipart/form-data');
            console.log('res =>', res)
            dispatch(actions.controlLoading(false))
            toast.success('Post has been created successfully!', {position:'top-center', autoClose: 2000})
            setTimeout(() => navigate('/posts'), 3000)
        }catch(error){
            console.log('error submit post =>', error)
            dispatch(actions.controlLoading(false))
        }
    }

    useEffect(() => {
        dispatch(actions.controlLoading(true))
        requestApi('/categories', 'GET').then(res => {
            console.log('categories', res)
            setCategories(res.data)
            dispatch(actions.controlLoading(false))
        }).catch(err => {
            console.log('categories err', err)
            dispatch(actions.controlLoading(false))
        })
    },[])

    const onThumbnailChange = (event) => {
        if(event.target.files[0]){
            const file = event.target.files[0]
            let reader = new FileReader()
            reader.onload = (e) => {
                setThumbnail(reader.result)
            }
            reader.readAsDataURL(file)
        }
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
                    <h1 className="mt-4">New post</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to="/posts">Posts</Link></li>
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
                                        <label for="inputTitle" className="form-label">Title</label>
                                        <input {...register('title', {required: 'Title is required.'})} type="text" className="form-control" id="inputTitle" />
                                        {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label for="inputSummary" className="form-label">Summary</label>
                                        <textarea row="5" {...register('summary', {required: 'Summary is required.'})} className="form-control" id="inputSummary" />
                                        {errors.summary && <p style={{ color: 'red' }}>{errors.summary.message}</p>}
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
                                        <label for="inputThumbnail" className="form-label">Thumbnail</label>
                                        {thumbnail && <img src={thumbnail} className='img-thumbnail rounded mb-2' />}
                                        <div className='input-file'>
                                            <label for="file" class="btn-file btn-sm btn btn-primary">Browse files</label>
                                            <input class="form-control" type="file" {...register('thumbnail', {required: 'Thumbnail is required.', onChange:onThumbnailChange} )} id="file" accept='image/*' />
                                        </div>
                                        {errors.thumbnail && <p style={{ color: 'red' }}>{errors.thumbnail.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Category</label>
                                        <select {...register('category', {required: 'Category is required.'})} className='form-select'>
                                            <option value="">--Select a category--</option>
                                            {categories.map(cat => {return <option key={cat.id} value={cat.id}>{cat.name}</option>})}
                                        </select>
                                        {errors.status && <p style={{ color: 'red' }}>{errors.status.message}</p>}
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

export default PostAdd