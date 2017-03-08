import Reflux from 'reflux'
import request from '../utils/request'

const Actions = Reflux.createActions([
    "getMatchList",
    "hideSng",
    "showSng",
]);

module.exports = {
    Actions: Actions,
    Store: Reflux.createStore({
        listenables: [Actions],
        data: {
            matchList: [],
            sngVisible: false,
        },

        onGetMatchList(cb){
            var t = this;
            request('/api/matchlist')
            .then(function(data){
                var _mlist = data.data;
                _mlist.map((item,index)=>{
                    item.key = index + 1;
                    t.data.matchList.push(item);
                })
                t.updateComponent()
                cb&&cb(_mlist)
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