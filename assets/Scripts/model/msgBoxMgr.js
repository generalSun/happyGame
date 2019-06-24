cc.Class({
    extends: cc.Component,

    properties: {
        m_spTitle: cc.Label,
        m_lbContent: cc.Label,
        m_btnSure: cc.Button,
        m_btnCancel: cc.Button,
    },

    onLoad () {
        cc.game.addPersistRootNode(this.node)
        var self = this;

        self.node.on(cc.Node.EventType.TOUCH_START, function (event) {}, self);

        var sureClickHandler = G.tools.createClickEventHandler(self.node, "msgBoxMgr", "btnSureClickEvent")
        self.m_btnSure.clickEvents.push(sureClickHandler);

        var cancelClickHandler = G.tools.createClickEventHandler(self.node, "msgBoxMgr", "btnCancelClickEvent")
        self.m_btnCancel.clickEvents.push(cancelClickHandler);

        self.node.active = false;
    },

    //显示提示框
    /*
        @content: {String}显示的内容
        @clickEventCallBack: {Function} 确定按钮点击回调，默认为关闭弹窗
    */
    showMsgBox (param) {
        var self = this;

        var content = param.content || "";
        self.m_lbContent.string = content;

        self.sureClickEventCallBack = param.sureClickEventCallBack;
        self.cancelClickEventCallBack = param.cancelClickEventCallBack;
        if(self.sureClickEventCallBack && self.cancelClickEventCallBack){
            self.m_btnSure.node.x = -150
            self.m_btnCancel.node.x = 150
            self.m_btnSure.node.active = true
            self.m_btnCancel.node.active = true
        }else if(self.sureClickEventCallBack){
            self.m_btnSure.node.x = 0
            self.m_btnSure.node.active = true
            self.m_btnCancel.node.active = false
        }else if(self.cancelClickEventCallBack){
            self.m_btnCancel.node.x = 0
            self.m_btnSure.node.active = false
            self.m_btnCancel.node.active = true
        }else{
            self.m_btnSure.node.x = 0
            self.m_btnSure.node.active = true
            self.m_btnCancel.node.active = false
        }
        self.node.active = true;
    },

    //关闭提示框
    closeMsgBox () {
        this.node.active = false;
    },

    btnSureClickEvent () {
        var self = this;

        if (!!self.sureClickEventCallBack) {
            self.sureClickEventCallBack();
            self.sureClickEventCallBack = null;
        }
        self.closeMsgBox();
    },

    btnCancelClickEvent () {
        var self = this;

        if (!!self.cancelClickEventCallBack) {
            self.cancelClickEventCallBack();
            self.cancelClickEventCallBack = null;
        }
        self.closeMsgBox();
    },
});
