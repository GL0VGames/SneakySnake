/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="Boot.ts"/>
/// <reference path="MainMenu.ts"/>
/// <reference path="Preloader.ts"/>
/// <reference path="Level.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SneakySnake;
(function (SneakySnake) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 600, Phaser.AUTO, 'content', null);
            this.state.add('Boot', SneakySnake.Boot, false);
            this.state.add('Preloader', SneakySnake.Preloader, false);
            this.state.add('MainMenu', SneakySnake.MainMenu, false);
            this.state.add('Level', SneakySnake.Level, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    SneakySnake.Game = Game;
})(SneakySnake || (SneakySnake = {}));
//# sourceMappingURL=Game.js.map