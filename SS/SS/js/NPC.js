var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="ArgyleEngine.ts"/>
/// <reference path="Player.ts"/>
var NPC = /** @class */ (function (_super) {
    __extends(NPC, _super);
    function NPC(sVect, gVect, z, anims) {
        var _this = _super.call(this, sVect.x, sVect.y, anims, z) || this;
        _this.bStatic = false;
        _this.bStartFollowing = false;
        _this.bFollowing = false;
        _this.superTemp = 0;
        _this.tempCount = 0;
        _this.gPos = gVect;
        _this.pos = sVect;
        _this.followIndex = -5;
        _this.seen = false;
        _this.turnCounter = randIntBetween(NPC.turnMin, NPC.turnMax);
        _this.animMan = new AnimationManager(anims);
        _this.animMan.gotoFrame(randIntBetween(0, 3));
        // Pick a random turn type
        _this.sightType = randIntBetween(0, 2); // 0 = cw, 1 = ccw, 2 = rand
        return _this;
    }
    // Function to see if the player has crossed the npc's vision and to change the anim
    NPC.prototype.look = function (target, collision) {
        this.temp = this.gPos; // Because you can't decrease this.gPos
        this.tempVec = target.minus(this.gPos);
        if (this.tempVec.abs().x > 4 && this.tempVec.abs().y > 4)
            return;
        else if (this.tempVec.abs().x < 4 && (this.animMan.frame == Direction.DL || this.animMan.frame == Direction.UR))
            switch (this.animMan.frame) {
                case Direction.DL:
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
                case Direction.UR:
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
        else if (this.tempVec.abs().y < 4 && (this.animMan.frame == Direction.UL || this.animMan.frame == Direction.DR))
            switch (this.animMan.frame) {
                case Direction.UL:
                    if (target.x == this.temp.x && target.y > this.temp.y) {
                        for (this.temp.y; target.y > this.temp.y; this.temp.y++, this.superTemp++) {
                            if (collision[this.temp.y][this.temp.x].animMan.anims[collision[this.temp.y][this.temp.x].animMan.currentAnim].name === "filled")
                                return;
                        }
                        this.seen = true;
                        this.animMan.gotoNamedAnim("npcIdleLSeen");
                    }
                    break;
                case Direction.DR:
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
    NPC.prototype.rotate = function (score) {
        if (this.turnCounter == 0) {
            if (this.sightType == 0) {
                this.animMan.rightFrame();
            }
            else if (this.sightType == 1) {
                this.animMan.leftFrame();
            }
            else if (this.sightType == 2) {
                if (Math.round(Math.random()))
                    this.animMan.rightFrame();
                else
                    this.animMan.leftFrame();
            }
            else if (this.animMan.frame > this.animMan.anims.length)
                this.animMan.gotoFrame(0);
            this.turnCounter = randIntBetween(NPC.turnMin, clamp(NPC.turnMin, NPC.turnMax, NPC.turnMax - score));
        }
        else
            this.turnCounter--;
    };
    NPC.prototype.tick = function (inp, p, collision) {
        // If the player walks over the npc, add the npc to the player and increase the players speed
        if (p.pos.equals(this.pos) && !this.bFollowing) {
            this.setfollowIndex(p.following.length);
            p.following.push(this);
            this.bFollowing = true;
            p.speed += p.speedBoost;
        }
        // If the npc is supposed to be following the player, change the anim to the following anim
        else if (this.bFollowing) {
            this.followPlayer(p);
            if (!this.bStartFollowing) {
                this.animMan.gotoNamedAnim("npcFollowAnim");
                this.bStartFollowing = true;
            }
        }
        else if (!this.seen) {
            // rand decide turn
            this.rotate(p.following.length);
            // check if can see player or any part of tail
            this.look(p.gDestination, collision);
            for (this.tempCount = 0; this.tempCount < p.following.length; this.tempCount++)
                this.look(p.following[this.tempCount].gPos, collision);
        }
    };
    NPC.turnMin = 40;
    NPC.turnMax = 200;
    NPC.visionMax = 4;
    return NPC;
}(Obj));

//# sourceMappingURL=NPC.js.map
