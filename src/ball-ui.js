(function () {
    var
        ballClient = new Subetha.Client(),
        ballModel,
        $ball,
        winfos = Subetha.winfos,
        ballInited;

    // Calculate what the parent size should be?
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
        ballElement.style['z-index'] = '1';

        updateBallPosition(ballElement, ballInfo);

        return ballElement;
    }

    function updateBallPosition(ballElement, ballInfo) {
        ballElement.style.top = ballInfo.y + 'px';
        ballElement.style.left = ballInfo.x + 'px';
    }

    function initBall() {
        // Init the ball
        ballModel = new BallModel({
            x: 0,
            y: 0,
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

    winfos
    .on('add', function (winfo) {
        console.log('winfos Add');

        if (!ballInited) {
            ballInited = true;
            initBall();
        }
    })
    .on('update', function (winfo) {
        console.log('winfos Update');

        if (winfo === winfos.current) {
            ballModel.updateClient(winfo);
        }
    })
    .on('remove', function (winfo) {
        console.log('winfos Remove');
    });

    ballClient
        .on('::connect', function() {
            console.log('ball Connect');
        })
        .on('::join', function() {
            console.log('ball Join', arguments);
        })
        .on('::disconnect', function () {
            console.log('ball Disconnect');
            // ???
        })
        .on('requestForBall', function (e) {
            // Send out the ball data to the requester
            console.log('requestForBall');
            e.peer.send('ballInfo', ballModel);
        })
        .on('ballInfo', function (e, ballInfo) {
            console.log('Ball Info', arguments);
            ballModel = new BallModel(ballInfo);
            ballModel.updateClient({
                x: winfos.current.x,
                y: winfos.current.y
            });
        })
        .on('windowJoin', function (e) {
            // Resize the parent object
            console.log('windowJoin');
        });

    ballClient.open('ball@public');

    setTimeout(function() {
        ballClient.emit('requestForBall');
    }, 500);
})()
