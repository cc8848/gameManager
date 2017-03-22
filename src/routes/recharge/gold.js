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
        }
    }

    componentDidMount(){
        Pubsub.publish('layoutCurrent','s3_2')
        Actions.getUserList();
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
            if (!err) {
               console.log(values)
               t.setState({
                   ModelVisible: false
               })
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
                            {getFieldDecorator('userMobile', {
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
                                        t.state.Recharge.userList.map(function(i){
                                            return (
                                                <Option value={i.phone}>{i.phone} ({i.wxName} | {i.userName})</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                         <FormItem
                            label="金币数:"
                            >
                            {getFieldDecorator('golden', {
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
