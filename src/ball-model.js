
function calculateParent() {
    // For now, whole screen
    return {
        width: screen.width,
        height: screen.height
    };
}

// Functions for manipulating the ball object
function createBall(ballInfo) {
    var ballElement = document.createElement('ball');

    ballElement.className = 'ball';
    ballElement.style.position = 'absolute';
    ballElement.style.width = ballInfo.width + 'px';
    ballElement.style.height = ballInfo.width + 'px';
    ballElement.style.borderRadius = '50%';
    ballElement.style.backgroundColor = ballInfo.color;

    updateBallPosition(ballElement, ballInfo);

    return ballElement;
}

function updateBallPosition(ballElement, ballInfo) {
    ballElement.style.top = ballInfo.y + 'px';
    ballElement.style.left = ballInfo.x + 'px';
}

function init() {
    // Set global init to true
    inited = 1;

    // Append the background screen
    document.body.appendChild($screen);

    // Init the ball
    ballModel = new BallModel({
        x: 0,
        y: 50,
        width: 50,
        height: 50,
        velocityX: 600,
        velocityY: 600,
        color: 'red',
        lastUpdated: Date.now(),
        parent: calculateParent(),
        client: {
            x: winfos.current.x,
            y: winfos.current.y
        }
    });
    $ball = createBall(ballModel);

    document.body.appendChild($ball);
    window.requestAnimationFrame(updateDrawnBall);
}

// For the animation step
var updateDrawnBall = function() {
    ballModel.update();
    updateBallPosition($ball, ballModel.getCurrentPos());
    window.requestAnimationFrame(updateDrawnBall);
};


function BallModel(options) {
    // Parent bound info
    this.parent = {
        width: options.parent.width,
        height: options.parent.height
    };

    // Client position info
    this.client = {
        x: options.client.x,
        y: options.client.y
    };

    // Ball info
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.velocityX = options.velocityX;
    this.velocityY = options.velocityY;
    this.color = options.color;

    this.lastUpdated = options.lastUpdated;

    // Current pos is initialized on new model and is calculated based on client and parent info
    this.currentPos = {};

    this.update();
}

BallModel.prototype.updateParent = function(parentInfo) {
    this.parent.width = parentInfo.width;
    this.parent.height= parentInfo.height;
};

BallModel.prototype.addBound = function(id, boundInfo) {

};

BallModel.prototype.updateBound = function(id, boundInfo) {

};

BallModel.prototype.removeBound = function(id) {

};

BallModel.prototype.updateClient = function(clientInfo) {
    this.client.x = clientInfo.x;
    this.client.y = clientInfo.y;
};

BallModel.prototype.update = function() {
    var
        currentTime = Date.now(),
        timeOffset = currentTime - this.lastUpdated,
        newX = this.x + this.velocityX * timeOffset / 1000,
        newY = this.y + this.velocityY * timeOffset / 1000,
        inBound = false,
        safety = 3;

    while (inBound !== true && safety--) {
        inBound = true;
        if (newX < 0) {
            newX = Math.abs(newX);
            this.velocityX = -this.velocityX;
            inBound = false;
        } else if (newX + this.width > this.parent.width) {
            newX = newX - 2 * (newX + this.width - this.parent.width);
            this.velocityX = -this.velocityX;
            inBound = false;
        }
        if (newY < 0) {
            newY = Math.abs(newY);
            this.velocityY = -this.velocityY;
            inBound = false;
        } else if (newY + this.height > this.parent.height) {
            newY = newY - 2 * (newY + this.height - this.parent.height);
            this.velocityY = -this.velocityY;
            inBound = false;
        }
    }

    this.x = newX;
    this.y = newY;
    this.lastUpdated = currentTime;
    this.currentPos.x = newX - this.client.x;
    this.currentPos.y = newY - this.client.y;
    return this;
};

BallModel.prototype.getCurrentPos = function() {
    return this.currentPos;
};

window.BallModel = BallModel;
