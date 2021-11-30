import React from "react";
import styled from "styled-components";

interface Props{
  className?: string
}

function Empty({className}:Props): React.ReactElement<Props>{
  return (
    <div className={`${className} empty-container`}>
      <img src={require("./../../../../assets/images/emptyData.png")} alt=""/>
      <div className={"empty-text"}>no results found...</div>
    </div>
  )
}

export default React.memo(styled(Empty)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 643px;
  width: 100%;
  >img{
    width: 237px;
    height: 237px;
  }
  .empty-text{
    margin-top: 40px;
    font-size: 36px;
    font-weight: 400;
    line-height: 70px;
    color: #737373;
    letter-spacing: 16px;
  }
`)
