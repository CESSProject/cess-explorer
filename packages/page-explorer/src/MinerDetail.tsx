import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import * as echarts from "echarts";
import {Button, Icon} from "@polkadot/react-components";
import RcTable from "@polkadot/react-components/RcTable";
import ReactTooltip from "react-tooltip";

interface Props {
  className?: String
}

const option:any = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    align: 'right',
    right: '5%',
    top: 'center',
    orient: 'vertical',
    icon: 'roundRect',
    itemWidth: 8,
    itemHeight: 61,
    formatter: (value ,ee) =>{
      return value;
    }
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['50%', '70%'],
      color: ['#5078FE', '#5CD5B4'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        {value: 1048, name: 'Search Engine'},
        {value: 735, name: 'Direct'},
      ]
    }
  ]
};

function MinerDetail({className}: Props): React.ReactElement<Props> {
  const minerInfoRef = useRef<any>()
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

  useEffect(() => {
    let myChart = minerInfoRef.current = echarts.init(document.getElementById("miner-info-box") as HTMLDivElement);
    myChart.setOption(option);
    window.addEventListener("resize", () =>{
      minerInfoRef.current.resize();
    });
  }, [])

  const columns = React.useMemo(()=> [
    {Header: 'Extrinsic ID', accessor: 'ExtrinsicID'},
    {Header: 'Block', accessor: 'Block'},
    {Header: 'Extrinsic Hash', accessor: 'ExtrinsicHash'},
    {Header: 'Time', accessor: 'Time'},
    {
      Header: 'Result', accessor: 'Result', id: 'result',
      Cell: ({row}) => (
        <div>
          <Icon color='#EB3434'  icon='times-circle' />
          <Icon color='#5CD5B4'  icon='check-circle'/>
          <Icon color='#FF9C07'  icon='clock'/>
        </div>
      ),
    },
    {
      Header: 'Call', accessor: 'Call', id: 'expander', // It needs an ID
      Cell: ({row}) => (
        <span {...row.getToggleRowExpandedProps()}>
          {row.values.expander}
          <Icon icon={row.isExpanded ? 'caret-up' : 'caret-down'}/>
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

  const changeTableFilter = () =>{

  }

  return (
    <div className={`${className} miner-detail`}>
      <div className={"miner-title"}>
        Miner Detail
      </div>
      <div className={"miner-content"}>
        <div className={"miner-info"}>
          <div className={"miner-info-left"}>
            <div className={"miner-info-left-tr label"}>Account</div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>Account name</span>
              <span className={"miner-info-left-td"}>0x08cd_y6g6s</span>
            </div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>Account1</span>
              <span className={"miner-info-left-td ellipsis"} data-effect={"solid"} data-tip={"cTHDK35f4i7ujFS3K6jPiEQZ22mXpjasf3Jzorqf32EEhup1J"}>
                cTHDK35f4i7ujFS3K6jPiEQZ22mXpjasf3Jzorqf32EEhup1J
              </span>
              <ReactTooltip effect="solid" delayUpdate={500} delayHide={2000}/>
            </div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>Account2 name</span>
              <span className={"miner-info-left-td"}>0x08cd_y6g6s</span>
            </div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>Account2</span>
              <span className={"miner-info-left-td ellipsis"} data-effect={"solid"} data-tip={"cTHDK35f4i7ujFS3K6jPiEQZ22mXpjasf3Jzorqf32EEhup1J"}>cTHDK35f4i7ujFS3K6jPiEQZ22mXpjasf3Jzorqf32EEhup1J</span>
              <ReactTooltip effect="solid" delayUpdate={500} delayHide={2000}/>
            </div>
          </div>
          <div className={"miner-info-right"}>
            <div id="miner-info-box" ref={minerInfoRef} className={"miner-info-box"}/>
          </div>

        </div>
      </div>
      <div className={"miner-content"}>
        <div className={"miner-balance"}>
          <div className={"miner-info-left"}>
            <div className={"miner-info-left-tr label"}>Balance</div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>Account name</span>
              <span className={"miner-info-left-td"}><span
                className={"miner-info-left-td-value"}>8.1234 </span><span>tCESS</span></span>
            </div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>Account</span>
              <span className={"miner-info-left-td"}><span
                className={"miner-info-left-td-value"}>8.1234 </span><span>tCESS</span></span>
            </div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>Total</span>
              <span className={"miner-info-left-td"}><span
                className={"miner-info-left-td-value"}>12.1234 </span><span>tCESS</span></span>
            </div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>Available transfers</span>
              <span className={"miner-info-left-td"}><span
                className={"miner-info-left-td-value"}>8.1234 </span><span>tCESS</span></span>
            </div>
          </div>
        </div>
      </div>
      <div className={"miner-content"}>
        <div className={"accout-table"}>
          <div className={"btn-actions"}>
            <Button isSelected label={"Extrinsics (2)"} onClick={changeTableFilter}/>
          </div>
          <RcTable isShowPagination={false} columns={columns} data={state.data} renderRowSubComponent={renderRowSubComponent}/>
        </div>
      </div>
    </div>
  )
}

export default React.memo(styled(MinerDetail)`
  margin: 20px 0;
  font-size: 16px;

  .miner-title, .miner-content {
    padding: 35px 1.5rem !important;
    background: white;
    border-radius: 6px;
  }

  .miner-content {
    margin-top: 4px;
    box-sizing: border-box;
    border-radius: 6px;

    & .miner-info,.miner-balance {
      display: flex;

      &-left {
        width: 50%;
        font-size: 16px;

        &-tr {
          padding: 16px 0;
          box-sizing: border-box;
          border-bottom: 1px solid #DBDBDB;
          &.label{
            color: #5078FE
          }
        }

        &-td {
          display: inline-block;
          width: 50%;

          &.ellipsis{
            overflow: hidden;
            text-overflow: ellipsis;
          }

          &-value {
            font-size: 28px;
            color: #5078FE;
            margin-right: 20px;
          }
        }
      }

      &-right {
        width: 50%;
        .miner-info-box{
          width: 100%;
          height: 100%;
        }
      }
    }
    & .accout-table{
      & .btn-actions{
        margin-bottom: 20px;
      }
      & .expand-group{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        >div{
          width: 700px;text-align: left; border: 1px dashed #DBDBDB; padding: 10px;box-sizing: border-box;
          >p:last-child{
            display: flex;
            justify-content: space-between;
          }
        }
        >div:last-child{
          margin: 8px 0;
        }
      }
    }
  }
`)
