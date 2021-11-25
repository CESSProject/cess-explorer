import React, {useEffect, useRef, useState} from "react";
import _ from "lodash"
import moment from "moment"
import styled from "styled-components";
import * as echarts from "echarts";
import Icon from "@polkadot/react-components/Icon";
import {useApi} from "@polkadot/react-hooks";

const option:any ={
  title: {
    subtext: "unit(MB)"
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    icon: 'circle',
    right: '1%'
  },
  grid: {
    left: '0',
    right: '1%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    splitLine:{
      show: true
    },
  },
  yAxis: [
    {
      type: 'value',
      axisLabel:{
        formatter: value => Math.abs(value) + "MB"
      },
    }
  ],
  series: [
    {
      name: 'used storage',
      type: 'bar',
      stack: 'used storage',
      emphasis: {
        focus: 'series'
      },
      barWidth: '10',
      color: '#5078FE',
      data: [120, 132, 101, 134, 90, 230, 210,120, -132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'available storage',
      type: 'bar',
      stack: 'used storage',
      emphasis: {
        focus: 'series'
      },
      barWidth: '10',
      color: '#5CD5B4',
      data: [220, 182, 191, 234, 290, 330, 310,220, 182, 191, 234, 290, -330, 310,220, 182, 191, 234, 290, 330, 310,220, 182, 191, 234, 290, 330, 310]
    },

  ]
};

interface Props{
  className?: String
}

function NetworkStorageTrend({className}: Props): React.ReactElement<Props>{
  const { api } = useApi();
  const networkStorageTrendRef = useRef<any>();
  // const [xAxisData , setXAxisData] = useState<string[]>([]);
  // const [usedStorageData, setUsedStorageData] = useState<number[]>([]);
  // const [availableStorageData, setAvailableStorage] = useState<number[]>([]);

  const cleanData = list =>{
    let xAxisData: Array<string> = [], usedStorageData: Array<number> = [], availableStorageData: Array<number> = [];
    _.map(list, v=>{
      xAxisData.push(moment(v.time).format("YYYY-MM-DD"));
      usedStorageData.push(v.usedStorage);
      availableStorageData.push(~v.availableStorage);
    })
    return {xAxisData, usedStorageData, availableStorageData}
  }

  useEffect(() =>{
    (async (): Promise<void> =>{
      let list = await api.query.sminer.storageInfoVec();
      let {xAxisData, usedStorageData, availableStorageData} = cleanData(list.toJSON());
      console.log(xAxisData, usedStorageData, availableStorageData);
      option.xAxis.data = xAxisData;
      option.series[0].data = usedStorageData;
      option.series[1].data = availableStorageData;
      option.tooltip.formatter = list => {
        let res = list[0].name;
        for(let i=0;i<list.length;i++){
          res += "<br/>" + list[i].marker + list[i].seriesName + "<span style=\"margin-left:20px;text-align: right;font-weight: bold;\">" + Math.abs(list[i].value) + "MB</span>"
         }
        return res;
      };
      let myChart = networkStorageTrendRef.current = echarts.init(document.getElementById("network-storage-trend-box") as HTMLDivElement);
      myChart.setOption(option);
      window.addEventListener("resize", () =>{
        networkStorageTrendRef.current.resize();
      });
    })()
  }, [])

  return (
    <div className={`${className} network-storage-trend`}>
      <div className={"network-storage-trend-title"}>
        <Icon className='highlight--color' icon='dot-circle'/>
        <span>Network Storage Trend</span>
      </div>
      <div id="network-storage-trend-box" ref={networkStorageTrendRef} className={"network-storage-trend-box"} />
    </div>
  )
}

export default React.memo(styled(NetworkStorageTrend)`
  margin: 20px 0 50px 0;
  height: 420px;
  .network-storage-trend-title,.network-storage-trend-box{
    background: white;
    padding: 0.375rem 0.75rem 0.375rem 1.5rem;
    box-sizing: border-box;
  }
  .network-storage-trend-title{
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    >span{
      font-size: 24px;
      color: #464646;
      margin-left: 5px;
      vertical-align: middle;
      display: inline-block;
      margin-top: -3px;
    }
  }
  .network-storage-trend-box{
    width: 100%;
    height: 100%;
  }
`)
