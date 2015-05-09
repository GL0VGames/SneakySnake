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
    function NPC(x, y, gx, gy, z) {
        _super.call(this, x, y, z);
        this.bStatic = false;
        this.bFollowing = false;
        this.interactable = true;
        this.superTemp = 0;
        this.tempi = 0;
        this.gPos = new Vector2(gx, gy);
        this.pos = new Vector2(x, y);
        this.currAnim = "npcIdleD";
        this.animFrame = 0;
        this.zIndex = 5;
        this.followIndex = -5;
        this.rot = 0;
        this.seen = false;

        // Pick a random turn type
        this.sightType = Math.floor(Math.random() * 3); // 0 = cw, 1 = ccw, 2 = rand
    }
    NPC.prototype.look = function (target, collision) {
        this.temp = new Vector2(this.gPos.x, this.gPos.y);
        switch (this.currAnim) {
            case "npcIdleD":
                if (target.x > this.gPos.x && target.y == this.gPos.y) {
                    this.superTemp = 0;
                    for (this.temp.x, this.superTemp; target.x > this.temp.x && this.superTemp <= 4; this.temp.x++, this.superTemp++) {
                        if (collision[this.temp.y][this.temp.x].currAnim === "filled" || this.superTemp === 4)
                            return;
                    }
                    this.seen = true;
                    this.currAnim = "npcIdleDSeen";
                }
                break;
            case "npcIdleL":
                if (target.x == this.gPos.x && target.y > this.gPos.y) {
                    this.superTemp = 0;
                    for (this.temp.y; target.y > this.temp.y && this.superTemp <= 4; this.temp.y++, this.superTemp++) {
                        if (collision[this.temp.y][this.temp.x].currAnim === "filled" || this.superTemp === 4)
                            return;
                    }
                    this.seen = true;
                    this.currAnim = "npcIdleLSeen";
                }
                break;
            case "npcIdleR":
                if (target.x == this.gPos.x && target.y < this.gPos.y) {
                    this.superTemp = 0;
                    for (this.temp.y; target.y < this.temp.y && this.superTemp <= 4; this.temp.y--, this.superTemp++) {
                        if (collision[this.temp.y][this.temp.x].currAnim === "filled" || this.superTemp === 4)
                            return;
                    }
                    this.seen = true;
                    this.currAnim = "npcIdleRSeen";
                }
                break;
            case "npcIdleU":
                if (target.x < this.gPos.x && target.y == this.gPos.y) {
                    this.superTemp = 0;
                    for (this.temp.x; target.x < this.temp.x && this.superTemp <= 4; this.temp.x--, this.superTemp++) {
                        if (collision[this.temp.y][this.temp.x].currAnim === "filled" || this.superTemp === 4)
                            return;
                    }
                    this.seen = true;
                    this.currAnim = "npcIdleUSeen";
                }
                break;
        }
    };

    NPC.prototype.setfollowIndex = function (i) {
        this.followIndex = i;
    };

    NPC.prototype.followPlayer = function (p) {
        this.pos = lerp(this.pos, gridToScreen(p.previousLoc[this.followIndex].x, p.previousLoc[this.followIndex].y), p.speed);
        this.gPos = new Vector2(p.previousLoc[this.followIndex].x, p.previousLoc[this.followIndex].y);
    };

    NPC.prototype.rotate = function () {
        this.turning = Math.floor(Math.random() * 125);
        if (this.turning == 0) {
            if (this.sightType == 0) {
                this.rot++;
                if (this.rot > 3)
                    this.rot = 0;
            } else if (this.sightType == 1) {
                this.rot--;
                if (this.rot < 0)
                    this.rot = 3;
            } else if (this.sightType == 2) {
                this.rot += (Math.round(Math.random())) ? 1 : -1;
                if (this.rot < 0)
                    this.rot = 3;
                else if (this.rot > 3)
                    this.rot = 0;
            }
        }
    };

    NPC.prototype.changeAnim = function (anim) {
        if (anim)
            this.currAnim = anim;

        if (this.rot == 0)
            this.currAnim = "npcIdleD";
        else if (this.rot == 1)
            this.currAnim = "npcIdleL";
        else if (this.rot == 2)
            this.currAnim = "npcIdleU";
        else if (this.rot == 3)
            this.currAnim = "npcIdleR";
    };

    NPC.prototype.tick = function (inp, p, collision) {
        if (cmpVector2(p.pos, this.pos) && !this.bFollowing) {
            this.setfollowIndex(p.following.length + 1);
            p.following.push(this);
            this.bFollowing = true;
        }
        if (this.bFollowing) {
            this.followPlayer(p);
            this.currAnim = "npcFollow";
        } else if (!this.seen) {
            // rand decide turn
            this.rotate();

            // change the anim
            this.changeAnim();

            // check if can see player or any part of tail
            this.look(p.gDestination, collision);
            for (this.tempi = 0; this.tempi < p.following.length; this.tempi++)
                this.look(p.following[this.tempi].gPos, collision);
        }
    };
    return NPC;
})(Interactable);
//# sourceMappingURL=NPC.js.map
