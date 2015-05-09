/// <reference path="ArgyleEngine.ts"/>
class Player extends Obj {
    public bStatic: boolean = false;
    public gDestination: Vector2;
    public sDestination: Vector2;
    public tempDestination: Vector2;
    public speed: number = 2.5;
    private inventory: Array<Obj>;
    public bCanLerp: boolean;
    public previousLoc: Array<Vector2>;
    public following: Array<NPC>;
    private lastKey: string;
    public health: number = 1;

    public addInventory(object: Obj) {
        this.inventory.push(object);
    }

    public getInventory(): Array<Obj> {
        return this.inventory;
    }

    public tick(input: Input, collisionmap: any): void {

        if (this.bCanLerp == true) {
            this.gDestination.x = this.tempDestination.x;
            this.gDestination.y = this.tempDestination.y;
            if (!cmpVector2(this.gDestination, this.previousLoc[this.previousLoc.length - 1]))
                this.previousLoc.push(new Vector2(this.gDestination.x, this.gDestination.y));
            if (this.previousLoc.length > 5)
                this.previousLoc.splice(0, 1);
            this.sDestination = gridToScreen(this.gDestination.x, this.gDestination.y);
            if (!cmpVector2(this.pos, this.sDestination)) {
                if (this.lastKey === "a")
                    this.currAnim = "playerWalkL";
                else if (this.lastKey === "w")
                    this.currAnim = "playerWalkU";
                else if (this.lastKey === "d")
                    this.currAnim = "playerWalkU";
                else if (this.lastKey === "s")
                    this.currAnim = "playerWalkD";
                this.pos = lerp(this.pos, this.sDestination, this.speed);
            }
            else {
                this.tempDestination.x = this.gDestination.x;
                this.tempDestination.y = this.gDestination.y;
                if (this.lastKey === "a")
                    this.currAnim = "playerIdleL";
                else if (this.lastKey === "w")
                    this.currAnim = "playerIdleU";
                else if (this.lastKey === "d")
                    this.currAnim = "playerIdleU";
                else if (this.lastKey === "s")
                    this.currAnim = "playerIdleD";
            }
        } else {
            this.tempDestination.x = this.gDestination.x;
            this.tempDestination.y = this.gDestination.y;
            if (this.lastKey === "a")
                    this.currAnim = "playerIdleL";
            else if (this.lastKey === "w")
                    this.currAnim = "playerIdleU";
            else if (this.lastKey === "d")
                    this.currAnim = "playerIdleU";
            else if (this.lastKey === "s")
                    this.currAnim = "playerIdleD";
        }

        if (input.keyPresses.length > 0 && cmpVector2(this.pos, this.sDestination)) {
            if (input.keyPresses[0] === "a") {
                this.tempDestination.y = this.gDestination.y + 1;
                this.lastKey = "a";
            }
            else if (input.keyPresses[0] === "w") {
                this.tempDestination.x = this.gDestination.x - 1;
                this.lastKey = "w";
            }
            else if (input.keyPresses[0] === "d") {
                this.tempDestination.y = this.gDestination.y - 1;
                this.lastKey = "d";
            }
            else if (input.keyPresses[0] === "s") {
                this.tempDestination.x = this.gDestination.x + 1;
                this.lastKey = "s";
            }

            input.keyPresses.pop();  
        }
        
    }
    constructor(x: number, y: number) {
        super(x, y);
        this.pos = new Vector2(x, y);
        this.gDestination = new Vector2(1, 1);
        this.sDestination = new Vector2(x, y);
        this.tempDestination = new Vector2(1, 1);
        this.previousLoc = [new Vector2(1, 1), new Vector2(1, 1), new Vector2(1, 1), new Vector2(1, 1), new Vector2(1, 1)];
        this.currAnim = "playerIdleD";
        this.animFrame = 0;
        this.zIndex = 5;
        this.inventory = [];
        this.bCanLerp = true;
        this.following = [];
    }
} 