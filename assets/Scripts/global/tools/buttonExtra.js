// cc.Button.prototype._onTouchEnded = function (t) {
// 　　G.audioManager.playSFX('btnClick.mp3')
// 　　if (this.interactable && this.enabledInHierarchy) {
// 　　　　if (this._pressed) {
// 　　　　　　cc.Component.EventHandler.emitEvents(this.clickEvents, t);
// 　　　　　　this.node.emit("click", this);
// 　　　　}
// 　　　　this._pressed = !1;
// 　　　　this._updateState();
// 　　　　t.stopPropagation();
// 　　}
// };

var _onTouchEnded = cc.Button.prototype._onTouchEnded ;
cc.Button.prototype._soundOn = true ;
cc.Button.prototype._soundResources = 'select.mp3' ;
cc.Button.prototype.setSoundEffect = function(on){
    this._soundOn = on ;
}
cc.Button.prototype.setSoundResources = function(res){
    this._soundResources = res ;
}
cc.Button.prototype._onTouchEnded = function(event){
    var self = this
    if(self.interactable && self.enabledInHierarchy && self._pressed && self._soundOn == true){
        /**
         * 播放声效
         */
        G.audioManager.playSFX(self._soundResources)
    }
    _onTouchEnded.call(self,event) ;
}