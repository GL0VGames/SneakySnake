/// <reference path="../lib/phaser.d.ts"/>

module SneakySnake {
    export class Boot extends Phaser.State {
        preload() {
            this.load.image('preloadBar', 'img/loader.png');
        }
        create() {
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
                //  If you have any desktop specific settings, they can go in here
            }
            else {
                //  Same goes for mobile settings.
            }
            this.game.state.start('Preloader', true, false);
        }
    }
}
