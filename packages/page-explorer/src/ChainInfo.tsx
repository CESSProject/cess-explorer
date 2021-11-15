import React, {useEffect, useRef} from 'react';
import styled from "styled-components";
import * as echarts from "echarts"

interface Props{
  className?: String,
}

const option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      color: ['#5078FE', '#5CD5B4'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '40',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
      ]
    }
  ]
};

function ChainInfo({className}: Props): React.ReactElement<Props>{
  const chainInfoRef = useRef<any>()

  useEffect(()=>{
    let myChart = chainInfoRef.current = echarts.init(document.getElementById("chain-info-bar-box") as HTMLDivElement);
    myChart.setOption(option);
    const resize = chainInfoRef.current.resize();
    window.addEventListener("resize", resize);
  }, [])

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
        <div id="chain-info-bar-box" ref={chainInfoRef} className={"chain-info-bar-box"} />
      </div>
      {/*百分比图*/}
      <div className={"chain-info-storage-trend"}>

      </div>
    </div>
  )
}

export default React.memo(styled(ChainInfo)`
  margin: -50px 1.5rem 1.5rem 1.5rem;
  background: white;
  width: 90% !important;
  height: 100%;
  padding: 35px 1.5rem !important;
  box-sizing: border-box;
  border-radius: 6px;
  display: flex;
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
    .chain-info-bar{
      width: 33%;
      &-box{
        width: 100%;
        height: 100%;
      }
    }
`);
