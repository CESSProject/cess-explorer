import _ from "lodash"
import RcTable from "@polkadot/react-components/RcTable"
import React, {Fragment, useEffect, useState} from "react"
import styled from "styled-components"
import {Button} from "@polkadot/react-components";
import IdentityIcon from "@polkadot/react-components/IdentityIcon";
import ReactTooltip from 'react-tooltip';
import {useApi} from "@polkadot/react-hooks";
import {formatterCurrency, formatterCurrencyStr, formatterSize} from "./utils";
import Empty from "./components/Empty";
import Icon from "@polkadot/react-components/Icon";
import {number} from "echarts";
import {fetch} from "@polkadot/x-fetch";
import request from "./utils/reuqest";

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
          let total: number = _.toNumber(otherInfo.data.feeFrozen.replace(/,/g,'')) + _.toNumber(otherInfo.data.miscFrozen.replace(/,/g,''))  +  _.toNumber(otherInfo.data.reserved.replace(/,/g,'')) + freeInt;
          let availableTransfers = freeInt - _.toNumber(otherInfo.data.reserved.replace(/,/g,''));
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
      let params = { row: 100, page: 0, address: value };
      const response = await request.post({url:"http://106.15.44.155:4399/api/scan/extrinsics", params});
      let list = _.get(response, 'data.extrinsics');
      setExtrinsics(list);
    } else {
      let entries:any = await api.query.fileBank.file.entries();
      let list:any[]= [];
      entries.forEach(([key, entry]) => {
        let fileid:string = key.args.map((k) => k.toHuman());
        // console.log('key arguments:', key.args.map((k) => k.toHuman()));
        // console.log('account data--->', entry.toHuman(), 'toJSON ---->', entry.toJSON());
        let jsonObj = entry.toJSON();
        let humanObj = entry.toHuman();
        if(jsonObj.owner == value && jsonObj.ispublic === 1){
          jsonObj.filesize = formatterSize(jsonObj.filesize);
          jsonObj.filename = humanObj.filename;
          jsonObj.similarityhash = humanObj.similarityhash;
          list.push(_.assign(jsonObj,{fileid}));
        }
      });
      setData(list);
    }
  }

  const changeTableFilter = tab => {
    // setActiveTab(tab);
    fetchData(tab);
  };

  const extrinsicsColumns = React.useMemo(()=> [
    {Header: 'Extrinsic ID', accessor: 'extrinsic_index',id:'extrinsic_index', width: '12.5%'},
    {Header: 'Block', accessor: 'block_num',id:'block_num', width: '12.5%'},
    {Header: 'Extrinsic Hash', accessor: 'extrinsic_hash',id:'extrinsic_hash', width: '12.5%'},
    {Header: 'Time', accessor: 'block_timestamp',id:'block_timestamp', width: '12.5%'},
    // {Header: 'Result', accessor: 'result',id:'result', width: '12.5%'},
    {
      Header: 'Call', accessor: 'call_module', id: 'call_module', // It needs an ID
      Cell: ({row}) => (
        <span {...row.getToggleRowExpandedProps()}>
          {`${row.values.call_module}(${row.original.call_module_function})`}
          <Icon icon={row.isExpanded ? 'caret-up' : 'caret-down'}/>
        </span>
      ),
    },
  ], [])

  const columns = React.useMemo(()=> [
    {Header: 'File Name', accessor: 'filename',id:'filename', width: '12.5%'},
    {Header: 'Data ID', accessor: 'fileid',id:'fileid',width: '12.5%',Cell: ({row}) => (
        <a href={`http://121.46.19.38:54558/fileDetail?fid=${row.values.fileid}`} target="_blank">{row.values.fileid}</a>
    )},
    {Header: 'PoE', accessor: 'filehash',id:'filehash', width: '12.5%',Cell: ({row}) => (
        <span className={"filehash-ellipsis"}>
          {row.values.filehash}
        </span>
      )},
    {Header: 'Characteristic', accessor: 'similarityhash',id:'similarityhash', width: '12.5%',Cell: ({row}) => (
        <a href={`http://121.46.19.38:54558/fileDetail?fid=${row.values.fileid}`}  target="_blank">{row.values.similarityhash === "null" ? "": row.values.similarityhash}</a>
    )},
    {Header: 'Size', accessor: 'filesize',id:'filesize', width: '12.5%',Cell: ({row}) => (
        <span >
          {row.values.filesize}
        </span>
    )},
    {Header: 'Is The File Public?', accessor: 'ispublic',id:'ispublic', width: '12.5%',Cell: ({row}) => (
        <span >{row.values.ispublic == 1 ? "yes" : "no"}</span>
    )},
    {Header: 'Storage Validity Period To',id:'deadline', accessor: 'deadline', width: '12.5%'},
    {Header: 'Charge', accessor: 'downloadfee',id:'downloadfee', width: '12.5%',Cell: ({row}) => (
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
            rowInfo.map(info=>(
              <div>
                <p>{info.type}</p>
                <p>
                  <span>{info.name}</span>
                  <span>{info.value}</span>
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
              <div className={"accout-info-left-tr"}>Account</div>
              <div className={"accout-info-left-tr"}>
                <span className={"accout-info-left-td"}>Account name</span>
                <span className={"accout-info-left-td account-name"}>
                  <IdentityIcon value={value} />
                  <span>{value?.substr(0, 5) + '...' + value?.substr(value?.length - 5, value?.length)}</span>
                </span>
              </div>
              <div className={"accout-info-left-tr"}>
                <span className={"accout-info-left-td"}>Account</span>
                <span className={"accout-info-left-td ellipsis"} data-effect={"solid"} data-tip={value}>{value}</span>
                <ReactTooltip effect="solid" delayUpdate={500} delayHide={2000}/>
              </div>
              <div className={"accout-info-left-tr"}>
                <span className={"accout-info-left-td"}>Total</span>
                <span className={"accout-info-left-td"}><span className={"accout-info-left-td-value"}>{accountInfo && accountInfo.totalObj &&  accountInfo.totalObj.money} </span><span>{accountInfo && accountInfo.totalObj &&  accountInfo.totalObj.suffix}</span></span>
              </div>
              <div className={"accout-info-left-tr"}>
                <span className={"accout-info-left-td"}>Available transfers</span>
                <span className={"accout-info-left-td"}><span className={"accout-info-left-td-value"}>{accountInfo && accountInfo.availableTransfersObj &&  accountInfo.availableTransfersObj.money} </span><span>{accountInfo && accountInfo.availableTransfersObj &&  accountInfo.availableTransfersObj.suffix}</span></span>
              </div>
            </div>
            <div className={"accout-info-center"}>
              <img src={require("./../../../assets/images/accoutAvailableLogo.png")} alt=""/>
            </div>
            <div className={"accout-info-right"}>
              <span>Data</span>
              <span>{size}</span>
              {/*<span>MB</span>*/}
            </div>
          </div>
          <div className={"accout-table"}>
            <div className={"btn-actions"}>
              <Button isSelected={activeTab === "extrinsics"} label={`Extrinsics (${extrinsics ? extrinsics.length : 0})`} onClick={ ()=>{changeTableFilter("extrinsics")}}/>
              <Button isSelected={activeTab === "data"} label={`Data (${data ? data.length: 0})`} onClick={()=>{changeTableFilter("data")}} className={"select-btn"}/>
            </div>
            {
              ((activeTab === "extrinsics" && !_.isEmpty(extrinsics)) || (activeTab === "data" && !_.isEmpty(data))) ? <RcTable columns={ activeTab === "extrinsics" ? extrinsicsColumns : columns} data={ activeTab === "extrinsics" ? extrinsics : data}
                 renderRowSubComponent={renderRowSubComponent} /> : <Empty />
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
          &.ellipsis{
            overflow: hidden;
            text-overflow: ellipsis;
          }
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

  //sepecial
  .filehash-ellipsis{
    width: 100px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`)
