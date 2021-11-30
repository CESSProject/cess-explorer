import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import * as echarts from "echarts";
import {Button, Icon} from "@polkadot/react-components";
import RcTable from "@polkadot/react-components/RcTable";
import ReactTooltip from "react-tooltip";
import {useApi} from "@polkadot/react-hooks";
import _ from "lodash"
import {formatterCurrency, formatterSize, formatterSizeFromMB} from "./utils";

interface Props {
  className?: string,
  value?: number
}

function MinerDetail({className, value}: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const minerInfoRef = useRef<any>()
  const [minerDetail, setMinerDetail] = useState<any>({})

  useEffect(() => {
    (async ():Promise<void> =>{
      // let res:any = await api.query.sminer.minerDetails(1);
      let res:any = await api.query.sminer.minerDetails(value);
      let resJson: any = res.toJSON();
      resJson.totalRewardObj = formatterCurrency(resJson.totalReward);
      resJson.totalRewardsCurrentlyAvailableObj = formatterCurrency(resJson.totalRewardsCurrentlyAvailable);
      resJson.totaldNotReceiveObj = formatterCurrency(resJson.totaldNotReceive);
      resJson.collateralsObj = formatterCurrency(resJson.collaterals);
      if(res){
        setMinerDetail(resJson)
        let barData = [
          { value: resJson.space, name: 'used storage'},
          { value: resJson.power - resJson.space, name: 'available storage'},
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
        window.addEventListener("resize", () =>{
          minerInfoRef.current.resize();
        });
      }
    })()
  }, [value])

  const columns = React.useMemo(()=> [
    {Header: 'Miner ID', accessor: 'Miner ID'},
    {Header: 'Address1', accessor: 'address'},
    {Header: 'Address2', accessor: 'beneficiary'},
    {Header: 'Total Storage', accessor: 'totalStorage'},
    {Header: 'Average Daily Data Traffic (In)', accessor: 'averageDailyDataTrafficIn'},
    {Header: 'Average Daily Data Traffic (Out)', accessor: 'averageDailyDataTrafficOut'},
    {Header: 'Mining Reward', accessor: 'miningReward'},
    {
      Header: 'Call', accessor: 'Call', id: 'expander', // It needs an ID
      Cell: ({row}) => (
        <span {...row.getToggleRowExpandedProps()}>
          {row.values.expander}
          <Icon icon={row.isExpanded ? 'caret-up' : 'caret-down'}/>
        </span>
      ),
    },
  ], [])

  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <div className={"expand-group"}>
        <div>
          <p>AccountId32</p>
          <p>
            <span>Account name</span>
            <span>5DJPrZNBXD9vn6KgUBBvAFWGLJuD_</span>
          </p>
        </div>
        <div>
          <p>AccountId32</p>
          <p>
            <span>Account name</span>
            <span>5DJPrZNBXD9vn6KgUBBvAFWGLJuD_</span>
          </p>
        </div>
      </div>
    ),
    []
  )

  const changeTableFilter = () =>{}

  return (
    <div className={`${className} miner-detail`}>
      <div className={"miner-title"}>
        <Icon className='highlight--color' icon='dot-circle'/>
        <span className={"miner-title-text"}>Miner Detail</span>
      </div>
      <div className={"miner-content"}>
        <div className={"miner-info"}>
          <div className={"miner-info-left"}>
            <div className={"miner-info-left-tr label"}>Account</div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>Account name</span>
              <span className={"miner-info-left-td"}>{minerDetail && minerDetail.address && minerDetail.address.substr(0,5)}</span>
            </div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>Account1</span>
              <span className={"miner-info-left-td ellipsis"} data-effect={"solid"} data-tip={minerDetail && minerDetail.address}>
                {minerDetail && minerDetail.address}
              </span>
              <ReactTooltip effect="solid" delayUpdate={500} delayHide={2000}/>
            </div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>Account2 name</span>
              <span className={"miner-info-left-td"}> {minerDetail && minerDetail.beneficiary && minerDetail.beneficiary.substr(0,5) }</span>
            </div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>Account2</span>
              <span className={"miner-info-left-td ellipsis"} data-effect={"solid"} data-tip={minerDetail && minerDetail.beneficiary}>
                {minerDetail && minerDetail.beneficiary}
              </span>
              <ReactTooltip effect="solid" delayUpdate={500} delayHide={2000}/>
            </div>
          </div>
          <div className={"miner-info-right"}>
            <div id="miner-info-box" ref={minerInfoRef} className={"miner-info-box"}/>
          </div>

        </div>
      </div>
      <div className={"miner-content"}>
        <div className={"miner-balance"}>
          <div className={"miner-info-left"}>
            <div className={"miner-info-left-tr label"}>Balance</div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>total</span>
              <span className={"miner-info-left-td"}><span
                className={"miner-info-left-td-value"}>{ minerDetail && minerDetail.totalRewardObj && minerDetail.totalRewardObj.money } </span><span>{ minerDetail && minerDetail.totalRewardObj && minerDetail.totalRewardObj.suffix }</span></span>
            </div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>available transfers</span>
              <span className={"miner-info-left-td"}><span
                className={"miner-info-left-td-value"}>{ minerDetail && minerDetail.totalRewardsCurrentlyAvailableObj && minerDetail.totalRewardsCurrentlyAvailableObj.money} </span><span>{ minerDetail && minerDetail.totalRewardsCurrentlyAvailableObj && minerDetail.totalRewardsCurrentlyAvailableObj.suffix }</span></span>
            </div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>locked</span>
              <span className={"miner-info-left-td"}>
                <span className={"miner-info-left-td-value"}>{minerDetail && minerDetail.totaldNotReceiveObj && minerDetail.totaldNotReceiveObj.money }</span><span>{minerDetail && minerDetail.totaldNotReceiveObj && minerDetail.totaldNotReceiveObj.suffix }</span>
                <img className={"ellipsis"} src={require("./../../../assets/images/hoverInfo.png")} alt="" data-place={"right"} data-effect={"solid"}  data-tip={"Binding through harvest"}/>
                <ReactTooltip place={"right"} effect="solid" delayUpdate={500} delayHide={2000}/>
              </span>
            </div>
            <div className={"miner-info-left-tr"}>
              <span className={"miner-info-left-td"}>remaining staking</span>
              <span className={"miner-info-left-td"}><span
                className={"miner-info-left-td-value"}>{ minerDetail && minerDetail.collateralsObj && minerDetail.collateralsObj.money }</span><span>{ minerDetail && minerDetail.collateralsObj && minerDetail.collateralsObj.suffix }</span></span>
            </div>
          </div>
        </div>
      </div>
      {/*<div className={"miner-content"}>*/}
      {/*  <div className={"accout-table"}>*/}
      {/*    <div className={"btn-actions"}>*/}
      {/*      <Button isSelected label={"Extrinsics (2)"} onClick={changeTableFilter}/>*/}
      {/*    </div>*/}
      {/*    <RcTable isShowPagination={false} columns={columns} data={state.data} renderRowSubComponent={renderRowSubComponent}/>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
}

export default React.memo(styled(MinerDetail)`
  margin: -50px 0 20px 0;
  font-size: 16px;

  .miner-title, .miner-content {
    padding: 26px 1.5rem !important;
    background: white;
    border-radius: 6px;
    .accout-title-text{
      margin-left: 5px;
    }
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
