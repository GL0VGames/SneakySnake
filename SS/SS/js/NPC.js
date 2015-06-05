var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="ArgyleEngine.ts"/>
/// <reference path="player.ts"/>
var NPC = (function (_super) {
    __extends(NPC, _super);
    function NPC(x, y, gx, gy, z, anims) {
        _super.call(this, x, y, z, anims);
        this.bStatic = false;
        this.bStartFollowing = false;
        this.bFollowing = false;
        this.superTemp = 0;
        this.gPos = new Vector2(gx, gy);
        this.pos = new Vector2(x, y);
        this.zIndex = 5;
        this.followIndex = -5;
        this.seen = false;
        this.turnCounter = randBetween(NPC.turnMin, NPC.turnMax, true);
        this.animMan = new AnimationManager(anims);
        this.animMan.frame = randBetween(0, 3, true);
        // Pick a random turn type
        this.sightType = randBetween(0, 2, true); // 0 = cw, 1 = ccw, 2 = rand
    }
    // Function to see if the player has crossed the npc's vision and to change the anim
    NPC.prototype.look = function (target, collision) {
        this.temp = this.gPos; // Because you can't decrease this.gPos
        this.tempVec = difVector2(target, this.gPos);
        this.tempVec.x = Math.abs(this.tempVec.x);
        this.tempVec.y = Math.abs(this.tempVec.y);
        if (this.tempVec.x > 4 && this.tempVec.y > 4)
            return;
        else if (this.tempVec.x < 4 && (this.animMan.frame == 0 || this.animMan.frame == 2))
            switch (this.animMan.frame) {
                case 0:
                    // Make sure the npc can actually see the player, no walls in the way and not out of range ( 4 )
                    if (target.x > this.temp.x && target.y == this.temp.y) {
                        this.superTemp = 0;
                        for (this.temp.x; target.x > this.temp.x; this.temp.x++, this.superTemp++) {
                            if (collision[this.temp.y][this.temp.x].animMan.anims[collision[this.temp.y][this.temp.x].animMan.currentAnim].name === "filled")
                                return;
                        }
                        // If the npc can actually see the player, change the anim to the seen anim and set the flag
                        this.seen = true;
                        this.animMan.gotoNamedAnim("npcIdleDSeen");
                    }
                    break;
                case 2:
                    if (target.x < this.temp.x && target.y == this.temp.y) {
                        this.superTemp = 0;
                        for (this.temp.x; target.x < this.temp.x; this.temp.x--, this.superTemp++) {
                            if (collision[this.temp.y][this.temp.x].animMan.anims[collision[this.temp.y][this.temp.x].animMan.currentAnim].name === "filled")
                                return;
                        }
                        this.seen = true;
                        this.animMan.gotoNamedAnim("npcIdleUSeen");
                    }
                    break;
            }
        else if (this.tempVec.y < 4 && (this.animMan.frame == 1 || this.animMan.frame == 3))
            switch (this.animMan.frame) {
                case 1:
                    if (target.x == this.temp.x && target.y > this.temp.y) {
                        for (this.temp.y; target.y > this.temp.y; this.temp.y++, this.superTemp++) {
                            if (collision[this.temp.y][this.temp.x].animMan.anims[collision[this.temp.y][this.temp.x].animMan.currentAnim].name === "filled")
                                return;
                        }
                        this.seen = true;
                        this.animMan.gotoNamedAnim("npcIdleLSeen");
                    }
                    break;
                case 3:
                    if (target.x == this.temp.x && target.y < this.temp.y) {
                        this.superTemp = 0;
                        for (this.temp.y; target.y < this.temp.y; this.temp.y--, this.superTemp++) {
                            if (collision[this.temp.y][this.temp.x].animMan.anims[collision[this.temp.y][this.temp.x].animMan.currentAnim].name === "filled")
                                return;
                        }
                        this.seen = true;
                        this.animMan.gotoNamedAnim("npcIdleRSeen");
                    }
                    break;
            }
        if (this.animMan.frame < 0)
            this.animMan.frame = 0;
    };
    // Set the index in the players last positions array that the npc is supposed to look at
    NPC.prototype.setfollowIndex = function (i) {
        this.followIndex = i;
    };
    // Lerp to the position behind the player the npc is supposed to be at
    NPC.prototype.followPlayer = function (p) {
        this.pos = lerp(this.pos, gridToScreen(p.previousLoc[this.followIndex]), p.speed);
        this.gPos = new Vector2(p.previousLoc[this.followIndex].x, p.previousLoc[this.followIndex].y);
    };
    // Pseudo-randomly rotate the npc's in either a clockwise, anti-clockwise, or random direction
    NPC.prototype.rotate = function () {
        if (this.turnCounter == 0) {
            if (this.sightType == 0) {
                this.animMan.rightFrame();
            }
            else if (this.sightType == 1) {
                this.animMan.leftFrame();
            }
            else if (this.sightType == 2) {
                this.animMan.frame += (Math.round(Math.random())) ? 1 : -1;
                this.animMan.frame %= 4;
                this.animMan.gotoFrame(this.animMan.frame);
            }
            else if (this.animMan.frame > 3)
                this.animMan.gotoFrame(0);
            this.turnCounter = randBetween(NPC.turnMin, NPC.turnMax, true);
        }
        else
            this.turnCounter--;
    };
    NPC.prototype.tick = function (inp, p, collision) {
        // If the player walks over the npc, add the npc to the player and increase the players speed
        if (cmpVector2(p.pos, this.pos) && !this.bFollowing) {
            this.setfollowIndex(p.following.length + 1);
            p.following.push(this);
            this.bFollowing = true;
            p.speed += .1;
        }
        else if (this.bFollowing) {
            this.followPlayer(p);
            if (!this.bStartFollowing) {
                this.animMan.gotoNamedAnim("npcFollowAnim");
                this.bStartFollowing = true;
            }
        }
        else if (!this.seen) {
            // rand decide turn
            this.rotate();
            // check if can see player or any part of tail
            this.look(p.gDestination, collision);
            for (this.temp = 0; this.temp < p.following.length; this.temp++)
                this.look(p.following[this.temp].gPos, collision);
        }
    };
    NPC.turnMin = 20;
    NPC.turnMax = 200;
    NPC.visionMax = 4;
    return NPC;
})(Interactable);
//# sourceMappingURL=NPC.js.map