import React from 'react'
import { render } from 'react-dom'

// 引入react-router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'
import { Table, Button } from 'antd';

import HTTPUtil from '../../actions/fetch/FetchUtils.js'
import CommonUtils from '../common/utils/CommonUtils.js'

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
            data: []
        }
    }

    componentDidMount() {
    }

    upgradeTable = (tableInfo) => {
        let tableInfoAll;
        tableInfoAll = CommonUtils.setJson(null,"table_status","running");
        tableInfoAll = CommonUtils.setJson(tableInfoAll,"id",tableInfo.id);
        tableInfoAll = CommonUtils.setJson(tableInfoAll,"table_name",tableInfo.table_name);
        tableInfoAll = CommonUtils.setJson(tableInfoAll,"upgrade_time",CommonUtils.formatDate(new Date()));
        HTTPUtil.post("http://localhost:8900/upgrade/update/sequenceToOrcInfo", tableInfoAll)
    }

    updateConversionPanel = (status) =>{
        this.props.updateConversionPanel(status);
    }

    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            console.table(this.state.selectedRowKeys)
            for (var key in this.state.selectedRowKeys) {
                console.log('cacheData: ', this.props.tablesInfo[this.state.selectedRowKeys[key]]);
                let urls = [
                    "http://localhost:8900/upgrade/getTopicByName/" + this.props.tablesInfo[this.state.selectedRowKeys[key]].table_name
                ];
                HTTPUtil.URLs(urls).then((text) => {
                    if(text.size != 0 ){
                        this.upgradeTable(JSON.parse(text[0]));
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
            this.updateConversionPanel(true);
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