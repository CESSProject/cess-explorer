import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import * as echarts from "echarts";

const option ={
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
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
    const resize = networkStorageTrendRef.current.resize();
    window.addEventListener("resize", resize);
  }, [])

  return (
    <div className={`${className} network-storage-trend`}>
      <div id="network-storage-trend-box" ref={networkStorageTrendRef} className={"network-storage-trend-box"} />
    </div>
  )
}

export default React.memo(styled(NetworkStorageTrend)`
  margin: 20px 0;
  background: white;
  width: 90% !important;
  //height: 100%;
  padding: 35px 1.5rem !important;
  box-sizing: border-box;
  height: 420px;
  .network-storage-trend-box{
    width: 100%;
    height: 100%;
  }
`)
