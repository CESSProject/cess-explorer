import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import * as echarts from "echarts"
import {useApi} from "@polkadot/react-hooks";
import { useTranslation } from './translate';
import {  BlockAuthorsContext, TimeNow } from '@polkadot/react-query';
import _ from "lodash"

interface Props{
  className?: string,
}

function ChainInfo({className}: Props): React.ReactElement<Props>{
  const chainInfoRef = useRef<any>()
  const { t } = useTranslation();
  const { api } = useApi();
  const { lastHeaders } = useContext(BlockAuthorsContext);
  const [barData, setBarData] = useState<any>([])

  useEffect(() =>{
    let myChart = chainInfoRef.current = echarts.init(document.getElementById("chain-info-bar-box") as HTMLDivElement);
    (async (): Promise<void> =>{
      api.registerTypes({
        "StorageInfo": {
          "used_storage": "u128",
          "available_storage": "u128",
          "time": "BlockNumber"
        }
      });
      const storageInfo = await api.query.sminer.storageInfoValue();
      console.log(storageInfo, '1111111111111111111')
      let barData = [
        { value: _.get(storageInfo , 'used_storage.words.0' ), name: 'used storage'},
        { value: _.get(storageInfo , 'available_storage.words.0' ), name: 'available storage'},
      ];
      setBarData(barData);
      const option: any = {
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
          formatter: name =>{
            let value = _.get(_.find(barData, v=> v.name === name),'value');
            return ['{a|' + name + '}', '{b|' + value + '}'].join('\n');
          },
          textStyle:{
            rich: {
              a: {
                color: '#858585',
                fontSize: 14,
                verticalAlign: 'middle'
              },
              b:{
                align: 'right',
                lineHeight: 40,
                fontSize: 18,
                color: '#464646',
                verticalAlign: 'middle'
              }
            },
          },
        },
        series: [
          {
            name: 'Chain Info',
            type: 'pie',
            radius: ['50%', '70%'],
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
            data: barData
          }
        ]
      };
      myChart.setOption(option);
    })().catch(console.error);
    window.addEventListener("resize", () =>{
      chainInfoRef.current.resize();
    });
  }, [])


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
            <span className={"chain-info-details-block-item"}>{lastHeaders.length}</span>
          </div>
          <div className={"chain-info-details-block"}>
            <span className={"chain-info-details-block-item label"}>latest block</span>
            <span className={"chain-info-details-block-item"}> <TimeNow /> <span className={"unit"} /></span>
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
