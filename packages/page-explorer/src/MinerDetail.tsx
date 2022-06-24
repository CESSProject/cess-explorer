import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as echarts from "echarts";
import { Button, Icon } from "@polkadot/react-components";
import ReactTooltip from "react-tooltip";
import { useApi } from "@polkadot/react-hooks";
import _ from "lodash"
import { formatterCurrency, formatterSizeFromMB, isJson } from "./utils";
import Empty from "@polkadot/app-explorer/components/Empty";
import MinerSearch from "./components/MinerSearch";

interface Props {
  className?: string,
  value?: number
}

function MinerDetail({ className, value }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const minerInfoRef = useRef<any>()
  const [minerDetail, setMinerDetail] = useState<any>({})

  useEffect(()=>{ // by cbf
    (async (): Promise<void> =>{
      const minerItems:any = await api.query.sminer.minerItems.entries();//get all miner list

      let miners:any[]= [];
      minerItems.forEach(([key, entry]) => {// get id
        let address:string = key.args.map((k) => k.toHuman());
        address=address[0];
        let jsonObj = entry.toJSON();        
        let totalReward=_.toNumber(jsonObj.rewardInfo.totalReward);
        let totalRewardObj=formatterCurrency(totalReward);
        let totalRewardsCurrentlyAvailableObj=formatterCurrency(_.toNumber(jsonObj.rewardInfo.totalRewardsCurrentlyAvailable));
        let totaldNotReceiveObj=formatterCurrency(_.toNumber(jsonObj.rewardInfo.totaldNotReceive));
        let collateralsObj=formatterCurrency(_.toNumber(jsonObj.collaterals));
        miners.push(_.assign(jsonObj,{address,totalRewardObj,totalRewardsCurrentlyAvailableObj,totaldNotReceiveObj,collateralsObj}));
      });
      let miner=miners.find(t=>t.peerid==value);
      // console.log('***************miner*****************');
      // console.log(miner);
      setMinerDetail(miner);

    })().catch(console.error);
  }, [])

  useEffect(() => {
    (async (): Promise<void> => {
      let barData = [
        { value: minerDetail.space, name: 'used storage' },
        { value: minerDetail.power - minerDetail.space, name: 'available storage' },
      ];
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
          formatter: name => {
            let value = _.get(_.find(barData, v => v.name === name), 'value');
            return ['{a|' + name + '}', '{b|' + formatterSizeFromMB(value) + '}'].join('\n');
          },
          textStyle: {
            rich: {
              a: {
                color: '#858585',
                fontSize: 14,
                verticalAlign: 'middle'
              },
              b: {
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
      let myChart = minerInfoRef.current = echarts.init(document.getElementById("miner-info-box") as HTMLDivElement);
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        minerInfoRef.current.resize();
      });
    })()
  }, [value])

  const renderRowSubComponent = React.useCallback((
    ({ row }) => {
      let params = row.original.params;
      let rowInfo: any;
      if (isJson(params)) {
        rowInfo = JSON.parse(params)
      }
      return (
        <>
          {
            rowInfo ? <div className={"expand-group"}>
              {
                rowInfo.map(info => (
                  <div>
                    <p>{info.type}</p>
                    <p>
                      <span>{info.name}</span>
                      <span>{_.isObject(info.value) ? JSON.stringify(info.value) : info.value}</span>
                    </p>
                  </div>
                ))
              }
            </div> : <div />
          }
        </>

      )
    }
  ), [])


  return (
    <>
      {
        !_.isEmpty(minerDetail) ? <div className={`${className} miner-detail`}>
          <div className={"miner-title"}>
            <Icon className='highlight--color' icon='dot-circle' />
            <span className={"miner-title-text"}>Miner Detail</span>
            <MinerSearch className="right-search-box" />
          </div>
          <div className={"miner-content"}>
            <div className={"miner-info"}>
              <div className={"miner-info-left"}>
                <div className={"miner-info-left-tr label"}>Accounts</div>
                <div className={"miner-info-left-tr"}>
                  <span className={"miner-info-left-td"}>miner ID</span>
                  <span className={"miner-info-left-td"}>{value}</span>
                </div>
                <div className="hold"></div>
                <div className={"miner-info-left-tr"}>
                  <span className={"miner-info-left-td"}>account-1 name</span>
                  <span className={"miner-info-left-td"}>{minerDetail && minerDetail.address && (minerDetail.address.substr(0, 5) + '...' + minerDetail.address.substr(minerDetail.beneficiary.length - 5, minerDetail.address.length - 1))}</span>
                </div>
                <div className={"miner-info-left-tr"}>
                  <span className={"miner-info-left-td"}>account-1</span>
                  <span className={"miner-info-left-td ellipsis"} data-for='address' data-effect={"solid"} data-tip={""}>
                    {minerDetail && minerDetail.address}
                  </span>
                  <ReactTooltip id={"address"} effect="solid" delayUpdate={500} delayHide={2000} getContent={() => { return minerDetail.address }} />
                </div>
                <div className="hold"></div>
                <div className={"miner-info-left-tr"}>
                  <span className={"miner-info-left-td"}>account-2 name</span>
                  <span className={"miner-info-left-td"}> {minerDetail && minerDetail.beneficiary && (minerDetail.beneficiary.substr(0, 5) + '...' + minerDetail.beneficiary.substr(minerDetail.beneficiary.length - 5, minerDetail.beneficiary.length - 1))}</span>
                </div>
                <div className={"miner-info-left-tr"}>
                  <span className={"miner-info-left-td"}>account-2</span>
                  <span className={"miner-info-left-td ellipsis"} data-for='beneficiary' data-effect={"solid"} data-tip={""}>
                    {minerDetail && minerDetail.beneficiary}
                  </span>
                  <ReactTooltip id={"beneficiary"} effect="solid" delayUpdate={500} delayHide={2000} getContent={() => { return minerDetail.beneficiary }} />
                </div>
              </div>
              <div className={"miner-info-right"}>
                <div id="miner-info-box" ref={minerInfoRef} className={"miner-info-box"} />
              </div>

            </div>
          </div>
          <div className={"miner-content"}>
            <div className={"miner-balance"}>
              <div className={"miner-info-left"}>
                <div className={"miner-info-left-tr label"}>Balance</div>
                <div className={"miner-info-left-tr"}>
                  <span className={"miner-info-left-td"}>total reward</span>
                  <span className={"miner-info-left-td"}><span
                    className={"miner-info-left-td-value"}>{minerDetail && minerDetail.totalRewardObj && minerDetail.totalRewardObj.money} </span><span>{minerDetail && minerDetail.totalRewardObj && minerDetail.totalRewardObj.suffix}</span></span>
                </div>
                <div className={"miner-info-left-tr"}>
                  <span className={"miner-info-left-td"}>available</span>
                  <span className={"miner-info-left-td"}><span
                    className={"miner-info-left-td-value"}>{minerDetail && minerDetail.totalRewardsCurrentlyAvailableObj && minerDetail.totalRewardsCurrentlyAvailableObj.money} </span><span>{minerDetail && minerDetail.totalRewardsCurrentlyAvailableObj && minerDetail.totalRewardsCurrentlyAvailableObj.suffix}</span></span>
                </div>
                <div className={"miner-info-left-tr"}>
                  <span className={"miner-info-left-td"}>total not receive</span>
                  <span className={"miner-info-left-td"}>
                    <span className={"miner-info-left-td-value"}>{minerDetail && minerDetail.totaldNotReceiveObj && minerDetail.totaldNotReceiveObj.money}</span><span>{minerDetail && minerDetail.totaldNotReceiveObj && minerDetail.totaldNotReceiveObj.suffix}</span>
                    <img className={"ellipsis"} src={require("./../../../assets/images/hoverInfo.png")} alt="" data-place={"right"} data-effect={"solid"} data-tip={"Binding through harvest"} />
                    <ReactTooltip place={"right"} effect="solid" delayUpdate={500} delayHide={2000} />
                  </span>
                </div>
                <div className={"miner-info-left-tr"}>
                  <span className={"miner-info-left-td"}>collaterals</span>
                  <span className={"miner-info-left-td"}><span
                    className={"miner-info-left-td-value"}>{minerDetail && minerDetail.collateralsObj && minerDetail.collateralsObj.money}</span><span>{minerDetail && minerDetail.collateralsObj && minerDetail.collateralsObj.suffix}</span></span>
                </div>
              </div>
            </div>
          </div>
          <div className={"miner-content"}>
            <div className={"accout-table"}>
            </div>
          </div>
        </div> : <Empty />
      }
    </>
  )
}

export default React.memo(styled(MinerDetail)`
  margin: -50px 0 20px 0;
  font-size: 16px;
  .miner-title, .miner-content {
    padding: 26px 1.5rem !important;
    background: white;
    border-radius: 6px;
    .miner-title-text{
      margin-left: 5px;
    }
  }
  .hold{
    width:100%;
    height:20px;
    display:block;
    overflow:hidden;
    clear:both;
  }

  .miner-content {
    margin-top: 4px;
    box-sizing: border-box;
    border-radius: 6px;

    & .miner-info,.miner-balance {
      display: flex;

      &-left {
        width: 50%;
        font-size: 16px;

        &-tr {
          padding: 16px 0;
          box-sizing: border-box;
          border-bottom: 1px solid #DBDBDB;
          &.label{
            color: #5078FE
          }
        }

        &-td {
          display: inline-block;
          width: 50%;

          &.ellipsis{
            overflow: hidden;
            text-overflow: ellipsis;
          }

          &-value {
            font-size: 28px;
            color: #5078FE;
            margin-right: 20px;
            vertical-align: middle;
          }
          >img{
            vertical-align: baseline;
            margin-left: 20px;
          }
        }
      }

      &-right {
        width: 50%;
        .miner-info-box{
          width: 100%;
          height: 100%;
        }
      }
    }
    & .accout-table{
      & .btn-actions{
        margin-bottom: 20px;
      }
      & .expand-group{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        >div{
          width: 700px;text-align: left; border: 1px dashed #DBDBDB; padding: 10px;box-sizing: border-box;
          >p:last-child{
            display: flex;
            justify-content: space-between;
          }
        }
        >div:last-child{
          margin: 8px 0;
        }
      }
    }
  }
`)
