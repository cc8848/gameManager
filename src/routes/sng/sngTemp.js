//  sng 模板
import React from 'react';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import LayoutPage from '../../components/LayoutPage'
import Pubsub from 'pubsub-js';
import { Modal, Breadcrumb,Row,Cascader,TimePicker,Table, InputNumber, Upload, Col,Icon, Button, Form, DatePicker,Input,Select,message } from 'antd';
const FormItem = Form.Item;
import moment from 'moment';
const Option = Select.Option;
const InputGroup = Input.Group;
import {Actions,Store} from '../../models/sng';
import './sngTemp.less';
// 盲注结构表
var raiseBlind = require('./raiseBlind')
class _SNGTemp extends React.Component{
    constructor(props){
        super(props)
        this.state = {
           prizeModelVisible: false,
           prizesValue: [],
           prizesList: [], // 实物奖品列表
           prizeNum: 1, // 实物奖品数量
           matchPicture: [],
           prizesColumns: [
               {
                    title: '奖励',
                    render:(value)=>(
                        <a className="ant-dropdown-link">展开查看奖励</a>
                    ),
                    key: 'chip',
               },
               {
                    title: '操作',
                    render:(value)=>(
                        <a className="ant-dropdown-link">删除</a>
                    ),
                    key: 'edit',
               },
               
           ],
           tempPrizesObj: {
               randomKey: '',
               chip: 0,
               diamond: 0,
               masterScore: 0,
               rewardPrizes: []
           }
        }
    }

    componentDidMount(){
        var t = this;
        Pubsub.publish('layoutCurrent','m2')
        Actions.getPrizeList(function(data){
            t.setState({
                prizesValue: [JSON.stringify(data[0])]
            })
        });
    }

    handleAddPrizeOK = (e) =>{
        var t = this;
        t.state.prizesValue.map(function(item){
            var obj = JSON.parse(item);
            t.state.tempPrizesObj.randomKey = Math.random()
            t.state.tempPrizesObj.rewardPrizes.push({
                prizeId: obj.id,
                prizeName: obj.prizeName,
                prizeNum: t.state.prizeNum,
                prizeIcon: obj.prizeImgUrl,
                prizeId2: "",
                prizeType: 0
            })
        })
        t.state.prizesList.push(t.state.tempPrizesObj);
        t.state.tempPrizesObj = {
            chip: 0,
            diamond: 0,
            masterScore: 0,
            rewardPrizes: []
        }
        t.setState({
            prizeModelVisible: false
        })
        console.log(t.state.prizesList)
    }

    handleModelInputChanged=(type,event)=>{
        if (event.target.value != '') {
            this.state.tempPrizesObj[type] = (Number(event.target.value) || 0);
        }
    }

    handleAddPrizeCancel = () =>{
        this.setState({
            prizeModelVisible: false
        })
    }
    
    handleShowAddModel = () => {
        console.log('handleShowAddModel')
        this.setState({
            prizeModelVisible: true
        })
    }

    handleSubmit = (e) => {
        var t = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.maxPlayer = values.minPlayer;
                values.createTime = moment().unix(); 
                values.iconUrl = t.state.matchPicture[0].response.data;
                values.signUpFeeType = values.serviceFeeType;
                values.raiseBlind = raiseBlind[values.raiseBlindIndex] || [];
                var _rewards = [];
                var _rindex = 0;
                t.state.prizesList.map(function(item,i){
                    _rewards.push({
                        rewardIndex: i,
                        chip: item.chip,
                        diamond: item.diamond,
                        masterScore: item.masterScore,
                        rewardPrizes: item.rewardPrizes
                    })
                })
                values.rewards = _rewards;
                console.log(values)
                Actions.createSng(values,function(data){
                    if (data.data === true) {
                        message.success('SNG模板添加成功');
                        setTimeout(function(){
                            window.location.href = '/#/sng'
                        })
                    } else {
                        message.error('SNG模板创建失败');
                    }
                })
            }
        });
    }

    prizeSelectChanged(value){
        var t = this;
        this.setState({
            prizesValue: value,
        });
    }

    render(){
        var t = this;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const props = {
            action: '/api/upload',
            listType: 'picture',
            multiple: false,
            fileList: t.state.matchPicture,
            onChange: function(files){
                t.setState({
                    matchPicture: [files.file]
                })
            }
        };
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 12 },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        return (
            <LayoutPage>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>赛事</Breadcrumb.Item>
                    <Breadcrumb.Item href="/#/sng">SNG模板</Breadcrumb.Item>
                    <Breadcrumb.Item href="/#/create/sng">创建SNG模板</Breadcrumb.Item>
                </Breadcrumb>
                <span className="tm"/>
                <Form onSubmit={t.handleSubmit}>
                    <FormItem
                        label="赛事图片:"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('iconUrl', {
                            rules: [{ type: 'object', required: true, max: 20, message: '请上传赛事图片' }],
                        })(
                            <Upload {...props}>
                                <Button>
                                    <Icon type="upload"/>上传图片
                                </Button>
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        label="类型名称:"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('name', {
                            rules: [{ required: true, max: 20, message: '请填写SNG模板名称' }],
                        })(
                            <Input style={{width: 'auto'}}/>
                        )}
                    </FormItem>
                    <FormItem
                        label="牌桌人数:"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('minPlayer', {
                            initialValue: '9',
                            rules: [{required: true, message: '请选择拍桌人数' }],
                        })(
                           <Select style={{width: 'auto'}}>
                                <Option value="1">1人</Option>
                                <Option value="2">2人</Option>
                                <Option value="3">3人</Option>
                                <Option value="4">4人</Option>
                                <Option value="5">5人</Option>
                                <Option value="6">6人</Option>
                                <Option value="7">7人</Option>
                                <Option value="8">8人</Option>
                                <Option value="9">9人</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label="涨盲时间:"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('raiseBlindTime', {
                            rules: [{ required: true, max: 20, message: '请填写涨盲时间' }],
                        })(
                            <Input  min={1} max={10} style={{width: 'auto'}}/>
                        )}
                        <span className="lm"/>
                        <span className="ant-form-text">秒</span>
                    </FormItem>
                    <FormItem
                        label="初始积分:"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('buyIn', {
                            rules: [{ required: true, max: 20, message: '请填写初始积分' }],
                        })(
                            <Input min={1} max={10} style={{width: 'auto'}}/>
                        )}
                        <span className="lm"/>
                        <span className="ant-form-text">分</span>
                    </FormItem>
                    <FormItem
                        label="盲注结构:"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('raiseBlindIndex', {
                            initialValue: '0',
                            rules: [{required: true, message: '请选择盲注结构' }],
                        })(
                            <Select style={{width: 'auto'}}>
                                <Option value="0">标准</Option>
                            </Select>
                        )}
                        <span className="lm"/>
                        <Button size="small">查看</Button>
                    </FormItem>
                    <FormItem
                        label="报名费:"
                        {...formItemLayout}
                        >
                            <InputGroup compact size="normal">
                            {getFieldDecorator('signUpFee', {
                                initialValue: 0,
                                rules: [{required: true, message: '请填写报名费' }],
                            })(
                                <Input type="number" placeholder="报名费" style={{width: '35%'}}/>
                            )}
                            {getFieldDecorator('serviceFee', {
                                initialValue: 0,
                                rules: [{required: true, message: '请填写服务费' }],
                            })(
                                <Input type="number" placeholder="服务费" style={{width: '35%'}}/>
                            )}
                            {getFieldDecorator('serviceFeeType', {
                                initialValue: '1',
                                rules: [{required: true, message: '请选择类型' }],
                            })(
                                <Select style={{width: '30%'}}>
                                    <Option value="1">筹码</Option>
                                    <Option value="2">钻石</Option>
                                </Select>
                            )}
                            </InputGroup>
                        
                    </FormItem>
                    <FormItem
                        label="奖励:"
                        labelCol={ {span: 2} }
                        wrapperCol={ {span: 12} }
                        >
                        <Button type="dashed" onClick={this.handleShowAddModel}>
                            <Icon type="plus"/> 新增奖励
                        </Button>
                        <span className="tm"/>
                        <Table columns={t.state.prizesColumns} rowKey= "randomKey" expandedRowRender={
                            record => <div><p>奖品列表:</p>{
                                (()=>{
                                    var doms = [];
                                    for (var item in record) {
                                        if (item !== 'randomKey'){
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
                                                    if (typeof record[item] === 'object') {
                                                        return record[item].map(function(i){
                                                            return <span>{i.prizeName}({i.prizeNum}个),</span>
                                                        })
                                                    }else {
                                                        return record[item]
                                                    }
                                                })() 
                                            }<br/></span>)   
                                        }
                                    }
                                    return doms;
                                })()
                            }</div>
                        } dataSource={t.state.prizesList} size="small"></Table>
                    </FormItem>
                    <FormItem
                        label="操作:"
                        {...formItemLayout}
                        >
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            提交
                        </Button>
                    </FormItem>
                </Form>
                <Modal 
                    visible={t.state.prizeModelVisible}
                    title="新增奖励"
                    onOk={t.handleAddPrizeOK}
                    onCancel={t.handleAddPrizeCancel}
                    >
                    <Form>
                        <FormItem
                            label="筹码:"
                            >
                            <Input type="Number" defaultValue={t.state.tempPrizesObj.chip} onChange={t.handleModelInputChanged.bind(event,'chip')} placeholder="筹码" style={{ width: 150 }}/>
                        </FormItem>
                        <FormItem
                            label="钻石:"
                            >
                            <Input type="Number" defaultValue={t.state.tempPrizesObj.diamond} onChange={t.handleModelInputChanged.bind(event,'diamond')} placeholder="钻石" style={{ width: 150 }}/>
                        </FormItem>
                        <FormItem
                            label="大师分:"
                            >
                            <Input type="Number" defaultValue={t.state.tempPrizesObj.masterScore} onChange={t.handleModelInputChanged.bind(event,'masterScore')} placeholder="大师分" style={{ width: 150 }}/>
                        </FormItem>
                        <FormItem
                            label="实物奖励:"
                            >
                            {
                                t.state.SNG.prizeList.length > 0 ? (<Select tags
                                style={{ width: '100%' }}
                                searchPlaceholder="标签模式"
                                value={t.state.prizesValue}
                                onChange={t.prizeSelectChanged.bind(t)}
                            >
                                {
                                    t.state.SNG.prizeList.map(function(item){
                                        return (<Option value={JSON.stringify(item)}>{item.prizeName}</Option>)
                                    })
                                }
                            </Select>) : (<span>没有实物奖品,请手动添加 <a href="/#/prize">点击添加奖品</a></span>)
                            }
                        </FormItem>
                    </Form>
                <span className="tm"/>
                </Modal>
            </LayoutPage>
        )
    }
}

reactMixin.onClass(_SNGTemp, Reflux.connect(Store,'SNG'))

_SNGTemp.propTypes = {
};

const SNGTemp = Form.create()(_SNGTemp);

module.exports = SNGTemp;