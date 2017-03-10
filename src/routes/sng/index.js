import React from 'react';
import reactMixin from 'react-mixin';
import LayoutPage from '../../components/LayoutPage'
import Reflux from 'reflux';
import {Link} from 'react-router'
import Pubsub from 'pubsub-js';
import { Modal, Button,Table,Breadcrumb,Popconfirm,Row, Col, } from 'antd';
import {Actions,Store} from '../../models/sng';

class SNG extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            columns: [
                {
                    title: '模板ID',
                    dataIndex: 'id',
                    key: 'id'
                },
                {
                    title: '模板名称',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: '涨盲时间',
                    dataIndex: 'raiseBlindTime',
                    key: 'raiseBlindTime',
                },
                {
                    title: '初始积分',
                    dataIndex: 'buyIn',
                    key: 'buyIn',
                },{
                    title: '盲注表',
                    key: 'raiseBlind',
                    render:(value)=>(
                        <a href="#" className="ant-dropdown-link">查看</a>
                    )
                },,{
                    title: '报名费',
                    dataIndex: 'signUpFee',
                    key: 'signUpFee',
                },
                {
                    title: '奖励',
                    key: 'rewards',
                    render:(value)=>(
                        <a href="#" className="ant-dropdown-link">查看</a>
                    )
                },
                {
                    title: '操作人',
                    key: 'operator',
                    render:(text)=>(
                        <span>Admin</span>
                    )
                },
                {
                    title: '操作',
                    key: 'edit',
                    render:(text)=>(
                        //onConfirm={this.confirm} onCancel={this.cancel}
                       <div>
                            <Popconfirm title="确认删除该行数据?" okText="Yes" cancelText="No">
                                <a className="ant-dropdown-link">删除</a>
                            </Popconfirm>
                            <span className="lm"/>
                            <a className="ant-dropdown-link">编辑</a>
                        </div>
                    )
                }
            ]
        }
    }

    componentDidMount(){
        Pubsub.publish('layoutCurrent','m2')
        Actions.getTempList()
    }

    render(){
        var t = this;

        return (
            <LayoutPage>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>赛事</Breadcrumb.Item>
                    <Breadcrumb.Item href="/">SNG模板</Breadcrumb.Item>
                </Breadcrumb>
                <span className="tm"/>
                <Row gutter={20}>
                    <Col span={5}>
                        <Link to="/create/sng">
                            <Button icon="plus" type="primary">创建SNG模板</Button>
                        </Link>
                    </Col>
                </Row>
                <span className="tm"/>
                <Table dataSource={t.state.SNG.templates} columns={t.state.columns} />
            </LayoutPage>
        )
    }
}

reactMixin.onClass( SNG, Reflux.connect(Store,'SNG'))

SNG.propTypes = {
};

module.exports = SNG;