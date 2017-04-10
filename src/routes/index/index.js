import React from 'react';
import LayoutPage from '../../components/LayoutPage'
import { Breadcrumb, Input, Row, Col, Select, DatePicker, Button, Table, Popconfirm, message, Modal, Checkbox } from 'antd';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import { Actions, Store } from '../../models/index';
import Pubsub from 'pubsub-js';
import SNG from './sng';

const Option = Select.Option;

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            blindListVisible: false, // 盲注表显示开关
            columns: [
                {
                    title: '选择',
                    key: 'checked',
                    render: (value) => (
                        <Checkbox></Checkbox>
                    )
                },
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                },
                {
                    title: '比赛名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '显示时间',
                    render: (value) => {
                        return (new Date(value.showTime * 1000).toLocaleDateString().replace(/\//g, "-") + ' ' + (new Date(value.showTime * 1000)).toTimeString().substr(0, 8))
                    },
                    key: 'showTime',
                }, {
                    title: '涨盲时间(秒)',
                    dataIndex: 'raiseBlindTime',
                    key: 'raiseBlindTime',
                }, {
                    title: '初始积分',
                    dataIndex: 'buyIn',
                    key: 'buyIn',
                },
                {
                    title: '盲注表',
                    key: 'raiseBlind',
                    render: (value) => (
                        <a className="ant-dropdown-link" onClick={this.showBlindList.bind(this, value)}>查看</a>
                    )
                },
                {
                    title: '报名费(万)',
                    render: (value) => (
                        value.signUpFee / 10000 + '万'
                    ),
                    key: 'signUpFee',
                },
                {
                    title: '奖励',
                    key: 'prize',
                    render: (value) => (
                        <a className="ant-dropdown-link" onClick={this.showRewardsList.bind(this, value)}>查看</a>
                    )
                },
                {
                    title: '参赛选手',
                    key: 'users',
                    render: (value) => (
                        <a className="ant-dropdown-link">查看</a>
                    )
                },
                {
                    title: '操作人',
                    key: 'operator',
                    render: (value) => (
                        <span>Admin</span>
                    )
                },
                {
                    title: '操作',
                    key: 'edit',
                    render: (value) => (
                        <div>
                            <Popconfirm title="确认删除该行数据?" onConfirm={this.confirm.bind(this, value)} onCancel={this.cancel} okText="Yes" cancelText="No">
                                <a className="ant-dropdown-link">删除</a>
                            </Popconfirm>
                            <span className="lm" />
                            <a className="ant-dropdown-link">编辑</a>
                        </div>
                    )
                }
            ],
        }
    }

    showBlindList(data) {
        Modal.info({
            title: '盲注表',
            content: (
                <div>
                    {
                        data.raiseBlind.blindItemList.map((i, index) => {
                            return <p>{index} {i.smallBlind}/{i.smallBlind * 2}</p>
                        })
                    }
                </div>

            )
        });
    }

    showRewardsList(data) {
        Modal.info({
            title: '奖励',
            content: (
                <div>{
                    (() => {
                        var  doms  =  [];
                        data.rewards.map(function (ri, i) {
                            doms.push(<p>第{i + 1}名:</p>);
                            for  (var  item  in  ri)  {
                                if (item !== 'randomKey' && item !== 'id' && item !== 'rewardIndex' && item !== 'des') {
                                    doms.push(<span>{
                                        (() => {
                                            switch (item) {
                                                case  'chip':
                                                    return  '金币: '
                                                    break;
                                                case  'diamond':
                                                    return  '钻石: '
                                                    break;
                                                case  'masterScore':
                                                    return  '大师分: '
                                                    break;
                                                case  'rewardPrizes':
                                                    return  '实物: '
                                                    break;
                                            }
                                        })()
                                    }{
                                            (() => {
                                                if  (typeof  ri[item]  ===  'object')  {
                                                    if (ri[item].length <= 0) {
                                                        return <span>无实物奖品</span>
                                                    }
                                                    return  ri[item].map(function (i) {
                                                        return  <span>{i.prizeName}({i.prizeNum}个),</span>
                                                    })
                                                } else  {
                                                    return  ri[item]
                                                }
                                            })()
                                        }<br /></span>)
                                }
                            }
                            doms.push(<div><hr /><br /></div>)
                        })
                        return  doms;
                    })()
                }</div>)
        });
    }

    handleCreateSNG() {
        var t = this;
        Actions.showSng()
    }

    handleOk() {
        this.setState({
            blindListVisible: false
        })
    }

    confirm(param) {
        var id = param.id;
        Actions.deleteTable(id, function (data) {
            message.success('删除成功!')
            Actions.getMatchList()
        })
    }

    componentDidMount() {
        Pubsub.publish('layoutCurrent', 'm1')
        Actions.getMatchList()
    }

    cancel(e) {
        message.error('取消删除');
    }


    render() {
        var t = this;
        return (
            <LayoutPage>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>赛事</Breadcrumb.Item>
                    <Breadcrumb.Item href="/">赛事管理</Breadcrumb.Item>
                </Breadcrumb>
                <span className="tm" />
                <Row gutter={20}>
                    <Col span={5}>
                        <span>赛事名: </span>
                        <Input placeholder="赛事名" style={{ width: 150 }} />
                    </Col>
                    <Col span={5}>
                        <span>比赛时间: </span>
                        <DatePicker />
                    </Col>
                    <Col span={5}>
                        <span>比赛状态: </span>
                        <Select defaultValue="on" style={{ width: 120 }} >
                            <Option value="on">进行中</Option>
                            <Option value="off">已结束</Option>
                        </Select>
                    </Col>
                    <Col span={2}>
                        <Button icon="search" type="primary">Search</Button>
                    </Col>
                </Row>
                <span className="tm" />
                <Row gutter={20}>
                    <Col span={2}>
                        <Button icon="plus" type="primary" onClick={t.handleCreateSNG.bind(t)}>创建SNG</Button>
                    </Col>
                </Row>
                <span className="tm" />
                <Row>
                    <Table dataSource={t.state.Index.matchList} columns={t.state.columns} />
                </Row>

                <SNG visible={!!t.state.Index.sngVisible}></SNG>
            </LayoutPage>
        )
    }
}

Index.propTypes = {
};
reactMixin.onClass(Index, Reflux.connect(Store, 'Index'))

module.exports = Index;
