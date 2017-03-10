import Reflux from 'reflux'
import request from '../utils/request'

const Actions = Reflux.createActions([
    "getTempList",
    'createSng',
    'createTable',
    'deleteTable'
]);

module.exports = {
    Actions: Actions,
    Store: Reflux.createStore({
        listenables: [Actions],
        data: {
            templates: [],
        },

        onGetTempList(cb){
            var t = this;
            request('/api/templates')
            .then((data)=>{
                t.data.templates = data.data;
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

        onDeleteTable(id,cb){
            // 
            var t = this;
            request('/api/table/delete',{ 
                method: 'POST',
                body: {
                    id: id 
                },
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