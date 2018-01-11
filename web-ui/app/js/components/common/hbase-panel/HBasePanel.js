import React from 'react'
import { render } from 'react-dom'

// 引入react-router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'

import HTTPUtil from '../../../actions/fetch/FetchUtils.js'
import CommonTopics from '../../common/common-tables/CommonTopics.js'

export default class HBasePanel extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            tablesNum: 0,
            tablesInfo: []
        }
    }

    getData = () => {
        let urls = [
            "/configInfo/get/getHBaseTopics"
        ];

        let tableInfoAll;
        HTTPUtil.URLs(urls).then((text) => {
            if(text.size != 0 ){
                let tableInfo = JSON.parse(text[0]);
                var tablesDetails = [];
                for(var o in tableInfo){
                    tablesDetails.push(tableInfo[o]);
                }
                this.setState({
                    tablesNum : tableInfo.length,
                    tablesInfo : tablesDetails
                })
            }else{
                console.log("fetch exception " + text.code);
            }
        },(text)=>{
            console.log("fetch fail " + text.code);
        })
    }

    componentDidMount() {
       this.getData();
    }

    update = (newState) => {
        this.getData();
    }

    render() {
        return (
            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                <CommonTopics tablesNum={this.state.tablesNum} tablesInfo={this.state.tablesInfo} updateConversionPanel={this.update}/>
            </div>
        );
    }
}