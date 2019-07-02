cc.Class({
    extends: cc.Component,

    properties: {
        view:cc.Node,
        content:cc.Node
    },

    init(infos,socketProcess){
        var self = this
        infos = infos || []
        self.m_items.splice(0,self.m_items.length)
        self.content.removeAllChildren()

        var ps = new Array()
        for(var i = 0; i < infos.length; i++){
            var info = infos[i]
            var describle = info.describle
            if(describle){
                var str = 'prefabs/gameList/'+describle
                var p = G.tools.loadResPromise(str, cc.Prefab,info)
                ps.push(p)
            }
        }
        Promise.all(ps).then(function(args){
            for(var i = 0; i < args.length; i++){
                var arg = args[i]
                var prefab = arg.resource
                var value = arg.parameter
                var item = cc.instantiate(prefab);
                self.content.addChild(item);
                self.m_items.push(item);
                var scriptName = value.describle + '_page'
                item.getComponent(scriptName).init(value,socketProcess)
            }
        })
        .catch(function(err){
            cc.log(err.message || err);
        })
    },

    onLoad () {
        var self = this
        self.m_items = new Array();
        self.enabled = false

        self.node.off(cc.Node.EventType.TOUCH_START, self._onTouchBegan, self, true);

        self.node.off(cc.Node.EventType.TOUCH_MOVE, self._onTouchMoved, self, true);

        self.node.off(cc.Node.EventType.TOUCH_END, self._onTouchEnded, self, true);

        self.node.off(cc.Node.EventType.TOUCH_CANCEL, self._onTouchCancelled, self, true);
    },
});
