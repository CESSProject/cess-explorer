import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import _ from "lodash"
import styled from "styled-components";
import * as echarts from "echarts"
import {useTranslation} from "@polkadot/app-explorer/translate";
import {useApi} from "@polkadot/react-hooks";
import {BlockAuthorsContext} from "@polkadot/react-query";
import { formatterSizeFromMB} from '../utils';


interface Props{
  className?: string
}

function StorageGroup({className}: Props): React.ReactElement<Props>{
  const chainInfoRef = useRef<any>()
  const { t } = useTranslation();
  const { api } = useApi();
  const { lastHeaders } = useContext(BlockAuthorsContext);
  const [barData, setBarData] = useState<any>([]);
  const [utilization, setUtilization] = useState(0)

  useEffect(() =>{
    let myChart = echarts.init(chainInfoRef.current);
    (async (): Promise<void> =>{
      let storageInfoValue = await api.query.sminer.storageInfoValue();
      let storageInfo = storageInfoValue.toJSON();
      drawUtilization({used_storage: _.toNumber(_.get(storageInfo , 'usedStorage' )), available_storage: _.toNumber(_.get(storageInfo , 'availableStorage' ))});
      let barData = [
        { value: _.get(storageInfo , 'usedStorage' ), name: 'used storage'},
        { value: _.get(storageInfo , 'availableStorage' ), name: 'available storage'},
      ];
      setBarData(barData);
      const option: any = {
        tooltip: {
          trigger: 'item',
          formatter: list => {
            let res = list.name;
            res += "<br/>" + list.marker + list.seriesName + "<span style=\"margin-left:20px;text-align: right;font-weight: bold;\">" + formatterSizeFromMB(Math.abs(list.value)) + "</span>"
            return res;
          }
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
            return ['{a|' + name + '}', '{b|' + formatterSizeFromMB(value) + '}'].join('\n');
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
        grid:{
          left: '2%',
        },
        series:
          {
            name: 'Chain Info',
            type: 'pie',
            right: '40%',
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

      };
      myChart.setOption(option);
    })().catch(console.error);
    window.addEventListener("resize", () =>{
      myChart.resize();
    });
  }, [])

  const getCoordinate = (x0, y0, r, angle) =>{
    let percentX = x0 + r * Math.cos(angle * Math.PI/180)
    let percentY = y0 + r * Math.sin(angle * Math.PI/180)
    return {percentX, percentY}
  }

  const drawUtilization = ({used_storage, available_storage}) =>{
    let usedPercent: number = used_storage / (used_storage + available_storage);
    setUtilization(_.round(usedPercent,2)*100);
    let percentPI: number = 0;
    let coordinate: any;
    let canvas = document.getElementsByClassName("chain-info-percent-canvas")[0] as HTMLCanvasElement;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //1、画未使用的容量弧线描边
    ctx?.beginPath();
    ctx?.arc(150,150,100,0.5*Math.PI, 2.5 * Math.PI, false);
    ctx.lineWidth=3;
    ctx.strokeStyle="#8FBFFF";
    ctx?.stroke();
    ctx?.save();
    //2、画已使用的容量弧线描边
    ctx?.beginPath();
    if(usedPercent < 0.25){
      percentPI = 0.5 - 0.5 * usedPercent/0.25;
      coordinate = getCoordinate(150,150,100, 90 - usedPercent/0.25 * 90)
    } else if(usedPercent >= 0.25 && usedPercent <0.5){
      percentPI = 2 - 0.5*(usedPercent - 0.25) / 0.25;
      coordinate = getCoordinate(150,150,100, 360 - (usedPercent - 0.25)/0.25 * 90)
    }else if (usedPercent >= 0.5 && usedPercent <0.75){
      percentPI = 1.5 - 0.5 * (usedPercent - 0.5) / 0.25;
      coordinate = getCoordinate(150,150,100, 270 - (usedPercent - 0.5)/0.25 * 90)
    } else {
      percentPI = 1 - 0.5 *(usedPercent - 0.75)/ 0.25 === 0.5 ? 0.51 : 1 - 0.5 *(usedPercent - 0.75)/ 0.25; //如果逆时针绘制 0.5PI到 0.5PI，canvas不会绘制，改为 0.5PI到 0.51PI
      coordinate = getCoordinate(150,150,100, 180 - (usedPercent - 0.75)/0.25 * 90)
    }
    ctx?.arc(150,150,100, 0.5*Math.PI,percentPI * Math.PI, true);
    ctx.strokeStyle="#FF9C07";
    ctx.lineWidth=6;
    ctx?.stroke();
    ctx?.save();
    //3、画交汇圆点
    ctx?.beginPath();
    ctx?.arc(coordinate.percentX,coordinate.percentY,16,0,2* Math.PI);
    ctx.fillStyle = "#FF9C07";
    ctx?.fill();
    ctx?.closePath();
  }

  return (
    <div className={`${className}`}>
      <div className={"chain-info-bar"}>
        <div ref={chainInfoRef} className={"chain-info-bar-box"} />
      </div>
      {/*百分比图*/}
      <div className={"chain-info-percent"}>
        <canvas className={"chain-info-percent-canvas"} width={300} height={300}/>
        <div className={"chain-info-percent-detail"}>
          <div className={"chain-info-percent-detail-left"}>
            <p>utilization</p>
            <p>{_.round(utilization, 1)} %</p>
          </div>
          <div className={"chain-info-percent-detail-right"} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(styled(StorageGroup)`
  width: 67%;
  height: 100%;
  display: flex;
  .chain-info-bar{
    width: 50%;
    height: 100%;
    &-box{
      width: 100%;
      //height: 100%;
      min-height: 300px;
    }
  }
  .chain-info-percent{
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;
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
        border-radius: 2px;
        background: #FF9C07;
        margin-left: 12px;
      }
    }
  }
`)
