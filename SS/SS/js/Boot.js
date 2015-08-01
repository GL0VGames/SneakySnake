/// <reference path="../lib/phaser.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SneakySnake;
(function (SneakySnake) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'img/loader.png');
        };
        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            //this.stage.disableVisibilityChange = true;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.maxWidth = 800;
            this.scale.maxHeight = 600;
            this.scale.minWidth = 400;
            this.scale.minHeight = 300;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            if (this.game.device.desktop) {
            }
            else {
            }
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    SneakySnake.Boot = Boot;
})(SneakySnake || (SneakySnake = {}));
//# sourceMappingURL=Boot.js.map