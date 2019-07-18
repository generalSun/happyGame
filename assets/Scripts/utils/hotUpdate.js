var Constants = require('../config/Constants')
var TAG = 'hotUpdata.js'
cc.Class({
    initHotUpdate(manifestUrl,verifycallback,updateCallBack){
        var self = this
        self.m_manifestUrl = manifestUrl
        self.m_updateCallBack = updateCallBack

        self._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-assets');
        self._am = new jsb.AssetsManager('', self._storagePath, self.versionCompareHandle.bind(self));
        self._am.setVerifyCallback(function (filePath, asset) {
            if(verifycallback){
                verifycallback(filePath,asset)
            }
            return true;
        });
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            self._am.setMaxConcurrentTask(2);
        }
    },

    updateCallBack(code,data) {
        var self = this
        console.log(TAG,'updataCallBack',code)
        switch (code) {
            case Constants.UPDATE_CODE.OK:
                self.closeUpdateCallBack()
                break;
            case Constants.UPDATE_CODE.HOT_UPDATE_ERR:
                self.closeUpdateCallBack()
                break;
            case Constants.UPDATE_CODE.LOCAL_MANIFEST_LOAD_ERR:
                self.closeUpdateCallBack()
                break;
            case Constants.UPDATE_CODE.UPDATE_FINISHED:
                self.closeUpdateCallBack()
                self.gameRestart()
                break;
        }
        if(self.m_updateCallBack){
            self.m_updateCallBack(code,data)
        }
    },

    versionCompareHandle(versionA, versionB){
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    },

    checkUpdata() {
        var self = this
        if (self._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var url = self.m_manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            self._am.loadLocalManifest(url);
        }
        if (!self._am.getLocalManifest() || !self._am.getLocalManifest().isLoaded()) {
            if(self.updateCallBack){
                self.updateCallBack(Constants.UPDATE_CODE.LOCAL_MANIFEST_LOAD_ERR)
            }
            return
        }
        self._am.setEventCallback(self.checkCb.bind(self));
        self._am.checkUpdate();
    },

    checkCb(event) {
        var self = this
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST://"No local manifest file found, hot update skipped."
                if(self.updateCallBack){
                    self.updateCallBack(Constants.UPDATE_CODE.CHECK_UPDATE_ERR)
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST://"Fail to download manifest file, hot update skipped."
                if(self.updateCallBack){
                    self.updateCallBack(Constants.UPDATE_CODE.CHECK_UPDATE_ERR)
                }
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE://"Already up to date with the latest remote version."
                if(self.updateCallBack){
                    self.updateCallBack(Constants.UPDATE_CODE.OK)
                }
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND://'New version found, start try to update.'
                if(self.updateCallBack){
                    self.updateCallBack(Constants.UPDATE_CODE.NEW_VERSION_FOUND)
                }
                break;
            default:
                return;
        }
        self._am.setEventCallback(null);
    },

    hotUpdate() {
        var self = this
        if (self._am) {
            self._am.setEventCallback(self.updateCb.bind(self));
            if (self._am.getState() === jsb.AssetsManager.State.UNINITED) {
                var url = self.m_manifestUrl.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                self._am.loadLocalManifest(url);
            }
            self._am.update();
        }
    },

    updateCb(event) {
        var self = this
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST://'No local manifest file found, hot update skipped.'
                if(self.updateCallBack){
                    self.updateCallBack(Constants.UPDATE_CODE.LOCAL_MANIFEST_LOAD_ERR)
                }
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                if(self.updateCallBack){
                    self.updateCallBack(Constants.UPDATE_CODE.UPDATEING_ASSETS,event)
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST://'Fail to download manifest file, hot update skipped.'
                if(self.updateCallBack){
                    self.updateCallBack(Constants.UPDATE_CODE.HOT_UPDATE_ERR)
                }
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE://'Already up to date with the latest remote version.'
                if(self.updateCallBack){
                    self.updateCallBack(Constants.UPDATE_CODE.OK)
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED://Update finished. + event.getMessage()
                if(self.updateCallBack){
                    self.updateCallBack(Constants.UPDATE_CODE.UPDATE_FINISHED)
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED://'Update failed. ' + event.getMessage()
                if(self.updateCallBack){
                    self.updateCallBack(Constants.UPDATE_CODE.UPDATE_FAILED)
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING://'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage()
                if(self.updateCallBack){
                    self.updateCallBack(Constants.UPDATE_CODE.ASSET_UPDATE_ERR)
                }
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                if(self.updateCallBack){
                    self.updateCallBack(Constants.UPDATE_CODE.DECOMPRESS_ERR)
                }
                break;
            default:
                break;
        }
    },

    closeUpdateCallBack(){
        var self = this
        self._am.setEventCallback(null);
    },

    gameRestart:function(){
        var self = this
        var searchPaths = jsb.fileUtils.getSearchPaths();
        var newPaths = self._am.getLocalManifest().getSearchPaths();
        Array.prototype.unshift.apply(searchPaths, newPaths);
        G.ioUtil.set(Constants.LOCALLSTORAGEKEY.HOTUPDATESEARCHPATHS,JSON.stringify(searchPaths))
        jsb.fileUtils.setSearchPaths(searchPaths);
        cc.audioEngine.stopAll();
        cc.game.restart();
    },

    getLocalVersion:function(){
        var self = this
        var manifest = self._am.getLocalManifest();
        return manifest.getVersion();
    },

    onDestroy() {
        var self = this
        self.closeUpdateCallBack()
    }
});
