import Reflux from 'reflux'
import request from '../utils/request'

const Actions = Reflux.createActions([
    "getMatchList",
    "hideSng",
    "showSng",
    'deleteTable',
]);

module.exports = {
    Actions: Actions,
    Store: Reflux.createStore({
        listenables: [Actions],
        data: {
            matchList: [],
            sngVisible: false,
        },

        onGetMatchList(page,pageSize,cb){
            var t = this;
            request(`/api/matchlist?pageIndex=${page}&pageSize=${pageSize}`)
            .then(function(data){
                t.data.matchList = {
                    total: 0,
                    data: []
                }
                var _mlist = data.data.data;
                _mlist.map((item,index)=>{
                    item.key = index + 1;
                    t.data.matchList.data.push(item);
                })
                t.data.matchList.total = data.data.total;
                t.updateComponent()
                cb&&cb(_mlist)
            })
        },

        onDeleteTable(id,cb){
            request('/api/table/delete',{ 
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({id: id})
            })
            .then((data)=>{
                cb&&cb(data)
            })
        },

        onHideSng(cb){
            this.data.sngVisible = false;
            this.updateComponent()
            cb&&cb(this.data)
        },

        onShowSng(cb){
            this.data.sngVisible = true;
            this.updateComponent()
            cb&&cb(this.data)
        },

        updateComponent() {
            this.trigger(this.data);
        },

        getInitialState(){
            return this.data;
        }
    })
}