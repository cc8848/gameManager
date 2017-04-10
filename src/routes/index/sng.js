import React from 'react';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import moment from 'moment';
import { Modal, Button, Form, DatePicker,Input,Select,TimePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const IndexActions = require ('../../models/index').Actions;
import {Actions,Store} from '../../models/sng';

class _SNG extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            visible: false,
            templates: []
        }
    }

    handleSubmit = (e) => {
        var t = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var _showTime = moment(values.date).hour(moment(values.time).hour()).minute(moment(values.time).minute())
                var template = {}
                t.state.SNG.templates.map((item)=>{
                    if (item.id === values.template) {
                        var _jvalue = JSON.stringify(item);
                        template = JSON.parse(_jvalue);
                    }
                })
                template.showTime = _showTime.unix();
                template.name = values.name;
                Actions.createTable(template,function(data){
                    IndexActions.getMatchList(function(){
                        IndexActions.hideSng();
                    });
                })
            }
        });
    }

    componentDidMount(){
        Actions.getTempList()
    }

    handleCancel(){
        IndexActions.hideSng()
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
                className="hideFooter"
                >
                <Form onSubmit={t.handleSubmit.bind(t)} id="sngForm">
                    <FormItem
                        label="赛事显示时间:"
                        >
                        {getFieldDecorator('date', {
                            initialValue: moment(new Date(), 'YYYY/MM/DD'),
                            rules: [{ required: true, message: '请填写日期' }],
                        })(
                            <DatePicker />
                        )}
                        <span>  -  </span>
                        {getFieldDecorator('time', {
                            initialValue: moment(new Date()),
                            rules: [{ type: "object", required: true, message: '请选择时间' }],
                        })(
                            <TimePicker format="HH:mm"/>
                        )}
                    </FormItem>
                    <FormItem
                        label="赛事名称:"
                        >
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请填写赛事名称' }],
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