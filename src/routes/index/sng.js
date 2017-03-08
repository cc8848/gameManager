import React from 'react';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import { Modal, Button, Form, DatePicker,Input,Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import {Actions,Store} from '../../models/sng';
import './sng.less';

class _SNG extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            visible: false,
            templates: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // TODO: submit SNG 
                console.log('Received values of form: ', values);
            }
        });
    }

    componentDidMount(){
        var t = this;
        Actions.getTempList()
    }

    handleCancel(){
        const Actions = require ('../../models/index').Actions;
        Actions.hideSng()
    }

    render(){
        var t = this;
        const { getFieldDecorator } = this.props.form;
        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };
        return (
            <Modal 
                onCancel={t.handleCancel.bind(this)}
                visible={t.props.visible}
                footer={[]}
                className="createSng"
                >
                <Form onSubmit={t.handleSubmit.bind(t)} id="sngForm">
                    <FormItem
                        label="赛事显示时间:"
                        >
                        {getFieldDecorator('time', {
                            rules: [{ required: true, max: 20, message: '请填写赛事显示时间' }],
                        })(
                            <DatePicker />
                        )}
                    </FormItem>
                    <FormItem
                        label="赛事名称:"
                        >
                        {getFieldDecorator('name', {
                            rules: [{ required: true, max: 20, message: '请填写赛事名称' }],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem
                        label="SNG模板:"
                        >
                        {getFieldDecorator('template', {
                            rules: [{ required: true, message: '请选择SNG模板' }],
                        })(
                            <Select>
                                {
                                    t.state.SNG.templates.map((tem)=>{
                                        return (
                                            <Option value={tem.id}>{tem.name}</Option>
                                        )
                                    })
                                }                                
                            </Select>    
                        )}
                    </FormItem>
                    <Button key="submit" hidden="true" type="primary" htmlType="submit" size="large">提交</Button>
                </Form>
            </Modal>
        )
    }
}

reactMixin.onClass( _SNG, Reflux.connect(Store,'SNG'))

_SNG.propTypes = {
};

const SNG = Form.create()(_SNG);

module.exports = SNG;