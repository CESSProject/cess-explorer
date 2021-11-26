import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {  BlockAuthorsContext, BlockToTime, TimeNow } from '@polkadot/react-query';
import { BN_ONE } from '@polkadot/util';
import _ from "lodash"
import StorageGroup from './components/StorageGroup';

interface Props{
  className?: string,
}

function ChainInfo({className}: Props): React.ReactElement<Props>{
  const { lastHeaders } = useContext(BlockAuthorsContext);

  useEffect(() =>{

  }, [])

  return (
    <div className={`${className}`}>
      {/*详情*/}
      <div className={"chain-info"}>
        <div className={"chain-info-details"}>
          <div className={"chain-info-details-block"}>
            <span className={"chain-info-details-block-item label"}>tipset height</span>
            <span className={"chain-info-details-block-item"}>{lastHeaders.length}</span>
          </div>
          <div className={"chain-info-details-block"}>
            <span className={"chain-info-details-block-item label"}>latest block</span>
            <span className={"chain-info-details-block-item"}> <TimeNow /> <span className={"unit"} /></span>
          </div>
          <div className={"chain-info-details-block middle-block"}>
            <span className={"chain-info-details-block-item label"}>avg block time</span>
            <span className={"chain-info-details-block-item"}><BlockToTime value={BN_ONE} /></span>
          </div>
          <div className={"chain-info-details-block middle-block"}>
            <span className={"chain-info-details-block-item label"}>block reward</span>
            <span className={"chain-info-details-block-item"}>124.2345 <span className={"unit"}>tCESS</span></span>
          </div>
          <div className={"chain-info-details-block"}>
            <span className={"chain-info-details-block-item label"}>24h average block reward</span>
            <span className={"chain-info-details-block-item"}>1.2234 <span className={"unit"}>tCESS/TB</span></span>
          </div>
          <div className={"chain-info-details-block"}>
            <span className={"chain-info-details-block-item label"}>active miners</span>
            <span className={"chain-info-details-block-item"}>121</span>
          </div>
        </div>
        <StorageGroup />
      </div>
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
        }
        .middle-block{
          margin: 50px 0;
        }
      }
    }
`);
