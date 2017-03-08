// import dva from 'dva';
import './index.less';
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

const Index = require('./routes/index/index')
const SNG = require('./routes/index/sng')
const SNGTemp = require('./routes/sng/sngTemp')
const Prize = require('./routes/prize')

ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/" component={Index}/>
      <Route path="/sngtemp" component={SNGTemp}/>
      <Route path="/prize" component={Prize}/>
    </Router>, document.getElementById('root')
);
