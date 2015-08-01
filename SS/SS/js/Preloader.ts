/// <reference path="../lib/phaser.d.ts"/>

module SneakySnake {
    export class Preloader extends Phaser.State {
        preloadBar: Phaser.Sprite;
        preload() {
            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

 
            //  Load CB assets
            this.load.image('titlepage', '../img/titlepage.jpg');
            this.load.audio('music', '../img/title.mp3', true);
            this.load.audio('sizzle', 'audio/sizzlesizzle.mp3', true);
            this.load.spritesheet('simon', '../img/simon.png', 58, 96, 5);
            this.load.image('level1', '../img/level1.png');
            this.load.image('bacon', '../img/bacon_uncooked.png');
            this.load.image('bacon_cooked', '../img/bacon_cooked.png');
            this.load.image('pancakes', '../img/pancakes_uncooked.png');
            this.load.image('pancakes_cooked', '../img/pancakes_cooked.png');
            this.load.image('sausage', '../img/sausage_uncooked.png');
            this.load.image('sausage_cooked', '../img/sausage_cooked.png');
            this.load.image('taters', '../img/taters_uncooked.png');
            this.load.image('taters_cooked', '../img/taters_cooked.png');
            this.load.image('pan', '../img/fryingpan.png');
            this.load.image('spatula', '../img/spatula.png');
            this.load.image('stovetop', '../img/stove2.png');
            //this.load.physics('physicsData', 'physics.json');
            this.load.image('menu', '../img/menu.png');
            this.load.image('mbacon', '../img/mbacon.png');
            this.load.image('msausage', '../img/msausage.png');
            this.load.image('mtaters', '../img/mtaters.png');
            this.load.image('mpancake', '../img/mpancake.png');
            this.load.image('mbacon_hover', '../img/mbacon-hover.png');
            this.load.image('msausage_hover', '../img/msausage-hover.png');
            this.load.image('mtaters_hover', '../img/mtaters-hover.png');
            this.load.image('mpancake_hover', '../img/mpancake-hover.png');
            this.load.image('logo', '../img/gl0v-logo.png');
            this.load.image('logo_hover', '../img/gl0v-logo-hover.png');
        }
        create() {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        }
        startMainMenu() {
            this.game.state.start('MainMenu', true, false);
        }
    }
}
