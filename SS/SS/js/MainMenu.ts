/// <reference path="../lib/phaser.d.ts"/>

module SneakySnake {
    export class MainMenu extends Phaser.State {
        background: Phaser.Sprite;
        start: Phaser.Button;
        logo: Phaser.Button;
        create() {
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
        }
        startGame(mode: string) {
            this.game.state.start('Level', true, false, mode);
        }
    }
}