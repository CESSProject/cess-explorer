// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { KeyedEvent } from '@polkadot/react-query/types';

import React from 'react';

import { Columar } from '@polkadot/react-components';

import BlockHeaders from './BlockHeaders';
import Events from './Events';
import Summary from './Summary';

import ChainInfo from './ChainInfo';
import NetworkStorageTrend from './NetworkStorageTrend';
import AccoutDetail from './AccoutDetail';
import MinerDetail from '../MinerDetail';
import ExtrinsicDetail from "@polkadot/app-explorer/ExtrinsicDetail";

interface Props {
  eventCount: number;
  events: KeyedEvent[];
  headers: HeaderExtended[];
}

function Main ({ eventCount, events, headers }: Props): React.ReactElement<Props> {
  return (
    <>
      <Summary eventCount={eventCount} />
      <ChainInfo />
      <NetworkStorageTrend />
      <AccoutDetail />
      <MinerDetail />
      <ExtrinsicDetail />
      <Columar>
        <Columar.Column>
          <BlockHeaders headers={headers} />
        </Columar.Column>
        <Columar.Column>
          <Events events={events} />
        </Columar.Column>
      </Columar>
    </>
  );
}

export default React.memo(Main);
