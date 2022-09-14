import React, {Fragment, useEffect, useState,useCallback} from "react"
import styled, { AnyStyledComponent } from "styled-components"
import RcTable from "@polkadot/react-components/RcTable";
import Icon from "@polkadot/react-components/Icon";
import { api } from "@polkadot/react-api";
import StorageGroup from "./components/StorageGroup";
import MinerSearch from "./components/MinerSearch";
import _ from "lodash"
import {
  formatterCurrency,
  formatterCurrencyStr,
  formatterSize,
  formatterSizeFromMB
} from "@polkadot/app-explorer/utils";

interface Props{
  className?: string
}

function Miners({className}: Props): React.ReactElement<Props>{
  const [minerData, setMinerData] = useState<any>({})
  const [minerList, setMinerList] = useState<any[]>([]);

  // useEffect(()=>{
  //   (async (): Promise<void> =>{
  //     const unsub = await api.query.sminer.minerStatValue((res)=>{
  //       if(res){
  //         let info:any = res.toJSON();
  //         let stakingObj = formatterCurrency(info.staking);
  //         info.stakingMoney = stakingObj.money;
  //         info.stakingSuffix = stakingObj.suffix;
  //         let minerRewardObj = formatterCurrency(info.minerReward);
  //         info.minerRewardMoney = minerRewardObj.money;
  //         info.minerRewardSuffix = minerRewardObj.suffix;
  //         setMinerData(info);
  //       }
  //     });
  //   })().catch(console.error);
  // }, [])

// activeMiners: 6
// minerReward: "0x000000000000000014d1120d7b160000"
// minerRewardMoney: "1.500"
// minerRewardSuffix: "MILL"
// staking: "0x00000000000000000031bced02db0000"
// stakingMoney: "14.000"
// stakingSuffix: "KILO"
// sumFiles: 0
// totalMiners: 6

  useEffect(()=>{
    (async (): Promise<void> =>{
      const minerItems:any = await api.query.sminer.minerItems.entries();//get all miner list
      // const minerDetails:any = await api.query.sminer.minerDetails.entries();
      const files:any=await api.query.fileBank.file.entries();

      let miners:any[]= [];
      let reward=0;
      let staking=0;
      minerItems.forEach(([key, entry],i) => {// get id
        let peerid=i+1;        
        let minerID:string = key.args.map((k) => k.toHuman());
        console.log('minerID',minerID)
        minerID=minerID[0];
        let jsonObj = entry.toJSON();     
        if(jsonObj.peerId){
          peerid=jsonObj.peerId;
        }   
        let totalReward=_.toNumber(jsonObj.rewardInfo.totalReward);
        reward+=totalReward;
        staking+=_.toNumber(jsonObj.collaterals);
        miners.push(_.assign(jsonObj,{minerID,totalReward,peerid}));
      });
      let miningReward=formatterCurrency(reward);
      console.log('reward',reward);
      let stakingObj=formatterCurrency(staking);
      // console.log('*******************miners*************************');
      // console.log(miners);
      miners.sort((t1,t2)=>t1.peerid-t2.peerid);
      setMinerList(miners);

      // let details:any[]= [];
      // minerDetails.forEach(([key, entry]) => {
      //   let fileid:string = key.args.map((k) => k.toHuman());
      //   let jsonObj = entry.toJSON();
      //   details.push(_.assign(jsonObj,{fileid}));
      // });
      // console.log(details);


      // let reward=0;
      // details.forEach(t=>{
      //   reward+=_.toNumber(t.totalReward);
      // });
      // let miningReward=formatterCurrency(reward);

      // let staking=0;
      // miners.forEach(t=>{
      //   staking+=_.toNumber(t.collaterals);
      // });
      // let stakingObj=formatterCurrency(staking);


      let info:any ={
          activeMiners:miners.length,
          totalMiners:miners.length,
          sumFiles:files.length,
          stakingMoney:stakingObj.money,
          stakingSuffix:stakingObj.suffix,
          minerRewardMoney:miningReward.money,          
          minerRewardSuffix:miningReward.suffix
      };
      setMinerData(info);



      // if(res){
      //   let info:any ={
      //     activeMiners:res.length,
      //     totalMiners:res.length,
      //     sumFiles:res2.length
      //   };
      //   console.log('************start********************');
      //   console.log(res);
      //   console.log(res2);
      //   console.log('************end********************');


      //   let stakingObj = formatterCurrency(info.staking);
      //   info.stakingMoney = stakingObj.money;
      //   info.stakingSuffix = stakingObj.suffix;
      //   let minerRewardObj = formatterCurrency(info.minerReward);
      //   info.minerRewardMoney = minerRewardObj.money;
      //   info.minerRewardSuffix = minerRewardObj.suffix;
        
      //   setMinerData(info);
      // }
    })().catch(console.error);
  }, [])

  // useEffect(()=>{
  //   (async (): Promise<void> =>{
  //     const MinerKeys = await api.query.sminer.minerTable.keys();
  //     const entries = await api.query.sminer.minerTable.entries();
  //     let list:any[]= [];
  //     entries.forEach(([key, entry]) => {
  //       // console.log(key.args,'key arguments:', key.args.map((k) => k.toHuman()),'rrrrrrrrr',key);
  //       // console.log('     exposure:', entry.toHuman());
  //       let minerId = _.get(key.args.map((k) => k.toHuman()), `0`);
  //       let humanObj = entry.toJSON();
  //       list.push(_.assign(humanObj, { minerId }));
  //     });
  //     list = _.sortBy(list, v=> _.toNumber(v.minerId));
  //     setMinerList(list);
  //   })().catch(console.error);
  // }, [])

  // useEffect(()=>{
  //   (async (): Promise<void> =>{
  //     const minerDetails:any = await api.query.sminer.minerDetails.entries();
  //     let list:any[]= [];
  //     minerDetails.forEach(([key, entry]) => {
  //       let minerId = _.get(key.args.map((k) => k.toHuman()), `0`);// key is a arrary,minerid get first one
  //       let humanObj = entry.toJSON();
  //       list.push(_.assign(humanObj, { minerId }));
  //     });
  //     list = _.sortBy(list, v=> _.toNumber(v.minerId));
  //     // console.log(list);
  //     setMinerList(list);
  //   })().catch(console.error);
  // }, [])



  const columns = React.useMemo(()=> [
    {Header: 'miner ID', accessor: 'peerid',Cell: ({row}) => (
      <a href={`#/explorer/query/${row.values.peerid}/${undefined}`} >{row.values.peerid}</a>
      // <span>{row.values.peerid}</span>
    )},
    {Header: 'address1', accessor: 'minerID',Cell: ({row}) => (
      <span>{row.values.minerID}</span>
      //  <a href={`#/explorer/query/${row.values.minerID}/${undefined}`} >{row.values.minerID}</a>
     )},
    {Header: 'address2', accessor: 'beneficiary',Cell: ({row}) => (
      //  <a href={`#/explorer/query/${row.values.beneficiary}/${undefined}`} >{row.values.beneficiary}</a>
      <span>{row.values.beneficiary}</span>
    )},
    {Header: 'total storage', accessor: 'power', Cell: ({row}) => (
       <span>{ formatterSizeFromMB(row.values.power)}</span>
    )},
    {Header: 'mining reward', accessor: 'totalReward', Cell: ({row}) => (
       <span>{ formatterCurrencyStr(row.values.totalReward)}</span>
    )},
  ], [])

  return (
    <div className={`${className} miners`}>
      <div className={"miners-info"}>
        <div className={"miners-info-details"}>
          <div className={"miners-info-details-block"}>
            <span className={"miners-info-details-block-item label"}>total miners</span>
            <span className={"miners-info-details-block-item"}>{minerData && minerData.totalMiners}</span>
          </div>
          <div className={"miners-info-details-block"}>
            <span className={"miners-info-details-block-item label"}>active miners</span>
            <span className={"miners-info-details-block-item"}> {minerData && minerData.activeMiners}</span>
          </div>
          <div className={"miners-info-details-block middle-block"}>
            <span className={"miners-info-details-block-item label"}>staking</span>
            <span className={"miners-info-details-block-item"}>{ minerData && minerData.stakingMoney } <span className={"unit"}>{minerData && minerData.stakingSuffix}</span></span>
          </div>
          <div className={"miners-info-details-block middle-block"}>
            <span className={"miners-info-details-block-item label"}>mining reward</span>
            <span className={"miners-info-details-block-item"}>{minerData && minerData.minerRewardMoney} <span className={"unit"}>{ minerData && minerData.minerRewardSuffix}</span></span>
          </div>
          <div className={"miners-info-details-block"}>
            <span className={"miners-info-details-block-item label"}>total number of files</span>
            <span className={"miners-info-details-block-item"}>{minerData && minerData.sumFiles} </span>
          </div>
        </div>
        <StorageGroup />
      </div>
      <div className={"miners-table"}>
        <div className={"miners-title"}>
          <Icon className='highlight--color' icon='dot-circle'/>
          <span>miners</span>
          <MinerSearch className="right-search-box" />
        </div>
        <div className={"miners-table-info"}>
          <RcTable columns={columns} data={minerList}/>
        </div>

      </div>

    </div>
  )
}

export default React.memo(styled(Miners)`
  margin-top: -50px;
  height: 100%;
  .miners-info{
    border-radius: 6px;
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
    margin-top: 20px;
    .miners-title{
      background: white;
      border-radius: 6px;
      padding: 15px 1.5rem;
      box-sizing: border-box;
      svg{
        vertical-align: baseline
      }
      >span{
        font-size: 24px;
        color: #464646;
        margin-left: 5px;
        vertical-align: baseline;
        display: inline-block;
        margin-top: -3px;
        font-weight: 100;
      }
    }
    &-info{
      margin-top: 4px;
      background: white;
      padding: 15px 1.5rem;
      box-sizing: border-box;
      border-radius: 6px;
    }
  }
`)
