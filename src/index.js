import './index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

const Index = require('./routes/index/index');
const SNG = require('./routes/sng/index');
const SNGTemp = require('./routes/sng/sngTemp');
const Prize = require('./routes/prize');
const Recharge = require('./routes/recharge/index');
const Gold = require('./routes/recharge/gold');
const Login = require('./routes/login/index');
const GoldMobile = require('./routes/mobile/Gold');

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/login" component={Login} />
    <Route path="/login/:page" component={Login} />
    <Route path="/" component={Index} />
    <Route path="/sng" component={SNG} />
    <Route path="/create/sng" component={SNGTemp} />
    <Route path="/edit/sng/:id" component={SNGTemp} />
    <Route path="/prize" component={Prize} />
    <Route path="/recharge" component={Recharge} />
    <Route path="/gold" component={Gold} />
    <Route path="/gold_mobile" component={GoldMobile} />
  </Router>, document.getElementById('root')
);
