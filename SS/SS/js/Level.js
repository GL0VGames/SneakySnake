/// <reference path="../lib/phaser.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SneakySnake;
(function (SneakySnake) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            _super.apply(this, arguments);
            this.debug = false;
        }
        Level.prototype.init = function (mode) {
            this.mode = mode;
        };
        Level.prototype.create = function () {
            this.background = this.add.sprite(0, 0, 'stovetop');
            this.background.scale.setTo(0.4, 0.4);
            this.music = this.add.audio('music', 1, false);
            this.sizzle = this.add.audio('sizzle', 0.5, true);
            this.sizzle.play();
            // physics setup
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.setImpactEvents(true);
            this.game.physics.p2.restitution = 0.8;
            this.panCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.spatulaCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.foodCollisionGroup = this.game.physics.p2.createCollisionGroup();
            // create stuff
            // mouse input events
            var that = this;
            function mouseWheel(event) {
                switch (that.game.input.mouse.wheelDelta) {
                    case Phaser.Mouse.WHEEL_UP:
                        break;
                    case Phaser.Mouse.WHEEL_DOWN:
                        break;
                }
            }
            this.game.input.mouse.mouseWheelCallback = mouseWheel;
            function mouseDown(event) {
            }
            this.game.input.onDown.add(mouseDown);
            function mouseUp(event) {
            }
            this.game.input.onUp.add(mouseUp);
        };
        Level.prototype.update = function () {
            // handle input
            var force_x = 0;
            var force_y = 0;
            var slide_x = 0;
            var slide_y = 0;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                force_y = -700;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                force_y = 700;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                force_x = -700;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                force_x = 700;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.TILDE)) {
                if (this.debug) {
                    this.food.forEach(function (f) {
                        f.body.debug = false;
                    }, this, true);
                    this.heat.forEach(function (f) {
                        f.body.debug = false;
                    }, this, true);
                    this.debug = false;
                }
                else {
                    this.food.forEach(function (f) {
                        f.body.debug = true;
                    }, this, true);
                    this.heat.forEach(function (f) {
                        f.body.debug = true;
                    }, this, true);
                    this.debug = true;
                }
            }
        };
        return Level;
    })(Phaser.State);
    SneakySnake.Level = Level;
})(SneakySnake || (SneakySnake = {}));
//# sourceMappingURL=Level.js.map