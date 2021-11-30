import Table from 'rc-table';
import React from 'react';
import styled from 'styled-components';

interface Props{
  className?: string
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 100,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 200,
  },
  {
    title: 'Operations',
    dataIndex: '',
    key: 'operations',
    render: () => <a href="#">Delete</a>,
  },
];

const data = [
  { name: 'Jack', age: 28, address: 'some where', key: '1' },
  { name: 'Rose', age: 36, address: 'some where', key: '2' },
];

function RcTable({className}: Props): React.ReactElement<Props>{
  return (
    <div className={`${className}`}>
      <Table columns={columns} data={data} tableLayout={"auto"}/>
    </div>
  )
}

export default React.memo(styled(RcTable)`
  width: 100%;
`)
