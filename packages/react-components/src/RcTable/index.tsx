import React from 'react'
import styled from 'styled-components'
import { useTable, useExpanded,usePagination } from 'react-table'

interface Props{
  className?: String,
  paginationClassName?: String,
  columns?: any,
  data?: any,
  renderRowSubComponent?: Function | null
}

function RcTable({ columns: userColumns, data, renderRowSubComponent, className, paginationClassName }:Props) : React.ReactElement<Props>{

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  }: any = useTable({
    columns: userColumns,
    data,
  },
    useExpanded,
    usePagination
  )
  return (
    <>
      <table {...getTableProps()} className={`${className} normal-styles`}>
        <thead>
        {headerGroups.map((headerGroup: any) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column:any) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {page.map((row: any, i: any) => {
          prepareRow(row)
          return (
            <React.Fragment {...row.getRowProps()} key={i}>
              <tr>
                {row.cells.map((cell: any) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
              {row.isExpanded ? (
                <tr>
                  <td colSpan={visibleColumns.length}>
                    { renderRowSubComponent && renderRowSubComponent({ row })}
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          )
        })}
        </tbody>
      </table>
      <div className={`${className} pagination`} >
        <button className={"pagination-btn"} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button className={"pagination-btn"} onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button className={"pagination-btn"} onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button className={"pagination-btn"} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>

  )
}

export default styled(RcTable)`
  width: 100%;
  border-spacing: 0;
  border: 1.5px solid #5078FE;
  border-radius: 6px;
  color: #858585;

  tr {
    :last-child {
      td {
        border-bottom: 0;
      }
    }
  }

  th,
  td {
    margin: 0;
    padding: 0.5rem;
    border-bottom: 1px solid #DBDBDB;
    border-right: 1px solid #DBDBDB;
    text-align: center;

    :last-child {
      border-right: 0;
    }
  }
  &.pagination {
    text-align: right;
    border: 0;
    margin-top: 20px;
    padding: 0.5rem;
    .pagination-btn{
      border-radius: 3px;
      border: 1px solid #DBDBDB;
    }
    input{
      border-color: #DBDBDB;
    }
  }
`;

