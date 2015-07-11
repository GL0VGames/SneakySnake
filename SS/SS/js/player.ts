/// <reference path="ArgyleEngine.ts"/>
class Player extends Obj {
    public gDestination: Vector2;
    public sDestination: Vector2;
    public tempDestination: Vector2;
    public speed: number = 2.5;
    public bCanLerp: boolean;
    public previousLoc: Array<Vector2>;
    public following: Array<NPC>;
    private lastKey: string;
    public health: number = 1;
    public controls: Array<string> = ["s", "a", "w", "d"]; // Indexed by enum Direction

    constructor(x: number, y: number, anims: Array<Animation>) {
        super(x, y, anims, 5);
        this.bStatic = false;
        this.gDestination = new Vector2(1, 1);
        this.sDestination = new Vector2(x, y);
        this.tempDestination = new Vector2(1, 1);
        this.previousLoc = [new Vector2(1, 1), new Vector2(1, 1), new Vector2(1, 1), new Vector2(1, 1), new Vector2(1, 1)];
        this.bCanLerp = true;
        this.following = [];
    }

    public tick(input: Input, collisionmap: any): void {
        // Make sure the player is allowed to  move right now
        if (this.bCanLerp == true) {
            this.gDestination.x = this.tempDestination.x;
            this.gDestination.y = this.tempDestination.y;
            if (!this.gDestination.equals(this.previousLoc[0]))
                this.previousLoc = new Array(new Vector2(this.gDestination.x, this.gDestination.y)).concat(this.previousLoc.slice());//.push(new Vector2(this.gDestination.x, this.gDestination.y));
            if (this.previousLoc.length > 500) // This means you can only have 500 little guys following you, :( oh darn
                this.previousLoc.splice(0, 1); // FIFO, remove the first if the array is too long to prevent memory leaks
            this.sDestination = gridToScreen(this.gDestination.x, this.gDestination.y);
            if (!this.pos.equals(this.sDestination)) {
                // Change the animation depending on which way the character is moving
                if (this.lastKey === this.controls[0])
                    this.animMan.gotoNamedAnim("playerWalkL");
                else if (this.lastKey === this.controls[1])
                    this.animMan.gotoNamedAnim("playerWalkU");
                else if (this.lastKey === this.controls[2])
                    this.animMan.gotoNamedAnim("playerWalkU");
                else if (this.lastKey === this.controls[3])
                    this.animMan.gotoNamedAnim("playerWalkD");
                this.pos = lerp(this.pos, this.sDestination, this.speed);
            }
            else {
                // If the player isn't moving, change the anim to the correct idle anim
                if (input.keyPresses.length == 0) {
                    this.tempDestination.x = this.gDestination.x;
                    this.tempDestination.y = this.gDestination.y;
                    if (this.lastKey === this.controls[0])
                        this.animMan.gotoNamedAnim("playerIdleL");
                    else if (this.lastKey === this.controls[1])
                        this.animMan.gotoNamedAnim("playerIdleU");
                    else if (this.lastKey === this.controls[2])
                        this.animMan.gotoNamedAnim("playerIdleU");
                    else if (this.lastKey === this.controls[3])
                        this.animMan.gotoNamedAnim("playerIdleD");
                }
            }
        } else {
            // This is dumb, I know but if they're not allowed to lerp then they also need to go back to idle anims
            if (input.keyPresses.length == 0) {
                this.tempDestination.x = this.gDestination.x;
                this.tempDestination.y = this.gDestination.y;
                if (this.lastKey === this.controls[0])
                    this.animMan.gotoNamedAnim("playerIdleL");
                else if (this.lastKey === this.controls[1])
                    this.animMan.gotoNamedAnim("playerIdleU");
                else if (this.lastKey === this.controls[2])
                    this.animMan.gotoNamedAnim("playerIdleU");
                else if (this.lastKey === this.controls[3])
                    this.animMan.gotoNamedAnim("playerIdleD");
            }
        }

        if (input.keyPresses.length > 0 && this.pos.equals(this.sDestination)) {
            // If there is somewhere to go and you're not supposed to be moving at the moment then set the grid destination to wherever it needs to be
            if (input.keyPresses[0] === this.controls[0]) {
                this.tempDestination.y = this.gDestination.y + 1;
                this.lastKey = this.controls[0];
            }
            else if (input.keyPresses[0] === this.controls[1]) {
                this.tempDestination.x = this.gDestination.x - 1;
                this.lastKey = this.controls[1];
            }
            else if (input.keyPresses[0] === this.controls[2]) {
                this.tempDestination.y = this.gDestination.y - 1;
                this.lastKey = this.controls[2];
            }
            else if (input.keyPresses[0] === this.controls[3]) {
                this.tempDestination.x = this.gDestination.x + 1;
                this.lastKey = this.controls[3];
            }
            input.keyPresses.pop();  
        }
    }
} 