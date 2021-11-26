import _ from "lodash"
import RcTable from "@polkadot/react-components/RcTable"
import React, {useEffect, useState} from "react"
import styled from "styled-components"
import {Button} from "@polkadot/react-components";
import IdentityIcon from "@polkadot/react-components/IdentityIcon";
import ReactTooltip from 'react-tooltip';
import {useApi} from "@polkadot/react-hooks";

interface Props{
  className? :String
}

function AccoutDetail({className}: Props) :React.ReactElement<Props>{
  const { api } = useApi();
  const [size, setSize] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [accountInfo, setAccountInfo] = useState({});

  useEffect(()=>{
    (async (): Promise<void> =>{
      const result = await api.query.system.account("5HbW1vWRgUbkxqEYRiNVdd6Kx57yuETbZNE1THG5Dk8oSYhP");
      let info = result.toHuman();
      let free = _.get(info, 'data.free');
      setAccountInfo(info.data || {});
    })().catch(console.error);
  }, [])

  useEffect(()=>{
    (async ():Promise<void> =>{
      let res:any = await api.query.fileBank.userFileSize("5HbW1vWRgUbkxqEYRiNVdd6Kx57yuETbZNE1THG5Dk8oSYhP");
      if(res){
        let size = res.toJSON() || 0;
        setSize(size);
      }
    })()
  },[])

  useEffect(()=>{
    (async ():Promise<void> =>{
      let entries:any = await api.query.fileBank.file.entries();
      let list:any[]= [];
      entries.forEach(([key, entry]) => {
        let fileid:string = key.args.map((k) => k.toHuman());
        // console.log('key arguments:', key.args.map((k) => k.toHuman()));
        console.log('account data--->', entry.toHuman());
        let humanObj = entry.toJSON();
        humanObj.filesize = formatterSize(humanObj.filesize);
        list.push(_.assign(humanObj,{fileid}));
      });
      setData(list);
    })()
  },[])

  const formatterSize = (bytes) =>{
    if(_.isString(bytes)){
      bytes = _.toNumber(bytes);
    }
    if (bytes == 0) return '0 B';
    let k = 1024; //设定基础容量大小
    let sizeStr = ['B','KB','MB','GB','TB','PB','EB','ZB','YB']; //容量单位
    let i = 0; //单位下标和次幂
    for(let l=0;l<8;l++){
      if(bytes / Math.pow(k, l) < 1){
        break;
      }
      i = l;
    }
    return (bytes / Math.pow(k, i)).toFixed(3) + ' ' + sizeStr[i];  //循环结束 或 条件成立 返回字符
  }

  const columns = React.useMemo(()=> [
    {Header: 'File Name', accessor: 'filename',id:'filename', width: 300},
    {Header: 'Data ID', accessor: 'fileid',id:'fileid', width: 300,Cell: ({row}) => (
        <a href={`http://121.46.19.38:54558/fileDetail?fileId=${row.values.fileid}`} target="_blank">{row.values.fileid}</a>
    )},
    {Header: 'PoE', accessor: 'filehash',id:'filehash', width: 300},
    {Header: 'Characteristic', accessor: 'similarityhash',id:'similarityhash', width: 300,Cell: ({row}) => (
        <a href={`http://121.46.19.38:54558/fileDetail?fileId=${row.values.fileid}`}  target="_blank">{row.values.similarityhash}</a>
    )},
    {Header: 'Size', accessor: 'filesize',id:'filesize', width: 300,Cell: ({row}) => (
        <span >
          {row.values.filesize}
        </span>
    )},
    {Header: 'Is The File Public?', accessor: 'ispublic',id:'ispublic', width: 300,Cell: ({row}) => (
        <span >{row.values.ispublic == 1 ? "yes" : "no"}</span>
    )},
    {Header: 'Storage Validity Period To',id:'deadline', accessor: 'deadline', width: 300},
    {Header: 'Charge', accessor: 'downloadfee',id:'downloadfee', width: 300},
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
    <div className={`${className} "accout-detail"`}>
      <div className={"accout-title"}>
        Account Detail
      </div>
      <div className={"accout-content"}>
        <div className={"accout-info"}>
          <div className={"accout-info-left"}>
            <div className={"accout-info-left-tr"}>Account</div>
            <div className={"accout-info-left-tr"}>
              <span className={"accout-info-left-td"}>Account name</span>
              <span className={"accout-info-left-td account-name"}>
                <IdentityIcon value={api.genesisHash} />
                <span>0x08cd_y6g6s</span>
              </span>
            </div>
            <div className={"accout-info-left-tr"}>
              <span className={"accout-info-left-td"}>Account</span>
              <span className={"accout-info-left-td ellipsis"} data-effect={"solid"} data-tip={"cTHDK35f4i7ujFS3K6jPiEQZ22mXpjasf3Jzorqf32EEhup1J"}>cTHDK35f4i7ujFS3K6jPiEQZ22mXpjasf3Jzorqf32EEhup1J</span>
              <ReactTooltip effect="solid" delayUpdate={500} delayHide={2000}/>
            </div>
            <div className={"accout-info-left-tr"}>
              <span className={"accout-info-left-td"}>Total</span>
              <span className={"accout-info-left-td"}><span className={"accout-info-left-td-value"}>12.1234 </span><span>tCESS</span></span>
            </div>
            <div className={"accout-info-left-tr"}>
              <span className={"accout-info-left-td"}>Available transfers</span>
              <span className={"accout-info-left-td"}><span className={"accout-info-left-td-value"}>{accountInfo && accountInfo["free"]} </span></span>
            </div>
          </div>
          <div className={"accout-info-center"}>
            <img src={require("./../../../assets/images/accoutAvailableLogo.png")} alt=""/>
          </div>
          <div className={"accout-info-right"}>
            <span>Data</span>
            <span>{size}</span>
            <span>MB</span>
          </div>
        </div>
        <div className={"accout-table"}>
          <div className={"btn-actions"}>
            {/*<Button isSelected label={"Extrinsics (2)"} onClick={changeTableFilter}/>*/}
            <Button isSelected label={"Data (10)"} onClick={changeTableFilter} className={"select-btn"}/>
          </div>
          <RcTable columns={columns} data={data}/>
        </div>
      </div>
    </div>
  )
}

export default React.memo(styled(AccoutDetail)`
  margin: 20px 0;
  font-size: 16px;
  .accout-title, .accout-content{
    padding: 35px 1.5rem !important;
    background: white;
    border-radius: 6px;
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
          margin-right: 20px;
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
`)
