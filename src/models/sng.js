import Reflux from 'reflux'
import request from '../utils/request'

const Actions = Reflux.createActions([
    "getTempList",
    'createSng',
    'createTable',
    'createPrize',
    'getPrizeList',
    'deletePrize',
    'deleteTable',
    'getTempInfo',
    'editSng',
]);

module.exports = {
    Actions: Actions,
    Store: Reflux.createStore({
        listenables: [Actions],
        data: {
            templates: [],
            prizeList: [],
            tempObj: {},
        },

        onGetTempList(cb){
            var t = this;
            request('/api/templates')
            .then((data)=>{
                t.data.templates = data.data.reverse();
                t.updateComponent()
                cb&&cb(t.data.templates)
            })
        },

        onCreateSng(params,cb){
            var t = this;
            request('/api/sng/create',{ 
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

        onEditSng(params,cb){
            var t = this;
            request('/api/table/edit',{ 
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

        onGetTempInfo(id,cb){
            var t = this;
            request('/api/table/info?data='+JSON.stringify({
                        tableId: Number(id)
            }))
            .then((data)=>{
                t.data.tempObj = data.data;
                t.data.tempObj.signUpFee = t.data.tempObj.signUpFee / 10000;
                t.data.tempObj.serviceFee = t.data.tempObj.serviceFee / 10000;
                t.data.tempObj.rewards.map((item,i)=>{
                    t.data.tempObj.rewards[i].chip = t.data.tempObj.rewards[i].chip/10000;
                })
                t.updateComponent()
                cb&&cb(data.data)
            })
        },

        onCreatePrize(params,cb){
            var t = this;
            request('/api/prize/create',{ 
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

        onDeleteTable(params,cb) {
            var t = this;
            request('/api/sng/delete',{ 
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

        onGetPrizeList(cb){
            var t = this;
            request('/api/prize/list')
            .then((data)=>{
                t.data.prizeList = data.data;
            })
            .then(()=>{
                request('/api/coupon/list')
                .then((data)=>{
                    data.data.map(function(item){
                        t.data.prizeList.push(item);
                    })
                    t.updateComponent()
                    cb&&cb(t.data.prizeList)
                })
            }
            )
        },

        onDeletePrize(params,cb){
            var t = this;
            request('/api/prize/delete',{ 
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

        onCreateTable(params,cb){
            var t = this;
            request('/api/table/create',{ 
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

        updateComponent: function() {
            this.trigger(this.data);
        },

        getInitialState(){
            return this.data;
        }
    })
}