import React, {Fragment, useState} from "react"
import styled from "styled-components"
import RcTable from "@polkadot/react-components/RcTable";
import ChainInfo from "./ChainInfo";

interface Props{
  className?: string
}

function Miners({className}: Props): React.ReactElement<Props>{
  const [state, setState] = useState({
    data: [
      {ExtrinsicID: 'Hello', Block: 'World', Call: 'staking(guarantee)'},
      {ExtrinsicID: 'react-table', Block: 'rocks', Call: 'balances(transfer_keep_alive)'},
      {ExtrinsicID: 'whatever', Block: 'you want', Call: 'staking(guarantee)'},
      {ExtrinsicID: 'Hello', Block: 'World', Call: 'staking(guarantee)'},
      {ExtrinsicID: 'react-table', Block: 'rocks', Call: 'balances(transfer_keep_alive)'},
      {ExtrinsicID: 'whatever', Block: 'you want', Call: 'staking(guarantee)'},
      {ExtrinsicID: 'Hello', Block: 'World', Call: 'staking(guarantee)'},
      {ExtrinsicID: 'react-table', Block: 'rocks', Call: 'balances(transfer_keep_alive)'},
      {ExtrinsicID: 'whatever', Block: 'you want', Call: 'staking(guarantee)'},
      {ExtrinsicID: 'Hello', Block: 'World', Call: 'staking(guarantee)'},
      {ExtrinsicID: 'react-table', Block: 'rocks', Call: 'balances(transfer_keep_alive)'},
      {ExtrinsicID: 'whatever', Block: 'you want', Call: 'staking(guarantee)'},
      {ExtrinsicID: 'Hello1', Block: 'World', Call: 'staking(guarantee)'},
      {ExtrinsicID: 'react-table2', Block: 'rocks', Call: 'balances(transfer_keep_alive)'},
      {ExtrinsicID: 'whatever2', Block: 'you want', Call: 'staking(guarantee)'},
      {ExtrinsicID: 'Hell2o', Block: 'World', Call: 'staking(guarantee)'},
      {ExtrinsicID: 'react-tabl2e', Block: 'rocks', Call: 'balances(transfer_keep_alive)'},
      {ExtrinsicID: 'whatev2er', Block: 'you want', Call: 'staking(guarantee)'},
    ]
  })

  const columns = React.useMemo(()=> [
    {Header: 'Extrinsic ID', accessor: 'ExtrinsicID'},
    {Header: 'Block', accessor: 'Block'},
    {Header: 'Extrinsic Hash', accessor: 'ExtrinsicHash'},
    {Header: 'Time', accessor: 'Time'},
    {Header: 'Result', accessor: 'Result'},
    {
      Header: 'Call', accessor: 'Call', id: 'expander', // It needs an ID
      Cell: ({row}) => (
        <span {...row.getToggleRowExpandedProps()}>
          {row.isExpanded ? row.values.expander + '👇' :  row.values.expander +'👉'}
        </span>
      ),
    },
  ], [])

  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <div className={"expand-group"}>
        <div>
          <p>AccountId32</p>
          <p>
            <span>Account name</span>
            <span>5DJPrZNBXD9vn6KgUBBvAFWGLJuD_</span>
          </p>
        </div>
        <div>
          <p>AccountId32</p>
          <p>
            <span>Account name</span>
            <span>5DJPrZNBXD9vn6KgUBBvAFWGLJuD_</span>
          </p>
        </div>
      </div>
    ),
    []
  )

  return (
    <div className={`${className} miners`}>
      <ChainInfo />
      <div className={"miners-title"}>Miners</div>
      <RcTable columns={columns} data={state.data} renderRowSubComponent={renderRowSubComponent}/>
    </div>
  )
}

export default React.memo(styled(Miners)`
  margin-top: 20px;
  background: white;
  width: 90% !important;
  height: 100%;
  padding: 24px 1.5rem !important;
  box-sizing: border-box;
  border-radius: 6px;
  .miners-title{
    margin-bottom: 18px;
  }
`)
