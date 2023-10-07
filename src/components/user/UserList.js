import React, { useEffect, useState } from 'react'
import requestApi from '../../helpers/api'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import DataTable from '../common/DataTable'

const UserList = () => {
    const dispatch = useDispatch()
    const [users, setUsers] = useState([])
    const [numOfPage, setNumOfPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(1)
    const [searchString, setSearchString] = useState('')

    const columns = [
        {
            name: "ID",
            element: row => row.id
        },
        {
            name: "First Name",
            element: row => row.first_name
        },
        {
            name: "Last Name",
            element: row => row.last_name
        },
        {
            name: "Email",
            element: row => row.email
        },
        {
            name: "Created at",
            element: row => row.created_at
        },
        {
            name: "Updated at",
            element: row => row.updated_at
        },
        {
            name: "Actions",
            element: row => (
                <>
                    <button type="button" class="btn btn-primary btn-sm me-1"><i className='fa fa-pencil'></i> Edit</button>
                    <button type="button" class="btn btn-danger btn-sm me-1"><i className='fa fa-trash'></i> Delete</button>
                </>
            )
        },
    ]

    useEffect(() => {
        dispatch(actions.controlLoading(true))
        let query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}`
        requestApi(`/users${query}`, 'GET', []).then(response => {
            console.log('response =>', response)
            setUsers(response.data.data)
            setNumOfPage(response.data.lastPage)
            dispatch(actions.controlLoading(false))
        }).catch(err => {
            console.log(err)
            dispatch(actions.controlLoading(false))
        })
    }, [currentPage, itemsPerPage, searchString])

    return (
        <div id='layoutSidenav_content'>
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Tables</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><a href="index.html">Dashboard</a></li>
                        <li className="breadcrumb-item active">Tables</li>
                    </ol>
                    <DataTable 
                        name="List Users" 
                        data={users} 
                        columns={columns}
                        numOfPage={numOfPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onChangeItemsPerPage={setItemsPerPage}
                        onKeySearch={(keyword) => {
                            console.log('keyword in comp', keyword)
                            setSearchString(keyword)
                        }}
                    />
                </div>
            </main>
        </div>
    )
}

export default UserList