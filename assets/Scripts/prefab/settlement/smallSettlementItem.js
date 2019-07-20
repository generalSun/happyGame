var TAG = 'smallSettlementItem.js'
cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Sprite,
        bankruptcy:cc.Sprite,
        chair:cc.Sprite,
        chairRes:[cc.SpriteFrame],
        nickName:cc.Label,
        textDescrible:cc.Label,
        picDescrible:cc.Node,
        single:cc.Sprite,
        jiabei:cc.Sprite,
        score:cc.Label,
        ratio:cc.Label,
        showNode:cc.Node
    },

    init(pokerAtlas,pokerPrefab,logic){
        var self = this
        self.m_cardsPool = new cc.NodePool()
        self.m_cards = new Array()
        self.m_pokerAtlas = pokerAtlas
        self.m_pokerPrefab = pokerPrefab
        self.m_logic = logic
        self.textDescrible.node.active = false
        self.picDescrible.active = false
        if(logic.gameType == 'poker'){  
            self.picDescrible.active = true
        }else{
            self.textDescrible.node.active = true
        }
    },

    show(info){
        console.log(TAG,'show',info)
        var self = this
        if(!info || info.length <= 0){
            self.hide()
        }
        
        var balance = info.balance
        var cards = info.cards
        var gameover = info.gameover
        var ratio = info.ratio
        var score = info.score
        var userid = info.userid
        var username = info.username
        var chair = info.chair
        var jiabei = info.jiabei
        var single = info.single
        self.node.active = true
        self.nickName.getComponent(cc.Label).string = username
        if(self.picDescrible.active){
            self.score.getComponent(cc.Label).string = score
            self.ratio.getComponent(cc.Label).string = ratio
            self.jiabei.node.active = jiabei
            self.single.node.active = single
        }else{
            self.textDescrible.getComponent(cc.Label).string = '得分：'+score+'     倍率：'+ratio
        }
        self.bankruptcy.node.active = (balance <= 0)
        
        var space = 25
        for(var i = 0; i < cards.length; i++){
            var value = cards[i]
            if(self.m_cardsPool.size() <= 0){
                var card = cc.instantiate(self.m_pokerPrefab);
                self.m_cardsPool.put(card); 
            }
            var node = self.m_cardsPool.get();
            node.active = true;
            self.showNode.addChild(node);
            self.m_cards.push(node)
            var cardScript = node.getComponent('poker')
            
            cardScript.setPokerScale(1)
            cardScript.setLogic(self.m_logic)
            cardScript.setAtlas(self.m_pokerAtlas)
            cardScript.setPokerType(2)
            cardScript.setCard(value)
            cardScript.setPokerCurrentPosition(i*space)
        }
    },

    hide(){
        var self = this
        for(var i = 0; i < self.m_cards.length; i++){
            var item = self.m_cards[i]
            self.m_cardsPool.put(item)
        }
        self.showNode.removeAllChildren()
        self.node.active = false
        self.m_cards.splice(0,self.m_cards.length)
    },

    clear(){
        var self = this
        self.m_cardsPool.clear();
        self.m_cards.splice(0,self.m_cards.length)
        if(cc.isValid(self.showNode)){
            self.showNode.removeAllChildren()
        }
    },

    onDestroy(){
        var self = this
        self.clear()
    }
});
