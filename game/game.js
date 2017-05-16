var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../bower_components/excalibur/dist/excalibur.d.ts" />
//initializing the excalibur engine and assigning it the global variable game
var game = new ex.Engine({
    width: 800,
    height: 600
});
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = 
        //super invokes the ex.Actor class that Player extends
        _super.call(this, 150, game.getDrawHeight() - 40, 200, 20, ex.Color.Chartreuse) || this;
        //switching the collision type from the default PreventCollision option
        // to the Fixed option, an actor with the Fixed CollisionType will cause other actors to 
        // react when it colides with them, but it will not be altered 
        // is considered "immovable/unstoppable" 
        _this.collisionType = ex.CollisionType.Fixed;
        return _this;
    }
    //Overrides the excalibur Actor, update method
    Player.prototype.update = function (game, delta) {
        //updating the base update logic
        _super.prototype.update.call(this, game, delta);
        //custom update logic
        //press or hold the left arrow to move left
        if (game.input.keyboard.isHeld(ex.Input.Keys.Left) || game.input.keyboard.wasPressed(ex.Input.Keys.Left)) {
            this.pos.x -= 20;
        }
        //press or hold the right arrow to move right
        if (game.input.keyboard.isHeld(ex.Input.Keys.Right) || game.input.keyboard.wasPressed(ex.Input.Keys.Right)) {
            this.pos.x += 20;
        }
    };
    return Player;
}(ex.Actor));
var Ballz = (function (_super) {
    __extends(Ballz, _super);
    function Ballz() {
        var _this = 
        //super invokes the ex.Actor class that Ballz extends
        _super.call(this, 100, 300, 20, 20, ex.Color.Red) || this;
        //switching the default collision type from PreventCollision to Elastic
        //NOTE: According to the documentation, Elastic will be deprecated soon, 
        //the physics for this will be incorporated into a different part of Excalibur
        _this.collisionType = ex.CollisionType.Elastic;
        //setting the initial velocity in the x and y directions
        _this.vel.setTo(100, 100);
        // On collision remove the brick
        _this.on('collision', function (ev) {
            if (bricks.indexOf(ev.other) > -1) {
                // kill removes an actor from the current scene
                // therefore it will no longer be drawn or updated
                ev.other.kill();
            }
        });
        _this.on('exitviewport', function () {
            //when the ball leaves the bottom of the screen
            alert('You lose!');
        });
        return _this;
    }
    //overriding the built in update method
    Ballz.prototype.update = function (game, delta) {
        //updating ex.Actor
        _super.prototype.update.call(this, game, delta);
        //checking to see the position of the ball, it will bounce off all edges except the bottom edge
        // when the ball leaves the page you loose
        //if the ball collides with the left side of the screen and the velocity is in the spectrum provided
        // then reverse it and increse by 25%, if it collides and is not in the spectrum then simply reverse it
        if (this.pos.x < (this.getWidth() / 2)) {
            if (this.vel.x < 250 && this.vel.x > -250) {
                this.vel.x *= -1.25;
            }
            else {
                this.vel.x *= -1;
            }
        }
        // If the ball collides with the right side of the screen and the velocity is on the spectrum
        // then reverse and increase velocity by 25%, otherwise simply reverse direction
        if (this.pos.x + (this.getWidth() / 2) > game.getDrawWidth()) {
            if (this.vel.x < 250 && this.vel.x > -250) {
                this.vel.x *= -1.25;
            }
            else {
                this.vel.x *= -1;
            }
        }
        // If the ball collides with the top of the screen and the velocity is on the spectrum then reverse it and 
        // increase by 25%, other wise simply reverse it
        if (this.pos.y < 0) {
            if (this.vel.y < 250 && this.vel.y > -250) {
                this.vel.y *= -1.25;
            }
            else {
                this.vel.y *= -1;
            }
        }
    };
    // draw overrides the built in method of draw, allowing for custom options
    // the reason the ball is circle and not a square
    Ballz.prototype.draw = function (ctx, delta) {
        // Custom draw code
        ctx.fillStyle = this.color.toString();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    };
    return Ballz;
}(ex.Actor));
//creating new instances of player and ballz
var paddle = new Player();
var ball = new Ballz();
//adding the ball and paddle to the game scene
game.add(paddle);
game.add(ball);
// Build Bricks
// Padding between bricks
var padding = 20; // px
var xoffset = 65; // x-offset
var yoffset = 20; // y-offset
//number of columns and rows
//total of 20 bricks will appear
var columns = 5;
var rows = 4;
var brickColor = [ex.Color.Azure, ex.Color.Violet, ex.Color.Orange, ex.Color.Yellow];
// Individual brick width with padding factored in
var brickWidth = game.getDrawWidth() / columns - padding - padding / columns; // px
var brickHeight = 30; // px
var bricks = [];
for (var j = 0; j < rows; j++) {
    for (var i = 0; i < columns; i++) {
        bricks.push(new ex.Actor(xoffset + i * (brickWidth + padding) + padding, yoffset + j * (brickHeight + padding) + padding, brickWidth, brickHeight, brickColor[j % brickColor.length]));
    }
}
bricks.forEach(function (brick) {
    // Make sure that bricks can participate in collisions
    brick.collisionType = ex.CollisionType.Active;
    // Add the brick to the current scene to be drawn
    game.add(brick);
});
// Start the engine to begin the game.
game.start();
