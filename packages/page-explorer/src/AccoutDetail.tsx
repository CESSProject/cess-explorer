import _ from "lodash"
import ControlledTable from "@polkadot/react-components/RcTable/ControlledTable"
import RcTable from "@polkadot/react-components/RcTable"
import React, {Fragment, useCallback, useEffect, useState} from "react"
import styled from "styled-components"
import {Button} from "@polkadot/react-components";
import IdentityIcon from "@polkadot/react-components/IdentityIcon";
import ReactTooltip from 'react-tooltip';
import {useApi} from "@polkadot/react-hooks";
import {formatterCurrency, formatterCurrencyStr, formatterSize} from "./utils";
import Empty from "./components/Empty";
import Icon from "@polkadot/react-components/Icon";
import request from "./utils/reuqest";
import moment from "moment";
import {httpUrl, linkUrl} from "@polkadot/apps-config/http"

interface Props{
  className? :string,
  value?: string
}

type Currency ={
  money: string,
  suffix: string
}

interface DnsResponse {
  Answer?: { name: string }[];
  Question: { name: string }[];
}

function AccoutDetail({className, value}: Props) :React.ReactElement<Props>{
  const { api } = useApi();
  const [size, setSize] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [extrinsics, setExtrinsics] = useState<any[]>([]);
  const [accountInfo, setAccountInfo] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>( 'extrinsics')
  const [pageCount, setPageCount] = useState<number>(0);
  const [extrinsicCount,setExtrinsicCount] = useState<number>(0);

  useEffect(()=>{
    if(value){
      (async (): Promise<void> =>{
        // const result = await api.query.system.account("5HbW1vWRgUbkxqEYRiNVdd6Kx57yuETbZNE1THG5Dk8oSYhP");
        const result:any = await api.query.system.account(value);
        if(result){
          let info = result.toJSON();
          let otherInfo = result.toHuman();
          let freeStr: string = otherInfo.data.free;
          let freeInt: number = _.toNumber(freeStr.replace(/,/g,''));
          let total: number = freeInt + _.toNumber(otherInfo.data.reserved.replace(/,/g,''));
          let availableTransfers: number = freeInt - _.toNumber(otherInfo.data.feeFrozen.replace(/,/g,''));
          let totalObj: Currency = formatterCurrency(total);
          let reservedObj: Currency = formatterCurrency(info.data.reserved);
          let availableTransfersObj: Currency = formatterCurrency(availableTransfers);
          let obj:any = { totalObj, reservedObj, availableTransfersObj }
          setAccountInfo(obj);
        }
      })().catch(console.error);
    }
  }, [value])

  useEffect(()=>{
    if(value){
      (async ():Promise<void> =>{
        let res:any = await api.query.fileBank.userFileSize(value);
        if(res){
          let size = res.toJSON() || 0;
          size = formatterSize(size);
          setSize(size);
        }
      })().catch(console.error);
    }
  },[value])

  useEffect(()=>{
    if(value){
      fetchData("extrinsics");
    }
  },[value])

  const fetchData = async (tab) =>{
    setActiveTab(tab);
    if(tab === 'extrinsics'){
      await fetchData2({pageSize: 10, pageIndex: 0});
    } else {
      let entries:any = await api.query.fileBank.file.entries();
      let list:any[]= [];
      entries.forEach(([key, entry]) => {
        let fileid:string = key.args.map((k) => k.toHuman());
        // console.log('key arguments:', key.args.map((k) => k.toHuman()));
        // console.log('account data--->', entry.toHuman(), 'toJSON ---->', entry.toJSON());
        let jsonObj = entry.toJSON();
        let humanObj = entry.toHuman();
        if(jsonObj.owner == value){
          jsonObj.filesize = formatterSize(jsonObj.filesize);
          jsonObj.filename = humanObj.filename;
          jsonObj.similarityhash = humanObj.similarityhash;
          list.push(_.assign(jsonObj,{fileid}));
        }
      });
      setData(list);
    }
  }

  const fetchData2 = useCallback(async ({pageSize, pageIndex}) =>{
    let params = { row: pageSize, page: pageIndex, address: value };
    const response = await request.post({url: `${httpUrl}/api/scan/extrinsics`, params});
    let list = _.get(response, 'data.extrinsics');
    let count = _.get(response, 'data.count');
    setExtrinsics(list);
    setPageCount(_.ceil(count / pageSize));
    setExtrinsicCount(count);
  },[pageCount])

  const changeTableFilter = tab => {
    // setActiveTab(tab);
    fetchData(tab);
  };

  const extrinsicsColumns = React.useMemo(()=> [
    {Header: 'extrinsic ID', accessor: 'extrinsic_index',id:'extrinsic_index', width: '12.5%'},
    {Header: 'block', accessor: 'block_num',id:'block_num', width: '12.5%'},
    {Header: 'extrinsic hash', accessor: 'extrinsic_hash',id:'extrinsic_hash', width: '12.5%'},
    {
      Header: 'time', accessor: 'block_timestamp', id: 'block_timestamp', width: '12.5%', Cell: ({row}) => (
        <span>{ moment(row.values.block_timestamp * 1000).format("YYYY-MM-DD HH:mm:ss")}</span>
      )
    },
    // {Header: 'Result', accessor: 'result',id:'result', width: '12.5%'},
    {
      Header: 'call', accessor: 'call_module', id: 'call_module', // It needs an ID
      Cell: ({row}) => (
        <span {...row.getToggleRowExpandedProps()}>
          {`${row.values.call_module}(${row.original.call_module_function})`}
          <Icon icon={row.isExpanded ? 'caret-up' : 'caret-down'}/>
        </span>
      ),
    },
  ], [])

  const columns = React.useMemo(()=> [
    {Header: 'file name', accessor: 'filename',id:'filename', width: '12.5%',Cell: ({row}) => (
      <>
        <span className={"ellipsis ellipsis-filename"} data-effect={"solid"} data-tip={row.original.ispublic === 1 ? row.values.filename : "******"}>{row.original.ispublic === 1 ? row.values.filename : "******"}</span>
        <ReactTooltip effect="solid" delayUpdate={500} delayHide={1000}/>
      </>
    )},
    {Header: 'data ID', accessor: 'fileid',id:'fileid',width: '12.5%',Cell: ({row}) => (
      <>
        {
          row.original.ispublic === 1 ?
            <a href={`${linkUrl}/fileDetail?fid=${row.values.fileid}`} target="_blank">{row.values.fileid}</a> :
            <span>{"**********"}</span>
        }
      </>

    )},
    {Header: 'poe', accessor: 'filehash',id:'filehash', width: '12.5%',Cell: ({row}) => (
      <>
        <span className={"ellipsis ellipsis-filehash"} data-effect={"solid"} data-tip={row.values.filehash}>
          {row.values.filehash}
        </span>
        <ReactTooltip effect="solid" delayUpdate={500} delayHide={1000}/>
      </>
      )},
    {Header: 'characteristic', accessor: 'similarityhash',id:'similarityhash', width: '12.5%',Cell: ({row}) => (
      <>
        {
          row.original.ispublic === 1 ?
            <a href={`${linkUrl}/fileDetail?fid=${row.values.fileid}`}  target="_blank">{row.values.similarityhash === "null" ? "": row.values.similarityhash}</a> :
              <span>{row.values.similarityhash === "null" ? "": row.values.similarityhash}</span>
        }
      </>
    )},
    {Header: 'size', accessor: 'filesize',id:'filesize', width: '12.5%',Cell: ({row}) => (
        <span >
          {row.original.ispublic === 1 ? row.values.filesize : '******'}
        </span>
    )},
    {Header: 'is The file public?', accessor: 'ispublic',id:'ispublic', width: '12.5%',Cell: ({row}) => (
        <span >{row.values.ispublic == 1 ? "yes" : "no"}</span>
    )},
    {Header: 'storage validity period To',id:'deadline', accessor: 'deadline', width: '12.5%',Cell: ({row}) => (
        <span >
          {row.original.ispublic === 1 ? moment(row.values.deadline*1000).format("YYYY-MM-DD") : '******'}
        </span>
    )},
    {Header: 'charge', accessor: 'downloadfee',id:'downloadfee', width: '12.5%',Cell: ({row}) => (
        <span >{ formatterCurrencyStr(row.values.downloadfee) }</span>
    )},
  ], [])

  const renderRowSubComponent = React.useCallback((
    ({ row }) =>{
      let params = row.original.params;
      let rowInfo = JSON.parse(params);
      return (
        <div className={"expand-group"}>
          {
            rowInfo.map((info, idx)=>(
              <div key={idx}>
                <p>{info.type}</p>
                <p>
                  <span>{info.name}</span>
                  <a className={"ellipsis ellipsis-link"} href="javascript:void(0)" title={!_.isObject(info.value) ? info.value : JSON.stringify(info.value)} >{!_.isObject(info.value) ? info.value : JSON.stringify(info.value)}</a>
                  {/*<span className={"ellipsis"} style={{ width: '60%'}} data-place={"left"} data-multiline={true} data-effect={"solid"} data-tip={!_.isObject(info.value) ? info.value : JSON.stringify(info.value)}>{!_.isObject(info.value) ? info.value : JSON.stringify(info.value)}</span>*/}
                  {/*<ReactTooltip effect="solid" place={"left"} multiline={true} delayUpdate={500} delayHide={1000}/>*/}
                </p>
              </div>
            ))
          }
        </div>
      )
    }
  ), [])


  return (
    <Fragment>
      <div className={`${className} "accout-detail"`}>
        <div className={"accout-title"}>
          <Icon className='highlight--color' icon='dot-circle'/>
          <span className={"accout-title-text"}>Account Detail</span>
        </div>
        <div className={"accout-content"}>
          <div className={"accout-info"}>
            <div className={"accout-info-left"}>
              <div className={"accout-info-left-tr first-title"}>Account</div>
              <div className={"accout-info-left-tr"}>
                <span className={"accout-info-left-td"}>account name</span>
                <span className={"accout-info-left-td account-name"}>
                  <IdentityIcon value={value} />
                  <span>{value?.substr(0, 5) + '...' + value?.substr(value?.length - 5, value?.length)}</span>
                </span>
              </div>
              <div className={"accout-info-left-tr"}>
                <span className={"accout-info-left-td"}>account</span>
                <span className={"accout-info-left-td ellipsis"} data-effect={"solid"} data-tip={value}>{value}</span>
                <ReactTooltip effect="solid" delayUpdate={500} delayHide={2000}/>
              </div>
              <div className={"accout-info-left-tr"}>
                <span className={"accout-info-left-td"}>total</span>
                <span className={"accout-info-left-td"}><span className={"accout-info-left-td-value"}>{accountInfo && accountInfo.totalObj &&  accountInfo.totalObj.money} </span><span>{accountInfo && accountInfo.totalObj &&  accountInfo.totalObj.suffix}</span></span>
              </div>
              <div className={"accout-info-left-tr"}>
                <span className={"accout-info-left-td"}>available transfers</span>
                <span className={"accout-info-left-td"}><span className={"accout-info-left-td-value"}>{accountInfo && accountInfo.availableTransfersObj &&  accountInfo.availableTransfersObj.money} </span><span>{accountInfo && accountInfo.availableTransfersObj &&  accountInfo.availableTransfersObj.suffix}</span></span>
              </div>
            </div>
            <div className={"accout-info-center"}>
              <img src={require("./../../../assets/images/accoutAvailableLogo.png")} alt=""/>
            </div>
            <div className={"accout-info-right"}>
              <span>data</span>
              <span>{size}</span>
            </div>
          </div>
          <div className={"accout-table"}>
            <div className={"btn-actions"}>
              <Button isSelected={activeTab === "extrinsics"} label={`extrinsics (${extrinsicCount})`} onClick={ ()=>{changeTableFilter("extrinsics")}}/>
              <Button isBasic isSelected={activeTab === "data"} label={data.length >0 ? `data (${data.length})` : 'data'} onClick={()=>{changeTableFilter("data")}} className={"select-btn"}/>
            </div>
            {
              ((activeTab === "extrinsics" && !_.isEmpty(extrinsics)) || (activeTab === "data" && !_.isEmpty(data))) ?
                activeTab === "extrinsics"?
                <ControlledTable fetchData={fetchData2} columns={extrinsicsColumns} data={extrinsics} pageCount={pageCount} renderRowSubComponent={renderRowSubComponent} /> :
                <RcTable columns={columns} data={data} renderRowSubComponent={renderRowSubComponent} /> : <Empty />
            }
          </div>
        </div>
      </div>
    </Fragment>

  )
}

export default React.memo(styled(AccoutDetail)`
  margin: -50px 0 20px 0;
  font-size: 16px;
  .accout-title, .accout-content{
    padding: 26px 1.5rem !important;
    background: white;
    border-radius: 6px;
    .accout-title-text{
      margin-left: 5px;
    }
  }
  .accout-content{
    margin-top: 4px;
    box-sizing: border-box;
    border-radius: 6px;
    & .accout-info{
      display: flex;
      &-left{
        width: 50%;
        font-size: 16px;
        .first-title{
          color: #5078FE;
        }
        &-tr{
          padding: 16px 0;
          box-sizing: border-box;
          border-bottom: 1px solid #DBDBDB;
        }
        &-td{
          display: inline-block;
          width: 50%;
          &.account-name{
            div{
              vertical-align: middle;
            }
            >span{
              margin-left: 5px;
              vertical-align: middle;
            }
          }
          //&.ellipsis{
          //  overflow: hidden;
          //  text-overflow: ellipsis;
          //}
          &-value{
            font-size: 28px;
            color: #5078FE;
            margin-right: 20px;
            vertical-align: middle;
          }
        }
      }
      &-center{
        width: 25%;
        text-align: center;
      }
      &-right{
        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
        span:nth-child(2){
          font-size: 28px;
          color: #5078FE;
          margin: 0 6px 0 28px;
        }
      }
    }
    & .accout-table{
      margin-top: 40px;
      .btn-actions{
        margin-bottom: 20px;
        .select-btn{
          margin-left: 20px;
          //background: #DBDBDB;
        }
      }

      .expand-group{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        > div {
          width: 700px;
          text-align: left;
          border: 1px dashed #DBDBDB;
          padding: 10px;
          box-sizing: border-box;
          margin-bottom: 8px;
          > p:last-child {
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }

  //sepecial
  .ellipsis{
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &-filehash{
      width: 100px;
    }
    &-filename{
      width: 150px;
    }
    &-link{
      width: 80%;
      color: #858585 !important;
      cursor: initial;
    }
  }
`)
