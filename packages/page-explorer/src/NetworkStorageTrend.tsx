import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import * as echarts from "echarts";
import Icon from "@polkadot/react-components/Icon";

const option ={
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    icon: 'circle',
    right: '4%'
  },
  grid: {
    left: '0',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Email',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      barWidth: '10',
      color: '#5078FE',
      data: [120, 132, 101, 134, 90, 230, 210,120, -132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      color: '#5CD5B4',
      data: [220, 182, 191, 234, 290, 330, 310,220, 182, 191, 234, 290, -330, 310,220, 182, 191, 234, 290, 330, 310,220, 182, 191, 234, 290, 330, 310]
    },

  ]
};

interface Props{
  className?: String
}

function NetworkStorageTrend({className}: Props): React.ReactElement<Props>{
  const networkStorageTrendRef = useRef<any>();

  useEffect(() =>{
    let myChart = networkStorageTrendRef.current = echarts.init(document.getElementById("network-storage-trend-box") as HTMLDivElement);
    myChart.setOption(option);
    window.addEventListener("resize", () =>{
      networkStorageTrendRef.current.resize();
    });
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
  margin: 20px 0;
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
    margin-bottom: 20px;
  }
`)
