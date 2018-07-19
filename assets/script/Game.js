// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        // 分数 score 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },
        // 结束音效资源
        endAudio: {
            default: null,
            url: cc.AudioClip
        },
        // 场景音效资源
        gameAudio: {
            default: null,
            url: cc.AudioClip
        },
        // 这个属性引用了重新开始按钮资源
        // restartbtnPrefab: {
        //     default: null,
        //     type: cc.Prefab
        // },

        // 开始按钮资源
        startBtn: {
            default: null,
            type: cc.Button
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // 生成一个新的星星
        this.spawnNewStar();
        // 初始积分
        this.score = 0;
        // 播放游戏音乐
        // var gameAudio = cc.audioEngine.play(this.gameAudio, false, 0.7);
        // cc.audioEngine.playEffect(this.gameAudio, false);
        // 开始按钮
        this.setstartBtn();
    },

    spawnNewStar: function() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // 将 Game 组件的实例传入星星组件
        newStar.getComponent('Star').game = this;
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width/2;
        randX = cc.randomMinus1To1() * maxX;
        // 返回星星坐标
        return cc.p(randX, randY);
    },

    start () {

    },

    update (dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },

    gameOver: function () {
        // 停止 player 节点的跳跃动作
        this.player.stopAllActions(); 
        // 结束所有音乐
        cc.audioEngine.stopAll();
        // 结束音乐
        // cc.audioEngine.playEffect(this.endAudio, false);
        // 重载场景
        cc.director.loadScene('game');
    },

    // 增加积分 和 修改文字
    gainScore: function () {
        this.score += 1;
        // 更新文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放得分音效
        // cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    // 开始按钮
    setstartBtn: function () {
        console.log(this.startBtn.node)
        var player = this.player;
        this.startBtn.node.on(cc.Node.EventType.TOUCH_END, function(e){
            player.getComponent('Player').setJumpAction();
        })
    }
});
