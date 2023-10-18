import React, { useEffect, useState } from 'react'
import requestApi from '../../helpers/api'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import DataTable from '../common/DataTable'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { formatDateTime } from '../../helpers/common'

const PostList = () => {
    const dispatch = useDispatch()
    const [posts, setPosts] = useState([])
    const [numOfPage, setNumOfPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [searchString, setSearchString] = useState('')
    const [selectedRows, setSelectedRows] = useState([])
    const [deleteItem, setDeleteItem] = useState(null)
    const [deleteType, setDeleteType] = useState('single')
    const [showModal, setShowModal] = useState(false)
    const [refresh, setRefresh] = useState(Date.now())

    const columns = [
        {
            name: "ID",
            element: row => row.id
        },
        {
            name: "Title",
            element: row => row.title
        },
        {
            name: "Summary",
            element: row => row.summary
        },
        {
            name: "Thumbnail",
            element: row => <img width="70px" src={process.env.REACT_APP_API_URL + '/' + row.thumbnail} />
        },
        {
            name: "Status",
            element: row => row.status == 1 ? "Active" : "Inactive"
        },
        {
            name: "Created at",
            element: row => formatDateTime(row.created_at)
        },
        {
            name: "Updated at",
            element: row => formatDateTime(row.updated_at)
        },
        {
            name: "Actions",
            element: row => (
                <>
                    <Link to={`/post/edit/${row.id}`} className="btn btn-primary btn-sm me-1"><i className='fa fa-pencil'></i> Edit</Link>
                    <button type="className" class="btn btn-danger btn-sm me-1" onClick={() => handleDelete(row.id)}><i className='fa fa-trash'></i> Delete</button>
                </>
            )
        },
    ]

    const handleDelete = (id) => {
        console.log("single delete ", id)
        setShowModal(true)
        setDeleteItem(id)
        setDeleteType('single')
    }

    const handleMultiDelete = () => {
        console.log("multi delete ", selectedRows)
        setShowModal(true)
        setDeleteType('multi')
    }

    const requestDeleteApi = () => {
        if(deleteType === 'single'){
            dispatch(actions.controlLoading(true))
            requestApi(`/posts/${deleteItem}`, 'DELETE', []).then(response => {
                setShowModal(false)
                setRefresh(Date.now())
                dispatch(actions.controlLoading(false))
            }).catch(err => {
                console.log(err)
                setShowModal(false)
                dispatch(actions.controlLoading(false))
            })
        }else{
            dispatch(actions.controlLoading(true))
            requestApi(`/posts/multiple?ids=${selectedRows.toString()}`, 'DELETE', []).then(response => {
                setShowModal(false)
                setRefresh(Date.now())
                setSelectedRows([])
                dispatch(actions.controlLoading(false))
            }).catch(err => {
                console.log(err)
                setShowModal(false)
                dispatch(actions.controlLoading(false))
            })
        }
    }

    useEffect(() => {
        dispatch(actions.controlLoading(true))
        let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}`
        requestApi(`/posts${query}`, 'GET', []).then(response => {
            console.log('response =>', response)
            setPosts(response.data.data)
            setNumOfPage(response.data.lastPage)
            dispatch(actions.controlLoading(false))
        }).catch(err => {
            console.log(err)
            dispatch(actions.controlLoading(false))
        })
    }, [currentPage, itemsPerPage, searchString, refresh])

    return (
        <div id='layoutSidenav_content'>
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Posts</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Post List</li>
                    </ol>
                    <div className='mb-3'>
                        <Link to='/post/add' className='btn btn-sm btn-success me-2'><i className='fa fa-plus'></i> Add new</Link>
                        {selectedRows.length > 0 && <button type='button' onClick={handleMultiDelete} className='btn btn-sm btn-danger'><i className='fa fa-trash'></i> Delete</button>}
                    </div>
                    <DataTable 
                        name="List Posts" 
                        placeholderSearch="Title"
                        data={posts} 
                        columns={columns}
                        numOfPage={numOfPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onChangeItemsPerPage={setItemsPerPage}
                        onKeySearch={(keyword) => {
                            console.log('keyword in comp', keyword)
                            setSearchString(keyword)
                        }}
                        onSelectedRows={rows => {
                            console.log("Selected rows in user list", rows)
                            setSelectedRows(rows)
                        }}
                    />
                </div>
            </main>
            <Modal show={showModal} onHide={() => setShowModal(false)} size='sm'>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure want to delete?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowModal(false)}>Close</Button>
                    <Button className='btn-danger' onClick={requestDeleteApi}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PostList