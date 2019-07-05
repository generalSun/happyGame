var gamelogic = {}
//数值掩码
gamelogic.VALUE_MASK = {
    COLOR :	240	,							                 //花色掩码
    VALUE :	15	,							                 //数值掩码
}

gamelogic.CARD_TYPE = {
    't_1'   : 1,        // 单张
    't_1n'  : 2,        // 顺子
    't_2'   : 3,        // 对
    't_2n'  : 4,        // 连对
    't_3'   : 5,        // 三个
    't_3n'  : 6,        // 多组三个
    't_31'  : 7,        // 三带1
    't_31n' : 8,        // 飞机
    't_32'  : 9,        // 三带2
    't_32n' : 10,       // 飞机
    't_41'  : 11,       // 四带一
    't_42'  : 12,       // 四带二
    't_43'  : 13,       // 四带三
    't_h4'  : 14,       // 带癞子炸
    't_4'   : 15,       // 纯炸弹
    't_4l'  : 16,       // 四癞子 
    't_king': 17,       // 王炸
}

gamelogic.CARD_DATA_ARRAY = [
	0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a,0x0b,0x0c,0x0d,//黑桃
    0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1a,0x1b,0x1c,0x1d,//梅花
    0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2a,0x2b,0x2c,0x2d,//红桃
    0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3a,0x3b,0x3c,0x3d,//方块
    0x041,0x042                                                      //大小王
]

//排序类型
gamelogic.SORT_TYPE = {
    LOGIC		:			1,									     //逻辑排序
    VALUE_POINT	:			2,									     //数值排序
}

//获取数值
gamelogic.getcardvalue = function(card){
	return (card & gamelogic.VALUE_MASK.VALUE)
}

//获取花色
gamelogic.getcardcolor = function(card){
	return (card & gamelogic.VALUE_MASK.COLOR) >> 4
}

//逻辑大小
gamelogic.getcardlogicvalue = function(card){
    var value = gamelogic.getcardvalue(card);//获取牌值
    var color = gamelogic.getcardcolor(card);//获取花色
    if(value == 0x01){
        value = 14
    }else if(value == 0x01){
        value = 15
    }else if(color == 0x04 && value == 0x01){
        value = 16
    }else if(color == 0x04 && value == 0x02){
        value = 17
    }
	return value
}
module.exports = gamelogic