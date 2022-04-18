import React, {Fragment, useEffect, useState} from "react"
import styled from "styled-components"
import {Button, Icon} from "@polkadot/react-components";
import request from "./utils/reuqest";
import _ from "lodash"
import moment from "moment";
import RcTable from "@polkadot/react-components/RcTable";
import Empty from "@polkadot/app-explorer/components/Empty";
import {useLoadingDelay} from "@polkadot/react-hooks";
import {isJson} from "@polkadot/app-explorer/utils";
import {httpUrl} from "@polkadot/apps-config/http";

interface Props{
  className?: string,
  value: string
}

function ExtrinsicDetail({className, value}:Props) :React.ReactElement<Props>{
  const [extrinsicInfo, setExtrinsicInfo] = useState<any>({});
  const [eventList, setEventList] = useState<any>([]);
  const [isShowJson, toggleShowJson] = useState(false);
  const [isShowAllParams, setShowAll] = useState(false);

  const getMoreParameter = () =>{
    setShowAll(!isShowAllParams);
  }

  const showJsonCode = () => {
    toggleShowJson(!isShowJson);
  };

  const showEventJsonCode = (id, isExpanded) =>{
    let idx = _.findIndex(eventList, v=>v.event_id === id);
    eventList[idx].isShowEventJson = !eventList[idx].isShowEventJson;
    eventList[idx].isExpanded = isExpanded;
    setEventList([...eventList]);
  };

  useEffect(() =>{
    fetchData();
  },[value])

  const fetchData = async (): Promise<void> =>{
    let params = {hash: value};
    let res:any = await request.post({url:`${httpUrl}/api/scan/extrinsic`, params});//use http api
    if(res && res.data){
      if(res.data.call_module === "balances" && (res.data.call_module_function === "transfer_keep_alive" || res.data.call_module_function === "transfer")){
        let events = res.data.events;
        let destinationItem = _.find(events, v=> v.name ==="dest");
        let valueItem = _.find(events, v=> v.name ==="value");
        res.data.destination = destinationItem?.value?.id;//dest
        res.data.value = valueItem?.value;
      }
      setExtrinsicInfo(res.data);
      res.data.event = _.map(res.data.event, t=>{
        t.isShowEventJson = false;
        return t;
      })
      setEventList(res.data.event);
    } else {
      setExtrinsicInfo([]);
    }
  }

  const columns = React.useMemo(()=> [
    {Header: 'event ID', accessor: 'event_id',id:'event_id', width: '12.5%'},
    {Header: 'hash', accessor: 'extrinsic_hash',id:'extrinsic_hash', width: '12.5%'},
    {
      Header: 'operation', accessor: 'operation', id: 'operation', 
      Cell: ({row}) => (
        <span {...row.getToggleRowExpandedProps()}>
          {`${row.original.module_id}(${row.original.event_id})`}
          <Icon icon={row.isExpanded ? 'caret-up' : 'caret-down'} />
        </span>
      ),
    },
  ], [])

  const renderRowSubComponent = (
    ({ row }) =>{
      let params = row.original.params;
      let isValid = isJson(params)
      let rowInfo:any;
      if(isValid){
        rowInfo = JSON.parse(params);
      }
      return (
        <>
          {
            isValid && rowInfo ?
            <div  className={"expand-group"}>
              <div className={"expand-group-list"}>
                {
                  rowInfo ? rowInfo.map((p, index)=>(
                    <p key={index} className={"json-item"}><span>{p.type}</span><span>{ _.isObject(p.value) ? JSON.stringify(p.value) : p.value }</span></p>
                  )) : <div />
                }
              </div>
              <div className={"expand-code"}>
                <Button isSelected label={row.original.isShowEventJson ? "Decode" : "View Code"} onClick={()=> {
                  showEventJsonCode(row.original.event_id, row.isExpanded)
                }}
                />
                { row.original.isShowEventJson && <div><pre><code>{JSON.stringify(rowInfo, null, 2)}</code></pre></div> }
              </div>
            </div> : <div />
          }
        </>

      )
    }
  )

  return (
    <>
      {
        !_.isEmpty(extrinsicInfo) ?
          <div className={`${className} extrinsic-detail`}>
            <div className={"extrinsic-title"}>
              <Icon className='highlight--color' icon='dot-circle'/>
              <span className={"extrinsic-title-text"}>Extrinsic Detail</span>
            </div>
            <div className={"extrinsic-content"}>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>extrinsic ID</span>
                <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.extrinsic_index }</span>
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>time</span>
                <span className={"extrinsic-content-form-item-value"}> { moment(extrinsicInfo.block_timestamp * 1000).format("YYYY-MM-DD HH:mm:ss") } </span>
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>extrinsic hash</span>
                <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.extrinsic_hash }</span>
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>block</span>
                <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.block_num }</span>
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>module</span>
                <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.call_module }</span>
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>call</span>
                <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.call_module_function }</span>
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>sender</span>
                <span className={"extrinsic-content-form-item-value"}>{extrinsicInfo.account_id}</span>
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>destination</span>
                <span className={"extrinsic-content-form-item-value"}>{extrinsicInfo.destination}</span>
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>value</span>
                <span className={"extrinsic-content-form-item-value"}>{extrinsicInfo.value}</span>
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>gas</span>
                <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.fee }</span>
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>nonce</span>
                <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.nonce }</span>
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>result</span>
                {
                  extrinsicInfo.success ? (extrinsicInfo.finalized ? <img src={require("./../../../assets/images/status/success.png")} alt=""/> :   <img src={require("./../../../assets/images/status/wait.png")} alt=""/>) : <img src={require("./../../../assets/images/status/fail.png")} alt=""/>
                }
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>parameter</span>
                <div className={"extrinsic-content-form-item-parameter"}>
                  <div className={"extrinsic-content-form-item-parameter-list"}>
                    {
                      extrinsicInfo && extrinsicInfo.params && (isShowAllParams ? extrinsicInfo.params : _.slice(extrinsicInfo.params, 0, 5)).map((p,idx) => {
                        return <p key={idx}><span>{p.name}</span><span>{ _.isObject(p.value) ? JSON.stringify(p.value) : p.value}</span></p>
                      })
                    }
                    {extrinsicInfo.params && extrinsicInfo.params.length > 5 && <Button isSelected label={isShowAllParams ? "Put Away":"More"} onClick={getMoreParameter} />}
                  </div>
                  <div className={"extrinsic-content-form-item-parameter-actions"}>
                    <Button isSelected label={isShowJson ? "Decode" : "View Code"} onClick={showJsonCode} />
                    { isShowJson && <div><pre><code>{JSON.stringify(extrinsicInfo.params, null, 2)}</code></pre></div> }
                  </div>
                </div>
              </div>
              <div className={"extrinsic-content-form-item"}>
                <span className={"extrinsic-content-form-item-label"}>signature</span>
                <span className={"extrinsic-content-form-item-value"}>{extrinsicInfo.signature}</span>
              </div>
            </div>
            <div className={"events-title"}>
              <Icon className='highlight--color' icon='dot-circle'/>
              <span className={"events-title-text"}>Events</span>
            </div>
            <div className={"event-content"}>
              <div className={"event-table"}>
                <RcTable columns={columns} data={eventList} renderRowSubComponent={renderRowSubComponent}/>
              </div>
            </div>
          </div> : <Empty />
      }
    </>

  )
}

export default React.memo(styled(ExtrinsicDetail)`
  margin: -50px 0 0px 0;
  font-size: 16px;

  .extrinsic-title, .extrinsic-content, .events-title, .event-content {
    padding: 26px 1.5rem !important;
    box-sizing: border-box;
    background: white;
    border-radius: 6px;
  }
  .extrinsic-title, .events-title{
    &-text{
      margin-left: 5px;
    }
  }
  .extrinsic-content{
    margin-top: 4px;
    &-form-item{
      border-bottom: 1px solid #DBDBDB;
      padding: 20px 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      &-label{
        display: inline-block;
        width: 20%;
      }
      &-parameter{
        width: 80%;
        display: flex;
        justify-content: space-between;
        &-list{
          width: 40%;
          max-height: 400px;
          overflow-y: auto;
          >p{
            border-bottom: 1px solid #DBDBDB;
            >span{
              display: inline-block;
              width: 50%;
            }
          }
        }
        &-actions{
          width: 50%;
          text-align: left;
          max-height: 400px;
          overflow-y: auto;
          >div{
            border-left: 3px solid #8FBFFF;
            >pre{
              border: 1px dotted #DBDBDB;
              margin: 18px 0 0 24px
            }
          }
        }
      }
    }
  }
  .events-title{
    margin-top: 20px;
  }
  .event-content{
    margin-top: 4px;
    .event-table{
      & .btn-actions{
        margin-bottom: 20px;
      }
      & .expand-group{
        display: flex;
        justify-content: space-between;
        border: 1px dashed #DBDBDB;
        padding: 10px;
        box-sizing: border-box;
        .expand-group-list{
          width: 50%;
          .json-item{
            border-bottom: 1px solid #DBDBDB;
            >span{
              display: inline-block;
              width: 50%;
            }
          }
        }
        .expand-code{
          width: 40%;
          text-align: left;
          max-height: 400px;
          overflow-y: auto;
          div{
            border-left: 3px solid #8FBFFF;
            >pre{
              border: 1px dotted #DBDBDB;
              margin: 18px 0 0 24px
            }
          }
        }
      }
    }
  }
`)
