var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="ArgyleEngine.ts"/>
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(x, y, anims) {
        _super.call(this, x, y, anims, 5);
        this.speed = 2.3;
        this.health = 1;
        this.speedBoost = .1; // Added to player speed whenever they pick up an NPC
        this.bStatic = false;
        this.gDestination = new Vector2(1, 1);
        this.sDestination = new Vector2(x, y);
        this.previousLoc = [new Vector2(1, 1)];
        this.bCanLerp = true;
        this.following = [];
        this.animMan.gotoNamedAnim("playerIdleR");
    }
    Player.prototype.IDLE = function () {
        if (this.animMan.anims[this.animMan.currentAnim].name == "playerWalkD")
            this.animMan.gotoNamedAnim("playerIdleD");
        else if (this.animMan.anims[this.animMan.currentAnim].name == "playerWalkU")
            this.animMan.gotoNamedAnim("playerIdleU");
        else if (this.animMan.anims[this.animMan.currentAnim].name == "playerWalkR")
            this.animMan.gotoNamedAnim("playerIdleR");
    };
    Player.prototype.tick = function (input, collisionmap) {
        // If there is somewhere to go and you're not there
        if (this.bCanLerp && input.keyPresses.length > 0 && this.sDestination.equals(this.pos) && this.health > 0) {
            // Add current position to previous loc arr so that followers know where to go
            this.previousLoc = [new Vector2(this.gDestination.x, this.gDestination.y)].concat(this.previousLoc.slice());
            // Change destination and anim to match new movement
            if (input.keyPresses[0] === "s") {
                this.gDestination.y = this.gDestination.y + 1;
                this.lastKey = "s";
            }
            else if (input.keyPresses[0] === "a") {
                this.gDestination.x = this.gDestination.x - 1;
                this.lastKey = "a";
            }
            else if (input.keyPresses[0] === "w") {
                this.gDestination.y = this.gDestination.y - 1;
                this.lastKey = "w";
            }
            else if (input.keyPresses[0] === "d") {
                this.gDestination.x = this.gDestination.x + 1;
                this.lastKey = "d";
            }
            // Remove keypress
            input.keyPresses = input.keyPresses.splice(1, input.keyPresses.length - 1);
            // Set screen destination and go there
            this.sDestination = gridToScreen(this.gDestination);
        }
        else if (this.bCanLerp && !this.sDestination.equals(this.pos)) {
            // Change anims because now it's ok to move
            if (this.lastKey === "s")
                this.animMan.gotoNamedAnim("playerWalkD");
            else if (this.lastKey === "a")
                this.animMan.gotoNamedAnim("playerWalkU");
            else if (this.lastKey === "w")
                this.animMan.gotoNamedAnim("playerWalkU");
            else if (this.lastKey === "d")
                this.animMan.gotoNamedAnim("playerWalkR");
            // Move
            this.pos = lerp(this.pos, this.sDestination, this.speed);
        }
        else if (!this.bCanLerp) {
            // Reset bCanLerp and location vars so that you can move again
            this.bCanLerp = true;
            this.gDestination = new Vector2(this.previousLoc[0].x, this.previousLoc[0].y);
            this.sDestination = gridToScreen(this.gDestination);
            this.previousLoc = this.previousLoc.splice(1, this.previousLoc.length - 1);
            // For any case that doesn't involve moving, go to idle anim
            this.IDLE();
        }
        else
            this.IDLE();
    };
    return Player;
})(Obj);
//# sourceMappingURL=Player.js.map