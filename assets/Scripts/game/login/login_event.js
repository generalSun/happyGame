cc.Class({
    extends: cc.Component,

    properties: {
        setNodePerfab:cc.Prefab
    },

    onLoad () {
        var self = this
        self.m_isAgress = true
        self.m_socketProcess = self.node.getComponent('login_socketProcess')
    },

    //检查是否同意用户使用协议
    check(event, customEventData){
        var self = this
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        self.m_isAgress = false
        if(event.isChecked){
            self.m_isAgress = true
        }
    },

    //设置按钮
    set(event, customEventData){
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        var self = this;
        var setNode = self.node.getChildByName('setNode')
        if(!setNode){
            setNode = cc.instantiate(self.setNodePerfab);
            self.node.addChild(setNode);
        }
        setNode.active = true;
    },

    //游客登陆
    guestLogin (event, customEventData) {
        var self = this
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(!self.m_isAgress){
            G.alterMgr.showMsgBox({content:'请先同意用户使用协议！'})
            return;
        }
        self.m_socketProcess.guestLogin()
    },

    //第三方登陆
    thirtyLogin (event, customEventData) {
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        cc.log("node=", node.name, " event=", event.type, " data=", customEventData);
        if(!this.m_isAgress){
            G.alterMgr.showMsgBox({content:'请先同意用户使用协议！'})
            return;
        }
        G.javaManage.WxLogin()
    },
});
