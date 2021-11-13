// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { SummaryBox } from '@polkadot/react-components';
import Query from "@polkadot/app-explorer/Query";

interface Props {
  eventCount: number;
}

function Summary ({ eventCount }: Props): React.ReactElement<Props> {

  return (
    <div className={"explore-summary-container"} style={{
      background: "url(" + require("./../../../assets/images/topBg.png") + ") no-repeat top",
      maxWidth: '100%', height: '263px',padding: '0 8rem',display: 'flex', alignItems: 'center',justifyContent: 'flex-start'
    }}>
      <SummaryBox className="explore-summary-container">
        <Query className={"explore-query-group"}/>
      </SummaryBox>
    </div>
  );
}

export default React.memo(Summary);
