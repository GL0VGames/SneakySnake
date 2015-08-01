/// <reference path="../lib/phaser.d.ts"/>

module SneakySnake {
    export class Level extends Phaser.State {
        background: Phaser.Sprite;
        music: Phaser.Sound;
        sizzle: Phaser.Sound;
        food: Phaser.Group;
        heat: Phaser.Group;
        mode: string;
        debug: boolean = false;
        panCollisionGroup: Phaser.Physics.P2.CollisionGroup;
        spatulaCollisionGroup: Phaser.Physics.P2.CollisionGroup;
        foodCollisionGroup: Phaser.Physics.P2.CollisionGroup;
        init(mode?: string) {
            this.mode = mode;
        }
        create() {
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
        }
        update() {
            // handle input
            var force_x: number = 0;
            var force_y: number = 0;
            var slide_x: number = 0;
            var slide_y: number = 0;
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
                } else {
                    this.food.forEach(function (f) {
                        f.body.debug = true;
                    }, this, true);
                    this.heat.forEach(function (f) {
                        f.body.debug = true;
                    }, this, true);
                    this.debug = true;
                }
            }
        }
    }
}