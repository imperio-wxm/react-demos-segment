import React from 'react'
import { render } from 'react-dom'

// 引入react-router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'
import { Table, Button, Form,Switch, Icon,Badge,message,Menu, Dropdown} from 'antd';
const FormItem = Form.Item;

import HTTPUtil from '../../actions/fetch/FetchUtils.js'
import CommonUtils from '../common/utils/CommonUtils.js'
import './css/conversion.css'

const TableStatus = React.createClass({
    render() {
        let tableStatus = this.props.status;
        let badgeStatus = "default"; 
        if(tableStatus == "Running") {
            badgeStatus = "processing";
        } else if(tableStatus == "Finish") {
            badgeStatus = "success";
        }
        return (
            <span><Badge status={badgeStatus} />{tableStatus}</span>
        );
    }
})

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
        render: (text) => <TableStatus status={text} />
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
            num: '',
            timer: null
        }
    }

    upgradeTable = (tableInfo,rowKey) => {
        let tableInfoAll;
        tableInfoAll = CommonUtils.setJson(null,"table_status","Running");
        tableInfoAll = CommonUtils.setJson(tableInfoAll,"id",tableInfo.id);
        tableInfoAll = CommonUtils.setJson(tableInfoAll,"table_name",tableInfo.table_name);
        tableInfoAll = CommonUtils.setJson(tableInfoAll,"upgrade_time",CommonUtils.formatDate(new Date()));
        var status = HTTPUtil.post("http://localhost:8900/upgrade/update/sequenceToOrcInfo", tableInfoAll);
        message.info('Table=' + tableInfo.table_name + ",  upgrading........", 10);
    }

    handleMenuClick = (e) => {
        this.updateConversionPanel(e.key);
    }

    typeMenu = (
        <Menu onClick={this.handleMenuClick} >
          <Menu.Item key="all">All</Menu.Item>
          <Menu.Item key="Hive">Hive</Menu.Item>
          <Menu.Item key="HBase">HBase</Menu.Item>
        </Menu>
    );

    statusMenu = (
        <Menu onClick={this.handleMenuClick} >
          <Menu.Item key="Init">Init</Menu.Item>
          <Menu.Item key="Running">Running</Menu.Item>
          <Menu.Item key="Finish">Finish</Menu.Item>
        </Menu>
    );

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

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }
    
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    autoRefresh = (enable) => {
        if(enable) {
            this.state.timer = setInterval(() => {
                console.log('enable: ', enable);
                this.updateConversionPanel(true);
            }, 5000);
        } else {
            clearInterval(this.state.timer);
        }
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
                <div className="table-operations">
                <Form layout="inline">
                    <FormItem label="自动刷新表状态(1min)">
                        <Switch checkedChildren="开" unCheckedChildren="关" onChange={this.autoRefresh} />
                    </FormItem>
                    <FormItem>
                        <Dropdown overlay={this.typeMenu}>
                            <Button style={{ marginLeft: 8 }}>
                                分类 <Icon type="down" />
                            </Button>
                        </Dropdown>
                    </FormItem>
                    <FormItem>
                        <Dropdown overlay={this.statusMenu}>
                            <Button style={{ marginLeft: 8 }}>
                                状态过滤 <Icon type="down" />
                            </Button>
                        </Dropdown>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.refresh} >
                            刷新
                        </Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
                            转换
                        </Button>
                        <span style={{ marginLeft: 8 }}>
                            {hasSelected ? `已选择 ${selectedRowKeys.length}` : ''}
                        </span>
                    </FormItem>
                </Form>
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} 
                    footer={() => <div>All Size：{this.state.data.length}</div>} />
            </div>
        );
    }
}