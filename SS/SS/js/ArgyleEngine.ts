/// <reference path="../lib/jquery.d.ts" />
// Given integers low and high, returns a random integer in the interval [low, high]
function randIntBetween(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function collide(obj: Vector2, NPCs: Array<Obj>): boolean {
    for (var ind: number = 0; ind < NPCs.length; ind++) {
        if (obj.equals(NPCs[ind].gPos))
            return true;
    }
    return false;
}

class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    static randVector2(xMax: number, yMax: number) {
        return new Vector2(randIntBetween(0, xMax), randIntBetween(0, yMax));
    }
    plus(rhs: Vector2): Vector2 {
        return new Vector2(this.x + rhs.x, this.y + rhs.y);
    }
    minus(rhs: Vector2): Vector2 {
        return new Vector2(this.x - rhs.x, this.y - rhs.y);
    }
    equals(rhs: Vector2): boolean {
        return (this.x == rhs.x) && (this.y == rhs.y);
    }
}

class Input {
    private mouseDown: boolean;
    public mouseClicked: boolean;
    public mouseDownPos: Vector2;
    public mouseUpPos: Vector2;
    public keyPresses: Array<string>;

    constructor() {
        this.mouseDown = false;
        this.mouseClicked = false;
        this.mouseDownPos = new Vector2(-1, -1);
        this.mouseUpPos = new Vector2(-1, -1);
        this.keyPresses = new Array("");
    }
    public mousedown(e: JQueryMouseEventObject) {
        this.mouseDownPos.x = e.pageX;
        this.mouseDownPos.y = e.pageY;
        this.mouseDown = true;
    }
    public mouseup(e: JQueryMouseEventObject) {
        this.mouseUpPos.x = e.pageX;
        this.mouseUpPos.y = e.pageY;
        this.mouseDown = false;
    }
    public click(e: JQueryMouseEventObject) {
        // these next four lines shouldn't be needed once mousedown and mouseup are working
        // but they're not for some reason
        this.mouseDownPos.x = e.pageX;
        this.mouseDownPos.y = e.pageY;
        this.mouseUpPos.x = e.pageX;
        this.mouseUpPos.y = e.pageY;
        this.mouseClicked = true;
}
}

class Animation {
    public static: boolean;
    public frameSize: Vector2;
    public offset: Vector2;
    public image: HTMLImageElement;
    public sheetWidth: number;
	public name: string;
	// For automatic anims
	public frameCounter: number = 0;
	public frameCounterMax: number;

    public translate(ofst: Vector2) {
        this.offset = ofst;
    }

	// Frames must be greater than 0 for animations
    constructor(st: boolean, width: number, height: number, off_x: number, off_y: number, frames: number, name: string) {
        this.static = st;
        this.frameSize = new Vector2(width, height);
        this.offset = new Vector2(off_x, off_y);
		this.frameCounterMax = frames;
		this.name = name;
    }
    public setImage(img) {
        this.image = img;
        this.sheetWidth = Math.floor(img.width / this.frameSize.x);
    }
}

class Obj {
    bStatic: boolean;
    pos: Vector2;
    gPos: Vector2;
	animMan: AnimationManager;
    zIndex: number = 5;

    public setZ(z): void {
        this.zIndex = z;
    }
    constructor(x: number, y: number, anims: Array<Animation>, z?: number) {
        this.pos = new Vector2(x, y);
        this.zIndex = 0;
		this.animMan = new AnimationManager(anims);
		if (typeof (z) !== undefined)
			this.zIndex = z;
    }
}

class CollisionTile extends Obj {
    bStatic = true;
    constructor(x: number, y: number, anims: Array<Animation>) {
        super(x, y, anims);
        this.zIndex = 3;
    }
}

class FloorTile extends Obj {
    bStatic = true;
    public tick() {
        this.pos.x++;
    }
    constructor(x: number, y: number, anims: Array<Animation>) {
        super(x, y, anims);
        this.zIndex = 0;
    }
}

class WallTile extends Obj {
    bStatic = true;
    constructor(x: number, y: number, anims: Array<Animation>) {
        super(x, y, anims);
        this.zIndex = 5;
    }
}

class DoorTile extends Obj {
    bStatic = true;
    constructor(x: number, y: number, anims: Array<Animation>) {
        super(x, y, anims);
        this.zIndex = 5;
    }
}

function gridToScreen(xOrVect: any, y?: number): Vector2 {
    var out;
    
    if (typeof xOrVect != "number")
        out = new Vector2((600 + 32 * xOrVect.x - 32 * xOrVect.y) - 87, (16 * xOrVect.x + 16 * xOrVect.y) + 44);
    else 
        out = new Vector2((600 + 32 * xOrVect - 32 * y) - 87, (16 * xOrVect + 16 * y) + 44);

    return out;
}

function div(a: number, b: number): number {
    return (~~(a / b)) * b;
}

//function screenToGrid(x: number, y: number) {
//	var xg = Math.round((((x / 32) - 18.75 + (y / 16)) / 2) - 2.72);
//	xg = x - 513 
//	var y = Math.round(((18.75 + (y / 16) - (x / 32)) / 2)) - 2.75);
//    var out = new Vector2(xg, yg);
//    return out;
//}

function lerp(start: Vector2, end: Vector2, speed: number) {
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var len = Math.sqrt(dx * dx + dy * dy);
    if (speed >= len) {
        return new Vector2(end.x, end.y);
    } else {
        dx *= speed / len;
        dy *= speed / len;
        return new Vector2(start.x + dx, start.y + dy);
    }
}

enum Direction { DL, UL, UR, DR };
enum RTypes { FLOOR, WALL, DOOR };

class AssetManager {
    // Loading Bar Vars
    private barTickSize: number = 0;
    private totalBar: number = 0;
    public total: number = 0;
    private remainder: number = 0;
    private curr: number = 0;
    private imagesLength: number;
	private doneLoading: boolean = false;

    // Arrays of anims, images, and audio
    public images: { [index: string]: HTMLImageElement; } = {};
    private imageURLs: { [index: string]: string; } = {
        none: "images/none.png",
        floor: "images/floors.png",
        wall: "images/walls.png",
        teleporter: "images/teleporter.png",
        playerIdleD: "images/charStatDown.png",
        playerIdleL: "images/charStatLeft.png",
        playerIdleU: "images/charStatUp.png",
        playerWalkD: "images/charStatDown.png",
        playerWalkL: "images/charStatLeft.png",
        playerWalkU: "images/charStatUp.png",
        filled: "images/filled.png",
        empty: "images/empty.png",
        npcFollow: "images/npcFollower.png",
		npcFollowAnim: "images/npcFollower.png",
		npcAll: "images/npcAll.png",
        npcIdleDSeen: "images/npcStatDown.png",
        npcIdleLSeen: "images/npcStatLeft.png",
        npcIdleUSeen: "images/npcStatUp.png",
        npcIdleRSeen: "images/npcStatRight.png",
		testAnim: "images/testAnim.png",
    };
    public anims: { [index: string]: Animation; } = { //index matches imageURL index
        none: new Animation(true, 64, 32, 32, 16, 0, "none"),
        floor: new Animation(true, 64, 32, 32, 16, 0, "floor"),
        wall: new Animation(true, 64, 64, 32, 48, 0, "wall"),
        teleporter: new Animation(true, 64, 48, 32, 32, 0, "teleporter"),
        playerIdleD: new Animation(true, 64, 64, 32, 44, 0, "playerIdleD"),
        playerIdleL: new Animation(true, 64, 64, 32, 44, 0, "playerIdleL"),
        playerIdleU: new Animation(true, 64, 64, 32, 44, 0, "playerIdleU"),
        playerWalkD: new Animation(true, 64, 64, 32, 64, 0, "playerWalkD"),
        playerWalkL: new Animation(true, 64, 64, 32, 64, 0, "playerWalkL"),
        playerWalkU: new Animation(true, 64, 64, 32, 64, 0, "playerWalkU"),
        filled: new Animation(true, 64, 32, 32, 16, 0, "filled"),
        empty: new Animation(true, 64, 32, 32, 16, 0, "empty"),
        npcFollow: new Animation(true, 64, 64, 32, 40, 0, "npcFollow"),
		npcFollowAnim: new Animation(false, 64, 64, 32, 40, 0, "npcFollowAnim"),
		npcAll: new Animation(false, 64, 64, 32, 40, -1, "npcAll"),
        npcIdleDSeen: new Animation(true, 64, 64, 32, 60, 0, "npcIdleDSeen"),
        npcIdleLSeen: new Animation(true, 64, 64, 32, 60, 0, "npcIdleLSeen"),
        npcIdleUSeen: new Animation(true, 64, 64, 32, 60, 0, "npcIdleUSeen"),
        npcIdleRSeen: new Animation(true, 64, 64, 32, 60, 0, "npcIdleRSeen"),
		testAnim: new Animation(false, 13, 32, 13, 32, 60, "testAnim"),
    };
    public audio: any = {}; // Can't do : Array<HTMLAudioElement> because that doesn't support .addEventListenerxr some odd reason
    private audioURLs: any = {
        "main": "sounds/theme2.wav",
    };

    // Loading bar canvas vars;
    private x: number = 0;
    private y: number = 0;
    private height: number = 0;

    // Updates the loading bar when asset is loaded
    updateBar(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.curr++;
		var that = this;

        // Loading bar
        this.totalBar += this.barTickSize;
        ctx.fillStyle = "black";
        var width: number = Math.floor(this.totalBar);
        if (this.curr >= this.total) width += this.remainder;
        ctx.fillRect(this.x, this.y, width, this.height);

        // Custom even handled in game.ts to start the game when all assets have loaded
        $("body").trigger("assetLoaded", {
			"num": this.curr
		});
		$("body").on("assetLoaded", function (e, d) {
			if (d.num >= that.total && !that.doneLoading) {
				that.doneLoading = true;
				// Assign image to anim
				for (var j in that.anims)
					that.anims[j].setImage(that.images[j]);
				$("body").trigger("assetsFinished");
			}
		});
    }

    private preloader(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        var that = this;

        // Preload all images and put into anims
        for (var i in this.anims) {
            this.images[i] = new Image();
            this.images[i].onload = function (): void {
                that.updateBar(ctx, canvas);
            }
            this.images[i].src = this.imageURLs[i];
            this.imagesLength++;

        }

        // Preload all sounds
        for (var i in this.audioURLs) {
            this.audio[i] = new Audio();
            this.audio[i].addEventListener('canplaythrough', that.updateBar(ctx, canvas), false);
            this.audio[i].src = this.audioURLs[i];
            this.audio[i].load();
            this.audio[i].addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
        }
    }

    public removeAssets() {
        for (var i = this.audio.length - 1; i >= 0; i--)
            $(this.audio[0]).remove();
        for (var i = this.imagesLength - 1; i >= 0; i--)
            $(this.images[0]).remove(); 
    }

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.imagesLength = 0;
        // Set canvas vars
        this.total = Object.keys(this.imageURLs).length + Object.keys(this.audioURLs).length;
        this.x = Math.floor(canvas.width / 4);
        this.y = Math.floor(canvas.height / 2 - canvas.height / 16);
        this.height = Math.floor(canvas.height / 16);

        // Black background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Loading bar stuff
        ctx.fillStyle = "white";
        ctx.fillRect(this.x - 5, this.y - 5, Math.floor(canvas.width / 2 + 10), this.height + 10); // 5 is boarder
        this.barTickSize = Math.floor((canvas.width / 2) / this.total);
        this.remainder = Math.floor(canvas.width / 2) - (this.barTickSize * this.total);

        // Actually load the images
        this.preloader(ctx, canvas);
    }
}

class Renderer {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
	private assets: AssetManager;

    public draw(objs: Array<Obj>, anims: { [index: string]: Animation; }, fps?: number) {

        // draw background
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // render objects first by z-index, then by ascending (top to bottom) y order
        objs.sort(function (a: Obj, b: Obj): number {
            var zDiff = a.zIndex - b.zIndex;
            if (zDiff == 0) {
                return a.pos.y - b.pos.y;
            } else {
                return zDiff;
            }
        });

        for (var i: number = 0; i < objs.length; i++) {
            var obj: Obj = objs[i];
            var anim: Animation = obj.animMan.anims[obj.animMan.currentAnim];

			// For automatic anims only (so not npc's or the player or anything like that atm)
            if (!anim.static && anim.frameCounterMax > 0 && anim.frameCounter == (anim.frameCounterMax - 1))
				obj.animMan.rightFrame();

			anim.frameCounter = (anim.frameCounter + 1) % anim.frameCounterMax;
			this.ctx.drawImage(anim.image,
				obj.animMan.framePosition.x, obj.animMan.framePosition.y,
				anim.frameSize.x, anim.frameSize.y,
				obj.pos.x - anim.offset.x, obj.pos.y - anim.offset.y,
				anim.frameSize.x, anim.frameSize.y);

			// FPS Counter
			if (typeof (fps) !== undefined && fps != -1) {
				this.ctx.fillStyle = "#DD1321";
				this.ctx.font = "2em Inconsolata";
				this.ctx.fillText("fps: " + JSON.stringify(fps), this.canvas.width / 11, this.canvas.height / 11);
			}
		}
	}
    constructor() {
        this.canvas = <HTMLCanvasElement> document.getElementById("canvas");
        this.canvas.width = 1024;
        this.canvas.height = 600;
        $(this.canvas).css({"display":"block","width":"1024","height":"600","margin-left":"auto", "margin-right":"auto"});
        this.ctx = this.canvas.getContext("2d");
    }
}

class AnimationManager {
	public frame: number = 0;
	public framePosition: Vector2;
	public anims: Array<Animation>;
	public currentAnim: number;

	public nextAnim() {
		this.frame = 0;
		this.currentAnim = (this.currentAnim + 1) % this.anims.length;
	}

	public gotoNamedAnim(name: string) {
		for (var x: number = 0; x < this.anims.length; x++) {
			if (name == this.anims[x].name) {
				this.currentAnim = x;
				this.frame = 0;
				this.framePosition.x = this.frame * this.anims[this.currentAnim].frameSize.x;
				this.framePosition.y = Math.floor(this.frame / this.anims[this.currentAnim].sheetWidth);
				break;
			}
		}
	}

	public rightFrame() {
		if (!this.anims[this.currentAnim].static) {
			this.frame = (this.frame + 1) % this.anims[this.currentAnim].sheetWidth;
			this.framePosition.x = this.frame * this.anims[this.currentAnim].frameSize.x;
			this.framePosition.y = Math.floor(this.frame / this.anims[this.currentAnim].sheetWidth);
		}
	}

	public leftFrame() {
		if (!this.anims[this.currentAnim].static) {
			this.frame = (this.frame + 3) % this.anims[this.currentAnim].sheetWidth;
			this.framePosition.x = this.frame * this.anims[this.currentAnim].frameSize.x;
			this.framePosition.y = Math.floor(this.frame / this.anims[this.currentAnim].sheetWidth);
		}
	}

	public gotoFrame(frame: number) {
		if (frame > 0 && frame < this.anims[this.currentAnim].sheetWidth && !this.anims[this.currentAnim].static) {
			this.frame = frame;
			this.framePosition.x = this.frame * this.anims[this.currentAnim].frameSize.x;
			this.framePosition.y = Math.floor(this.frame / this.anims[this.currentAnim].sheetWidth);
		}
	}

	constructor(anims: Array<Animation>, currentAnim?: number) {
		this.anims = anims;
		this.currentAnim = (typeof (currentAnim) !== "undefined") ? currentAnim : 0;
		this.framePosition = new Vector2(0, 0);
	}
}

// Basic tile for each grid point on a floor
class GridTile {
    wall: boolean;
    door: boolean;
    type: RTypes;
    constructor() {
        this.wall = false;
        this.door = false;
        this.type = RTypes.FLOOR;
    }
}

// Floors in a building, contains a 2d array of GridTiles called grid
class Floor {
    public grid: Array<Array<GridTile>>;

    private partition(x: number, y: number, dir: number, floorSize: number): void {
        var length: number = 0;
        var start: Vector2 = new Vector2(x, y);

        // Return if coords are bad
        if (x < 0 || x > floorSize || y < 0 || y > floorSize) {
            console.warn("coords out of bounds");
            return;
        }

        // Return if too small
        var minLength: number = 3;
        var percent: number = 2;
        if (dir == 0) {
            for (var i: number = 0; i < minLength; i++)
                if (this.grid[x][y + i].wall) return;
            if (this.grid[x + 1][y + 1].wall || (this.grid[x + 2][y + 1].wall && (Math.random() * 10) > percent) || this.grid[x - 1][y + 1].wall || (this.grid[x - 2][y + 1].wall && (Math.random() * 10) > percent)) return;
        }
        else if (dir == 1) {
            for (var i: number = 0; i < minLength; i++)
                if (this.grid[x + i][y].wall) return;
            if (this.grid[x + 1][y + 1].wall || (this.grid[x + 1][y + 2].wall && (Math.random() * 10) > percent) || this.grid[x + 1][y - 1].wall || (this.grid[x + 1][y - 2].wall && (Math.random() * 10) > percent)) return;
        }
        else if (dir == 2) {
            for (var i: number = 0; i < minLength; i++)
                if (this.grid[x][y - i].wall) return;
            if (this.grid[x + 1][y - 1].wall || (this.grid[x + 2][y - 1].wall && (Math.random() * 10) > percent) || this.grid[x - 1][y - 1].wall || (this.grid[x - 2][y - 1].wall && (Math.random() * 10) > percent)) return;
        }
        else if (dir == 3) {
            for (var i: number = 0; i < minLength; i++)
                if (this.grid[x - i][y].wall) return;
            if (this.grid[x - 1][y + 1].wall || (this.grid[x - 1][y + 2].wall && (Math.random() * 10) > percent) || this.grid[x - 1][y - 1].wall || (this.grid[x - 1][y - 2].wall && (Math.random() * 10) > percent)) return;
        }

        // Make a wall until you hit another wall in the specified direction 
        while (!this.grid[x][y].wall) {
            this.grid[x][y].wall = !this.grid[x][y].wall;
            this.grid[x][y].type = RTypes.WALL;

            if (dir == 0) y++;
            else if (dir == 1) x++;
            else if (dir == 2) y--;
            else if (dir == 3) x--;

            length++;
        }
        length--; // All of the stuff runs the last time when it's on another wall

        // To move the door if a wall runs into a door (not for spawning from a door)
        if (dir == 0 && (y + 1 < floorSize) && this.grid[x][y].door) {
            this.grid[x][y].door = false;
            this.grid[x][y].type = RTypes.WALL;
            if (this.grid[x + 1][y + 1].wall) {
                this.grid[x - 1][y].door = true;
                this.grid[x - 1][y].type = RTypes.DOOR;
            }
            else {
                this.grid[x + 1][y].door = true;
                this.grid[x + 1][y].type = RTypes.DOOR;
            }
        } else if (dir == 1 && (x + 1 < floorSize) && this.grid[x][y].door) {
            this.grid[x][y].door = false;
            this.grid[x][y].type = RTypes.WALL;
            if (this.grid[x + 1][y + 1].wall) {
                this.grid[x][y - 1].door = true;
                this.grid[x][y - 1].type = RTypes.DOOR;
            }
            else {
                this.grid[x][y + 1].door = true;
                this.grid[x][y + 1].type = RTypes.DOOR;
            }
        } else if (dir == 2 && (y - 1 > 0) && this.grid[x][y].door) {
            this.grid[x][y].door = false;
            this.grid[x][y].type = RTypes.WALL;
            if (this.grid[x + 1][y - 1].wall) {
                this.grid[x - 1][y].door = true;
                this.grid[x - 1][y].type = RTypes.DOOR;
            }
            else {
                this.grid[x + 1][y].door = true;
                this.grid[x + 1][y].type = RTypes.DOOR;
            }
        } else if (dir == 3 && (x - 1 > 0) && this.grid[x][y].door) {
            this.grid[x][y].door = false;
            this.grid[x][y].type = RTypes.WALL;
            if (this.grid[x - 1][y + 1].wall) {
                this.grid[x][y - 1].door = true;
                this.grid[x][y - 1].type = RTypes.DOOR;
            }
            else {
                this.grid[x][y + 1].door = true;
                this.grid[x][y + 1].type = RTypes.DOOR;
            }
        }

        // Make a door in the middle-ish
        var door1 = Math.floor((Math.random() * (length * (2 / 3))) + (length / 6));
        var door2 = -1;

        // If big enough, take split the wall in half and put the doors on opposite ends
        if (length > floorSize / 2) {
            door1 = Math.floor((Math.random() * ((length / 2) * (2 / 3))) + ((length / 2) / 6));
            door2 = Math.floor((Math.random() * ((length / 2) * (2 / 3))) + ((length / 2) / 6) + (length / 2));
        }

        // Get new coords
        var newCord1: number = door1;
        var newCord2: number = door1;

        while (newCord1 == door1 || newCord1 == door2) {
            newCord1 = Math.floor((Math.random() * (length * (2 / 3))) + (length / 6));
        }
        while (newCord2 == door1 || newCord2 == door2) {
            newCord2 = Math.floor((Math.random() * (length * (2 / 3))) + (length / 6));
        }

        // Fix values for directions 
        if (dir == 2 || dir == 3) {
            newCord1 *= -1;
            newCord2 *= -1;
        }
        if (dir == 2 || dir == 3) {
            door1 *= -1;
            door2 *= -1;
        }

        // Set door
        if (dir == 0 || dir == 2) {
            this.grid[x][start.y + door1].door = true;
            this.grid[x][start.y + door1].type = RTypes.DOOR;
            if (length > (floorSize * .75)) {
                this.grid[x][start.y + door2].door = true;
                this.grid[x][start.y + door2].type = RTypes.DOOR;
            }
            else if (length > (floorSize / 2) && ((Math.random() * 10) > 2.5)) {
                this.grid[x][start.y + door2].door = true;
                this.grid[x][start.y + door2].type = RTypes.DOOR;
            }
        }
        else if (dir == 1 || dir == 3) {
            this.grid[start.x + door1][y].door = true;
            this.grid[start.x + door1][y].type = RTypes.DOOR;
            if (length > (floorSize * .75)) {
                this.grid[start.x + door2][y].door = true;
                this.grid[start.x + door2][y].type = RTypes.DOOR;
            }
            else if (length > (floorSize / 2) && ((Math.random() * 10) > 2.5)) {
                this.grid[start.x + door2][y].door = true;
                this.grid[start.x + door2][y].type = RTypes.DOOR;
            }
        }

        // Do the recursion
        // Recursive x
        if (dir == 0 || dir == 2) {
            // Recurse right
            this.partition(x + 1, start.y + newCord1, 1, floorSize);
            // Recurse left
            this.partition(x - 1, start.y + newCord2, 3, floorSize);
        }
        // Recursive y
        else if (dir == 1 || dir == 3) {
            // Recurse up
            this.partition(start.x + newCord1, y + 1, 0, floorSize);
            // Recurse down
            this.partition(start.x + newCord2, y - 1, 2, floorSize);
        }
    }

    constructor(floorSize: number) {
        this.grid = [];
        
        for (var j: number = 0; j <= floorSize; j++) {
            this.grid[j] = [];
            for (var k: number = 0; k <= floorSize; k++) {
                this.grid[j][k] = new GridTile();
                this.grid[j][k].wall = (j == 0 || j == floorSize) ? true : (k == 0 || k == floorSize) ? true : false;
                this.grid[j][k].type = (j == 0 || j == floorSize) ? RTypes.WALL : (k == 0 || k == floorSize) ? RTypes.WALL : RTypes.FLOOR;
            }
        }

        var dir = Math.round(Math.random());
        var x: number = (dir == 0) ? Math.floor(Math.random() * (((floorSize - 1) / 2) + 1) + (floorSize / 4)) : 1;
        var y: number = (dir == 1) ? Math.floor(Math.random() * (((floorSize - 1) / 2) + 1) + (floorSize / 4)) : 1;
        this.partition(x, y, dir, floorSize);
    }
}

// Top level object, post: building complete with floors and rooms
class Building {
    floors: Array<Floor>;
    numFloors: number;
    collisionMap: Array<Array<Array<string>>>;

    constructor(floorSize: number, assets: AssetManager) {
        this.floors = [];
        this.numFloors = (Math.floor(Math.random() * 8)) + 10; // Anywhere from 10-18 floors

        for (var i: number = 0; i < this.numFloors; i++) {
            this.floors[i] = new Floor(floorSize);
        }

        var tempArr = [];
        var tempCollish = [];
        this.collisionMap = [];
        for (var i = 0; i < this.numFloors; i++) {
            this.collisionMap[i] = [];
            for (var x = 0; x < this.floors[i].grid.length; x++) {
                for (var y = 0; y < this.floors[i].grid.length; y++) {
                    tempCollish.push((this.floors[i].grid[y][x].type == RTypes.WALL) ? new CollisionTile(gridToScreen(y, x).x, gridToScreen(y, x).y, [assets.anims["filled"]]) : new CollisionTile(gridToScreen(y, x).x, gridToScreen(y, x).y, [assets.anims["empty"]]));
                }
                this.collisionMap[i].push(tempCollish);
                tempCollish = [];
            }
        }

        return this;
    }
}