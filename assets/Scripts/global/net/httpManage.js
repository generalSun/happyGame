
/**
 * Http 请求封装
 */
const httpManage ={
    httpGet: function (url , success , error) {
        G.globalLoading.setLoadingVisible(true)
        var errorFun = function(){
            G.globalLoading.setLoadingVisible(false)
            if(error){
                error()
            }
        }

        var successFun = function(respone){
            G.globalLoading.setLoadingVisible(false)
            if(success){
                success(respone)
            }
        }
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status >= 200 && xhr.status < 300){
                    var respone = JSON.parse(xhr.responseText);
                    successFun(respone);
                }else{
                    errorFun()
                }
            }
        };
        xhr.open("GET", url, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        //超时回调
        xhr.ontimeout = function(event){
            errorFun();
        };
        xhr.onerror = function(event){
            errorFun();
        };
        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 3000;// 3 seconds for timeout

        xhr.send();
    },

    encodeFormData : function(data){  
        var pairs = [];  
        var regexp = /%20/g;  
      
        for (var name in data){  
            var value = data[name].toString();  
            var pair = encodeURIComponent(name).replace(regexp, "+") + "=" +  
                encodeURIComponent(value).replace(regexp, "+");  
            pairs.push(pair);  
        }  
        return pairs.join("&");  
    },

    httpPost: function (url, params, success , error) {
        var xhr = cc.loader.getXMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status >= 200 && xhr.status < 300){
                    var respone = xhr.responseText;
                    if(success){
                        success(respone);
                    }
                }else{
                    if(error){
                        error();
                    }
                }
            }
        };
        xhr.open("POST", url, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 5000;// 5 seconds for timeout
        
        xhr.send( httpManage.encodeFormData(params));
    }
}

module.exports = httpManage