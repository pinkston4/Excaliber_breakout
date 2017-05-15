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
var game = new ex.Engine({
    width: 800,
    height: 600
});
// Create an actor with x position of 150px,
// y position of 40px from the bottom of the screen,
// width of 200px, height and a height of 20px
// 
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        _this.collisionType = ex.CollisionType.Fixed;
        _this.color = ex.Color.Chartreuse;
        _this.x = 150;
        _this.y = game.getDrawHeight() - 40;
        _this.setHeight(20);
        _this.setWidth(200);
        return _this;
    }
    Player.prototype.update = function (game, delta) {
        _super.prototype.update.call(this, game, delta);
        if (game.input.keyboard.isHeld(ex.Input.Keys.Left) || game.input.keyboard.wasPressed(ex.Input.Keys.Left)) {
            this.pos.x -= 10;
        }
        if (game.input.keyboard.isHeld(ex.Input.Keys.Right) || game.input.keyboard.wasPressed(ex.Input.Keys.Right)) {
            this.pos.x += 10;
        }
    };
    return Player;
}(ex.Actor));
var Ballz = (function (_super) {
    __extends(Ballz, _super);
    function Ballz() {
        var _this = _super.call(this) || this;
        _this.collisionType = ex.CollisionType.Active;
        _this.x = 100;
        _this.y = 300;
        _this.setHeight(20);
        _this.setWidth(20);
        _this.color = ex.Color.Red;
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
            alert('You lose!');
        });
        return _this;
    }
    Ballz.prototype.update = function (game, delta) {
        _super.prototype.update.call(this, game, delta);
        if (this.pos.x < (this.getWidth() / 2)) {
            this.vel.x *= -1.1;
        }
        // If the ball collides with the right side
        // of the screen reverse the x velocity
        if (this.pos.x + (this.getWidth() / 2) > game.getDrawWidth()) {
            this.vel.x *= -1.1;
        }
        // If the ball collides with the top
        // of the screen reverse the y velocity
        if (this.pos.y < 0) {
            this.vel.y *= -1.1;
        }
    };
    Ballz.prototype.draw = function (ctx, delta) {
        // Custom draw code
        // super.draw(ctx, delta);
        ctx.fillStyle = this.color.toString();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    };
    return Ballz;
}(ex.Actor));
var paddle = new Player();
var ball = new Ballz();
// `game.add` is the same as calling
// `game.currentScene.add`
game.add(paddle);
// Add the ball to the current scene
game.add(ball);
// ball.draw();
// Build Bricks
// Padding between bricks
var padding = 20; // px
var xoffset = 65; // x-offset
var yoffset = 20; // y-offset
var columns = 5;
var rows = 3;
var brickColor = [ex.Color.Violet, ex.Color.Orange, ex.Color.Yellow];
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
