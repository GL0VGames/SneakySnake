/// <reference path="ArgyleEngine.ts"/>
/// <reference path="Player.ts"/>
class NPC extends Obj {
    public bStatic: boolean = false;
	public bStartFollowing: boolean = false;
    public bFollowing: boolean = false;
    private followIndex: number;
    private sightType: number;
    private turnCounter: number;
    public gPos: Vector2;
    public seen: boolean;
	public framePosition: Vector2;
	private static turnMin: number = 40;
	private static turnMax: number = 200;
	private static visionMax: number = 4;

	// To help keep memory down
	private temp: any;
	private tempVec: Vector2;
    private superTemp: number = 0;
    private tempCount: number = 0;

    // Function to see if the player has crossed the npc's vision and to change the anim
    private look(target: Vector2, collision: any) {
		this.temp = this.gPos; // Because you can't decrease this.gPos
		this.tempVec = target.minus(this.gPos);
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
						for (this.temp.x; target.x > this.temp.x; this.temp.x++ , this.superTemp++) {
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
						for (this.temp.x; target.x < this.temp.x; this.temp.x-- , this.superTemp++) {
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
    }

    // Set the index in the players last positions array that the npc is supposed to look at
    public setfollowIndex(i: number) {
            this.followIndex = i;
    }

    // Lerp to the position behind the player the npc is supposed to be at
    public followPlayer(p: Player) {
        this.pos = lerp(this.pos, gridToScreen(p.previousLoc[this.followIndex]), p.speed);
        this.gPos = new Vector2(p.previousLoc[this.followIndex].x, p.previousLoc[this.followIndex].y);
    }

    // Pseudo-randomly rotate the npc's in either a clockwise, anti-clockwise, or random direction
    private rotate(score: number) {
        if (this.turnCounter == 0) {
            if (this.sightType == 0) {
                this.animMan.rightFrame();
            } else if (this.sightType == 1) {
                this.animMan.leftFrame();
            } else if (this.sightType == 2) {
                if (Math.round(Math.random()))
					this.animMan.rightFrame();
				else this.animMan.leftFrame();
			}
            else if (this.animMan.frame > this.animMan.anims.length)
                this.animMan.gotoFrame(0);
            this.turnCounter = randIntBetween(NPC.turnMin, clamp(NPC.turnMin, NPC.turnMax, NPC.turnMax - score));
        } else
			this.turnCounter--;
    }

    public tick(inp: Input, p: Player, collision: any) {
        // If the player walks over the npc, add the npc to the player and increase the players speed
        if (p.pos.equals(this.pos) && !this.bFollowing) {
            this.setfollowIndex(p.following.length + 1);
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
    }

    constructor(sVect: Vector2, gVect: Vector2, z: number, anims: Array<Animation>) {
        super(sVect.x, sVect.y, anims, z);
        this.gPos = gVect;
        this.pos = sVect;
        this.followIndex = -5;
        this.seen = false;
        this.turnCounter = randIntBetween(NPC.turnMin, NPC.turnMax);
        this.animMan = new AnimationManager(anims);
        this.animMan.gotoFrame(randIntBetween(0, 3));

        // Pick a random turn type
        this.sightType = randIntBetween(0, 2); // 0 = cw, 1 = ccw, 2 = rand
    }
}