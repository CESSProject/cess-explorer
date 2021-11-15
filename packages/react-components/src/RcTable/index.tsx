import React from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'

interface Props{
  className?: String,
  columns?: any,
  data?: any
}

function RcTable({columns, data, className}:Props) : React.ReactElement<Props>{
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })
  return (
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
      {rows.map((row: any, i: any) => {
        prepareRow(row)
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map((cell: any) => {
              return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
            })}
          </tr>
        )
      })}
      </tbody>
    </table>
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
`;

