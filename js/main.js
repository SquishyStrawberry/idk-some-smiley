/* jshint undef: true, unused: true */
/* globals document, window, Image, Promise, prompt, console */
document.addEventListener("DOMContentLoaded", function() {
    var canvas, context;
    var setCoords = true;
    var __images = {};
    var player = {
        x: 128,
        y: 128,
        vel: {
            x: 0,
            y: 0
        },
        image: null
    };
    var mouse = {
        x: 128,
        y: 128
    };

    window.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    window.addEventListener("mousemove", function(e) {
        if (setCoords) {
            mouse.x = e.pageX;
            mouse.y = e.pageY;
        }
    });
    
    window.addEventListener("click", function() {
        setCoords = !setCoords;
        if (setCoords) {
            player.image = loadImage("./js/assets/sadFace.png");
        }
        else {
            player.image = loadImage("./js/assets/happyFace.png");
        }
    });

    function loadImage(path) {
        if (path in __images) return __images[path];
        var img = new Image();
        var prom = new Promise(function(resolve, reject) {
            img.onload = function() {
                __images[path] = img;
                resolve(img);
            };
            img.onerror = function() {
                reject("Could not load image " + path);
            };
        });
        img.src = path;
        return prom;
    }

    function moveTowards(seeker, target) {
        var dx = target.x - seeker.x;
        var dy = target.y - seeker.y;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len !== 0) {
            seeker.x += dx / len * seeker.speed;
            seeker.y += dy / len * seeker.speed;
        }
        return len !== 0;
    }

    function alignIfClose(seeker, target) {
        if (Math.abs(target.x - seeker.x) <= seeker.speed) seeker.x = target.x;
        if (Math.abs(target.y - seeker.y) <= seeker.speed) seeker.y = target.y;
    }

    function init() {
        canvas = document.createElement("canvas");
        context = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var images = [
            "./js/assets/happyFace.png",
            "./js/assets/sadFace.png"
        ].map(loadImage);
        while (true) {
            var temp = prompt("Enter the speed of the smiley");
            if (isNaN(temp)) continue;
            player.speed = +temp;
            break;
        }
        Promise.all(images).then(function() {
            console.info("Starting game");
            player.image = loadImage("./js/assets/sadFace.png");
            window.requestAnimationFrame(loop);
        });
        document.body.appendChild(canvas);
    }

    function update() {
        if (setCoords) {
            moveTowards(player, mouse);
        }
        alignIfClose(player, mouse);
    }
    
    function draw() {
        var realX = player.x - player.image.width / 2,
            realY = player.y - player.image.height / 2;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(player.image,
                          realX, realY);
        context.beginPath();
        context.font = "15px Monospace";
        context.lineWidth = 1;
        context.strokeText("Y: " + realY.toString(), realX, realY);
        context.strokeText("X: " + realX.toString(), realX, realY - 15);
        context.lineWidth = 5;
        context.strokeStyle = "tomato";
        if (setCoords) {
            context.moveTo(player.x, player.y);
            context.lineTo(mouse.x, mouse.y);
        }
        context.stroke();
    }

    function loop() {
        update();
        draw();
        window.requestAnimationFrame(loop);
    }

    init();
});
