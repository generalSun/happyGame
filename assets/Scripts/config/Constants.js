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
    POKERFLIP:{name:'POKERFILP',target:0},
    POKERFLIPEND:{name:'POKERFILPEND',target:1},
}

const NET_EVENT = {//http网络事件名
	GET_SERVERINFO:'/get_serverinfo',
	GUEST_LOGIN:'/guest',
    HALLLOGIN:'/login',//大厅登陆
    REGISTER:'/register',
    LOGIN:'/auth',//登陆
    CREATE_USER:'/create_user',
    BASE_INFO:'/base_info',
    CREATE_PRIVATE_ROOM:'create_private_room',
}

module.exports = {
    LOCALLSTORAGEKEY:LOCALLSTORAGEKEY,
    THIRTINFO:THIRTINFO,
    CARD_STATUS:CARD_STATUS,
    FRAMEEVENT:FRAMEEVENT,
    NET_EVENT:NET_EVENT
};