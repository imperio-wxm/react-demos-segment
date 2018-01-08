import {render} from 'react-dom';
import React, {Component} from 'react';
// 引入react-router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'


import './main.css'
import ConversionPanel from './js/components/common/conversion-panel/ConversionPanel.js'

import {Layout, Menu, Breadcrumb, Icon} from 'antd';
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class MainMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false,
            current: ''
        }
    }

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({collapsed});
    }

    handleClick = (e) => {
        this.setState({
            current: e.key
        })
        console.log(e.key);
    }

    componentDidMount() {
    }

    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo"/>
                    <Menu theme="dark" onClick={this.handleClick} mode="inline">
                        <Menu.Item key="1">
                            <Link to="/conversionPanel">
                                <Icon type="desktop"/>
                                <span>ORC 转换</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="file"/>
                            <span>HDFS Topics</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="file"/>
                            <span>HBbase Topics</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0}}/>
                    <Content style={{margin: '0 16px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>Upgrade</Breadcrumb.Item>
                        </Breadcrumb>
                        { this.props.children }
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        ORC File Upgrade
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}


// 配置路由
render((
    <Router history={hashHistory} >
        <Route path="/" component={MainMenu}>
          <IndexRoute component={MainMenu} />
          <Route path="conversionPanel" component={ConversionPanel} />
        </Route>
    </Router>
), document.getElementById('root'));
