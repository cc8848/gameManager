module.exports = function(code,msg,data){
    return {
        code: code || -1,
        message: msg,
        data: data
    }
}
