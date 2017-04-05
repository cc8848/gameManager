import {message} from 'antd';
var fetch = require('fetch-polyfill2')
function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  // const hide = message.loading('加载中...', 0)
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    // .then(data => ({ data }))
    .then((data)=>{
      // hide()
      return data;
    })
    .catch(err => ({ err }));
}
