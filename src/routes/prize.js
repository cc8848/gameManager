import React from 'react';
import LayoutPage from '../components/LayoutPage'
import { Breadcrumb,Input,Upload,Icon, Form, Row, Col, Select,DatePicker,Button,Table,Popconfirm, message, Modal, Checkbox } from 'antd';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import Pubsub from 'pubsub-js';

import {Actions,Store} from '../models/sng';

const Option = Select.Option;
const FormItem = Form.Item;

class Prize extends React.Component{
    constructor(props){
        super(props)
        this.state = {
           prizePicture: []
        }
    }

    componentDidMount(){
        Pubsub.publish('layoutCurrent','h1')
    }

    handleSubmit = (e) => {
        var t = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.prizeImgUrl = values.iconUrl.fileList[0].response.data;
                delete values.iconUrl;
                Actions.createPrize(values,function(data){
                    console.log(data)
                })
            }
        });
    }

    render(){
        var t = this;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        const { getFieldDecorator } = this.props.form;
        const props = {
            action: '/api/prize/upload',
            listType: 'picture',
            multiple: false,
            fileList: t.state.prizePicture,
            onChange: function(files){
                t.setState({
                    prizePicture: [files.file]
                })
            }
        };
        
        return (
            <LayoutPage>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>奖品配置</Breadcrumb.Item>
                    <Breadcrumb.Item href="/#/prize">创建奖品</Breadcrumb.Item>
                </Breadcrumb>
                <span className="tm"/>
                <Form onSubmit={t.handleSubmit}>
                    <FormItem
                        label="奖品图片:"
                        {...formItemLayout}
                        >
                         {getFieldDecorator('iconUrl', {
                            rules: [{ type: 'object', required: true, max: 20, message: '请上传奖品图片' }],
                        })(
                            <Upload {...props} style={{width: 'auto'}}>
                                <Button>
                                    <Icon type="upload"/>上传图片
                                </Button>
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        label="奖品名称:"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('prizeName', {
                            rules: [{ required: true, max: 20, message: 'Please input the captcha you got!' }],
                        })(
                            <Input/>  
                        )}
                    </FormItem>
                    <FormItem
                        label="奖品描述:"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('desc', {
                            rules: [{ required: true, max: 20, message: 'Please input the captcha you got!' }],
                        })(
                            <Input/>  
                        )}
                    </FormItem>
                    <FormItem
                        label="操作"
                        {...formItemLayout}
                        >
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            提交
                        </Button>
                    </FormItem> 
                </Form>
            </LayoutPage>
        )
    }
}

Prize.propTypes = {
};

reactMixin.onClass(Prize, Reflux.connect(Store,'SNG'))

const _Prize = Form.create()(Prize);

module.exports = _Prize;
