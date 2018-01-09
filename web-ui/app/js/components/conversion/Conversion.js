import React from 'react'
import { render } from 'react-dom'

// 引入react-router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'
import { Table, Button } from 'antd';

import HTTPUtil from '../../actions/fetch/FetchUtils.js'
import CommonUtils from '../common/utils/CommonUtils.js'
import './css/conversion.css'

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
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            loading: false,
            data: [],
            num: ''
        }
    }

    componentDidMount() {
    }

    upgradeTable = (tableInfo,rowKey) => {
        let tableInfoAll;
        tableInfoAll = CommonUtils.setJson(null,"table_status","running");
        tableInfoAll = CommonUtils.setJson(tableInfoAll,"id",tableInfo.id);
        tableInfoAll = CommonUtils.setJson(tableInfoAll,"table_name",tableInfo.table_name);
        tableInfoAll = CommonUtils.setJson(tableInfoAll,"table_type","hbase");
        tableInfoAll = CommonUtils.setJson(tableInfoAll,"upgrade_time",CommonUtils.formatDate(new Date()));
        var status = HTTPUtil.post("http://localhost:8900/upgrade/update/sequenceToOrcInfo", tableInfoAll);
    }

    /**
     * 更新父组件回调
     */
    updateConversionPanel = (status) => {
        this.props.updateConversionPanel(status);
    }

    refresh = () => {
        this.updateConversionPanel(true);
    }

    start = () => {
        this.setState({ 
            loading: true
        });
        // ajax request after empty completing
        setTimeout(() => {
            for (var key in this.state.selectedRowKeys) {
                var realKey = this.state.selectedRowKeys[key];
                let urls = [
                    "http://localhost:8900/upgrade/getTopicByName/" + this.state.data[realKey].table_name
                ];
                HTTPUtil.URLs(urls).then((text) => {
                    if(text.size != 0 ){
                        this.upgradeTable(JSON.parse(text[0]),realKey);
                        this.updateConversionPanel(true);
                    }else{
                        console.log("fetch exception " + text.code);
                    }
                },(text)=>{
                    console.log("fetch fail " + text.code);
                })
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
        this.state.num = this.props.tablesNum;
        this.state.data = this.props.tablesInfo;

        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <div className="table-operations">
                        <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
                            转换
                        </Button>
                        <Button type="primary" onClick={this.refresh} >
                            刷新
                        </Button>
                    </div>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                    </span>
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} />
            </div>
        );
    }
}