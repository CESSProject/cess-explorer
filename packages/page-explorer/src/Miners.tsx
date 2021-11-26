import React, {Fragment, useEffect, useState} from "react"
import styled from "styled-components"
import RcTable from "@polkadot/react-components/RcTable";
import ChainInfo from "./ChainInfo";
import Icon from "@polkadot/react-components/Icon";
import { api } from "@polkadot/react-api";
import {BlockToTime, TimeNow} from "@polkadot/react-query";
import {BN_ONE} from "@polkadot/util";
import StorageGroup from "./components/StorageGroup";

interface Props{
  className?: string
}

function Miners({className}: Props): React.ReactElement<Props>{
  const [minerList, setMinerList] = useState<any[]>([]);
  const [state, setState] = useState({
    data: []
  })

  useEffect(()=>{
    (async (): Promise<void> =>{
      const MinerKeys = await api.query.sminer.minerTable.keys();
      const entries = await api.query.sminer.minerTable.entries();
      let list:any[]= [];
      entries.forEach(([key, entry]) => {
        console.log('key arguments:', key.args.map((k) => k.toHuman()));
        console.log('     exposure:', entry.toHuman());
        list.push(entry.toHuman());
      });
      setMinerList(list);
    })().catch(console.error);
  }, [])

  const columns = React.useMemo(()=> [
    {Header: 'Miner ID', accessor: 'Miner ID'},
    {Header: 'Address1', accessor: 'address'},
    {Header: 'Address2', accessor: 'beneficiary'},
    {Header: 'Total Storage', accessor: 'totalStorage'},
    {Header: 'Average Daily Data Traffic (In)', accessor: 'averageDailyDataTrafficIn'},
    {Header: 'Average Daily Data Traffic (Out)', accessor: 'averageDailyDataTrafficOut'},
    {Header: 'Mining Reward', accessor: 'miningReward'},
    {Header: 'Status', accessor: 'status'},
  ], [])

  return (
    <div className={`${className} miners`}>
      <div className={"miners-info"}>
        <div className={"miners-info-details"}>
          <div className={"miners-info-details-block"}>
            <span className={"miners-info-details-block-item label"}>total miners</span>
            <span className={"miners-info-details-block-item"}>{'dd'}</span>
          </div>
          <div className={"miners-info-details-block"}>
            <span className={"miners-info-details-block-item label"}>active miners</span>
            <span className={"miners-info-details-block-item"}> <TimeNow /> <span className={"unit"} /></span>
          </div>
          <div className={"miners-info-details-block middle-block"}>
            <span className={"miners-info-details-block-item label"}>staking</span>
            <span className={"miners-info-details-block-item"}><BlockToTime value={BN_ONE} /></span>
          </div>
          <div className={"miners-info-details-block middle-block"}>
            <span className={"miners-info-details-block-item label"}>mining reward</span>
            <span className={"miners-info-details-block-item"}>124.2345 <span className={"unit"}>tCESS</span></span>
          </div>
          <div className={"miners-info-details-block"}>
            <span className={"miners-info-details-block-item label"}>total number of files</span>
            <span className={"miners-info-details-block-item"}>1.2234 <span className={"unit"}>tCESS/TB</span></span>
          </div>
          <div className={"miners-info-details-block"}>
            <span className={"miners-info-details-block-item label"}>active miners</span>
            <span className={"miners-info-details-block-item"}>121</span>
          </div>
        </div>
        <StorageGroup />
      </div>
      <div className={"miners-table"}>
        <div className={"miners-title"}>
          <Icon className='highlight--color' icon='dot-circle'/>
          <span>Miners</span>
        </div>
        <RcTable columns={columns} data={minerList}/>
      </div>

    </div>
  )
}

export default React.memo(styled(Miners)`
  height: 100%;
  .miners-info{
    display: flex;
    background: white;
    padding: 15px 1.5rem !important;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    &-details{
      width: 33%;
      display: flex;
      flex-wrap: wrap;
      &-block{
        display: flex;
        flex-direction: column;
        width: 50%;
        .label{
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #858585;
        }
        &-item{
          font-size: 28px;
          font-weight: 300;
          color: #464646;
          .unit{
            font-size: 18px;
          }
        }
      }
      .middle-block{
        margin: 50px 0;
      }
    }
  }
  .miners-table{
    background: white;
    padding: 15px 1.5rem !important;
    box-sizing: border-box;
    .miners-title{
      margin-bottom: 18px;
      >span{
        font-size: 24px;
        color: #464646;
        margin-left: 5px;
        vertical-align: middle;
        display: inline-block;
        margin-top: -3px;
      }
    }
  }
`)
