import React from 'react'
import LiveSearch from './LiveSearch';

const DataTable = (props) => {
    const { name, data, columns, currentPage, numOfPage, onPageChange, onChangeItemsPerPage, onKeySearch } = props;

    const renderHeaders = () => {
        return columns.map((col, index) => <th key={index}>{col.name}</th>)
    }

    const renderData = () =>{
        return (
            data.map((item, index) => (
                <tr key={index}>
                    {
                        columns.map((col, ind) => <td key={ind}>{col.element(item)}</td>)
                    }
                </tr>
            ))
        )
    }

    const renderPagination = () => {
        const pagination = [];
        const nextPage = currentPage + 1 > numOfPage ? null : currentPage + 1;
        const prevPage = currentPage - 1 ? null : currentPage - 1;

        pagination.push(
            <li key="prev" className={prevPage ? "page-item" : "page-item disabled"}>
                <button className='page-link' onClick={() => onPageChange(prevPage)}>&laquo;</button>
            </li>
        )

        for(let i = 1; i <= numOfPage; i++) {
            pagination.push(
                <li key={i} className={currentPage === i ? "page-item active" : "page-item"}>
                    <button className='page-link' onClick={() => onPageChange(i)}>{i}</button>
                </li>
            )
        }

        pagination.push(
            <li key="next" className={nextPage ? "page-item" : "page-item disabled"}>
                <button className='page-link' onClick={() => onPageChange(nextPage)}>&raquo;</button>
            </li>
        )

        return pagination;
    }

    const onChangeOption = (event) => {
        const target = event.target;
        console.log(target.value);
        onChangeItemsPerPage(target.value)
    }

    return (
        <div className="card mb-4">
            <div className="card-header">
                <i className="fas fa-table me-1"></i>
                {name}
            </div>
            <div className="card-body">
                <div className='row mb-3'>
                    <div className='col-sm-12 col-md-6'>
                        <label className='d-inline-flex'>Show
                        <select name='' className='form-select form-select-sm ms-1 me-1' onChange={onChangeOption}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                        </select> entries
                        </label>
                    </div>
                    <div className='col-sm-12 col-md-6'>
                        <label className='d-inline-flex float-end'>Search: 
                            <LiveSearch onKeySearch={onKeySearch} />
                        </label>
                    </div>
                </div>
                <table class="table table-bordered table-striped" width='100%'>
                    <thead>
                        <tr>
                            {renderHeaders()}
                        </tr>
                    </thead>
                    <tfoot>
                        <tr>
                            {renderHeaders()}
                        </tr>
                    </tfoot>
                    <tbody>
                        {renderData()}
                    </tbody>
                </table>
                {numOfPage > 1 && (
                    <ul className="pagination justify-content-center">
                        {renderPagination()}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default DataTable