// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TabItem } from './types';

import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import Badge from '../Badge';
import Icon from "@polkadot/react-components/Icon";

interface Props extends TabItem {
  basePath: string;
  className?: string;
  count?: number;
  index: number;
  icon?: boolean
}

function Tab ({ basePath, className = '', count, hasParams, index, isExact, isRoot, name, text, icon = false }: Props): React.ReactElement<Props> {
  const [isSelected, setActive] = useState(false);

  const to = isRoot
    ? basePath
    : `${basePath}/${name}`;

  // only do exact matching when not the fallback (first position tab),
  // params are problematic for dynamic hidden such as app-accounts
  const tabIsExact = isExact || !hasParams || index === 0;

  const checkIsChecked = (match, location) =>{
    if(!match){
      setActive(false)
      return false
    }
    setActive(true)
    return true
  }

  return (
    <NavLink
      activeClassName='tabLinkActive'
      isActive={checkIsChecked}
      className={`ui--Tab ${className}`}
      exact={tabIsExact}
      strict={tabIsExact}
      to={to}
    >
      <div className='tabLinkText'>
        {icon && <img src={require(`./../../../../assets/icons/${isSelected ? `${text}Active`: text}.png`)} alt={""} className={"tabLinkIcon"}/>}
        {text}
      </div>
      {!!count && (
        <Badge
          className='tabCounter'
          color='counter'
          info={count}
        />
      )}
    </NavLink>
  );
}

export default React.memo(styled(Tab)`
  position: relative;
  display: flex;
  align-items: center;
  color: #8B8B8B;
  padding: 0 1.5rem;
  height: 100%;
  font-size: 1rem;
  font-weight: 400;


    &:hover {
      color: var(--bg-theme);

      .tabLinkText::after{
        width: 100%;
        background-color: var(--bg-theme);
      }
    }

    &:hover .tabLinkText::after,
    &.tabLinkActive .tabLinkText::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
    }

  &.tabLinkActive {
    color: var(--bg-theme) !important;
    font-weight: 400;

    &:hover {
      cursor: default;
    }
  }

  .tabLinkText {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    .tabLinkIcon{
      margin-right: 5px;
    }
  }

  .tabCounter {
    margin: -1rem 0 -1rem 0.75rem;
  }

  .tabIcon {
    margin-left: 0.75rem;
  }
`);
