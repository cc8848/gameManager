module.exports = function(data,isObj){
    if (data.data) {
        return data.data
    }
    console.log(data)
    return isObj ?  {} : [];
}
