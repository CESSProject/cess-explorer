import React, {Fragment, useEffect, useState} from "react"
import styled from "styled-components"
import {Button, Icon} from "@polkadot/react-components";
import request from "./utils/reuqest";
import _ from "lodash"
import moment from "moment";
import RcTable from "@polkadot/react-components/RcTable";

interface Props{
  className?: string,
  value: string
}

function ExtrinsicDetail({className, value}:Props) :React.ReactElement<Props>{
  const [extrinsicInfo, setExtrinsicInfo] = useState<any>({});
  const [eventList, setEventList] = useState<any>([]);
  const [isShowJson, toggleShowJson] = useState(false);

  const getMoreParameter = () =>{}

  const showJsonCode = () => {
    toggleShowJson(!isShowJson);
  };

  const showEventJsonCode = (id) =>{
    let list = eventList;
    console.log(id, 'ryyyyyyyooooooooooooooooo', list, 'eventListeventList',eventList, extrinsicInfo, 'propspropsprops')
    // let idx = _.findIndex(list, v=>v.id === id);
    // _.set(eventList,`${idx}.isShowEventJson`, true);
    // list[idx].isShowEventJson = true;
    // console.log(list, 'listlistlistlistlistlistlistlistlistlistlist', idx, id)
    // setEventList(list);
  };

  useEffect(() =>{
    fetchData();
  },[value])

  const fetchData = async (): Promise<void> =>{
    let params = {hash: value};
    let res:any = await request.post({url:"http://106.15.44.155:4399/api/scan/extrinsic", params});
    if(res && res.data){
      if(res.data.call_module === "balances" && (res.data.call_module_function === "transfer_keep_alive" || res.data.call_module_function === "transfer")){
        let events = res.data.events;
        let destinationItem = _.find(events, v=> v.name ==="dest");
        let valueItem = _.find(events, v=> v.name ==="value");
        res.data.destination = destinationItem?.value?.id;
        res.data.value = valueItem?.value;
      }
      setExtrinsicInfo(res.data);
      res.data.event = _.map(res.data.event, t=>{
        t.isShowEventJson = false;
        return t;
      })
      setEventList(res.data.event);
    }
  }

  const columns = React.useMemo(()=> [
    {Header: 'Event ID', accessor: 'event_id',id:'event_id', width: '12.5%'},
    {Header: 'Hash', accessor: 'extrinsic_hash',id:'extrinsic_hash', width: '12.5%'},
    {
      Header: 'Operation', accessor: 'operation', id: 'operation', // It needs an ID
      Cell: ({row}) => (
        <span {...row.getToggleRowExpandedProps()}>
          {`${row.original.module_id}(${row.original.event_id})`}
          <Icon icon={row.isExpanded ? 'caret-up' : 'caret-down'} />
        </span>
      ),
    },
  ], [])

  const renderRowSubComponent = React.useCallback((
    ({ row }) =>{
      let params = row.original.params;
      let rowInfo = JSON.parse(params);
      console.log(row, '444444444444455555555555555555555555555555555', rowInfo);
      return (
        <div  className={"expand-group"}>
          <div className={"expand-group-list"}>
            {
              rowInfo ? rowInfo.map((p, index)=>(
                <p key={index} className={"json-item"}><span>{p.type}</span><span>{ _.isObject(p.value) ? p.value.weight : p.value }</span></p>
              )) : <div />
            }
          </div>
          <div className={"expand-code"}>
            <Button isSelected label={"View Code"} onClick={()=>{
              console.log(eventList, 'rrrrrrrrrrrrrrrr555555555')
              showEventJsonCode(row.id)}
            } />
            { row.original && row.original.isShowEventJson && <div><pre><code>{params}</code></pre></div> }
          </div>
        </div>
      )
    }
  ), [])

  console.log(eventList, 'eventListeventListeventListeventListeventListeventList')

  return (
    <div className={`${className} extrinsic-detail`}>
      <div className={"extrinsic-title"}>
        Extrinsic Detail
      </div>
      <div className={"extrinsic-content"}>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Extrinsic ID</span>
          <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.extrinsic_index }</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Time</span>
          <span className={"extrinsic-content-form-item-value"}> { moment(extrinsicInfo.block_timestamp).format("YYYY-MM-DD HH:mm:ss") } </span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Extrinsic hash</span>
          <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.extrinsic_hash }</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Block</span>
          <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.block_num }</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Module</span>
          <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.call_module }</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Call</span>
          <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.call_module_function }</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Sender</span>
          <span className={"extrinsic-content-form-item-value"}>{extrinsicInfo.account_id}</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Destination</span>
          <span className={"extrinsic-content-form-item-value"}>{extrinsicInfo.destination}</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Value</span>
          <span className={"extrinsic-content-form-item-value"}>{extrinsicInfo.value}</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Gas</span>
          <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.fee }</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Nonce</span>
          <span className={"extrinsic-content-form-item-value"}>{ extrinsicInfo.nonce }</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Result</span>
          <Icon color='#5CD5B4'  icon='check-circle'/>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>parameter</span>
          <div className={"extrinsic-content-form-item-parameter"}>
            <div className={"extrinsic-content-form-item-parameter-list"}>
              {
                extrinsicInfo && extrinsicInfo.params && extrinsicInfo.params.map(p => {
                  return <p><span>{p.name}</span><span>{p.value}</span></p>
                })
              }
              <Button isSelected label={"More"} onClick={getMoreParameter} />
            </div>
            <div className={"extrinsic-content-form-item-parameter-actions"}>
              <Button isSelected label={"View Code"} onClick={showJsonCode} />
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
        Events
      </div>
      <div className={"event-content"}>
        <div className={"event-table"}>
          <RcTable columns={columns} data={eventList} renderRowSubComponent={renderRowSubComponent}/>
        </div>
      </div>
    </div>
  )
}

export default React.memo(styled(ExtrinsicDetail)`
  margin: 20px 0;
  font-size: 16px;

  .extrinsic-title, .extrinsic-content, .events-title, .event-content {
    padding: 15px 1.5rem !important;
    background: white;
    border-radius: 6px;
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
    margin-top: 10px;
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
          max-height: 400px;
          overflow-y: auto;
          border-left: 3px solid #8FBFFF;
          >pre{
            border: 1px dotted #DBDBDB;
            margin: 18px 0 0 24px
          }
        }
      }
    }
  }
`)
