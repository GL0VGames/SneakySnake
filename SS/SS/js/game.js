/// <reference path="ArgyleEngine.ts"/>
/// <reference path="Player.ts"/>
/// <reference path="NPC.ts"/>
/// <reference path="Teleporter.ts"/>
var SneakySnakeGame = (function () {
    function SneakySnakeGame() {
        this.interval = 15; // 15ms between frames, 66.6666666666667 frames/second
        this.fps = 0;
        this.lastFPS = 0;
        this.renderer = new Renderer();
        this.assetmanager = new AssetManager(this.renderer.ctx, this.renderer.canvas);
        this.currentFloor = 0;
        this.floorSize = 15;
        this.world = this.worldGen();
        this.viewWorld(this.world);
        this.staticObjs = [];
        this.dynamicObjs = [];
        this.collisionMap = this.world.collisionMap;
        this.numNPC = 3;
        this.NPCs = [];
        var that = this;
        // Bind inputs
        this.input = new Input;
        $(this.renderer.canvas).click(function (e) {
            that.input.bMouseClicked = true;
            that.input.mouseClickPos.x = e.pageX;
            that.input.mouseClickPos.y = e.pageY;
        });
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
    SneakySnakeGame.prototype.setupFloor = function () {
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
                if (floor.grid[x][y].type == RTypes.FLOOR) {
                    var tile = new FloorTile(screen_coords.x, screen_coords.y, [this.assetmanager.anims["floor"]]);
                    tile.setZ(-1);
                    this.staticObjs.push(tile);
                }
                else if (floor.grid[x][y].type == RTypes.WALL) {
                    this.staticObjs.push(new WallTile(screen_coords.x, screen_coords.y, [this.assetmanager.anims["wall"]]));
                }
                else if (floor.grid[x][y].type == RTypes.DOOR) {
                    this.staticObjs.push(new FloorTile(screen_coords.x, screen_coords.y, [this.assetmanager.anims["floor"]]));
                }
            }
        }
        // Spawn teleporter to next level
        tempx = Math.floor(Math.random() * this.floorSize);
        tempy = Math.floor(Math.random() * this.floorSize);
        while (floor.grid[tempx][tempy].type == RTypes.WALL) {
            tempx = Math.floor(Math.random() * this.floorSize);
            tempy = Math.floor(Math.random() * this.floorSize);
        }
        this.tempi = gridToScreen(tempx, tempy);
        this.currTeleporter = new Teleporter(this.tempi.x, this.tempi.y, [this.assetmanager.anims["teleporter"]]);
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
        for (var i = randBetween(this.numNPC, this.numNPC - 3, true); i > 0; i--) {
            tempx = Math.floor(Math.random() * this.floorSize);
            tempy = Math.floor(Math.random() * this.floorSize);
            tempVect = new Vector2(tempx, tempy);
            while (floor.grid[tempx][tempy].type == RTypes.WALL || collide(tempVect, this.NPCs) || cmpVector2(gridToScreen(tempVect), this.currTeleporter.pos) || (tempVect.x < 6 && tempVect.y == 1) || (tempVect.x == 1 && tempVect.y < 6)) {
                tempx = Math.floor(Math.random() * this.floorSize);
                tempy = Math.floor(Math.random() * this.floorSize);
                tempVect = new Vector2(tempx, tempy);
            }
            this.tempi = gridToScreen(tempx, tempy);
            this.NPCs.push(new NPC(this.tempi.x, this.tempi.y, tempx, tempy, 5, [this.assetmanager.anims["npcAll"], this.assetmanager.anims["npcFollowAnim"], this.assetmanager.anims["npcIdleDSeen"], this.assetmanager.anims["npcIdleLSeen"], this.assetmanager.anims["npcIdleUSeen"], this.assetmanager.anims["npcIdleRSeen"]]));
        }
    };
    SneakySnakeGame.prototype.toggleControls = function () {
        if (this.player.controls[0] == "s")
            this.player.controls = ["a", "w", "d", "s"];
        else
            this.player.controls = ["s", "a", "w", "d"];
    };
    SneakySnakeGame.prototype.restartGame = function () {
        // Stop the tick function from ticking
        clearInterval(this.tickID);
        // Make new world
        this.world = this.worldGen();
        // Reset everything
        this.staticObjs = [];
        this.dynamicObjs = [];
        this.collisionMap = this.world.collisionMap;
        this.numNPC = 3;
        this.NPCs = [];
        this.currentFloor = 0;
        this.input.keyPresses = [];
        // Run the function to start a new game
        this.startGame();
    };
    SneakySnakeGame.prototype.worldGen = function () {
        // Makes a new world
        return new Building(this.floorSize, this.assetmanager);
    };
    SneakySnakeGame.prototype.viewWorld = function (w) {
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
    SneakySnakeGame.prototype.tick = function () {
        //game logic loop
        this.fps++;
        // Resets world if player is on a teleporter and thus needs to go to the next level
        if (cmpVector2(this.player.pos, this.player.sDestination) && cmpVector2(this.player.pos, this.currTeleporter.pos)) {
            this.currentFloor++;
            this.numNPC += 3;
            this.setupFloor();
            return;
        }
        // Draw objects
        this.tempTick = this.staticObjs.concat(this.dynamicObjs).concat(this.NPCs).concat(this.currTeleporter);
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
        // Disallows the player from moving through walls
        if (this.collisionMap[this.currentFloor][this.player.tempDestination.y][this.player.tempDestination.x].animMan.anims[0].name !== "filled")
            this.player.bCanLerp = true;
        else
            this.player.bCanLerp = false;
        // Render everything
        this.renderer.draw(this.tempTick, this.assetmanager.anims, this.lastFPS);
        // Clear inputs
        this.input.bMouseClicked = false;
        // Check end game (player has no health)
        if (this.player.health <= 0) {
            clearInterval(this.tickID);
            clearInterval(this.fpsID);
            var that = this;
            var highscore;
            var sHighscore;
            // Save highscore
            if (typeof (localStorage["highscore"]) == "undefined") {
                highscore = [that.player.following.length];
                sHighscore = JSON.stringify(highscore);
                localStorage.setItem("highscore", sHighscore);
            }
            else {
                highscore = JSON.parse(localStorage.getItem("highscore"));
                highscore.push(that.player.following.length);
                highscore = highscore.sort(function (a, b) {
                    return a - b;
                }); // The function allows the sort to be on numbers instead of strings... I know it's dumb but that's how it works
                sHighscore = JSON.stringify(highscore);
                localStorage.setItem("highscore", sHighscore);
            }
            // Show stuff on screen
            setTimeout(function () {
                that.renderer.ctx.fillStyle = "#DD1321";
                that.renderer.ctx.font = "6.5em Inconsolata";
                that.renderer.ctx.fillText("You've been seen!", that.renderer.canvas.width / 8, that.renderer.canvas.height / 2);
                that.renderer.ctx.font = "3em Incosolata";
                that.renderer.ctx.fillText("Score: " + that.player.following.length, that.renderer.canvas.width / 2.4, that.renderer.canvas.height / 1.5);
                that.renderer.ctx.fillText("Highscore: " + highscore[highscore.length - 1], that.renderer.canvas.width / 2.8, that.renderer.canvas.height / 1.25);
            }, 400);
        }
    };
    SneakySnakeGame.prototype.startGame = function () {
        // Create the player
        var playerLocation = gridToScreen(1, 1);
        this.player = new Player(playerLocation.x, playerLocation.y, [this.assetmanager.anims["playerIdleD"], this.assetmanager.anims["playerIdleL"], this.assetmanager.anims["playerIdleU"], this.assetmanager.anims["playerWalkD"], this.assetmanager.anims["playerWalkL"], this.assetmanager.anims["playerWalkU"]]);
        this.setupFloor();
        // Start tick function
        var self = this;
        this.tickID = setInterval(function () {
            self.tick();
        }, this.interval);
        this.fpsID = setInterval(function () {
            self.lastFPS = self.fps;
            self.fps = 0;
        }, 1000);
    };
    SneakySnakeGame.prototype.unsubscribeClick = function () {
        $(this.renderer.canvas).unbind("click");
    };
    return SneakySnakeGame;
})();
$(function game() {
    var game = new SneakySnakeGame();
    $(".new").click(function () {
        // Restart the game if the button is pressed
        game.restartGame();
    });
    $(".control").click(function () {
        // Change control scheme from w moving to upper right to w moving to upper left
        game.toggleControls();
    });
    // Start game when all assets are loaded
    $("body").on("assetsFinished", function () {
        game.assetmanager.audio.main.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        game.assetmanager.audio.main.play();
        game.startGame();
    });
});
//# sourceMappingURL=game.js.map