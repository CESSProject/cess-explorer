import React, {Fragment, useEffect, useState} from "react"
import styled from "styled-components"
import RcTable from "@polkadot/react-components/RcTable";
import ChainInfo from "./ChainInfo";
import Icon from "@polkadot/react-components/Icon";
import { api } from "@polkadot/react-api";

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
      <div className={"miners-title"}>
        <Icon className='highlight--color' icon='dot-circle'/>
        <span>Miners</span>
      </div>
      <RcTable columns={columns} data={minerList} renderRowSubComponent={renderRowSubComponent}/>
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
    >span{
      font-size: 24px;
      color: #464646;
      margin-left: 5px;
      vertical-align: middle;
      display: inline-block;
      margin-top: -3px;
    }
  }
`)
