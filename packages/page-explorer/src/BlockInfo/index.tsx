// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useBestNumber } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';
import _ from "lodash"
import BlockByHash from './ByHash';
import BlockByNumber from './ByNumber';
import AccoutDetail from '../AccoutDetail';
import MinerDetail from '../MinerDetail';
import ExtrinsicDetail from '../ExtrinsicDetail';

/**
 * get query params type
 * @param param
 * @param typeStr
 */
function getSearchType(param, typeStr){
  param = _.trim(param);
  let type = 0;   // 0 blockhash  1 Extrinsic ID  2 address  3 miner ID
  if(param.length === 66){
    if(typeStr === "extrinsic"){
      type = 1;
    } else {
      type = 0
    }
  } else if(param.length === 48){
    type = 2
  } else if(param.length>0 && param.length < 5){
    if(typeStr=='extrinsic'){
      type = 0;
    }else{
      type = 3; //  /miner/
    }
    
    // type = 3
  }
  return type;
}

function Entry (): React.ReactElement | null {
  const bestNumber = useBestNumber();
  const { value } = useParams<{ value: string }>();
  const { type } = useParams<{ type: string }>();
  const [stateValue, setStateValue] = useState<string | undefined>(value);

  useEffect((): void => {
    setStateValue((stateValue) =>
      value && value !== stateValue
        ? value
        : !stateValue && bestNumber
          ? bestNumber.toString()
          : stateValue
    );
  }, [bestNumber, value]);

  if (!stateValue) {
    return null;
  }

  let queryType = getSearchType(value, type);//get search type 

  const Component = isHex(stateValue) ? BlockByHash : BlockByNumber;

  return (
    <>
      { queryType === 1 ? <ExtrinsicDetail value={value}/> : queryType === 2 ? <AccoutDetail value={value}/> : queryType === 3 ? <MinerDetail value={_.toNumber(value)}/> : <Component key={stateValue} value={stateValue}/>}
    </>
  );
}

export default React.memo(Entry);
