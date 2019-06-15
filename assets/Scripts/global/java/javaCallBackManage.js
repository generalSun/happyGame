var javaCallBackManage = class{
    constructor(handler){
        this.handler = handler;
    }

    setHandler(handler){
        this.handler = handler;
    }

    wxLoginSuccessCallBack(resp){
        console.log('微信登陆成功返回数据:'+JSON.parse(resp))
        if(this.handler.wxLoginSuccessCallBack){
            this.handler.wxLoginSuccessCallBack(resp)
        }
    }

    wxLoginFailCallBack(resp){
        console.log('微信登陆失败返回数据:'+JSON.parse(resp))
        if(this.handler.wxLoginFailCallBack){
            this.handler.wxLoginFailCallBack(resp)
        }
    }

    wxLoginGetTokenCallBack(code){
    //     private void getAccessToken(String code) {
    //         //获取授权
    //         String http = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + Config.APP_ID +
    //                 "&secret=" + Config.APP_SERECET +
    //                 "&code=" + code +
    //                 "&grant_type=authorization_code";
    //         OkHttpUtils.ResultCallback<String> resultCallback = new OkHttpUtils.ResultCallback<String>() {
    //             @Override
    //             public void onSuccess(String response) {
    //                 String access = null;
    //                 String openId = null;
    //                 try {
    //                     JSONObject jsonObject = new JSONObject(response);
    //                     access = jsonObject.getString("access_token");
    //                     openId = jsonObject.getString("openid");
    //                 } catch (JSONException e) {
    //                     e.printStackTrace();
    //                 }
    //                 //获取个人信息
    //                 String getUserInfo = "https://api.weixin.qq.com/sns/userinfo?access_token=" + access + "&openid=" + openId + "";
    //                 OkHttpUtils.ResultCallback<WeChatInfo> resultCallback = new OkHttpUtils.ResultCallback<WeChatInfo>() {
    //                     @Override
    //                     public void onSuccess(final WeChatInfo response) {
    //                         response.setErrCode(resp.errCode);
    //                         Log.i("TAG获取个人信息", new Gson().toJson(response));
    //                         Cocos2dxHelper.runOnGLThread(new Runnable() {
    //                             @Override
    //                             public void run() {
    //                                 Cocos2dxJavascriptJavaBridge.evalString("window.G.javaCallBackManage.wxLoginSuccessCallBack('"+ new Gson().toJson(response) +"')");
    //                             }
    //                         });
    // //                        Toast.makeText(WXEntryActivity.this, new Gson().toJson(response), Toast.LENGTH_LONG).show();
    //                         finish();
    //                     }
    
    //                     @Override
    //                     public void onFailure(Exception e) {
    //                         Toast.makeText(WXEntryActivity.this, "登录失败", Toast.LENGTH_SHORT).show();
    //                         Cocos2dxHelper.runOnGLThread(new Runnable() {
    //                             @Override
    //                             public void run() {
    //                                 Cocos2dxJavascriptJavaBridge.evalString("window.G.javaCallBackManage.wxLoginFailCallBack('"+ "登录失败" +"')");
    //                             }
    //                         });
    //                     }
    //                 };
    //                 OkHttpUtils.get(getUserInfo, resultCallback);
    //             }
    
    //             @Override
    //             public void onFailure(Exception e) {
    //                 Toast.makeText(WXEntryActivity.this, "登录失败", Toast.LENGTH_SHORT).show();
    //                 Cocos2dxHelper.runOnGLThread(new Runnable() {
    //                     @Override
    //                     public void run() {
    //                         Cocos2dxJavascriptJavaBridge.evalString("window.G.javaCallBackManage.wxLoginFailCallBack('"+ "登录失败" +"')");
    //                     }
    //                 });
    //             }
    //         };
    //         OkHttpUtils.get(http, resultCallback);
    //     }
    }
}

module.exports = javaCallBackManage