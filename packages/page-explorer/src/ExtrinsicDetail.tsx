import React, {Fragment, useState} from "react"
import styled from "styled-components"
import {Button, Icon} from "@polkadot/react-components";

interface Props{
  className?: string
}

const list = [
  {a:1 ,b:2, c:3},
  {a:1 ,b:2, c:3},
  {a:1 ,b:2, c:3},
  {a:1 ,b:2, c:3},
  {a:1 ,b:2, c:3},
]

function ExtrinsicDetail({className}:Props) :React.ReactElement<Props>{
  const [isShowJson, toggleShowJson] = useState(false);

  const getMoreParameter = () =>{

  }

  const showJsonCode = () => {
    toggleShowJson(!isShowJson);
  };

  return (
    <div className={`${className} extrinsic-detail`}>
      <div className={"extrinsic-title"}>
        Extrinsic Detail
      </div>
      <div className={"extrinsic-content"}>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Extrinsic ID</span>
          <span className={"extrinsic-content-form-item-value"}>121212-1</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Time</span>
          <span className={"extrinsic-content-form-item-value"}>121212-1</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Extrinsic hash</span>
          <span className={"extrinsic-content-form-item-value"}>121212-1</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Block</span>
          <span className={"extrinsic-content-form-item-value"}>121212-1</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Module</span>
          <span className={"extrinsic-content-form-item-value"}>121212-1</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Call</span>
          <span className={"extrinsic-content-form-item-value"}>121212-1</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Sender</span>
          <span className={"extrinsic-content-form-item-value"}>121212-1</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Destination</span>
          <span className={"extrinsic-content-form-item-value"}>121212-1</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Value</span>
          <span className={"extrinsic-content-form-item-value"}>121212-1</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Gas</span>
          <span className={"extrinsic-content-form-item-value"}>121212-1</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Nonce</span>
          <span className={"extrinsic-content-form-item-value"}>121212-1</span>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>Result</span>
          <Icon color='#5CD5B4'  icon='check-circle'/>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>parameter</span>
          <div className={"extrinsic-content-form-item-parameter"}>
            <div className={"extrinsic-content-form-item-parameter-list"}>
              <p><span>Parameter name</span><span>value</span></p>
              <p><span>Parameter name</span><span>value</span></p>
              <p><span>Parameter name</span><span>value</span></p>
              <p><span>Parameter name</span><span>value</span></p>
              <p><span>Parameter name</span><span>value</span></p>
              <Button isSelected label={"More"} onClick={getMoreParameter} />
            </div>
            <div className={"extrinsic-content-form-item-parameter-actions"}>
              <Button isSelected label={"View Code"} onClick={showJsonCode} />
              { isShowJson && <div><pre><code>{JSON.stringify(list, null, 2)}</code></pre></div> }
            </div>
          </div>
        </div>
        <div className={"extrinsic-content-form-item"}>
          <span className={"extrinsic-content-form-item-label"}>signature</span>
          <span className={"extrinsic-content-form-item-value"}>0x6b627f3e5370f3c4f59a140b2027eaa1c406be149db588657fcbbc29cacb6cff47c604005a9fa00a309d885bcacce92386c926c9f99e8e9b9f51b8bab8a5c903</span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(styled(ExtrinsicDetail)`
  margin: 20px 0;
  font-size: 16px;

  .extrinsic-title, .extrinsic-content {
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
        width: 10%;
      }
      &-parameter{
        width: 90%;
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
`)
