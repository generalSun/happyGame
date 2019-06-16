window.G = {};

G.Code = {
	OK: 200, 
};

G.GameID = {
	GT_MJ: 1,
};

//msg分组(和后台配置保持一致)
G.MsgGroupName = {
	HALL: "HallGroup",
	[G.GameID.GT_MJ]: "MjGroup",
};

//场景名字表
G.SceneNameMap = {
	SNM_LOGIN: "LoginScene",
	SNM_HALL: "HallScene",
};

//房间场景名字配置
G.RoomSceneName = {
	[G.GameID.GT_MJ]: "MJRoomScene",
};

G.GroupItemResConfig = [
	"hall/e1",
	"hall/e2",
	"hall/e3",
	"hall/e4",
];

G.FriendRoomNumLength = 6;

//房间状态(和后台配置保持一致)
G.RoomState = {
	UN_INITED: 0, 						//房间未初始化
	INITED: 1, 							//初始化完成
	WAIT_TO_START: 2,					//人全部到齐，等待开局
	PLAYING: 3, 						//开局中
	ROUND_END: 4, 						//第一局结束，第二局还没开始
};

G.gameInfo = {
    isLogined:true,
	isInGame:true
}
