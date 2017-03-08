import request from '../utils/request';

const getMatchList = async function(){
    return request('/api/matchlist');
}

export { getMatchList}