var TAG = 'totalSettlementItem.js'
cc.Class({
    extends: cc.Component,

    properties: {
        isWin:cc.Sprite,
        nickName:cc.Label,
        chairPos:cc.Sprite,
        head:cc.Sprite,
        ID:cc.Label,
        master:cc.Sprite,
        bankruptcy:cc.Sprite,
        totalScore:cc.Label,
        scrollViewContent:cc.Node,
        item:cc.Prefab,
        chairRes:[cc.SpriteFrame]
    },

    init(){
        var self = this
        self.m_itemPool = new cc.NodePool()
        self.m_items = new Array()
    },

    show(info){
        console.log(TAG,'show',info)
        var self = this
        if(!info || info.length <= 0){
            self.hide()
            return
        }
        var balance = info.balance
        var gameover = info.gameover
        var score = info.score
        var userid = info.userid
        var username = info.username
        var chair = info.chair
        var gametype = info.gametype
        var win = info.win
        self.node.active = true
        self.nickName.getComponent(cc.Label).string = G.tools.interceptName(username,7)
        self.ID.getComponent(cc.Label).string = 'ID:' + userid
        self.totalScore.getComponent(cc.Label).string = (score>=0)?('+'+score):score
        self.bankruptcy.node.active = (balance <= 0)
        self.chairPos.getComponent(cc.Sprite).spriteFrame = self.chairRes[chair]
        self.isWin.node.active = win
    },

    hide(){
        var self = this
        for(var i = 0; i < self.m_items.length; i++){
            var item = self.m_items[i]
            self.m_itemPool.put(item)
        }
        self.scrollViewContent.removeAllChildren()
        self.node.active = false
        self.m_items.splice(0,self.m_items.length)
    },

    clear(){
        var self = this
        self.m_itemPool.clear();
        self.m_items.splice(0,self.m_items.length)
        if(cc.isValid(self.scrollViewContent)){
            self.scrollViewContent.removeAllChildren()
        }
    },

    onDestroy(){
        var self = this
        self.clear()
    }
});
