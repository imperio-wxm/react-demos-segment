import React from 'react'
import { render } from 'react-dom'

// 引入react-router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'

import HTTPUtil from '../../../actions/fetch/FetchUtils.js'
import Conversion from '../../../components/conversion/Conversion.js'
import CommonUtils from '../../common/utils/CommonUtils.js'

export default class ConversionPanel extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            tablesNum: 0,
            tablesInfo: []
        }
    }

    getData = (status) => {
        let urls = [];
        switch(status) {
            case "Hive":
            case "HBase":
                urls = [
                    "http://localhost:8900/upgrade/get/getTablesByType/" + status
                ];
                break;
            case "Init":
            case "Running":
            case "Finish":
                urls = [
                    "http://localhost:8900/upgrade/get/getTablesByStatus/" + status
                ];
                break;
            default:
                console.log(status);
                urls = [
                    "http://localhost:8900/upgrade/get/getAllTables"
                ];
                break;
        }
        let tableInfoAll;
        setTimeout(() => {
            HTTPUtil.URLs(urls).then((text) => {
                if(text.size != 0 ){
                    let tableInfo = JSON.parse(text[0]);
                    var tablesDetails = [];
                    for(var i in tableInfo){
                        tableInfo[i].key = i;
                        tablesDetails.push(tableInfo[i]);
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
        }, 500)
    }

    componentDidMount() {
       this.getData();
    }

    update = (newState) => {
        this.getData(newState);
    }

    render() {
        return (
            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                 <Conversion tablesNum={this.state.tablesNum} tablesInfo={this.state.tablesInfo} updateConversionPanel={this.update}/>
            </div>
        );
    }
}