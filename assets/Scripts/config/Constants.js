const LOCALLSTORAGEKEY = {//本地存储
    HOTUPDATESEARCHPATHS:'HotUpdateSearchPaths',
    USERINFO:'userInfo',
    GAMECONFIG:'gameConfig',
    AUDIO:'audio',
    CARDTYPE:'cardType'
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

const HTTP_NET_EVENT = {//http网络事件名
	GET_SERVERINFO:'/get_serverinfo',
	GUEST_LOGIN:'/guest',
    HALLLOGIN:'/login',//大厅登陆
    REGISTER:'/register',
    LOGIN:'/auth',//登陆
    CREATE_USER:'/create_user',
    BASE_INFO:'/base_info',
    GET_GAMELIST:'/get_gameList',
    CREATE_PRIVATE_ROOM:'/create_private_room',
    ENTER_PRIVATE_ROOM:'/enter_private_room',
    GET_GAMEDESTORY:'/get_gameDestory',
}

const SOCKET_EVENT_c2s = {//socket网络事件名
    LOGIN:'login',
}

const SOCKET_EVENT_s2c = {//socket网络事件名
    RECONNECTING:           'reconnecting',
    RECONNECT:              'reconnect',
    // CONNECT_ERROR:          'connect_error',
    // CONNECT_TIMEOUT:        'connect_timeout',
    // RECONNECT_ATTEMPT:      'reconnect_attempt',
    // RECONNECT_ERROR:        'reconnect_error',
    // RECONNECT_FAILED:       'reconnect_failed',
    LOGIN_RESULT:           'login_result',
    LOGIN_FINISHED:         'login_finished',
    GAME_BEGIN_PUSH:        'game_begin_push',//游戏开始
    GAME_SYNC_PUSH:         'game_sync_push',//玩家重连
    NEW_USER_COMES_PUSH:    'new_user_comes_push',//新玩家进入
    USER_STATE_PUSH:        'user_state_push',
}

module.exports = {
    LOCALLSTORAGEKEY:LOCALLSTORAGEKEY,
    THIRTINFO:THIRTINFO,
    CARD_STATUS:CARD_STATUS,
    FRAMEEVENT:FRAMEEVENT,
    HTTP_NET_EVENT:HTTP_NET_EVENT,
    SOCKET_EVENT_c2s:SOCKET_EVENT_c2s,
    SOCKET_EVENT_s2c:SOCKET_EVENT_s2c,
};