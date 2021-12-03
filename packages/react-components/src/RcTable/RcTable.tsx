import Table from 'rc-table';
import React from 'react';
import styled from 'styled-components';

interface Props{
  className?: string,
  renderRowSubComponent?: Function | null,
}

const data = [
  { key: 0, a: '125555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555553' },
  { key: 1, a: 'cdd', b: 'edd' },
  { key: 2, a: '1333', c: 'eee222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222', d: 2 },
];

const columns: any[] = [
  { title: 'title 1', dataIndex: 'a', key: 'a', width: 100 },
  { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 },
  { title: 'title 3', dataIndex: 'c', key: 'c', width: 700, fixed: 'right' },
];

function CustomExpandIcon(props) {
  let text;
  if (props.expanded) {
    text = '&#8679; collapse';
  } else {
    text = '&#8681; expand';
  }
  return (
    <a
      className="expand-row-icon"
      onClick={e => {
        props.onExpand(props.record, e);
      }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: text }}
      style={{ color: 'blue', cursor: 'pointer' }}
    />
  );
}

const onExpand = (expanded, record) => {
  // eslint-disable-next-line no-console
  console.log('onExpand', expanded, record);
};

function RcTable({className}: Props): React.ReactElement<Props>{
  return (
    <div className={`${className}`}>
      <Table
        columns={columns}
        data={data}
        scroll={{ x: 1800 }}
        expandable={{
          expandedRowRender: record => <p>extra: {record.a}</p>,
          onExpand,
          expandIcon: CustomExpandIcon,
        }}
      />
    </div>
  )
}

export default React.memo(styled(RcTable)`
  //width: 800px;
  .tableBorder() {
    border: 1px solid #5078FE;
    border-right: 0;
    border-bottom: 0;
  }

  table {
    width: 100%;
    border-spacing: 0;

    th, td {
      position: relative;
      box-sizing: border-box;
      padding: 16px 8px;
      white-space: normal;
      word-break: break-word;
      border: 1px solid #DBDBDB;
      border-top: 0;
      border-left: 0;
      transition: box-shadow 0.3s;

      .@{rc-table}-rtl& {
        border-right: 0;
        border: 1px solid #5078FE;
      }
    }
  }
  .rc-table{
    border: 1px solid #5078FE;
    border-radius: 6px;
    // ================== Cell ==================
    &-cell {
      &-fix-left,
      &-fix-right {
        z-index: 1;
      }
      &-fix-right:last-child:not(&-fix-sticky) {
        border-right-color: transparent;
      }
      .rc-table-rtl & {
        &-fix-right:last-child {
          border-right-color: #5078FE;
        }
        &-fix-left:last-child {
          border-left-color: transparent;
        }
      }

      &-fix-left-first {
        .rc-table-rtl & {
          box-shadow: 1px 0 0 #5078FE;
        }
      }

      &-fix-left-first::after,
      &-fix-left-last::after {
        position: absolute;
        top: 0;
        right: -1px;
        bottom: -1px;
        width: 20px;
        transform: translateX(100%);
        transition: box-shadow 0.3s;
        content: '';
        pointer-events: none;
      }
      &-fix-right-first,
      &-fix-right-last {
        box-shadow: -1px 0 0 #5078FE;

        .rc-table-rtl & {
          box-shadow: none;
        }

        &::after {
          position: absolute;
          top: 0;
          bottom: -1px;
          left: -1px;
          width: 20px;
          transform: translateX(-100%);
          transition: box-shadow 0.3s;
          content: '';
          pointer-events: none;
        }
      }
      &&-ellipsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        // Fixed first or last should special process
        &.rc-table-cell-fix-left-first,
        &.rc-table-cell-fix-left-last,
        &.rc-table-cell-fix-right-first &.@{tablePrefixCls}-cell-fix-right-last {
          overflow: visible;

          .rc-table-cell-content {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      &&-row-hover {
        background: rgba(255, 0, 0, 0.05);
      }

    }
    &-ping-left {
      .rc-table-cell-fix-left-first::after,
      .rc-table-cell-fix-left-last::after {
        box-shadow: inset 10px 0 8px -8px green;
      }
    }

    &-ping-right {
      .rc-table-cell-fix-right-first::after,
      .rc-table-cell-fix-right-last::after {
        box-shadow: inset -10px 0 8px -8px green;
      }
    }
    // ================= Header =================
    thead {
      td,
      th {
        background: #fff;
        text-align: center;
      }

      .rc-table-cell-scrollbar::after {
        position: absolute;
        top: 0;
        bottom: 0;
        left: -1px;
        width: 1px;
        background: #f7f7f7;
        content: '';

        .rc-table-rtl& {
          right: -1px;
          left: auto;
        }
      }
    }

    &-header {
      .tableBorder();
    }

    // ================= Empty ==================
    &-placeholder {
      text-align: center;
    }
    // ================== Body ==================
    tbody {
      tr {
        td,
        th {
          background: #fff;
        }
      }
    }

    &-content {
      .tableBorder();
      border-radius: 5px 0 0 0;
    }

    &-body {
      .tableBorder();
      border-top: 0;
    }

    &-fixed-column &-body::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      border-right: 1px solid #DBDBDB;
      content: '';
    }
    // ================= Expand =================
    &-expanded-row {
      .rc-table-cell {
        box-shadow: inset 0 8px 8px -8px green;
      }

      &-fixed {
        box-sizing: border-box;
        margin: 16px 8px;
        margin-right: -8px - 2 * 1px;
        padding: 16px 8px;

        &::after {
          position: absolute;
          top: 0;
          right: 1px;
          bottom: 0;
          width: 0;
          border-right: 1px solid #DBDBDB;
          content: '';
        }
      }
    }

    &-row-expand-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      color: #aaa;
      line-height: 16px;
      text-align: center;
      vertical-align: middle;
      border: 1px solid currentColor;
      cursor: pointer;

      &.rc-table-row-expanded::after {
        content: '-';
      }

      &.rc-table-row-collapsed::after {
        content: '+';
      }

      &.rc-table-row-spaced {
        visibility: hidden;
      }
    }
  }
`)
