// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-query/types';

import React, { useContext, useMemo, useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BlockAuthorsContext, EventsContext } from '@polkadot/react-query';

import BlockInfo from './BlockInfo';
import Forks from './Forks';
import Main from './Main';
import NodeInfo from './NodeInfo';
import { useTranslation } from './translate';
import styled from "styled-components";
import Miners from './Miners';
import Summary from "@polkadot/app-explorer/Summary";

interface Props {
  basePath: string;
  className?: string;
  newEvents?: KeyedEvent[];
}

function ExplorerApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { lastHeaders } = useContext(BlockAuthorsContext);// block height ,from subscription
  const { eventCount, events } = useContext(EventsContext);

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'chain',
      text: t<string>('Chain info'),
      icon: true
    },
    {
      hasParams: true,
      name: 'query',
      text: t<string>('Block details'),
      icon: true
    },
    {
      name: 'node',
      text: t<string>('Node info'),
      icon: true
    },
    {
      name: 'miners',
      text: t<string>('Miners'),
      icon: true
    },
  ]);

  const hidden = useMemo(
    () => api.query.babe ? [] : ['forks'],
    [api]
  );

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        hidden={hidden}
        items={itemsRef.current}
        className={'explorer-app'}
      />
      <Summary eventCount={eventCount} />
      <Switch>
        <Route path={`${basePath}/forks`}><Forks /></Route>
        <Route path={`${basePath}/query/:value/:type`}><BlockInfo /></Route>
        <Route path={`${basePath}/query`}><BlockInfo /></Route>
        <Route path={`${basePath}/node`}><NodeInfo /></Route>
        <Route path={`${basePath}/miners`}><Miners /></Route>
        <Route>
          <Main eventCount={eventCount} events={events} headers={lastHeaders} />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(styled(ExplorerApp)`
  .explorer-app{
    margin-bottom: 0;
  }
`);

