import React from 'react';
import reactMixin from 'react-mixin';
import LayoutPage from '../../components/LayoutPage'
import Reflux from 'reflux';
import {Link} from 'react-router'
import Pubsub from 'pubsub-js';
import { Modal, Button, message ,Table,Breadcrumb,Popconfirm,Row, Col, } from 'antd';
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
                        <a className="ant-dropdown-link" onClick={this.showBlindList.bind(this,value)}>查看</a>
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
                        <a className="ant-dropdown-link" onClick={this.showRewardsList.bind(this,value)}>查看</a>
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
                            <Popconfirm title="确认删除该行数据?" okText="Yes" onConfirm={this.handleDeleteTemp.bind(this,text.id)} cancelText="No">
                                <a className="ant-dropdown-link">删除</a>
                            </Popconfirm>
                            <span className="lm"/>
                            <a className="ant-dropdown-link" onClick={this.handleEdit.bind(this,text)}>编辑</a>
                        </div>
                    )
                }
            ]
        }
    }

    handleDeleteTemp(id){
        Actions.deleteTable({
            tableId: id
        },function(data){
            if (data.data === true) {
                message.success('删除模板成功');
                Actions.getTempList()
            } else {
                message.error('删除模板失败');
            }
        })
    }

    handleEdit(obj){
        Actions.setTempObj(obj,function(){
            window.location.href="/#/edit/sng/"+obj.id;
        })
    }

    componentDidMount(){
        Pubsub.publish('layoutCurrent','m2')
        Actions.getTempList()
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

    showRewardsList(data){
        Modal.info({
            title: '奖励',
            content: (
                <div>{
                    (()=>{
                    var doms = [];
                    data.rewards.map(function(ri,i){
                        doms.push(<p>第{i+1}名:</p>);
                        for (var item in ri) {
                            if (item !== 'randomKey' && item !== 'id' && item !== 'rewardIndex' && item !== 'des'){
                                doms.push(<span>{
                                    (()=>{
                                        switch(item){
                                            case 'chip':
                                            return '筹码: '
                                            break;
                                            case 'diamond':
                                            return '钻石: '
                                            break;
                                            case 'masterScore':
                                            return '大师分: '
                                            break;
                                            case 'rewardPrizes':
                                            return '实物: '
                                            break;
                                        }
                                    })()
                                }{ 
                                (()=>{
                                    if (typeof ri[item] === 'object') {
                                        if (ri[item].length <=0) {
                                            return <span>无实物奖品</span>
                                        }
                                        return ri[item].map(function(i){
                                            return <span>{i.prizeName}({i.prizeNum}个),</span>
                                        })
                                    } else {
                                        return ri[item]
                                    }
                                    })()
                                }<br/></span>)   
                            }
                        }
                        doms.push(<div><hr/><br/></div>)
                    })
                    return doms;
                    })()
                }</div>)
        });
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