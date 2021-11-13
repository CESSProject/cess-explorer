import React  from 'react';
import styled from "styled-components";
// import * as echarts from "echarts"

interface Props{
  className?: String,
}

function ChainInfo({className}: Props): React.ReactElement<Props>{
  return (
    <div className={`${className} chain-info`}>
      {/*详情*/}
      <div className={"chain-info-details"}>
        <div className={"chain-info-details-block"}>
          <span className={"chain-info-details-block-item label"}>tipset height</span>
          <span className={"chain-info-details-block-item"}>1235</span>
        </div>
        <div className={"chain-info-details-block"}>
          <span className={"chain-info-details-block-item label"}>latest block</span>
          <span className={"chain-info-details-block-item"}>1.1 <span className={"unit"}>secs ago</span></span>
        </div>
        <div className={"chain-info-details-block middle-block"}>
          <span className={"chain-info-details-block-item label"}>avg block time</span>
          <span className={"chain-info-details-block-item"}>4.8 <span className={"unit"}>s</span></span>
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
      {/*饼图*/}
      <div className={"chain-info-bar"}>
        <div ref={"chain-info-bar"} className={"chain-info-bar-box"}> </div>
      </div>
    </div>
  )
}

export default React.memo(styled(ChainInfo)`
  margin: -50px 1.5rem 1.5rem 1.5rem;
  background: white;
  width: 90% !important;
  padding: 35px 1.5rem !important;
  box-sizing: border-box;
  border-radius: 6px;
    .chain-info-details{
      width: 30%;
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
`);
