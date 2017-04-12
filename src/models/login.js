import Reflux from 'reflux'
import request from '../utils/request'

const Actions = Reflux.createActions([
    "login",
    "logOut"
]);

module.exports = {
    Actions: Actions,
    Store: Reflux.createStore({
        listenables: [Actions],
        data: {
            
        },

        onLogin(params,cb){
            request('/api/user/login',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(params)
            })
            .then((data)=> {
                cb&&cb(data)
            })
        },

        onLogOut(){
            request('/api/user/logout')
        },

        updateComponent() {
            this.trigger(this.data);
        },

        getInitialState(){
            return this.data;
        }
    })
}