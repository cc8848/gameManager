import React from 'react';
import LayoutPage from '../../components/LayoutPage'
import { Breadcrumb,Input, Row, Col, Select,DatePicker,Button,Table,Popconfirm, message, Modal, Checkbox } from 'antd';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import Pubsub from 'pubsub-js';

import {Actions,Store} from '../../models/recharge';

// const Option = Select.Option;
// const FormItem = Form.Item;

class Recharge extends React.Component{
    constructor(props){
        super(props)
        this.state = {
           blindListVisible: false, // 盲注表显示开关
            columns: [
                {
                    title: '订单ID',
                    dataIndex: 'id',
                    key: 'id',
                },
                {
                    title: '充值时间',
                    dataIndex: 'payTime',
                    key: 'payTime',
                },
                {
                    title: '用户ID',
                    dataIndex: 'userId',
                    key: 'userId',
                },
                {
                    title: '姓名',
                    dataIndex: 'userName',
                    key: 'userName',
                }, {
                    title: '手机',
                    dataIndex: 'userPhone',
                    key: 'userPhone',
                },{
                    title: '充值方式',
                    dataIndex: 'payStyle',
                    key: 'payStyle',
                },
                {
                    title: '金币充值',
                    key: 'payPrice',
                    dataIndex: 'payPrice',
                }
            ],
        }
    }

    componentDidMount(){
        Pubsub.publish('layoutCurrent','s3_1')
        Actions.getPayList()
    }

    render(){
        var t = this;

        return (
            <LayoutPage>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>充值管理</Breadcrumb.Item>
                    <Breadcrumb.Item href="/#/prize">充值记录</Breadcrumb.Item>
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
                </Row>
                <span className="tm"/>
                <Row gutter={20}>
                    <Col span={2}>
                        <Button icon="search" type="primary">查询</Button>
                    </Col>
                    <Col span={2}>
                        <Button icon="ellipsis" type="primary">充值统计</Button>    
                    </Col>
                </Row>
                <span className="tm"/>
                <Row>
                    <Table columns={t.state.columns} dataSource={t.state.Recharge.payList}/>
                </Row>
            </LayoutPage>
        )
    }
}

Recharge.propTypes = {
};

reactMixin.onClass(Recharge, Reflux.connect(Store,'Recharge'))

// const __Name_ = Form.create()(_Name_);

module.exports = Recharge;
