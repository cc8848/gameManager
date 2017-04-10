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

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Index} />
    <Route path="/sng" component={SNG} />
    <Route path="/create/sng" component={SNGTemp} />
    <Route path="/edit/sng/:id" component={SNGTemp} />
    <Route path="/prize" component={Prize} />
    <Route path="/recharge" component={Recharge} />
    <Route path="/gold" component={Gold} />
  </Router>, document.getElementById('root')
);
