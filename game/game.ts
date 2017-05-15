/// <reference path="../bower_components/excalibur/dist/excalibur.d.ts" />

var game = new ex.Engine({
    width: 800,
    height: 600
});

class Player extends ex.Actor {

    constructor() {
        super(150, game.getDrawHeight()-40, 200, 20, ex.Color.Chartreuse);
        this.collisionType = ex.CollisionType.Fixed;
    }    

    public update(game, delta) {
        super.update(game, delta);
        if (game.input.keyboard.isHeld(ex.Input.Keys.Left) || game.input.keyboard.wasPressed(ex.Input.Keys.Left)) {
            this.pos.x -= 20;
        }
         if (game.input.keyboard.isHeld(ex.Input.Keys.Right) || game.input.keyboard.wasPressed(ex.Input.Keys.Right)) {
            this.pos.x += 20;
        }
    }
}

class Ballz extends ex.Actor {

    constructor() {
        super(100, 300, 20, 20, ex.Color.Red);
        this.collisionType = ex.CollisionType.Elastic;
        this.vel.setTo(100,100);
            // On collision remove the brick
        this.on('collision',  (ev: ex.CollisionEvent) => {
            if (bricks.indexOf(ev.other) > -1) {
                // kill removes an actor from the current scene
                // therefore it will no longer be drawn or updated
                ev.other.kill();
            }
        });
        this.on('exitviewport', () => {
                alert('You lose!');
        });
    }

    public update(game, delta) {
        super.update(game, delta);
        if (this.pos.x < (this.getWidth() / 2)) {
            if(this.vel.x <= 200) {
                this.vel.x *= -1.2;
            } else {
                this.vel.x *= -1;
            }
        }

        // If the ball collides with the right side
        // of the screen reverse the x velocity
        if (this.pos.x + (this.getWidth() / 2) > game.getDrawWidth()) {
            if(this.vel.x <= 200) {
                this.vel.x *= -1.2;
            } else {
                this.vel.x *= -1;
            }        
        }

        // If the ball collides with the top
        // of the screen reverse the y velocity
        if (this.pos.y < 0) {
            if(this.vel.x <= 200) {
                this.vel.x *= -1.2;
            } else {
                this.vel.x *= -1;
            }        
        }
    }

    public draw(ctx: CanvasRenderingContext2D, delta) {
        // Custom draw code
        // super.draw(ctx, delta);
        ctx.fillStyle = this.color.toString();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

}

var paddle = new Player();
var ball = new Ballz();

game.add(paddle);
game.add(ball);

// Build Bricks
// Padding between bricks
var padding = 20; // px
var xoffset = 65; // x-offset
var yoffset = 20; // y-offset
var columns = 5;
var rows = 4;

var brickColor = [ex.Color.Azure, ex.Color.Violet, ex.Color.Orange, ex.Color.Yellow ];

// Individual brick width with padding factored in
var brickWidth = game.getDrawWidth() / columns - padding - padding/columns; // px
var brickHeight = 30; // px
var bricks = [];
for (var j = 0; j < rows; j++) {
    for (var i = 0; i < columns; i++) {
        bricks.push(new ex.Actor(xoffset + i * (brickWidth + padding) + padding, yoffset + j * (brickHeight + padding) + padding, brickWidth, brickHeight, brickColor[j % brickColor.length]));
    }
}


bricks.forEach((brick) => {
    // Make sure that bricks can participate in collisions
    brick.collisionType = ex.CollisionType.Active;

    // Add the brick to the current scene to be drawn
    game.add(brick);
});

// Start the engine to begin the game.
game.start();
