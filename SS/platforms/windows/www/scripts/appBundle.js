// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var SS;
(function (SS) {
    "use strict";
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        }
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }
        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }
    })(Application = SS.Application || (SS.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
})(SS || (SS = {}));
// Platform specific overrides will be placed in the merges folder versions of this file 
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
function randBetween(low, high, int) {
    if (int === void 0) { int = false; }
    if (int == false) {
        return Math.random() * (high - low) + low;
    }
    else if (int == true) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }
}
function cmpVector2(a, b) {
    if (a.x == b.x && a.y == b.y)
        return true;
    return false;
}
function collide(temp, NPCs) {
    for (var ind = 0; ind < NPCs.length; ind++) {
        if (cmpVector2(temp, NPCs[ind].gPos))
            return true;
        return false;
    }
}
var Vector2 = (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vector2;
})();
var Input = (function () {
    function Input() {
        this.bMouseClicked = false;
        this.mouseClickPos = new Vector2(-1, -1);
        this.keyPresses = new Array("");
    }
    return Input;
})();
var Animation = (function () {
    function Animation(st, width, height, off_x, off_y) {
        this.bStatic = st;
        this.frameSize = new Vector2(width, height);
        this.offset = new Vector2(off_x, off_y);
    }
    Animation.prototype.translate = function (ofst) {
        this.offset = ofst;
    };
    Animation.prototype.setImage = function (img) {
        this.image = img;
        this.sheetWidth = Math.floor(img.width / this.frameSize.x);
    };
    return Animation;
})();
var Obj = (function () {
    function Obj(x, y, anim) {
        this.pos = new Vector2(x, y);
        this.currAnim = anim;
        this.animFrame = 0;
        this.zIndex = 0;
        this.interactable = false;
    }
    // The "?" denotes an optional parameter, for those objects that don't need a vector2 it's not passed in
    Obj.prototype.tick = function (input, astar, p) {
        console.warn("calling undefined behavior");
    };
    Obj.prototype.setZ = function (z) {
        this.zIndex = z;
    };
    return Obj;
})();
var Interactable = (function (_super) {
    __extends(Interactable, _super);
    // Other stuff maybe, idk
    function Interactable(x, y, z) {
        _super.call(this, x, y);
        this.interactable = true;
        this.bStatic = true;
        this.zIndex = z;
    }
    return Interactable;
})(Obj);
var CollisionTile = (function (_super) {
    __extends(CollisionTile, _super);
    function CollisionTile(x, y, anim) {
        _super.call(this, x, y);
        this.bStatic = true;
        this.currAnim = anim;
        this.zIndex = 3;
    }
    return CollisionTile;
})(Obj);
var FloorTile = (function (_super) {
    __extends(FloorTile, _super);
    function FloorTile(x, y) {
        _super.call(this, x, y);
        this.bStatic = true;
        this.currAnim = "floor";
    }
    FloorTile.prototype.tick = function () {
        this.pos.x++;
    };
    return FloorTile;
})(Obj);
var WallTile = (function (_super) {
    __extends(WallTile, _super);
    function WallTile(x, y) {
        _super.call(this, x, y);
        this.bStatic = true;
        this.currAnim = "wall";
        this.zIndex = 5;
    }
    return WallTile;
})(Obj);
var DoorTile = (function (_super) {
    __extends(DoorTile, _super);
    function DoorTile(x, y) {
        _super.call(this, x, y);
        this.bStatic = true;
        this.currAnim = "door";
        this.zIndex = 5;
    }
    return DoorTile;
})(Obj);
function gridToScreen(xOrVect, y) {
    var out;
    if (typeof xOrVect != "number")
        out = new Vector2((600 + 32 * xOrVect.x - 32 * xOrVect.y) - 87, (16 * xOrVect.x + 16 * xOrVect.y) + 44);
    else
        out = new Vector2((600 + 32 * xOrVect - 32 * y) - 87, (16 * xOrVect + 16 * y) + 44);
    return out;
}
function div(a, b) {
    return (~~(a / b)) * b;
}
//function screenToGrid(x: number, y: number) {
//    var out = new Vector2(Math.round((((x / 32) - 18.75 + (y / 16)) / 2) - 2.72), Math.round(((18.75 + (y / 16) - (x / 32)) / 2)) - 2.75);
//    return out;
//}
function lerp(start, end, speed) {
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var len = Math.sqrt(dx * dx + dy * dy);
    if (speed >= len) {
        return new Vector2(end.x, end.y);
    }
    else {
        dx *= speed / len;
        dy *= speed / len;
        return new Vector2(start.x + dx, start.y + dy);
    }
}
var RTypes;
(function (RTypes) {
    RTypes[RTypes["FLOOR"] = 0] = "FLOOR";
    RTypes[RTypes["WALL"] = 1] = "WALL";
    RTypes[RTypes["DOOR"] = 2] = "DOOR";
})(RTypes || (RTypes = {}));
;
var AssetManager = (function () {
    function AssetManager(ctx, canvas) {
        // Loading Bar Vars
        this.barTickSize = 0;
        this.totalBar = 0;
        this.total = 0;
        this.remainder = 0;
        this.curr = 0;
        // Arrays of anims, images, and audio
        this.images = {};
        this.imageURLs = {
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
            npcIdleD: "images/npcStatDown.png",
            npcIdleL: "images/npcStatLeft.png",
            npcIdleU: "images/npcStatUp.png",
            npcIdleR: "images/npcStatRight.png",
            npcIdleDSeen: "images/npcStatDown.png",
            npcIdleLSeen: "images/npcStatLeft.png",
            npcIdleUSeen: "images/npcStatUp.png",
            npcIdleRSeen: "images/npcStatRight.png",
        };
        this.anims = {
            none: new Animation(true, 64, 32, 32, 16),
            floor: new Animation(true, 64, 32, 32, 16),
            wall: new Animation(true, 64, 64, 32, 48),
            teleporter: new Animation(true, 64, 48, 32, 32),
            playerIdleD: new Animation(true, 64, 64, 32, 44),
            playerIdleL: new Animation(true, 64, 64, 32, 44),
            playerIdleU: new Animation(true, 64, 64, 32, 44),
            playerWalkD: new Animation(true, 64, 64, 32, 64),
            playerWalkL: new Animation(true, 64, 64, 32, 64),
            playerWalkU: new Animation(true, 64, 64, 32, 64),
            filled: new Animation(true, 64, 32, 32, 16),
            empty: new Animation(true, 64, 32, 32, 16),
            npcFollow: new Animation(true, 64, 64, 32, 40),
            npcIdleD: new Animation(true, 64, 64, 32, 40),
            npcIdleL: new Animation(true, 64, 64, 32, 40),
            npcIdleU: new Animation(true, 64, 64, 32, 40),
            npcIdleR: new Animation(true, 64, 64, 32, 40),
            npcIdleDSeen: new Animation(true, 64, 64, 32, 60),
            npcIdleLSeen: new Animation(true, 64, 64, 32, 60),
            npcIdleUSeen: new Animation(true, 64, 64, 32, 60),
            npcIdleRSeen: new Animation(true, 64, 64, 32, 60),
        };
        this.audio = {}; // Can't do : Array<HTMLAudioElement> because that doesn't support .addEventListener() for some odd reason
        this.audioURLs = {
            "main": "sounds/SneakySnake Theme.wav",
        };
        // Loading bar canvas vars;
        this.x = 0;
        this.y = 0;
        this.height = 0;
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
    // Updates the loading bar when asset is loaded
    AssetManager.prototype.updateBar = function (ctx, canvas) {
        this.curr++;
        // Loading bar
        this.totalBar += this.barTickSize;
        ctx.fillStyle = "black";
        var width = Math.floor(this.totalBar);
        if (this.curr >= this.total)
            width += this.remainder;
        ctx.fillRect(this.x, this.y, width, this.height);
        // Custom even handled in game.ts to start the game when all assets have loaded
        $("body").trigger("assetLoaded", { "num": this.curr });
    };
    AssetManager.prototype.preloader = function (ctx, canvas) {
        var that = this;
        for (var i in this.imageURLs) {
            this.images[i] = new Image();
            this.images[i].onload = function () {
                that.updateBar(ctx, canvas);
            };
            this.images[i].src = this.imageURLs[i];
            this.imagesLength++;
        }
        for (var i in this.anims) {
            this.anims[i].setImage(this.images[i]);
        }
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
    };
    AssetManager.prototype.removeAssets = function () {
        for (var i = this.audio.length - 1; i >= 0; i--)
            $(this.audio[0]).remove();
        for (var i = this.imagesLength - 1; i >= 0; i--)
            $(this.images[0]).remove();
    };
    return AssetManager;
})();
var Renderer = (function () {
    function Renderer() {
        this.canvas = document.getElementById("canvas");
        this.canvas.width = 1024;
        this.canvas.height = 600;
        $(this.canvas).css({ "display": "block", "width": "1024", "height": "600", "margin-left": "auto", "margin-right": "auto" });
        this.ctx = this.canvas.getContext("2d");
    }
    Renderer.prototype.draw = function (objs, anims) {
        // draw background
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // render objects first by z-index, then by ascending (top to bottom) y order
        objs.sort(function (a, b) {
            var zDiff = a.zIndex - b.zIndex;
            if (zDiff == 0) {
                return a.pos.y - b.pos.y;
            }
            else {
                return zDiff;
            }
        });
        for (var i = 0; i < objs.length; i++) {
            var obj = objs[i];
            var anim = anims[obj.currAnim];
            var framePosition = new Vector2(0, 0);
            if (!anim.bStatic) {
                framePosition.x = obj.animFrame % anim.sheetWidth;
                framePosition.y = Math.floor(obj.animFrame / anim.sheetWidth);
            }
            this.ctx.drawImage(anim.image, framePosition.x, framePosition.y, anim.frameSize.x, anim.frameSize.y, obj.pos.x - anim.offset.x, obj.pos.y - anim.offset.y, anim.frameSize.x, anim.frameSize.y);
        }
    };
    return Renderer;
})();
// Basic tile for each grid point on a floor
var GridTile = (function () {
    function GridTile() {
        this.wall = false;
        this.door = false;
        this.type = 0 /* FLOOR */;
    }
    return GridTile;
})();
// Floors in a building, contains a 2d array of GridTiles called grid
var Floor = (function () {
    function Floor(floorSize) {
        this.grid = [];
        for (var j = 0; j <= floorSize; j++) {
            this.grid[j] = [];
            for (var k = 0; k <= floorSize; k++) {
                this.grid[j][k] = new GridTile();
                this.grid[j][k].wall = (j == 0 || j == floorSize) ? true : (k == 0 || k == floorSize) ? true : false;
                this.grid[j][k].type = (j == 0 || j == floorSize) ? 1 /* WALL */ : (k == 0 || k == floorSize) ? 1 /* WALL */ : 0 /* FLOOR */;
            }
        }
        var dir = Math.round(Math.random());
        var x = (dir == 0) ? Math.floor(Math.random() * (((floorSize - 1) / 2) + 1) + (floorSize / 4)) : 1;
        var y = (dir == 1) ? Math.floor(Math.random() * (((floorSize - 1) / 2) + 1) + (floorSize / 4)) : 1;
        this.partition(x, y, dir, floorSize);
    }
    Floor.prototype.partition = function (x, y, dir, floorSize) {
        var length = 0;
        var start = { x: x, y: y };
        // Return if coords are bad
        if (x < 0 || x > floorSize || y < 0 || y > floorSize) {
            console.warn("coords out of bounds");
            return;
        }
        // Return if too small
        var minLength = 3;
        var percent = 2;
        if (dir == 0) {
            for (var i = 0; i < minLength; i++)
                if (this.grid[x][y + i].wall)
                    return;
            if (this.grid[x + 1][y + 1].wall || (this.grid[x + 2][y + 1].wall && (Math.random() * 10) > percent) || this.grid[x - 1][y + 1].wall || (this.grid[x - 2][y + 1].wall && (Math.random() * 10) > percent))
                return;
        }
        else if (dir == 1) {
            for (var i = 0; i < minLength; i++)
                if (this.grid[x + i][y].wall)
                    return;
            if (this.grid[x + 1][y + 1].wall || (this.grid[x + 1][y + 2].wall && (Math.random() * 10) > percent) || this.grid[x + 1][y - 1].wall || (this.grid[x + 1][y - 2].wall && (Math.random() * 10) > percent))
                return;
        }
        else if (dir == 2) {
            for (var i = 0; i < minLength; i++)
                if (this.grid[x][y - i].wall)
                    return;
            if (this.grid[x + 1][y - 1].wall || (this.grid[x + 2][y - 1].wall && (Math.random() * 10) > percent) || this.grid[x - 1][y - 1].wall || (this.grid[x - 2][y - 1].wall && (Math.random() * 10) > percent))
                return;
        }
        else if (dir == 3) {
            for (var i = 0; i < minLength; i++)
                if (this.grid[x - i][y].wall)
                    return;
            if (this.grid[x - 1][y + 1].wall || (this.grid[x - 1][y + 2].wall && (Math.random() * 10) > percent) || this.grid[x - 1][y - 1].wall || (this.grid[x - 1][y - 2].wall && (Math.random() * 10) > percent))
                return;
        }
        while (!this.grid[x][y].wall) {
            this.grid[x][y].wall = !this.grid[x][y].wall;
            this.grid[x][y].type = 1 /* WALL */;
            if (dir == 0)
                y++;
            else if (dir == 1)
                x++;
            else if (dir == 2)
                y--;
            else if (dir == 3)
                x--;
            length++;
        }
        length--; // All of the stuff runs the last time when it's on another wall
        // To move the door if a wall runs into a door (not for spawning from a door)
        if (dir == 0 && (y + 1 < floorSize) && this.grid[x][y].door) {
            this.grid[x][y].door = false;
            this.grid[x][y].type = 1 /* WALL */;
            if (this.grid[x + 1][y + 1].wall) {
                this.grid[x - 1][y].door = true;
                this.grid[x - 1][y].type = 2 /* DOOR */;
            }
            else {
                this.grid[x + 1][y].door = true;
                this.grid[x + 1][y].type = 2 /* DOOR */;
            }
        }
        else if (dir == 1 && (x + 1 < floorSize) && this.grid[x][y].door) {
            this.grid[x][y].door = false;
            this.grid[x][y].type = 1 /* WALL */;
            if (this.grid[x + 1][y + 1].wall) {
                this.grid[x][y - 1].door = true;
                this.grid[x][y - 1].type = 2 /* DOOR */;
            }
            else {
                this.grid[x][y + 1].door = true;
                this.grid[x][y + 1].type = 2 /* DOOR */;
            }
        }
        else if (dir == 2 && (y - 1 > 0) && this.grid[x][y].door) {
            this.grid[x][y].door = false;
            this.grid[x][y].type = 1 /* WALL */;
            if (this.grid[x + 1][y - 1].wall) {
                this.grid[x - 1][y].door = true;
                this.grid[x - 1][y].type = 2 /* DOOR */;
            }
            else {
                this.grid[x + 1][y].door = true;
                this.grid[x + 1][y].type = 2 /* DOOR */;
            }
        }
        else if (dir == 3 && (x - 1 > 0) && this.grid[x][y].door) {
            this.grid[x][y].door = false;
            this.grid[x][y].type = 1 /* WALL */;
            if (this.grid[x - 1][y + 1].wall) {
                this.grid[x][y - 1].door = true;
                this.grid[x][y - 1].type = 2 /* DOOR */;
            }
            else {
                this.grid[x][y + 1].door = true;
                this.grid[x][y + 1].type = 2 /* DOOR */;
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
        var newCord1 = door1;
        var newCord2 = door1;
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
            this.grid[x][start.y + door1].type = 2 /* DOOR */;
            if (length > (floorSize * .75)) {
                this.grid[x][start.y + door2].door = true;
                this.grid[x][start.y + door2].type = 2 /* DOOR */;
            }
            else if (length > (floorSize / 2) && ((Math.random() * 10) > 2.5)) {
                this.grid[x][start.y + door2].door = true;
                this.grid[x][start.y + door2].type = 2 /* DOOR */;
            }
        }
        else if (dir == 1 || dir == 3) {
            this.grid[start.x + door1][y].door = true;
            this.grid[start.x + door1][y].type = 2 /* DOOR */;
            if (length > (floorSize * .75)) {
                this.grid[start.x + door2][y].door = true;
                this.grid[start.x + door2][y].type = 2 /* DOOR */;
            }
            else if (length > (floorSize / 2) && ((Math.random() * 10) > 2.5)) {
                this.grid[start.x + door2][y].door = true;
                this.grid[start.x + door2][y].type = 2 /* DOOR */;
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
        else if (dir == 1 || dir == 3) {
            // Recurse up
            this.partition(start.x + newCord1, y + 1, 0, floorSize);
            // Recurse down
            this.partition(start.x + newCord2, y - 1, 2, floorSize);
        }
    };
    return Floor;
})();
// Top level object, post: building complete with floors and rooms
var Building = (function () {
    function Building(floorSize) {
        this.floors = [];
        this.numFloors = (Math.floor(Math.random() * 8)) + 10; // Anywhere from 10-18 floors
        for (var i = 0; i < this.numFloors; i++) {
            this.floors[i] = new Floor(floorSize);
        }
        var tempArr = [];
        var tempCollish = [];
        this.collisionMap = [];
        for (var i = 0; i < this.numFloors; i++) {
            this.collisionMap[i] = [];
            for (var x = 0; x < this.floors[i].grid.length; x++) {
                for (var y = 0; y < this.floors[i].grid.length; y++) {
                    tempCollish.push((this.floors[i].grid[y][x].type == 1 /* WALL */) ? new CollisionTile(gridToScreen(y, x).x, gridToScreen(y, x).y, "filled") : new CollisionTile(gridToScreen(y, x).x, gridToScreen(y, x).y, "empty"));
                }
                this.collisionMap[i].push(tempCollish);
                tempCollish = [];
            }
        }
        return this;
    }
    return Building;
})();
/// <reference path="ArgyleEngine.ts"/>
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(x, y) {
        _super.call(this, x, y);
        this.bStatic = false;
        this.speed = 2.5;
        this.health = 1;
        this.controls = ["s", "a", "w", "d"];
        this.pos = new Vector2(x, y);
        this.gDestination = new Vector2(1, 1);
        this.sDestination = new Vector2(x, y);
        this.tempDestination = new Vector2(1, 1);
        this.previousLoc = [new Vector2(1, 1), new Vector2(1, 1), new Vector2(1, 1), new Vector2(1, 1), new Vector2(1, 1)];
        this.currAnim = "playerIdleD";
        this.animFrame = 0;
        this.zIndex = 5;
        this.bCanLerp = true;
        this.following = [];
    }
    Player.prototype.tick = function (input, collisionmap) {
        // Make sure the player is allowed to  move right now
        if (this.bCanLerp == true) {
            this.gDestination.x = this.tempDestination.x;
            this.gDestination.y = this.tempDestination.y;
            if (!cmpVector2(this.gDestination, this.previousLoc[0]))
                this.previousLoc = new Array(new Vector2(this.gDestination.x, this.gDestination.y)).concat(this.previousLoc.slice()); //.push(new Vector2(this.gDestination.x, this.gDestination.y));
            if (this.previousLoc.length > 500)
                this.previousLoc.splice(0, 1); // FIFO, remove the first if the array is too long to prevent memory leaks
            this.sDestination = gridToScreen(this.gDestination.x, this.gDestination.y);
            if (!cmpVector2(this.pos, this.sDestination)) {
                // Change the animation depending on which way the character is moving
                if (this.lastKey === this.controls[0])
                    this.currAnim = "playerWalkL";
                else if (this.lastKey === this.controls[1])
                    this.currAnim = "playerWalkU";
                else if (this.lastKey === this.controls[2])
                    this.currAnim = "playerWalkU";
                else if (this.lastKey === this.controls[3])
                    this.currAnim = "playerWalkD";
                this.pos = lerp(this.pos, this.sDestination, this.speed);
            }
            else {
                // If the player isn't moving, change the anim to the correct idle anim
                if (input.keyPresses.length == 0) {
                    this.tempDestination.x = this.gDestination.x;
                    this.tempDestination.y = this.gDestination.y;
                    if (this.lastKey === this.controls[0])
                        this.currAnim = "playerIdleL";
                    else if (this.lastKey === this.controls[1])
                        this.currAnim = "playerIdleU";
                    else if (this.lastKey === this.controls[2])
                        this.currAnim = "playerIdleU";
                    else if (this.lastKey === this.controls[3])
                        this.currAnim = "playerIdleD";
                }
            }
        }
        else {
            // This is dumb, I know but if they're not allowed to lerp then they also need to go back to idle anims
            if (input.keyPresses.length == 0) {
                this.tempDestination.x = this.gDestination.x;
                this.tempDestination.y = this.gDestination.y;
                if (this.lastKey === this.controls[0])
                    this.currAnim = "playerIdleL";
                else if (this.lastKey === this.controls[1])
                    this.currAnim = "playerIdleU";
                else if (this.lastKey === this.controls[2])
                    this.currAnim = "playerIdleU";
                else if (this.lastKey === this.controls[3])
                    this.currAnim = "playerIdleD";
            }
        }
        if (input.keyPresses.length > 0 && cmpVector2(this.pos, this.sDestination)) {
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
    };
    return Player;
})(Obj);
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
        this.sight = 4;
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
    // Function to see if the player has crossed the npc's vision and to change the anim
    NPC.prototype.look = function (target, collision) {
        this.temp = new Vector2(this.gPos.x, this.gPos.y);
        switch (this.currAnim) {
            case "npcIdleD":
                // Make sure the npc can actually see the player, no walls in the way and not out of range ( 4 )
                if (target.x > this.gPos.x && target.y == this.gPos.y) {
                    this.superTemp = 0;
                    for (this.temp.x, this.superTemp; target.x > this.temp.x && this.superTemp <= this.sight; this.temp.x++, this.superTemp++) {
                        if (collision[this.temp.y][this.temp.x].currAnim === "filled" || this.superTemp === this.sight)
                            return;
                    }
                    // If the npc can actually see the player, change the anim to the seen anim and set the flag
                    this.seen = true;
                    this.currAnim = "npcIdleDSeen";
                }
                break;
            case "npcIdleL":
                if (target.x == this.gPos.x && target.y > this.gPos.y) {
                    this.superTemp = 0;
                    for (this.temp.y; target.y > this.temp.y && this.superTemp <= this.sight; this.temp.y++, this.superTemp++) {
                        if (collision[this.temp.y][this.temp.x].currAnim === "filled" || this.superTemp === this.sight)
                            return;
                    }
                    this.seen = true;
                    this.currAnim = "npcIdleLSeen";
                }
                break;
            case "npcIdleR":
                if (target.x == this.gPos.x && target.y < this.gPos.y) {
                    this.superTemp = 0;
                    for (this.temp.y; target.y < this.temp.y && this.superTemp <= this.sight; this.temp.y--, this.superTemp++) {
                        if (collision[this.temp.y][this.temp.x].currAnim === "filled" || this.superTemp === this.sight)
                            return;
                    }
                    this.seen = true;
                    this.currAnim = "npcIdleRSeen";
                }
                break;
            case "npcIdleU":
                if (target.x < this.gPos.x && target.y == this.gPos.y) {
                    this.superTemp = 0;
                    for (this.temp.x; target.x < this.temp.x && this.superTemp <= this.sight; this.temp.x--, this.superTemp++) {
                        if (collision[this.temp.y][this.temp.x].currAnim === "filled" || this.superTemp === this.sight)
                            return;
                    }
                    this.seen = true;
                    this.currAnim = "npcIdleUSeen";
                }
                break;
        }
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
        this.turning = Math.floor(Math.random() * 125);
        if (this.turning == 0) {
            if (this.sightType == 0) {
                this.rot++;
                if (this.rot > 3)
                    this.rot = 0;
            }
            else if (this.sightType == 1) {
                this.rot--;
                if (this.rot < 0)
                    this.rot = 3;
            }
            else if (this.sightType == 2) {
                this.rot += (Math.round(Math.random())) ? 1 : -1;
                if (this.rot < 0)
                    this.rot = 3;
                else if (this.rot > 3)
                    this.rot = 0;
            }
        }
    };
    // Change the anim to the correct idle anim
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
        // If the player walks over the npc, add the npc to the player and increase the players speed
        if (cmpVector2(p.pos, this.pos) && !this.bFollowing) {
            this.setfollowIndex(p.following.length + 1);
            p.following.push(this);
            this.bFollowing = true;
            p.speed += .1;
        }
        // If the npc is supposed to be following the player, change the anim to the following anim
        if (this.bFollowing) {
            this.followPlayer(p);
            this.currAnim = "npcFollow";
        }
        else if (!this.seen) {
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
/// <reference path="ArgyleEngine.ts"/>
var Teleporter = (function (_super) {
    __extends(Teleporter, _super);
    // Pretty basic, just needs to be here for clarity in the rest of the code, maybe it'll have code of it's own at some point but not for now
    function Teleporter(x, y, anim) {
        _super.call(this, x, y, anim);
        this.zIndex = 5;
    }
    return Teleporter;
})(Obj);
/// <reference path="ArgyleEngine.ts"/>
/// <reference path="player.ts"/>
/// <reference path="NPC.ts"/>
/// <reference path="Teleporter.ts"/>
var OHDHGame = (function () {
    function OHDHGame() {
        this.interval = 15;
        this.currentFloor = 0;
        this.floorSize = 15;
        this.world = this.worldGen();
        this.viewWorld(this.world);
        this.renderer = new Renderer();
        this.assetmanager = new AssetManager(this.renderer.ctx, this.renderer.canvas);
        this.staticObjs = [];
        this.dynamicObjs = [];
        this.pickupObjs = [];
        this.interactableObjs = [];
        this.collisionMap = this.world.collisionMap;
        this.numNPC = 3;
        this.NPCs = [];
        var that = this;
        this.input = new Input;
        // Handle input
        $(this.renderer.canvas).click(function (e) {
            that.input.bMouseClicked = true;
            that.input.mouseClickPos.x = e.pageX;
            that.input.mouseClickPos.y = e.pageY;
        });
        // Bind key inputs
        $(window).keyup(function (e) {
            if (e.which == 87)
                that.input.keyPresses.push("w");
            else if (e.which == 65)
                that.input.keyPresses.push("a");
            else if (e.which == 83)
                that.input.keyPresses.push("s");
            else if (e.which == 68)
                that.input.keyPresses.push("d");
            else if (e.which == 77) {
                if (that.assetmanager.audio.main.paused)
                    that.assetmanager.audio.main.play();
                else
                    that.assetmanager.audio.main.pause();
            }
            else if (e.which == 82)
                that.restartGame();
            else if (e.which == 84)
                that.toggleControls();
        });
    }
    OHDHGame.prototype.setupFloor = function () {
        this.player.pos = gridToScreen(1, 1);
        this.player.sDestination = gridToScreen(1, 1);
        this.player.gDestination = new Vector2(1, 1);
        this.player.tempDestination = new Vector2(1, 1);
        this.player.previousLoc = [new Vector2(1, 1)];
        for (var i = 0; i < this.player.following.length + 1; i++)
            this.player.previousLoc.push(new Vector2(1, 1));
        // Set up floor tiles
        var floor = this.world.floors[this.currentFloor];
        this.staticObjs = [];
        for (var y = 0; y < floor.grid.length; y++) {
            for (var x = 0; x < floor.grid[y].length; x++) {
                var screen_coords = gridToScreen(x, y);
                if (floor.grid[x][y].type == 0 /* FLOOR */) {
                    var tile = new FloorTile(screen_coords.x, screen_coords.y);
                    tile.setZ(-1);
                    this.staticObjs.push(tile);
                }
                else if (floor.grid[x][y].type == 1 /* WALL */) {
                    this.staticObjs.push(new WallTile(screen_coords.x, screen_coords.y));
                }
                else if (floor.grid[x][y].type == 2 /* DOOR */) {
                    this.staticObjs.push(new FloorTile(screen_coords.x, screen_coords.y));
                }
            }
        }
        // Spawn teleporter to next level
        tempx = Math.floor(Math.random() * this.floorSize);
        tempy = Math.floor(Math.random() * this.floorSize);
        while (floor.grid[tempx][tempy].type == 1 /* WALL */) {
            tempx = Math.floor(Math.random() * this.floorSize);
            tempy = Math.floor(Math.random() * this.floorSize);
        }
        this.tempi = gridToScreen(tempx, tempy);
        this.currTeleporter = new Teleporter(this.tempi.x, this.tempi.y, "teleporter");
        // Spawn NPC's
        var tempx = Math.floor(Math.random() * this.floorSize);
        var tempy = Math.floor(Math.random() * this.floorSize);
        // Move followers (if any) to 1,1
        var tempNPC = [];
        for (var i = 0; i < this.NPCs.length; i++)
            if (this.NPCs[i].bFollowing) {
                this.NPCs[i].pos = gridToScreen(1, 1);
                tempNPC.push(this.NPCs[i]);
            }
        this.NPCs = tempNPC;
        var tempVect = new Vector2(0, 0);
        for (var i = randBetween(this.numNPC, this.numNPC - 3); i > 0; i--) {
            tempx = Math.floor(Math.random() * this.floorSize);
            tempy = Math.floor(Math.random() * this.floorSize);
            tempVect = new Vector2(tempx, tempy);
            while (floor.grid[tempx][tempy].type == 1 /* WALL */ || collide(tempVect, this.NPCs) || cmpVector2(gridToScreen(tempVect), this.currTeleporter.pos) || (tempVect.x < 6 && tempVect.y == 1) || (tempVect.x == 1 && tempVect.y < 6)) {
                tempx = Math.floor(Math.random() * this.floorSize);
                tempy = Math.floor(Math.random() * this.floorSize);
                tempVect = new Vector2(tempx, tempy);
            }
            this.tempi = gridToScreen(tempx, tempy);
            this.NPCs.push(new NPC(this.tempi.x, this.tempi.y, tempx, tempy, 5));
        }
    };
    OHDHGame.prototype.toggleControls = function () {
        if (this.player.controls[0] == "s")
            this.player.controls = ["a", "w", "d", "s"];
        else
            this.player.controls = ["s", "a", "w", "d"];
    };
    OHDHGame.prototype.restartGame = function () {
        // Stop the tick function from ticking
        clearInterval(this.tickID);
        // Make new world
        this.world = this.worldGen();
        // Reset everything
        this.staticObjs = [];
        this.dynamicObjs = [];
        this.pickupObjs = [];
        this.interactableObjs = [];
        this.collisionMap = this.world.collisionMap;
        this.numNPC = 3;
        this.NPCs = [];
        this.currentFloor = 0;
        this.input.keyPresses = [];
        ;
        // Run the function to start a new game
        this.startGame();
    };
    OHDHGame.prototype.worldGen = function () {
        // Makes a new world
        return new Building(this.floorSize);
    };
    OHDHGame.prototype.viewWorld = function (w) {
        var wall = "id ='wall";
        var door = "id ='door";
        for (var y = 0; y <= this.floorSize; y++) {
            var outP = "<p>";
            for (var x = 0; x <= this.floorSize; x++) {
                outP += "<span class='tileType" + ((w.floors[0].grid[x][y].wall) ? (w.floors[0].grid[x][y].door) ? "02" : "01" : "00") + "'" + " " + ((w.floors[0].grid[x][y].wall) ? (w.floors[0].grid[x][y].door) ? door : wall : "") + "'>";
                outP += (w.floors[0].grid[x][y].wall) ? (w.floors[0].grid[x][y].door) ? "02" : "01" : "00";
                outP += "</span>";
            }
            outP += "</p>";
            $(".output").prepend(outP);
            outP = "";
        }
        $(".tileType00").css({
            color: "black"
        });
        $(".tileType01").css({
            color: "#6C7A89",
            backgroundColor: "#6C7A89"
        });
        $(".tileType02").css({
            backgroundColor: "#CF000F",
            color: "#CF000F"
        });
    };
    OHDHGame.prototype.tick = function () {
        //game logic loop
        // Resets world if player is on a teleporter and thus needs to go to the next level
        if (cmpVector2(this.player.pos, this.player.sDestination) && cmpVector2(this.player.pos, this.currTeleporter.pos)) {
            this.currentFloor++;
            this.numNPC += 3;
            this.setupFloor();
            return;
        }
        // Draw objects
        this.tempTick = this.staticObjs.concat(this.dynamicObjs).concat(this.pickupObjs).concat(this.NPCs).concat(this.currTeleporter);
        this.tempTick.push(this.player);
        for (this.tempi = 0; this.tempi < this.NPCs.length; this.tempi++) {
            this.NPCs[this.tempi].tick(this.input, this.player, this.collisionMap[this.currentFloor]);
            if (this.NPCs[this.tempi].seen) {
                if (cmpVector2(this.player.pos, this.player.sDestination) && !cmpVector2(this.player.gDestination, this.NPCs[this.tempi].gPos)) {
                    this.player.health -= 1;
                }
                break;
            }
        }
        // Tick player
        this.player.tick(this.input, this.collisionMap);
        // Dissallows the player from moving through walls
        if (this.collisionMap[this.currentFloor][this.player.tempDestination.y][this.player.tempDestination.x].currAnim !== "filled")
            this.player.bCanLerp = true;
        else
            this.player.bCanLerp = false;
        // Render everything
        this.renderer.draw(this.tempTick, this.assetmanager.anims);
        // Clear inputs
        this.input.bMouseClicked = false;
        // Check end game (player has no health)
        if (this.player.health <= 0) {
            clearInterval(this.tickID);
            var that = this;
            setTimeout(function () {
                that.renderer.ctx.fillStyle = "#DD1321";
                that.renderer.ctx.font = "6.5em Inconsolata";
                that.renderer.ctx.fillText("You've been seen!", that.renderer.canvas.width / 8, that.renderer.canvas.height / 2);
                that.renderer.ctx.font = "3em Incosolata";
                that.renderer.ctx.fillText("Score: " + that.player.following.length, that.renderer.canvas.width / 2.4, that.renderer.canvas.height / 1.5);
            }, 400);
        }
    };
    OHDHGame.prototype.startGame = function () {
        // Create the player
        var playerLocation = gridToScreen(1, 1);
        this.player = new Player(playerLocation.x, playerLocation.y);
        // set up floor
        this.setupFloor();
        // Start tick function
        var self = this;
        this.tickID = setInterval(function () {
            self.tick();
        }, this.interval);
    };
    OHDHGame.prototype.unsubscribeClick = function () {
        $(this.renderer.canvas).unbind("click");
    };
    return OHDHGame;
})();
$(function game() {
    var game = new OHDHGame();
    $(".new").click(function () {
        // Restart the game if the button is pressed
        game.restartGame();
    });
    $(".control").click(function () {
        // Change control scheme from w moving to upper right to w moving to upper left
        game.toggleControls();
    });
    // Start game when all assets are loaded
    $("body").on("assetLoaded", function (e, d) {
        if (d.num >= game.assetmanager.total) {
            game.assetmanager.audio.main.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
            game.assetmanager.audio.main.play();
            game.startGame();
        }
    });
});
/// <reference path="ArgyleEngine.ts"/>
var HUD = (function () {
    function HUD() {
    }
    return HUD;
})();
//# sourceMappingURL=appBundle.js.map