/*
 * @Description: 
 * @Autor: fage
 * @Date: 2022-03-28 09:31:13
 * @LastEditors: fage
 * @LastEditTime: 2022-07-04 17:15:17
 */
// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { Button, FilterOverlay, Input } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';
import _ from "lodash"
import { useTranslation } from './translate';
import { useHistory } from "react-router-dom";

interface Props {
  className?: string;
  value?: string;
}

interface State {
  value: string;
  isValid: boolean;
}

function stateFromValue (value: string): State {
  return {
    isValid: isHex(value, 256) || /^\d+$/.test(value),
    value
  };
}

function Query ({ className = '', value: propsValue }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ isValid, value }, setState] = useState(() => stateFromValue(propsValue || ''));

  const _setHash = useCallback(
    (value: string): void => setState(stateFromValue(value)),
    []
  );

  let history = useHistory();
  const _onQuery = useCallback(
    async (): Promise<void> => {
      if (value.length === 0) {
        return;
      }
      let url='';
      switch(value.length){
        case 66://hash length is 66
          url=`/explorer/query/${value}/${'block'}`;
          break;
        case 48://wallet address length is 48
          url=`/explorer/query/${value}/${'address'}`;
          break;
        default://other is Extrinsics Hash
          url=`/explorer/query/${value}/${'extrinsic'}`;          
          break;
      }
      if(url){
        // window.location.hash =url;
        // use react-router-dom
        history.push(url);
      }
    },
    [value]
  );

  return (
    <FilterOverlay className={`ui--FilterOverlay hasOwnMaxWidth ${className}`}>
      <Input
        className='explorer--query'
        defaultValue={propsValue}
        isError={!isValid && value.length !== 0}
        onChange={_setHash}
        onEnter={_onQuery}
        placeholder={t<string>('Search by Block Hash / Block Height')}
        withLabel={false}
      >
        <Button
          isSelected
          icon='search'
          onClick={_onQuery}
        />
      </Input>
    </FilterOverlay>
  );
}

export default React.memo(styled(Query)`
  &.explore-query-group{
    position: relative;
    .explorer--query{
      width: 40em;
      margin-left: 200px;
    }
  }
  .explorer--query {
    width: 20em;
  }
`);
