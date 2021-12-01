import React, {Fragment} from 'react'
import styled from 'styled-components'
import { useTable, useExpanded,usePagination, useResizeColumns, useFlexLayout, useBlockLayout, useAbsoluteLayout } from 'react-table'

interface Props{
  className?: string,
  paginationClassName?: string,
  isShowPagination?:boolean,
  columns?: any,
  data?: any,
  renderRowSubComponent?: Function | null
}

function RcTable({ columns: userColumns, data, renderRowSubComponent, className, paginationClassName,isShowPagination = true }:Props) : React.ReactElement<Props>{

  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    []
  )

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
    defaultColumn,
    autoResetExpanded: false,
  },
    // useResizeColumns,
    // useFlexLayout,
    // useBlockLayout,
    // useAbsoluteLayout,
    useExpanded,
    usePagination
  )
  return (
    <Fragment>
      <div className={`${className} fragment-box`} {...getTableProps()}>
        <table className={`normal-styles`}>
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
              <Fragment key={i}>
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell: any) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
                {row.isExpanded ? (
                  <tr {...row.getRowProps()}>
                    <td colSpan={visibleColumns.length}>
                      { renderRowSubComponent && renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            )
          })}
          </tbody>
        </table>
      </div>
      {
        isShowPagination &&
        <div className={`${className} pagination`}>
          <button className={"pagination-btn"} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          {' '}
          <button className={"pagination-btn"} onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>
          {' '}
          <button className={"pagination-btn"} onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>
          {' '}
          <button className={"pagination-btn"} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>
          {' '}
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
              style={{width: '100px'}}
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
      }
    </Fragment>

  )
}

function areEqual(prevProps, nextProps) {
  if(prevProps.data === nextProps.data){
    return true
  }else {
    return false
  }

}

export default React.memo(styled(RcTable)`
  display: block;
  overflow-x: auto;
  table{
    border-collapse: collapse;
    width: 100%;
    border: 1.5px solid #5078FE;
    border-radius: 6px;
    overflow-x: auto;
    thead {
    ${'' /* These styles are required for a scrollable body to align with the header properly */}
      //overflow-y: hidden;
      overflow-x: auto;
      width: 100%;
    }
    tbody {
    ${'' /* These styles are required for a scrollable table body */}
      //overflow-y: hidden;
      overflow-x: auto;
      //height: 250px;
      width: 100%;
    }
  }

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
    ::-webkit-scrollbar-track{
      background: transparent;
    }
    text-align: right;
    border: 0;
    margin-top: 20px;
    padding: 0.5rem;
    .pagination-btn{
      border-radius: 4px;
      border: 1px solid #DBDBDB;
      line-height: 2 !important;
      min-width: 36px;
    }
    input, select{
      border-radius: 4px;
      border: 1px solid #DBDBDB;
      line-height: 2 !important;
      &:focus{
        border: 1px solid #5078FE;
        outline: none;
      }
    }
    select{
      min-height: 36px;
    }
  }
`, areEqual)

