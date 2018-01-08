import {render} from 'react-dom';
import React, {Component} from 'react';


import './main.css'

import {Layout, Menu, Breadcrumb, Icon} from 'antd';
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

export default class MainMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false
        }
    }

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({collapsed});
    }

    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1">
                            <Icon type="desktop"/>
                            <span>ORC 转换</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="file"/>
                            <span>HDFS Topics</span>
                        </Menu.Item>
                        <Menu.Item key="9">
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
                        <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                            Bill is a cat.
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        ORC File Upgrade
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

render(<MainMenu />, document.getElementById('root'));
