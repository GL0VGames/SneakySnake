/// <reference path="../lib/phaser.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SneakySnake;
(function (SneakySnake) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            var that = this;
            this.background = this.add.sprite(0, 0, 'menu');
            this.background.scale.setTo(0.4, 0.4);
            this.start = this.add.button(400, 350, 'mtaters', function () {
                that.startGame('taters');
            }, this);
            this.start.scale.setTo(0.4, 0.4);
            this.start.events.onInputOver.add(function () {
                that.start.loadTexture('mtaters_hover', 0);
            }, this);
            this.start.events.onInputOut.add(function () {
                that.start.loadTexture('mtaters', 0);
            }, this);
            this.logo = this.add.button(700, 500, 'logo', function () {
                window.open('http://www.gl0vgames.com', '_blank');
            });
            this.logo.scale.setTo(0.4, 0.4);
            this.logo.events.onInputOver.add(function () {
                that.logo.loadTexture('logo_hover', 0);
            }, this);
            this.logo.events.onInputOut.add(function () {
                that.logo.loadTexture('logo', 0);
            }, this);
        };
        MainMenu.prototype.startGame = function (mode) {
            this.game.state.start('Level', true, false, mode);
        };
        return MainMenu;
    })(Phaser.State);
    SneakySnake.MainMenu = MainMenu;
})(SneakySnake || (SneakySnake = {}));
//# sourceMappingURL=MainMenu.js.map