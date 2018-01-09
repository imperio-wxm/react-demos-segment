import React from 'react'
import { render } from 'react-dom'

// 引入react-router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'
import { Table, Button } from 'antd';

import HTTPUtil from '../../actions/fetch/FetchUtils.js'

const columns = [{
        title: 'Id',
        dataIndex: 'id',
    }, {
        title: 'Table Name',
        dataIndex: 'table_name',
    }, {
        title: 'Table Type',
        dataIndex: 'table_type',
    }, {
        title: 'Table Status',
        dataIndex: 'table_status',
    }, {
        title: 'Upgrade Time',
        dataIndex: 'upgrade_time',
    }, {
        title: 'Finish Time',
        dataIndex: 'finish_time',
    }
];
    
export default class Conversion extends React.Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false
    };
    componentDidMount() {
    }
    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            console.log(this.state.selectedRowKeys)
            for (var key in this.state.selectedRowKeys) {
                console.log('cacheData: ', this.props.tablesInfo[key]);
            }
            
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    render() {
        let tablesNum = this.props.tablesNum;
        let tablesInfo = this.props.tablesInfo;

        const data = [];
        tablesInfo.map((item, index)=>{
            data.push({
                id: `${item.id}`,
                table_name: `${item.table_name}`,
                table_type: `${item.table_type}`,
                table_status: `${item.table_status}`,
                upgrade_time: `${item.upgrade_time}`,
                finish_time: `${item.finish_time}`
            });
        })
    
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
                        转换
                    </Button>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                    </span>
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
            </div>
        );
    }
}