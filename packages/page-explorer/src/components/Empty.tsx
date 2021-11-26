import React from "react";
import styled from "styled-components";

interface Props{
  className?: string
}

function Empty({className}:Props): React.ReactElement<Props>{
  return (
    <div className={`${className} empty-container`}>
      <img src={require("./../../../../assets/images/emptyData.png")} alt=""/>
    </div>
  )
}

export default React.memo(styled(Empty)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 643px;
  width: 100%;
`)
