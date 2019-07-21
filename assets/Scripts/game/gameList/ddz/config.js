var config = {
    INVALID_CHAIR:0xFFFF,							//非法座位号
    maxPlayerNum:4,
    gameState:{
        
    },
    chair:{
        home:0,//自家
        nextDoor:1,//下家
        rightHome:2,//对家
        upperHouse:3,//上家
    },
    playerPos:{
        [3]:[
            cc.v2(-570,-255),
            cc.v2(570,70),
            cc.v2(-310,245),
            cc.v2(-570,70)
        ],
        [4]:[
            cc.v2(-570,-255),
            cc.v2(570,50),
            cc.v2(-310,245),
            cc.v2(-570,50)
        ],
    },
    sceneZOrder:{
        player:[1,2,3,4],
        buttonNode:5,
        moreNode:6,
        wxInviteNode:7,
        settlement:8
    },
    handNodeSize:[
        cc.size(cc.winSize.width,cc.winSize.height),
        cc.size(450,100),
        cc.size(450,100),
        cc.size(450,100),
    ],
    handNodeOffset:[//与playerNode的偏差
        cc.v2(0,0),
        cc.v2(120,-40),
        cc.v2(120,-40),
        cc.v2(120,-40),
    ],
    handCardOffset:[//改变节点的中心点
        cc.v2(0,0),
        cc.v2(0,0),
        cc.v2(0,0),
        cc.v2(0,0),
    ],
    handCardMinOffset:[//设定最小偏移
        cc.v2(180,0),
        cc.v2(0,0),
        cc.v2(0,0),
        cc.v2(0,0),

    ],
    handCardScale:[
        cc.v2(1,1),
        cc.v2(1,1),
        cc.v2(1,1),
        cc.v2(1,1),
    ],
    handCardSpace:[71,39,39,39],
    normalHandPokerSize:[
        cc.size(142,185),
        cc.size(78,103),
        cc.size(78,103),
        cc.size(78,103),
    ],
    cardPopHeight:25,

    disNodeSize:[
        cc.size(500,100),
        cc.size(450,100),
        cc.size(450,100),
        cc.size(450,100),
    ],
    disNodeOffset:[
        cc.v2(0,200),
        cc.v2(120,0),
        cc.v2(120,0),
        cc.v2(120,0),
    ],
    disCardOffset:[//改变节点的中心点
        cc.v2(0,0),
        cc.v2(0,0),
        cc.v2(0,0),
        cc.v2(0,0),
    ],
    disCardMinOffset:[//设定最小偏移
        cc.v2(0,0),
        cc.v2(0,0),
        cc.v2(0,0),
        cc.v2(0,0),
    ],
    disCardScale:[
        cc.v2(1,1),
        cc.v2(1,1),
        cc.v2(1,1),
        cc.v2(1,1),
    ],
    disCardSpace:[30,30,30,30],
    normalDisPokerSize:[
        cc.size(78,103),
        cc.size(78,103),
        cc.size(78,103),
        cc.size(78,103),
    ],

    yuCardsScale:cc.v2(1,1),
    normalBottomPokerSize:cc.size(44,58),
    yuCardsSpace:22,
    yuCardsOffset:cc.v2(0,0),
    yuCardsMinOffset:cc.v2(0,0),

    cardType:{
        ONE:{serverIndex:1,sound:"card_Size{0}"},		//单张      K
		TWO:{serverIndex:2,sound:"dui{0}"},		//一对	 kK
		THREE:{serverIndex:3,sound:"tuple{0}"},	//三张	 kkk
		FOUR:{serverIndex:4,sound:"3D1"},	//三带一	 AAA+K
		FORMTWO:{serverIndex:41,sound:"3D2"},	//三带对	 AAA+K
		FIVE:{serverIndex:5,sound:"ShunZi"},	//单顺	连子		10JQKA
		SIX:{serverIndex:6,sound:"LianDui"},		//双顺	连对		JJQQKK
		SEVEN:{serverIndex:7,sound:"FeiJi"},	//三顺	飞机		JJJQQQ
		EIGHT:{serverIndex:8,sound:"FeiJi"},	//飞机	带翅膀	JJJ+QQQ+K+A
		EIGHTONE:{serverIndex:81,sound:"FeiJi"},	//飞机	带翅膀	JJJ+QQQ+KK+AA
		NINE:{serverIndex:9,sound:"4D2"},	//四带二			JJJJ+Q+K
		NINEONE:{serverIndex:91,sound:"4D22"},	//四带二对			JJJJ+QQ+KK
		TEN:{serverIndex:10,sound:"zhadan"},	//炸弹			JJJJ
		ELEVEN:{serverIndex:11,sound:"wangzha"},	//王炸			0+0
    }
}

module.exports = config