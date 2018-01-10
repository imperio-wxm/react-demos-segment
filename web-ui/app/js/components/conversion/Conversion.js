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
        dataIndex: 'table_id',
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
        title: 'Upgrade PartDate',
        dataIndex: 'part_date',
    },{
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
            selectedRows: [],
            loading: false,
            data: [],
            num: '',
            timer: null
        }
    }

    upgradeTable = (tableInfo) => {
        tableInfo.table_status = "Running";
        tableInfo.part_date = CommonUtils.formatDate(new Date()).substring(0,10);
        tableInfo.upgrade_time = CommonUtils.formatDate(new Date());
        var status = HTTPUtil.post("http://localhost:8900/upgrade/update/sequenceToOrcInfo", JSON.stringify(tableInfo));
        message.info('Table=' + tableInfo.table_name + ",  upgrading........", 10);
        console.log("更新")
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
        console.log("刷新");
        this.updateConversionPanel(true);
    }

    start = () => {
        this.setState({ 
            loading: true
        });
        // ajax request after empty completing
        setTimeout(() => {
            for (var key in this.state.selectedRows) {
                var jsonData = this.state.selectedRows[key];
                let urls = [
                    "http://localhost:8900/upgrade/getTopicByName/" + jsonData.table_name
                ];
                HTTPUtil.URLs(urls).then((text) => {
                    if(text.size != 0 ){
                        this.upgradeTable(JSON.parse(text[0]));
                        this.refresh();
                    }else{
                        console.log("fetch exception " + text.code);
                    }
                },(text)=>{
                    console.log("fetch fail " + text.code);
                })
            }
            this.setState({
                selectedRowKeys: [],
                selectedRows: [],
                loading: false,
            });
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    componentDidMount() {
    }
    
    onSelectChange = (selectedRowKeys,selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    }

    autoRefresh = (enable) => {
        if(enable) {
            this.state.timer = setInterval(() => {
                console.log('refresh: ', CommonUtils.formatDate(new Date()));
                this.updateConversionPanel(true);
            }, 60 * 1000);
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
            hideDefaultSelections: true,
            onSelection: this.onSelection,
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