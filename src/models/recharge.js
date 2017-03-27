import Reflux from 'reflux'
import request from '../utils/request'

const Actions = Reflux.createActions([
    "getUserList",
    "addGold",
    "getRechargeList",
    'getPayList'
]);

module.exports = {
    Actions: Actions,
    Store: Reflux.createStore({
        listenables: [Actions],
        data: {
            userList: [],
            chargeList: [],
            payList: []
        },

        onGetUserList(cb) {
            var t = this;
            request('/api/userlist')
            .then((data)=>{
                t.data.userList = data.data;
                t.updateComponent()
                cb&&cb(data.data)
            })
        },

        onAddGold(params,cb){
            var t = this;
            request('/api/charge',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(params)
            })
            .then((data)=>{
                cb&&cb(data)
            })
        },

        onGetRechargeList(cb){
            var t = this;
            request('/api/charge/list')
            .then((data)=>{
                t.data.chargeList = data.data;
                t.updateComponent()
                cb&&cb(data.data)
            })
        },

        onGetPayList(cb){
            var t = this;
            request('/api/pay/list')
            .then((data)=>{
                t.data.payList = data.data;
                t.updateComponent()
                cb&&cb(data.data)
            })
        },

        updateComponent: function() {
            this.trigger(this.data);
        },

        getInitialState(){
            return this.data;
        }
    })
}