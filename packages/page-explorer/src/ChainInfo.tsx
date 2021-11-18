import React, {useEffect, useRef} from 'react';
import styled from "styled-components";
import * as echarts from "echarts"

interface Props{
  className?: string,
}

const option = {
  tooltip: {
    trigger: 'item',
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
      name: 'Chain Info',
      type: 'pie',
      radius: ['50%', '70%'],
      hoverAnimation:false,
      color: ['#5078FE', '#5CD5B4'],
      label: {
        show: false,
        position: 'center',
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
        { value: 2.3, name: 'used storage' },
        { value: 1.7, name: 'available storage' },
      ]
    }
  ]
};

function ChainInfo({className}: Props): React.ReactElement<Props>{
  const chainInfoRef = useRef<any>()

  useEffect(()=>{
    let myChart = chainInfoRef.current = echarts.init(document.getElementById("chain-info-bar-box") as HTMLDivElement);
    myChart.setOption(option);
    window.addEventListener("resize", () =>{
      chainInfoRef.current.resize();
    });
  },[])

  useEffect(() =>{
    let canvas = document.getElementById("chain-info-percent-canvas") as HTMLCanvasElement;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //1、画未使用的容量弧线描边
    ctx?.beginPath();
    ctx?.arc(150,150,100,0.5*Math.PI,1.5* Math.PI, false);
    ctx.lineWidth=3;
    ctx.strokeStyle="#8FBFFF";
    ctx?.stroke();
    ctx?.save();
    //2、画已使用的容量弧线描边
    ctx?.beginPath();
    ctx?.arc(150,150,100, 0.5*Math.PI,1.5* Math.PI, true);
    ctx.strokeStyle="#FF9C07";
    ctx.lineWidth=6;
    ctx?.stroke();
    ctx?.save();
    //3、画交汇圆点
    ctx?.beginPath();
    ctx?.arc(150,50,16,0,2* Math.PI);
    ctx.fillStyle = "#FF9C07";
    ctx?.fill();
    ctx?.closePath();
  },[])

  return (
    <div className={`${className}`}>
      {/*详情*/}
      <div className={"chain-info"}>
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
        <div className={"chain-info-percent"}>
          <canvas id={"chain-info-percent-canvas"} width={300} height={300}/>
          <div className={"chain-info-percent-detail"}>
            <div className={"chain-info-percent-detail-left"}>
              <p>utilization</p>
              <p>33.3 %</p>
            </div>
            <div className={"chain-info-percent-detail-right"} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(styled(ChainInfo)`
  margin-top: -50px;
    .chain-info{
      padding: 0.375rem 0.75rem 0.375rem 1.5rem;
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
      .chain-info-bar{
        width: 33%;
        &-box{
          width: 100%;
          height: 100%;
        }

      }
      .chain-info-percent{
        width: 34%;
        display: flex;
        flex-direction: row;
        align-items: center;
        &-detail{
          display: flex;
          align-items: center;
          &-left{
            >p:first-child{
              font-size: 14px;
              color: #858585;
            }
            >p:last-child{
              font-size: 28px;
              color: #464646;
            }
          }
          &-right{
            width: 8px;
            height: 61px;
            border-radius: 6px;
            background: #FF9C07;
            margin-left: 12px;
          }
        }
      }
    }
`);
