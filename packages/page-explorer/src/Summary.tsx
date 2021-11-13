// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BestFinalized, BestNumber, BlockToTime, TimeNow, TotalIssuance } from '@polkadot/react-query';
import { BN_ONE, formatNumber } from '@polkadot/util';

import SummarySession from './SummarySession';
import { useTranslation } from './translate';
import styled from "styled-components";

interface Props {
  eventCount: number;
}

function Summary ({ eventCount }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  
  return (
    <div style={{background: "url(" + require("./../../../assets/images/topBg.png" )+ ") no-repeat top", maxWidth: '100%', padding: 0, height: '263px'}}>
      <SummaryBox className={'explore-summary-box'}>
        <section>
          {api.query.timestamp && (
            <>
              <CardSummary label={t<string>('last block')}>
                <TimeNow/>
              </CardSummary>
              <CardSummary
                className='media--800'
                label={t<string>('target')}
              >
                <BlockToTime value={BN_ONE}/>
              </CardSummary>
            </>
          )}
          {api.query.balances && (
            <CardSummary
              className='media--800'
              label={t<string>('total issuance')}
            >
              <TotalIssuance/>
            </CardSummary>
          )}
        </section>
        <section className='media--1200'>
          <SummarySession withEra={false}/>
        </section>
        <section>
          <CardSummary
            className='media--1000'
            label={t<string>('last events')}
          >
            {formatNumber(eventCount)}
          </CardSummary>
          {api.query.grandpa && (
            <CardSummary label={t<string>('finalized')}>
              <BestFinalized/>
            </CardSummary>
          )}
          <CardSummary label={t<string>('best')}>
            <BestNumber/>
          </CardSummary>
        </section>
      </SummaryBox>
    </div>
  
  );
}

export default React.memo(styled(Summary)`
  .explore-summary-box{
    margin-top: 0 !important;
  }
`);
