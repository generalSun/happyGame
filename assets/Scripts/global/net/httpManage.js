var Constants = require('./../../config/Constants')
/**
 * Http 请求封装
 */
var httpManage ={
    HTTPROOTURL:"http://127.0.0.1:9000",
    accountServerUrl:"http://127.0.0.1:9000",
    sendRequest:function (path, data, successHandler, errorHandler, extraUrl,desc) {
        G.globalLoading.setLoadingVisible(true,desc)
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        data = data || {}
        var userInfo = G.ioUtil.get(Constants.LOCALLSTORAGEKEY.USERINFO)
        if(userInfo && userInfo.token){
            data.token = userInfo.token
        }
        if (extraUrl == null) {
            extraUrl = httpManage.HTTPROOTURL
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
        
        var success = function(event){
            G.globalLoading.setLoadingVisible(false)
            if(successHandler){
                successHandler(event)
            }
        }

        var error = function(msg){
            G.globalLoading.setLoadingVisible(false)
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
            console.log("onreadystatechange");
            if (xhr.readyState === 4){
                if (xhr.status >= 200 && xhr.status < 300) {
                    var respText = xhr.responseText;
                    try {
                        var ret = JSON.parse(respText);
                        cc.log("request from [" + xhr.responseURL + "] data [", ret, "]");
                        success(ret);
                    } catch (e) {
                        console.log("err:" + e);
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

    get:function(opt, successHandler, errorHandler,desc){
        var success = function(event){
            G.globalLoading.setLoadingVisible(false)
            if(successHandler){
                successHandler(event)
            }
        }

        var error = function(msg){
            G.globalLoading.setLoadingVisible(false)
            xhr.abort();
            if(errorHandler){
                errorHandler({
                    errcode: -10001,
                    errmsg: msg
                })
            }
        }
        G.globalLoading.setLoadingVisible(true,desc)
        var url = opt.url;
        delete opt["url"];
        url += "?";
        for (var key in opt){
            var val = opt[key];
            url += key + "=" + val + "&";
        }    
        console.log(TAG, "http get 请求： ", url);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            //console.log(TAG, "!!!!!  onreadystatechange", xhr.responseText, xhr.timeout);
            if (xhr.readyState == 4 && (xhr.status >=200 && xhr.status < 400)){
                var respText = xhr.responseText;
                try {
                    var ret = JSON.parse(respText);
                    cc.log("request from [" + xhr.responseURL + "] data [", ret, "]");
                    success(ret);
                } catch (e) {
                    console.log("err:" + e);
                    error(e);
                }
            } 
        }
        xhr.open("GET", url, true);
        //xhr.timeout = 3000;
        xhr.send();
        xhr.ontimeout = function(){
            console.log(TAG, "@@@@@@ ontimeout");
            error('连接超时！')
        }
        xhr.onerror = function(){
            console.log(TAG, "###### xhr error");
            error('连接出错！')
        }
    },

    post:function(opt, successHandler, errorHandler,desc){
        var success = function(event){
            G.globalLoading.setLoadingVisible(false)
            if(successHandler){
                successHandler(event)
            }
        }

        var error = function(msg){
            G.globalLoading.setLoadingVisible(false)
            xhr.abort();
            if(errorHandler){
                errorHandler({
                    errcode: -10001,
                    errmsg: msg
                })
            }
        }
        G.globalLoading.setLoadingVisible(true,desc)

        var url = opt.url;
        delete opt["url"];
        var param = "";
        for (var key in opt){
            param += key + "=" + opt[key] + "&";
        }    
        console.log(TAG, "http post 请求： ", url);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            //console.log(TAG, "!!!!!  onreadystatechange", xhr.responseText, xhr.timeout);
            if (xhr.readyState == 4 && (xhr.status >=200 && xhr.status < 400)){
                var respText = xhr.responseText;
                try {
                    var ret = JSON.parse(respText);
                    cc.log("request from [" + xhr.responseURL + "] data [", ret, "]");
                    success(ret);
                } catch (e) {
                    console.log("err:" + e);
                    error(e);
                }
            } 
        }
        xhr.open("POST", url, true);
        //xhr.timeout = 3000;
        xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  
        xhr.send(param);
        xhr.ontimeout = function(){
            console.log(TAG, "@@@@@@ ontimeout");
            error('连接超时！')
        }
        xhr.onerror = function(){
            console.log(TAG, "###### xhr error");
            error('连接出错！')
        }
    }
}

module.exports = httpManage