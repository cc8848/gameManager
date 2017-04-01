import React from 'react';
import LayoutPage from '../../components/LayoutPage'
import { Breadcrumb,Input,Upload,Icon, Form, Row, Col, Select,DatePicker,Button,Table,Popconfirm, message, Modal, Checkbox } from 'antd';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import Pubsub from 'pubsub-js';
const InputGroup = Input.Group;
const FormItem = Form.Item;

import {Actions,Store} from '../../models/recharge';

class Gold extends React.Component{
    constructor(props){
        super(props)
        this.state = {
           ModelVisible: false,
           svalue: '',
           columns: [
               {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                },
                {
                    title: '用户ID',
                    dataIndex: 'userId',
                    key: 'userId',
                },
                {
                    title: '微信昵称 | 游戏昵称',
                    render:(value)=>(
                        <span>{value.wxName} | {value.userName}</span>
                    ),
                    key: 'userName',
                },
                {
                    title: '手机号',
                    dataIndex: 'userPhone',
                    key: 'userPhone',
                },
                {
                    title: '操作人',
                    render:(value)=>(
                        <span>Admin</span>
                    ),
                    key: 'admin',
                },
                {
                    title: '发放金币数',
                    dataIndex: 'moneyNum',
                    key: 'moneyNum',
                },
                {
                    title: '描述',
                    dataIndex: 'changeDesc',
                    key: 'changeDesc',
                },
           ]
        }
    }

    componentDidMount(){
        Pubsub.publish('layoutCurrent','s3_2')
        Actions.getUserList();
        Actions.getRechargeList();
    }

    search(key){
        var tmp = [];
        this.state.Recharge.userList.map(function(i){
            if (i.phone.match(key) && i.phone.match(key).length > 0){
                tmp.push(
                    <Option value={i.phone}>{i.phone} ({i.wxName} | {i.userName})</Option>
                )
            }
        })
        return tmp;
    }

    handleAddGold=()=> {
        this.setState({
            ModelVisible: true
        })
    }

    handleAddGoldCancel=()=> {
        this.setState({
            ModelVisible: false
        })
    }

    handleSubmit = (e) => {
        var t = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (values.number.toString() === '0') {
                return message.error('金币数量不能为0')
            }
            if (!err) {
                if (confirm('你确定要给手机号: '+ values.mobile + '发放:' + values.number + '金币吗?')) {  
                    Actions.addGold(values,function(data){
                        if (data.data === true) {
                            message.success('金币发放成功!')
                            Actions.getRechargeList();
                            t.setState({
                                ModelVisible: false
                            })
                        }
                    })
                }
            }
        });
    }

    handleChange(value){
        this.setState({ svalue:  value});
    }

    render(){
        var t = this;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        return (
            <LayoutPage>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>充值管理</Breadcrumb.Item>
                    <Breadcrumb.Item href="/#/gold">金币发放记录</Breadcrumb.Item>
                </Breadcrumb>
                <span className="tm"/>
                <Row gutter={20}>
                    <Col span={2}>
                        <Button icon="plus" type="primary" onClick={t.handleAddGold}>发放金币</Button>
                    </Col>
                </Row>
                <span className="tm"/>
                <Row>
                    <Table dataSource={t.state.Recharge.chargeList} columns={t.state.columns} />
                </Row>
                <Modal 
                    visible={t.state.ModelVisible}
                    title="金币发放"
                    footer={[]}
                    className="hideFooter"
                    onCancel={t.handleAddGoldCancel}
                    >
                    <Form onSubmit={t.handleSubmit}>
                        <FormItem
                        label="手机号:"
                        >
                            {getFieldDecorator('mobile', {
                                rules: [{required: true, message: '请选择手机号' }],
                            })(
                                <Select
                                    combobox
                                    value={t.state.svalue}
                                    notFoundContent=""
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onChange={t.handleChange.bind(t)}
                                    style={{width: '100%'}}
                                    >
                                    {
                                        t.search(t.state.svalue)
                                    }
                                </Select>
                            )}
                        </FormItem>
                         <FormItem
                            label="金币数:"
                            >
                            {getFieldDecorator('number', {
                                initialValue: '0',
                                rules: [{required: true, message: '请输入金币数量' }],
                            })(
                               <Input/>
                            )}
                        </FormItem>
                        <Button key="submit" hidden="true" type="primary" htmlType="submit" size="large">提交</Button>    
                    </Form>
                </Modal>
            </LayoutPage>
        )
    }
}

Gold.propTypes = {
};

reactMixin.onClass(Gold, Reflux.connect(Store,'Recharge'))

const _Gold = Form.create()(Gold);

module.exports = _Gold;
