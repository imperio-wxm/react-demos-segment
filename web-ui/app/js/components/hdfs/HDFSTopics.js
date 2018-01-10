import React from 'react'
import { render } from 'react-dom'

// 引入react-router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'
import { Table, Button } from 'antd';

import HTTPUtil from '../../actions/fetch/FetchUtils.js'
import CommonUtils from '../common/utils/CommonUtils.js'

const columns = [{
        title: 'Table Name',
        dataIndex: 'table_name',
    }
];
    
export default class HDFSTopics extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            num: ''
        }
    }

    componentDidMount() {
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

    render() {
        this.state.num = this.props.tablesNum;
        this.state.data = this.props.tablesInfo;
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={this.refresh} >
                        刷新
                    </Button>
                </div>
                <Table columns={columns} dataSource={this.state.data} footer={() => <div>All Size：{this.state.data.length}</div>} />
            </div>
        );
    }
}