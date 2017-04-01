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
           prizePicture: [],
           columns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                },
                {
                    title: '名称',
                    dataIndex: 'prizeName',
                    key: 'prizeName',
                },
                {
                    title: '缩略图',
                    key: 'prizeImgUrl',
                    dataIndex: 'prizeImgUrl',
                    /*render: (value)=>{
                        <div>
                            {console.log(value.prizeImgUrl)}
                            <img  style={{ width: '100%' }} src={value.prizeImgUrl}/>
                        </div>
                    }*/
                },
                {
                    title: '描述',
                    dataIndex: 'desc',
                    key: 'desc',
                }, {
                    title: '价格',
                    dataIndex: 'price',
                    key: 'price',
                },{
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                },
                {
                    title: '操作',
                    key: 'edit',
                    render:(value)=>(
                        <div>
                            <Popconfirm title="确认删除该行数据?" onConfirm={this.handleDelete.bind(this,value.id)} okText="Yes" cancelText="No">
                                <a className="ant-dropdown-link">删除</a>
                            </Popconfirm>
                            <span className="lm"/>
                            <a className="ant-dropdown-link">编辑</a>
                        </div>
                    )
                },
           ],
        }
    }

    componentDidMount(){
        Pubsub.publish('layoutCurrent','h1')
        Actions.getPrizeList()
    }

    handleSubmit = (e) => {
        var t = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.prizeImgUrl = values.iconUrl.fileList[0].response.data;
                delete values.iconUrl;
                Actions.createPrize(values,function(data){
                   if (data.data === true) {
                        message.success('礼物添加成功');
                    }
                })
            }
        });
    }

    handleDelete(value){
        message.error('删除功能尚未实现')
        // Actions.deletePrize({
        //     prizeTypeId: value
        // })
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
                <Table columns={t.state.columns} dataSource={t.state.SNG.prizeList}/>
            </LayoutPage>
        )
    }
}

Prize.propTypes = {
};

reactMixin.onClass(Prize, Reflux.connect(Store,'SNG'))

const _Prize = Form.create()(Prize);

module.exports = _Prize;
