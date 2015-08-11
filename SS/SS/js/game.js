/// <reference path="ArgyleEngine.ts"/>
/// <reference path="Player.ts"/>
/// <reference path="NPC.ts"/>
/// <reference path="Teleporter.ts"/>
/// <reference path="Arrow.ts"/>
var SneakySnakeGame = (function () {
    function SneakySnakeGame() {
        this.interval = 15; // 15ms between frames, 66.6666666666667 frames/second
        this.fps = 0;
        this.lastFPS = 0;
        this.bFPS = false;
        this.muted = false;
        this.paused = true;
        this.cheated = false;
        this.renderer = new Renderer();
        this.assetmanager = new AssetManager(this.renderer.ctx, this.renderer.canvas);
        this.currentFloor = 0;
        this.floorSize = 15;
        this.world = this.worldGen();
        //this.viewWorld(this.world);
        this.staticObjs = [];
        this.dynamicObjs = [];
        this.collisionMap = this.world.collisionMap;
        this.numNPCNextFloor = 3;
        this.NPCs = [];
        var that = this;
        // Bind inputs
        this.input = new Input;
        this.arrows = [];
        this.arrows[Direction.DL] = new Arrow(gridToScreen(8, 17), [this.assetmanager.anims["arrowDownLeft"], this.assetmanager.anims["arrowDownLeftPress"], this.assetmanager.anims["arrowDownLeftNo"]]);
        this.arrows[Direction.DR] = new Arrow(gridToScreen(17, 8), [this.assetmanager.anims["arrowDownRight"], this.assetmanager.anims["arrowDownRightPress"], this.assetmanager.anims["arrowDownRightNo"]]);
        this.arrows[Direction.UL] = new Arrow(gridToScreen(-3, 6), [this.assetmanager.anims["arrowUpLeft"], this.assetmanager.anims["arrowUpLeftPress"], this.assetmanager.anims["arrowUpLeftNo"]]);
        this.arrows[Direction.UR] = new Arrow(gridToScreen(6, -3), [this.assetmanager.anims["arrowUpRight"], this.assetmanager.anims["arrowUpRightPress"], this.assetmanager.anims["arrowUpRightNo"]]);
        //$(this.renderer.canvas).mousedown(function (e) { that.input.mousedown(e); });
        $(this.renderer.canvas).mousedown(function (e) {
            that.input.mousedown(e);
            if (that.player.health <= 0) {
                that.restartGame();
            }
            else if (that.input.mouseDownPos.x < window.outerWidth / 2) {
                if (that.input.mouseDownPos.y < window.outerHeight / 2) {
                    that.input.keyPresses.push("a");
                    that.arrows[Direction.UL].press();
                }
                else {
                    that.input.keyPresses.push("s");
                    that.arrows[Direction.DL].press();
                }
            }
            else {
                if (that.input.mouseDownPos.y < window.outerHeight / 2) {
                    that.input.keyPresses.push("w");
                    that.arrows[Direction.UR].press();
                }
                else {
                    that.input.keyPresses.push("d");
                    that.arrows[Direction.DR].press();
                }
            }
        });
        $(this.renderer.canvas).mouseup(function (e) {
            that.input.mouseup(e);
            if (that.input.mouseUpPos.x < window.outerWidth / 2) {
                if (that.input.mouseUpPos.y < window.outerHeight / 2)
                    that.arrows[Direction.UL].norm();
                else
                    that.arrows[Direction.DL].norm();
            }
            else {
                if (that.input.mouseUpPos.y < window.outerHeight / 2)
                    that.arrows[Direction.UR].norm();
                else {
                    that.arrows[Direction.DR].norm();
                }
            }
        });
        //$(this.renderer.canvas).click(function (e) { that.input.click(e); });
        $(window).keyup(function (e) {
            e.preventDefault();
            if (!that.paused) {
                if (e.which == 87 || e.which == 38)
                    that.arrows[Direction.UR].norm();
                else if (e.which == 65 || e.which == 37)
                    that.arrows[Direction.UL].norm();
                else if (e.which == 83 || e.which == 40)
                    that.arrows[Direction.DL].norm();
                else if (e.which == 68 || e.which == 39)
                    that.arrows[Direction.DR].norm();
            }
        });
        $(window).keydown(function (e) {
            // Allowed to happen when paused
            e.preventDefault();
            if (e.which == 80) {
                $("#back").hide();
                $("#text-wrapper").hide();
                that.paused = !that.paused;
                if (that.paused) {
                    $("#game").hide();
                    $("#menu").show();
                    $("#play").hide();
                    $("#resume").show();
                    $("#restart").show();
                    $("#pause").hide();
                    $("#menu").zoomTo({ "scalemode": "both" });
                    that.assetmanager.audio.main.pause();
                }
                else {
                    $("#game").show();
                    $("#menu").hide();
                    $("#pause").show();
                    $("#game").zoomTo({ "scalemode": "both" });
                    if (!that.muted)
                        that.assetmanager.audio.main.play();
                }
            }
            else if (e.which == 77) {
                if (that.assetmanager.audio.main.paused) {
                    that.assetmanager.audio.main.play();
                    that.muted = false;
                }
                else {
                    that.assetmanager.audio.main.pause();
                    that.muted = true;
                }
            }
            else if (e.which == 73) {
                $("#menu").hide();
                $("#game").hide();
                $("#back").show();
                $("#text-wrapper").show();
                that.paused = true;
                $("#pause").hide();
            }
            // Not allowed to happen when paused
            if (!that.paused) {
                if (e.which == 87 || e.which == 38) {
                    that.input.keyPresses.push("w");
                    that.arrows[Direction.UR].press();
                }
                else if (e.which == 65 || e.which == 37) {
                    that.input.keyPresses.push("a");
                    that.arrows[Direction.UL].press();
                }
                else if (e.which == 83 || e.which == 40) {
                    that.input.keyPresses.push("s");
                    that.arrows[Direction.DL].press();
                }
                else if (e.which == 68 || e.which == 39) {
                    that.input.keyPresses.push("d");
                    that.arrows[Direction.DR].press();
                }
                else if (e.which == 82)
                    that.restartGame();
                else if (e.which == 70)
                    that.bFPS = !that.bFPS;
                else if (e.which == 76) {
                    var hi = new NPC(gridToScreen(1, 1), new Vector2(1, 1), 5, [that.assetmanager.anims["npcFollowAnim"]]);
                    if (that.player.following.length >= that.player.previousLoc.length - 1)
                        that.player.previousLoc = that.player.previousLoc.concat(new Vector2(1, 1));
                    hi.setfollowIndex(that.player.following.length);
                    hi.bFollowing = true;
                    that.NPCs = that.NPCs.concat(hi);
                    that.player.following = that.player.following.concat(that.NPCs[that.NPCs.length - 1]);
                    that.player.speed += that.player.speedBoost;
                    that.cheated = true;
                }
            }
        });
    }
    SneakySnakeGame.prototype.setupFloor = function () {
        this.player.pos = gridToScreen(1, 1);
        this.player.sDestination = gridToScreen(1, 1);
        this.player.gDestination = new Vector2(1, 1);
        this.player.previousLoc = [new Vector2(1, 1)];
        for (var i = 0; i < this.player.following.length + 1; i++)
            this.player.previousLoc.push(new Vector2(1, 1));
        this.player.animMan.gotoNamedAnim("playerIdleR");
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
        // Check if colliding with anything and if not then place
        for (var i = randIntBetween(this.numNPCNextFloor, this.numNPCNextFloor - 3); i > 0; i--) {
            this.tempi = Vector2.randVector2(this.floorSize, this.floorSize);
            while (this.collisionMap[this.currentFloor][this.tempi.y][this.tempi.x].animMan.anims[this.collisionMap[this.currentFloor][this.tempi.y][this.tempi.x].animMan.currentAnim].name === "filled"
                || collide(this.tempi, this.NPCs)
                || gridToScreen(this.tempi).equals(this.currTeleporter.pos)
                || (this.tempi.x < 6 && this.tempi.y == 1)
                || (this.tempi.x == 1 && this.tempi.y < 6)) {
                this.tempi = Vector2.randVector2(this.floorSize, this.floorSize);
            }
            this.NPCs.push(new NPC(gridToScreen(this.tempi), this.tempi, 5, [this.assetmanager.anims["npcAll"],
                this.assetmanager.anims["npcFollowAnim"],
                this.assetmanager.anims["npcIdleDSeen"],
                this.assetmanager.anims["npcIdleLSeen"],
                this.assetmanager.anims["npcIdleUSeen"],
                this.assetmanager.anims["npcIdleRSeen"]]));
        }
    };
    SneakySnakeGame.prototype.restartGame = function () {
        // Stop the tick function from ticking
        clearInterval(this.tickID);
        clearInterval(this.fpsID);
        // Make new world
        this.world = this.worldGen();
        // Reset everything
        this.staticObjs = [];
        this.dynamicObjs = [];
        this.collisionMap = this.world.collisionMap;
        this.numNPCNextFloor = 3;
        this.NPCs = [];
        this.currentFloor = 0;
        this.input.keyPresses = [];
        this.cheated = false;
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
        //$("p").remove();
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
        if (this.player.pos.equals(this.player.sDestination) && this.player.pos.equals(this.currTeleporter.pos)) {
            this.currentFloor++;
            this.numNPCNextFloor += randIntBetween(1, 3);
            this.setupFloor();
            return;
        }
        // Create array to put all objects in
        this.tempTick = this.staticObjs.concat(this.dynamicObjs).concat(this.NPCs).concat(this.currTeleporter);
        this.tempTick.push(this.player);
        // show collision map
        //var moreTemp = [];
        //for (var i = 0; i < this.collisionMap[this.currentFloor].length; i++) {
        //    moreTemp = this.collisionMap[this.currentFloor][i];
        //    this.tempTick = this.tempTick.concat(moreTemp.slice());
        //}
        // end show collision map
        // Tick player
        this.player.tick(this.input, this.collisionMap);
        // Tick NPC's, if any can see the player, kill the player
        for (this.tempi = 0; this.tempi < this.NPCs.length; this.tempi++) {
            this.NPCs[this.tempi].tick(this.input, this.player, this.collisionMap[this.currentFloor]);
            if (this.NPCs[this.tempi].seen) {
                if (this.player.pos.equals(this.player.sDestination))
                    this.player.health -= 1;
                break;
            }
        }
        // Disallows the player from moving through walls
        if (this.collisionMap[this.currentFloor][this.player.gDestination.y][this.player.gDestination.x].animMan.anims[0].name !== "filled") {
            this.player.bCanLerp = true;
        }
        else {
            this.player.bCanLerp = false;
            for (var x = 0; x < 4; x++)
                if (this.arrows[x].animMan.currentAnim == 1)
                    this.arrows[x].no();
        }
        // Add arrows to be rendered with the updated anim
        this.tempTick = this.tempTick.concat(this.arrows);
        // Render everything
        this.renderer.draw(this.tempTick, this.assetmanager.anims, (this.bFPS) ? this.lastFPS : -1);
        // Draw the "press p to pause"
        //this.renderer.ctx.fillStyle = "#FFFFFF";
        //this.renderer.ctx.font = "1em Inconsolata";
        //this.renderer.ctx.fillText("Press p to pause", 10, 20);
        // Clear inputs
        this.input.mouseClicked = false;
        // Check end game (player has no health)
        if (this.player.health <= 0) {
            clearInterval(this.tickID);
            clearInterval(this.fpsID);
            var that = this;
            var highscore = [];
            var sHighscore = "[]";
            if (typeof (localStorage) !== "undefined") {
                // Sort highscore, check if you cheated, save highscore
                if (!this.cheated)
                    if (typeof (localStorage["highscore"]) == "undefined") {
                        highscore = [that.player.following.length];
                    }
                    else {
                        highscore = JSON.parse(localStorage.getItem("highscore"));
                        highscore.push(that.player.following.length);
                        highscore = highscore.sort(function (a, b) { return a - b; }); // The function allows the sort to be on numbers instead of strings... I know it's dumb but that's how it works
                    }
                else {
                    highscore = JSON.parse(localStorage.getItem("highscore"));
                }
                // Don't let it get too long, there's only so much space in localstorage
                if (highscore.length > 5)
                    highscore = highscore.splice(1, highscore.length - 1);
                // Convert to string and save
                sHighscore = JSON.stringify(highscore);
                localStorage.setItem("highscore", sHighscore);
            }
            // Show stuff on screen
            setTimeout(function () {
                that.renderer.ctx.drawImage(that.assetmanager.anims["gameOver"].image, (gridToScreen(-1, 5).x - 18), gridToScreen(-1, 5).y);
                that.renderer.ctx.fillStyle = "#DD1321";
                that.renderer.ctx.font = "2.5em Inconsolata";
                if (!that.cheated)
                    that.renderer.ctx.fillText("Score: " + that.player.following.length, that.renderer.canvas.width / 2.4, that.renderer.canvas.height / 2 + 30);
                else
                    that.renderer.ctx.fillText("Cheater: " + that.player.following.length, that.renderer.canvas.width / 2.4, that.renderer.canvas.height / 2 + 30);
                sHighscore = (typeof (localStorage) !== "undefined") ? highscore[highscore.length - 1] : that.player.following.length;
                that.renderer.ctx.fillText("Highscore: " + sHighscore, that.renderer.canvas.width / 2.8, that.renderer.canvas.height / 2 + 100);
                that.renderer.ctx.fillText("Tap to restart!", that.renderer.canvas.width / 3 + 20, that.renderer.canvas.height / 2 - 80);
            }, 400);
        }
    };
    SneakySnakeGame.prototype.startGame = function () {
        // Create the player
        var playerLocation = gridToScreen(1, 1);
        this.player = new Player(playerLocation.x, playerLocation.y, [this.assetmanager.anims["playerIdleR"], this.assetmanager.anims["playerIdleD"], this.assetmanager.anims["playerIdleU"], this.assetmanager.anims["playerWalkR"], this.assetmanager.anims["playerWalkD"], this.assetmanager.anims["playerWalkU"]]);
        this.setupFloor();
        // Now you see the game
        $("#game").zoomTo({ "scalemode": "both" });
        // Start tick function
        var self = this;
        this.tickID = setInterval(function () { self.tick(); }, this.interval);
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
    // Start game when all assets are loaded
    $("body").on("assetsFinished", function () {
        $("#game").hide();
        $("#menu").show();
        $("#menu").zoomTo({ "scalemode": "both" });
        game.startGame();
    });
    function PLAYGAME() {
        $("#menu").hide();
        $("#play").hide();
        $("#resume").hide();
        $("#restart").hide();
        $("#game").show();
        $("#back").hide();
        $("#pause").show();
        $("#text-wrapper").hide();
        $("#game").zoomTo({ "scalemode": "both" });
        if (!game.muted)
            game.assetmanager.audio.main.play();
        game.paused = false;
    }
    $("#play").click(function () {
        PLAYGAME();
    });
    $("#resume").click(function () {
        PLAYGAME();
    });
    $("#restart").click(function () {
        game.restartGame();
        PLAYGAME();
    });
    $("#pause").click(function () {
        $("#back").hide();
        $("#text-wrapper").hide();
        game.paused = !game.paused;
        if (game.paused) {
            $("#game").css({ "display": "none" });
            $("#menu").show();
            $("#play").hide();
            $("#resume").show();
            $("#restart").show();
            $("#menu").zoomTo({ "scalemode": "both" });
            game.assetmanager.audio.main.pause();
        }
        else {
            $("#game").show();
            $("#menu").hide();
            $("#game").zoomTo({ "scalemode": "both" });
            if (!game.muted)
                game.assetmanager.audio.main.play();
        }
    });
    $("#info").click(function () {
        $("#menu").hide();
        $("#game").hide();
        $("#back").show();
        $("#text-wrapper").show();
        $("#text-wrapper").zoomTo({ "scalemode": "both" });
    });
    $("#back").click(function () {
        $("#menu").show();
        $("#back").hide();
        $("#text-wrapper").hide();
        $("#menu").zoomTo({ "scalemode": "both" });
    });
});
//# sourceMappingURL=game.js.map