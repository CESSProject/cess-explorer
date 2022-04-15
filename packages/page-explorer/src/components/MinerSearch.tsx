import React, { useState, useCallback } from "react"
import styled from "styled-components";
import Icon from "@polkadot/react-components/Icon";

interface Props {
  className?: string
}

function MinerSearch({ className }: Props): React.ReactElement<Props> {
  const [keyword, setKeyword] = useState('');

  const _setNumber = useCallback(
    (event: any): void => setKeyword(event.target.value),//miner iD
    []
  );
  const _onQuery = useCallback(
    () => {
      let value = parseInt(keyword.trim());
      if (value === 0) {
        return;
      }
      window.location.hash = `/explorer/query/${value}/miner`;
    },
    [keyword]
  );
  return (
    <span className={className}>
      <input type="number" placeholder="Search by miner ID" onKeyPress={_setNumber} onKeyUp={_setNumber} onChange={_setNumber} onBlur={_setNumber} />
      <button onClick={_onQuery}><Icon className='highlight--color' icon='search' /></button>
    </span>
  )
}

export default React.memo(styled(MinerSearch)`
    float:right;
    position: relative;
    width: 213px;
    >input{
      width: 160px;
      border: 1px solid #ddd;
      border-radius: 4px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      position: absolute;
      left: 0px;
      top: 0px;
    }
    >button{
      width: 50px;
      height: 30px;
      line-height: 30px;
      margin-left: 5px;
      border: none;
      font-size: 17px;
      border-radius: 4px;
      position: absolute;
      top: 0px;
      right: 0px;
    }
  }
`)
