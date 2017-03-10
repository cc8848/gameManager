import React from 'react';
import LayoutPage from '../../components/LayoutPage'
import { Breadcrumb,Input, Row, Col, Select,DatePicker,Button,Table,Popconfirm, message, Modal, Checkbox } from 'antd';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import {Actions,Store} from '../../models/index';
import Pubsub from 'pubsub-js';
import SNG from './sng';

const Option = Select.Option;

class Index extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            blindListVisible: false, // 盲注表显示开关
            columns: [
                {
                    title: '选择',
                    key: 'checked',
                    render:(value)=>(
                        <Checkbox></Checkbox>
                    )
                },
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                },
                {
                    title: '显示时间',
                    dataIndex: 'showTime',
                    key: 'showTime',
                }, {
                    title: '涨盲时间(秒)',
                    dataIndex: 'raiseBlindTime',
                    key: 'raiseBlindTime',
                },{
                    title: '初始积分',
                    dataIndex: 'buyIn',
                    key: 'buyIn',
                },
                {
                    title: '盲注表',
                    key: 'raiseBlind',
                    render:(value)=>(
                        <a href="#" className="ant-dropdown-link" onClick={this.showBlindList.bind(this,value)}>查看</a>
                    )
                },
                {
                    title: '报名费(元)',
                    dataIndex: 'signUpFee',
                    key: 'signUpFee',
                },
                {
                    title: '奖励',
                    key: 'prize',
                    render:(text)=>(
                        <a href="#" className="ant-dropdown-link">查看</a>
                    )
                },
                {
                    title: '参赛选手',
                    key: 'users',
                    render:(text)=>(
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
                        <div>
                            <Popconfirm title="确认删除该行数据?" onConfirm={this.confirm.bind(this,text)} onCancel={this.cancel} okText="Yes" cancelText="No">
                                <a className="ant-dropdown-link">删除</a>
                            </Popconfirm>
                            <span className="lm"/>
                            <a className="ant-dropdown-link">编辑</a>
                        </div>
                    )
                }
            ],
        }
    }

    showBlindList(data){
        Modal.info({
            title: '盲注表',
            content: (
                 <div>
                    {
                        data.raiseBlind.blindItemList.map((i,index)=>{
                            return <p>{index} {i.smallBlind}/{i.smallBlind * 2}</p>
                        })
                    }
                </div>
                
            )
        });
    }

    handleCreateSNG(){
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
        Actions.deleteTable(id,function(data){
            console.log(data)
        })
        message.success('Click on Yes');
    }

    componentDidMount(){
        Pubsub.publish('layoutCurrent','m1')
        Actions.getMatchList()
    }

    cancel(e) {
        message.error('Click on No');
    }
    

    render(){
        var t = this;
        return (
            <LayoutPage>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>赛事</Breadcrumb.Item>
                    <Breadcrumb.Item href="/">赛事管理</Breadcrumb.Item>
                </Breadcrumb>
                <span className="tm"/>
                <Row gutter={20}>
                    <Col span={5}>
                        <span>赛事名: </span>
                        <Input placeholder="赛事名" style={{ width: 150 }}/>
                    </Col>  
                    <Col span={5}>      
                        <span>比赛时间: </span>
                        <DatePicker/>
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
                <span className="tm"/>
                <Row gutter={20}>
                    <Col span={2}>
                        <Button icon="plus" type="primary" onClick={t.handleCreateSNG.bind(t)}>创建SNG</Button>
                    </Col>
                </Row>
                <span className="tm"/>
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
reactMixin.onClass(Index, Reflux.connect(Store,'Index'))

module.exports = Index;
