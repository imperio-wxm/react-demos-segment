import React from 'react'
import { render } from 'react-dom'

// 引入react-router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'

import HTTPUtil from '../../../actions/fetch/FetchUtils.js'

export default class HBasePanel extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
       
    }

    render() {
        return (
            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                HBase
            </div>
        );
    }
}