import RcTable from "@polkadot/react-components/RcTable"
import React, {Fragment, useState} from "react"
import styled from "styled-components"

interface Props{
  className? :String
}

function AccoutDetail({className}: Props) :React.ReactElement<Props>{
  const [state, setState] = useState({
    data: [
      {
        ExtrinsicID: 'Hello',
        Block: 'World',
        Call: 'staking(guarantee)'
      },
      {
        ExtrinsicID: 'react-table',
        Block: 'rocks',
        Call: 'balances(transfer_keep_alive)'
      },
      {
        ExtrinsicID: 'whatever',
        Block: 'you want',
        Call: 'staking(guarantee)'
      },
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
      <Fragment>
        <div style={{width: 600, textAlign: 'left', float: 'right', border: '1px dashed #DBDBDB', padding: 10,boxSizing: 'border-box'}}>
          <p>AccountId32</p>
          <p style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>Account name</span>
            <span>5DJPrZNBXD9vn6KgUBBvAFWGLJuD_</span>
          </p>
        </div>
        <div style={{width: 600, textAlign: 'left', float: 'right', border: '1px dashed #DBDBDB', padding: 10,boxSizing: 'border-box', margin: '8px 0'}}>
          <p>AccountId32</p>
          <p style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>Account name</span>
            <span>5DJPrZNBXD9vn6KgUBBvAFWGLJuD_</span>
          </p>
        </div>
      </Fragment>
    ),
    []
  )

  return (
    <div className={`${className} "accout-detail"`}>
      <div className={"accout-title"}>
        Account Detail
      </div>
      <div className={"accout-content"}>
        <div className={"accout-info"}>
          <div className={"accout-info-left"}>
            <div className={"accout-info-left-tr"}>Account</div>
            <div className={"accout-info-left-tr"}>
              <span className={"accout-info-left-td"}>Account name</span>
              <span className={"accout-info-left-td"}>0x08cd_y6g6s</span>
            </div>
            <div className={"accout-info-left-tr"}>
              <span className={"accout-info-left-td"}>Account</span>
              <span className={"accout-info-left-td"}>cTHDK35f4i7ujFS3K6jPiEQZ22mXpjasf3Jzorqf32EEhup1J</span>
            </div>
            <div className={"accout-info-left-tr"}>
              <span className={"accout-info-left-td"}>Total</span>
              <span className={"accout-info-left-td"}><span className={"accout-info-left-td-value"}>12.1234 </span><span>tCESS</span></span>
            </div>
            <div className={"accout-info-left-tr"}>
              <span className={"accout-info-left-td"}>Available transfers</span>
              <span className={"accout-info-left-td"}><span className={"accout-info-left-td-value"}>8.1234 </span><span>tCESS</span></span>
            </div>
          </div>
          <div className={"accout-info-center"}>
            <img src={require("./../../../assets/images/accoutAvailableLogo.png")} alt=""/>
          </div>
          <div className={"accout-info-right"}>
            <span>Data</span>
            <span>123.14</span>
            <span>MB</span>
          </div>
        </div>
        <div className={"accout-table"}>
          <RcTable columns={columns} data={state.data} renderRowSubComponent={renderRowSubComponent}/>
        </div>
      </div>
    </div>
  )
}

export default React.memo(styled(AccoutDetail)`
  margin: 20px 0;
  font-size: 16px;
  .accout-title, .accout-content{
    padding: 35px 1.5rem !important;
    background: white;
    border-radius: 6px;
  }
  .accout-content{
    margin-top: 4px;
    box-sizing: border-box;
    border-radius: 6px;
    & .accout-info{
      display: flex;
      &-left{
        width: 50%;
        font-size: 16px;
        &-tr{
          padding: 16px 0;
          box-sizing: border-box;
          border-bottom: 1px solid #DBDBDB;
        }
        &-td{
          display: inline-block;
          width: 50%;
          &-value{
            font-size: 28px;
            color: #5078FE;
            margin-right: 20px;
          }
        }
      }
      &-center{
        width: 25%;
        text-align: center;
      }
      &-right{
        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
        span:nth-child(2){
          font-size: 28px;
          color: #5078FE;
          margin: 0 6px 0 28px;
        }
      }
    }
    & .accout-table{
      margin-top: 40px;
    }
  }
`)
