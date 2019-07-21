var Constants = require('./../../config/Constants')
/**
 * Http 请求封装
 */
var httpManage ={
    // accountServerUrl:"http://127.0.0.1:8080",
    accountServerUrl:"http://127.0.0.1",
    sendRequest:function (path, data, successHandler, errorHandler, extraUrl,desc) {
        G.globalLoading.setLoadingVisible(true,desc)
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        data = data || {}
        var userInfo = G.ioUtil.get(Constants.LOCALLSTORAGEKEY.USERINFO)
        data.authorization = ''
        if(userInfo && userInfo.token){
            data.authorization = userInfo.token
        }
        if (extraUrl == null) {
            extraUrl = httpManage.accountServerUrl
        }
        //解析请求路由以及格式化请求参数
        var sendpath = path;
        var sendtext = '?';
        for (var k in data) {
            if (sendtext != "?") {
                sendtext += "&";
            }
            sendtext += (k + "=" + data[k]);
        }
        //组装完整的URL
        var requestURL = extraUrl + sendpath + encodeURI(sendtext);
        //发送请求
        console.log("RequestURL:" + requestURL);
        xhr.open("GET", requestURL, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        }
        
        var success = function(event,responseURL){
            G.globalLoading.setLoadingVisible(false)
            cc.log("request from [" + responseURL + "] data [", event, "]");
            if(successHandler){
                successHandler(event)
            }
        }

        var error = function(msg){
            G.globalLoading.setLoadingVisible(false)
            cc.log("request 错误："+ msg);
            xhr.abort();
            if(errorHandler){
                errorHandler({
                    errcode: -10001,
                    errmsg: msg
                })
            }
        }
        //超时回调
        xhr.ontimeout = function(event){
            error('连接超时！')
        };
        xhr.onerror = function(event){
            error('连接出错！')
        };
    
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4){
                if (xhr.status >= 200 && xhr.status < 300) {
                    var respText = xhr.responseText;
                    try {
                        var ret = JSON.parse(respText);
                        success(ret,xhr.responseURL);
                    } catch (e) {
                        error(e);
                    }
                }
            }
        };
    
        try {
            xhr.send();
        }catch (e) {
            error(e);
        }
    },
}

module.exports = httpManage