import React from 'react'
import { render } from 'react-dom'

// 引入react-router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'

import HTTPUtil from '../../../actions/fetch/FetchUtils.js'
import Conversion from '../../../components/conversion/Conversion.js'

export default class ConversionPanel extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            tablesNum: 0,
            tablesInfo: []
        }
    }

    getData = () => {
        let urls = [
            "http://localhost:8900/upgrade/get/getAllTables"
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
                 <Conversion tablesNum={this.state.tablesNum} tablesInfo={this.state.tablesInfo} updateConversionPanel={this.update}/>
            </div>
        );
    }
}