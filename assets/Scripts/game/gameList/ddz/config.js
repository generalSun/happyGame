var config = {
    INVALID_CHAIR:0xFFFF,							//非法座位号
    maxPlayerNum:4,
    playerPos:[
        {x:-570,y:-255},
        {x:570,y:30},
        {x:-310,y:245},
        {x:-570,y:30},
    ],
    sceneZOrder:{
        player:[1,2,3,4],

    },
    handNodeOffset:[
        {x:0,y:-30},
        {x:120,y:-30},
        {x:120,y:-30},
        {x:120,y:-30},
    ],
    handCardOffset:[//改变节点的中心点
        {x:0,y:0},
        {x:0,y:0},
        {x:0,y:0},
        {x:0,y:0},
    ],
    handCardMinOffset:[//设定最小偏移
        {x:180,y:0},
        {x:0,y:0},
        {x:0,y:0},
        {x:0,y:0},
    ],
    handNodeHeight:[720,80,80,80],
    handCardScale:[0.8,0.5,0.5,0.5],
    handCardSpace:[50,30,30,30],
    normalPokerSize:{width:118,height:160},
    cardPopHeight:33
}

module.exports = config