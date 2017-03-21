//  sng 模板
import React from 'react';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import LayoutPage from '../../components/LayoutPage'
import Pubsub from 'pubsub-js';
import { Modal, Breadcrumb,Row,Cascader,TimePicker, InputNumber, Upload, Col,Icon, Button, Form, DatePicker,Input,Select,message } from 'antd';
const FormItem = Form.Item;
import moment from 'moment';
const Option = Select.Option;
const InputGroup = Input.Group;
import {Actions,Store} from '../../models/sng';
import './sngTemp.less';
// 盲注结构表
var raiseBlind = require('./raiseBlind')
let uuid = 0;
let prizeList = {};
let rankUuid = 0;
let prizeIndex = 0;
class _SNGTemp extends React.Component{
    constructor(props){
        super(props)
        this.state = {
           prizeType: 'chip',
           prizeValue: '',
           prizeSelectValue: '',
           prizeModelVisible: false,
           prizesValue: '',
           matchPicture: []
        }
    }

    componentDidMount(){
        var t = this;
        Pubsub.publish('layoutCurrent','m2')
        Actions.getPrizeList(function(data){
            t.setState({
                prizesValue: data[0]
            })
        });
    }

    remove = (index,item) => {
        delete prizeList[index][item]
        this.setState({
            prizeModelVisible: false
        })
    }

    add = (index) => {
        prizeIndex = index;
        uuid++;
        this.setState({
            prizeModelVisible: true
        })
    }

    handleAddPrizeOK = () =>{
        console.log(this.state.prizeType)
        console.log(this.state.prizesValue)
        // if (!!!this.state.prizeValue || !!!this.state.prizesValue){
        //     return
        // }
        if (typeof prizeList[prizeIndex] != 'object') {
            prizeList[prizeIndex] = {}
        }
        if (this.state.prizeType === 'chip' || this.state.prizeType === 'diamond'||this.state.prizeType === 'masterScore') {
            prizeList[prizeIndex][this.state.prizeType] = this.state.prizeValue;
        } else if (this.state.prizeType === 'prizes') {
            prizeList[prizeIndex][this.state.prizeType] = this.state.prizesValue.prizeName;
        }
        this.setState({
            prizeModelVisible: false
        })
    }

    handlePrizeInputChanged=(e)=>{
        this.setState({
            prizeValue: e.target.value
        })
    }

    handlePrizesChanged=(e)=>{
        console.log(e)
    }

    handleAddPrizeCancel = () =>{
        this.setState({
            prizeModelVisible: false
        })
    }

    addRank = () => {
        rankUuid++;
        const { form } = this.props;
        const keys = form.getFieldValue('rankKeys');
        const nextKeys = keys.concat(rankUuid);
        form.setFieldsValue({
            rankKeys: nextKeys,
        });
    }

    removeRank = (k,index) => {
        delete prizeList[index]
        const { form } = this.props;
        const keys = form.getFieldValue('rankKeys');
        form.setFieldsValue({
            rankKeys: keys.filter(key => key !== k),
        });
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
                var _showTime = moment(values.showTime).hour(moment(values.showTime2).hour()).minute(moment(values.showTime2).minute())
                values.showTime = _showTime.unix();
                values.raiseBlind = raiseBlind[values.raiseBlindIndex] || [];
                var _rewards = [];
                var _rindex = 0;
                for (var item in prizeList) {
                    _rewards.push({
                        rewardIndex: _rindex,
                        chip: prizeList[item].chip ? prizeList[item].chip : 0,
                        diamond: prizeList[item].diamond ? prizeList[item].diamond : 0,
                        masterScore: prizeList[item].masterScore ? prizeList[item].masterScore : 0,
                        des: "",
                        // TODO 等礼物接口完了 再搞这个
                        rewardPrizes: []
                    })
                    _rindex ++;
                }
                values.rewards = _rewards;
                Actions.createSng(values,function(data){
                    if (data.data === true) {
                        message.success('SNG模板添加成功');
                    }
                })
            }
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
            wrapperCol: { span: 8 },
        };
        getFieldDecorator('keys', { initialValue: [] });
        getFieldDecorator('rankKeys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const rankKeys = getFieldValue('rankKeys');
        
        // 奖品模板
        const prizeItems = function(index){
            var t = this;
            var dom = [];
            for (var item in prizeList[index]) {
                dom.push(
                     <Row gutter={10}>
                        <Col span={5}/>
                        <Col span={5}>
                            {
                                (()=>{
                                    switch(item){
                                        case 'chip': 
                                            return (<span>筹码</span>)
                                        break;
                                        case 'diamond': 
                                            return (<span>钻石</span>)
                                        break;
                                        case 'masterScore': 
                                            return (<span>大师分</span>)
                                        case 'prizes': 
                                        return (<span>实物</span>)
                                        break;
                                    }
                                })()
                            }
                        </Col>
                        <Col span={5}>
                            {prizeList[index][item]}
                        </Col>
                        <Col span={5}>
                           <Button size="small" onClick={()=> t.remove(index,item)}>删除</Button>
                        </Col>
                    </Row>
                )
            }
            return dom;
        }

        // 名次模板
        const rankItems = rankKeys.map((k, index)=>{
            var t = this;
            return (
                <div>
                <Row gutter={10}>
                    <Col span={5}>
                        <span>第{index+1}名: </span>
                    </Col>
                    <Col span={5}/>
                    <Col span={5}>
                        <Button size="small" onClick={t.add.bind(t,index)}>增加奖品</Button>
                    </Col>
                    <Col span={5}>
                        <Button size="small" onClick={() => this.removeRank(k,index)}>删除</Button>
                    </Col>
                </Row>
                {prizeItems.bind(t,index)()}
                </div>
            )
        })
        // 奖励类型
        var prizeTypeChanged = function(value){
            this.setState({
                prizeType: value
            })
        }
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
                        label="展示时间:"
                        {...formItemLayout}
                        >
                        <div>
                            {getFieldDecorator('showTime', {
                                initialValue: moment(new Date(), 'YYYY/MM/DD'),
                                rules: [{ type: "object", required: true, message: '请选择展示日期' }],
                            })(
                                <DatePicker format="YYYY/MM/DD" />
                            )}
                            <span>  -  </span>
                            {getFieldDecorator('showTime2', {
                                initialValue: moment(new Date()),
                                rules: [{ type: "object", required: true, message: '请选择展示时间' }],
                            })(
                                <TimePicker format="HH:mm"/>
                            )}
                        </div>
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
                        {...formItemLayout}
                        >
                        {rankItems}
                        <span className="tm"/>
                        <Button type="dashed" style={{ width: '60%' }} onClick={this.addRank}>
                            <Icon type="plus"/> 新增名次
                        </Button>
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
                    <InputGroup compact size="normal">
                        <Select defaultValue={t.state.prizeType} onChange={prizeTypeChanged.bind(t)}>
                            <Option value="chip">筹码</Option>
                            <Option value="diamond">钻石</Option>
                            <Option value="masterScore">大师分</Option>
                            <Option value="prizes">实物</Option>
                        </Select>
                        {
                            t.state.prizeType === 'chip' || t.state.prizeType === 'diamond' || t.state.prizeType === 'masterScore' ? 
                            (
                                <Input defaultValue={t.state.prizeValue} onChange={t.handlePrizeInputChanged.bind(t)} style={{width: '35%'}}/>
                            ) : 
                            (
                                <Select value={t.state.prizesValue}>
                                    {
                                        t.state.SNG.prizeList.map(function(item){
                                            return <Option value={item}>{item.prizeName}</Option>
                                        })
                                    }
                                </Select>
                            )
                        }
                    </InputGroup>
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