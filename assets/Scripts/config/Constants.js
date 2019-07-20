const LOCALLSTORAGEKEY = {//本地存储
    HOTUPDATESEARCHPATHS:'HotUpdateSearchPaths',
    USERINFO:'userInfo',
    GAMECONFIG:'gameConfig',
    AUDIO:'audio',
    CARDTYPE:'cardType'
}

const UPDATE_CODE = {//热更 
    OK:'更新好了',
    CHECK_UPDATE_ERR: '检测更新出错',
    HOT_UPDATE_ERR: '更新出错',
    DECOMPRESS_ERR: '解压出错',
    ASSET_UPDATE_ERR: '资源更新出错',
    LOCAL_MANIFEST_LOAD_ERR: '本地manifest加载失败',
    UPDATEING_ASSETS: '更新资源中',
    UPDATE_FINISHED: '更新完成',
    NEW_VERSION_FOUND:'发现新版本',
    UPDATE_FAILED:'更新失败'
}

const THIRTINFO = {//第三方信息
    WX:{
        appkey: "wxafc956f84f22788f",
        appsecret: "10677f489ec36a99b7f4f1e0bf301c5e",
    }
}

const CARD_STATUS = {//扑克状态
	STATUS_NORMAL:1,
	STATUS_NORMAL_SELECT:2,
	STATUS_POP:3,
	STATUS_POP_SELECT:4,
	STATUS_DRAWING:5,
}

const FRAMEEVENT = {//帧事件名 target 0为发送给自己的节点   1为发送给别人的
    POKERFLIP:'POKERFILP',
    POKERFLIPEND:'POKERFILPEND',
}

const LOCALEVENT = {//本地事件名
    CONNECT_SUCCES:'connect_Succes',
    SHOW_CREATE_ROOM_VIEW:'showCreateRoomView',
    POKER_FILP_END:'pokerFilpEnd',
}

const HTTP_NET_EVENT = {//http网络事件名
	GUEST_LOGIN:'/api/guest',
}

const SOCKET_EVENT_c2s = {//socket网络事件名
    HEARTBEAT:              'ping',
    GAME_STATUS:            'gamestatus',
    SEARCH_ROOM:            'searchroom',
    JOIN_ROOM:              'joinroom',
    START_GAME:             'start',
    DO_CATCH:               'docatch',//叫地主
    GIVE_UP:                'giveup',//不叫
    DOPLAY_CARDS:           'doplaycards',//出牌
    NO_CARDS:               'nocards',//不出
    RECOVERY:               'recovery',//重连
}

const SOCKET_EVENT_s2c = {//socket网络事件名
    HEARTBEAT:              'pong',
    GAME_STATUS:            'gamestatus',
    SEARCH_ROOM:            'searchroom',
    JOIN_ROOM:              'joinroom',
    PLAYER_JOIN:            'players',
    ROOM_READY:             'roomready',//房间准备好了
    PLAYER_READY:           'playeready',//玩家点击了开始游戏
    BANKER:                 'banker',
    PLAYING_GAME:           'play',
    CATCH_SIGN:             'catch',
    CATCHRESULT:            'catchresult',
    LAST_HANDS:             'lasthands',
    CATCH_FAIL:             'catchfail',//流局了
    TAKE_CARDS:             'takecards',
    RECOVERY:               'recovery',//重连
    ALLCARDS:               'allcards',
}

module.exports = {
    LOCALLSTORAGEKEY:LOCALLSTORAGEKEY,
    THIRTINFO:THIRTINFO,
    CARD_STATUS:CARD_STATUS,
    FRAMEEVENT:FRAMEEVENT,
    LOCALEVENT:LOCALEVENT,
    HTTP_NET_EVENT:HTTP_NET_EVENT,
    SOCKET_EVENT_c2s:SOCKET_EVENT_c2s,
    SOCKET_EVENT_s2c:SOCKET_EVENT_s2c,
    UPDATE_CODE:UPDATE_CODE
};