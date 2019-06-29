cc.Button.prototype._onTouchEnded = function (t) {
　　G.audioManager.playSFX('btnClick.mp3')
　　if (this.interactable && this.enabledInHierarchy) {
　　　　if (this._pressed) {
　　　　　　cc.Component.EventHandler.emitEvents(this.clickEvents, t);
　　　　　　this.node.emit("click", this);
　　　　}
　　　　this._pressed = !1;
　　　　this._updateState();
　　　　t.stopPropagation();
　　}
};


var UiFactory = module.exports = {};

//创建sprite
UiFactory.createSprite = function (imgPath) {
    var node = new cc.Node();
    node.setAnchorPoint(cc.v2(0.5, 0.5));

    var sprite = node.addComponent(cc.Sprite);
    cc.loader.loadRes(imgPath, cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
            cc.log(err.message || err);
            return;
        }
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
    });

    return sprite;
};

//创建合图sprite
UiFactory.createAtlasSprite = function (atlasPath, spriteName) {
    var node = new cc.Node();
    node.setAnchorPoint(cc.v2(0.5, 0.5));

    var sprite = node.addComponent(cc.Sprite);
    cc.loader.loadRes(atlasPath, cc.SpriteAtlas, function (err, atlas) {
        if (err) {
            cc.log(err.message || err);
            return;
        }
        var frame = atlas.getSpriteFrame(spriteName);
        sprite.spriteFrame = frame;
        var rect = frame.getRect();
        node.setContentSize(rect.width, rect.height);
    });

    return sprite;
};

//创建label
UiFactory.createLabel = function (str, fontSize) {
    str = str || "";
    fontSize = fontSize || 20;

    var node = new cc.Node();
    var lb = node.addComponent(cc.Label);
    lb.fontSize = fontSize;
    lb.string = str;

    return lb;
};

//创建按钮
UiFactory.createButton = function (spriteFrame) {
    var node = new cc.Node();
    var btn = node.addComponent(cc.Button);

    return btn;
}