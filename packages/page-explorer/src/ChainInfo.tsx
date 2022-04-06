import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {  BlockAuthorsContext, BlockToTime, TimeNow } from '@polkadot/react-query';
import { BN_ONE } from '@polkadot/util';
import _ from "lodash"
import StorageGroup from './components/StorageGroup';
import {api} from "@polkadot/react-api";
import RcTable from '@polkadot/react-components/RcTable/RcTable';

interface Props{
  className?: string,
}

function ChainInfo({className}: Props): React.ReactElement<Props>{
  const [minerData, setMinerData] = useState<any>({})
  const [lastEra, setLastEra] = useState<any>(0)
  const [currentEra, setCurrentEra] = useState<any>(0)
  const { lastHeaders } = useContext(BlockAuthorsContext);

  let json = lastHeaders && lastHeaders[0] && lastHeaders[0].toJSON();
  let num = json ? json?.number : 0;


  useEffect(()=>{
    (async (): Promise<void> =>{
      // const res = await api.query.sminer.minerStatValue();
      const res = await api.query.sminer.minerItems.entries();      
      if(res){
        // let info = res1.toJSON();
        let info={
          activeMiners:res.length
        };
        setMinerData(info);
      }
    })().catch(console.error);
  }, [])

  useEffect(()=>{
    (async (): Promise<void> =>{
      const res = await api.query.staking.currentEra();
      if(res){
        let info:any = res.toHuman();
        setCurrentEra(info);
        let res2 = await api.query.staking.erasRewardPoints(info - 1);
        setLastEra(_.get(res2.toHuman(), 'total'));
      }
    })().catch(console.error);
  }, [])

  return (
    <div className={`${className}`}>
      <div className={"chain-info"}>
        <div className={"chain-info-details"}>
          <div className={"chain-info-details-block"}>
            <span className={"chain-info-details-block-item label"}>block height</span>
            <span className={"chain-info-details-block-item"}>{num}</span>
          </div>
          <div className={"chain-info-details-block"}>
            <span className={"chain-info-details-block-item label"}>latest block</span>
            <span className={"chain-info-details-block-item extra-item"}> <TimeNow /> <span className={"unit"}>ago</span></span>
          </div>
          <div className={"chain-info-details-block middle-block"}>
            <span className={"chain-info-details-block-item label"}>avg block time</span>
            <span className={"chain-info-details-block-item"}><BlockToTime value={BN_ONE} /></span>
          </div>
          <div className={"chain-info-details-block middle-block"}>
            <span className={"chain-info-details-block-item label"}>current era</span>
            <span className={"chain-info-details-block-item"}>{currentEra} </span>
          </div>
          <div className={"chain-info-details-block"}>
            <span className={"chain-info-details-block-item label"}>last era reward</span>
            <span className={"chain-info-details-block-item"}>{lastEra} <span className={"unit"}>TCESS</span></span>
          </div>
          <div className={"chain-info-details-block"}>
            <span className={"chain-info-details-block-item label"}>active miners</span>
            <span className={"chain-info-details-block-item"}>{(minerData && minerData.activeMiners) || 0}</span>
          </div>
        </div>
        <StorageGroup />
      </div>
      {/*<RcTable />*/}
    </div>
  )
}

export default React.memo(styled(ChainInfo)`
  margin-top: -50px;
    .chain-info{
      padding: 1.5rem;
      display: flex;
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 6px;
      .chain-info-details{
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
          .extra-item{
            display: flex;
            flex-direction: row;
            align-items: center;
            .unit{
              font-size: 28px;
              margin-left: 5px;
            }
          }
        }
        .middle-block{
          margin: 50px 0;
        }
      }
    }
`);
