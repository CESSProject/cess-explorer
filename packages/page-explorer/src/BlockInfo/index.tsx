// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useBestNumber } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';
import _ from "lodash"
import Query from '../Query';
import BlockByHash from './ByHash';
import BlockByNumber from './ByNumber';
import AccoutDetail from '../AccoutDetail';
import MinerDetail from '../MinerDetail';

/**
 * get query params type
 * @param param
 */
function getSearchType(param){
  param = _.trim(param);
  let type = 0;   // 0 blockhash  1 Extrinsic ID  2 address  3 miner ID
  if(param.length === 66){
    type = 0
  } else if(param.length === 48){
    type = 2
  } else if(param.length>0 && param.length < 5){
    type = 3
  }
  return type;
}

function Entry (): React.ReactElement | null {
  const bestNumber = useBestNumber();
  const { value } = useParams<{ value: string }>();
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

  let queryType = getSearchType(value);

  const Component = isHex(stateValue) ? BlockByHash : BlockByNumber;

  return (
    <>
      <Query />
      { queryType === 2 ? <AccoutDetail /> : queryType === 3 ? <MinerDetail /> : <Component key={stateValue} value={stateValue}/>}
    </>
  );
}

export default React.memo(Entry);
