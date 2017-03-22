import Reflux from 'reflux'
import request from '../utils/request'

const Actions = Reflux.createActions([
    "getUserList",
]);

module.exports = {
    Actions: Actions,
    Store: Reflux.createStore({
        listenables: [Actions],
        data: {
            userList: []
        },

        onGetUserList(cb) {
            var t = this;
            request('/api/userlist')
            .then((data)=>{
                t.data.userList = data.data;
                t.updateComponent()
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