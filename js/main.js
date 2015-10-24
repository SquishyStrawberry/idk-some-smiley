/* jshint undef: true, unused: true, eqeqeq: true */
/* globals document, window, Image, Promise, prompt */

document.addEventListener("DOMContentLoaded", function() {
    var canvas, context, lastCall;
    var __images = {};
    var player = {
        x: null,
        y: null,
        image: null
    };
    var mouse = {
        x: null,
        y: null,
        width: 1,
        height: 1
    };

    window.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    window.addEventListener("mousemove", function(e) {
        var r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
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

    function moveTowards(seeker, target, dt) {
        var dx = target.x - seeker.x;
        var dy = target.y - seeker.y;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len !== 0) {
            seeker.x += dx / len * seeker.speed * dt;
            seeker.y += dy / len * seeker.speed * dt;
        }
        return len !== 0;
    }

    function areColliding(seeker, target) { // jshint ignore: line
        return !(
            ((seeker.y + seeker.height) < (target.y)) ||
            (seeker.y > (target.y + target.height)) ||
            ((seeker.x + seeker.width) < target.x) ||
            (seeker.x > (target.x + target.width))
        ); 
    }

    function alignIfClose(seeker, target) {
        // Assumes x, y to be the center of the object
        var seekerCenter = {
            x: seeker.x,
            y: seeker.y,
            width: 5,
            height: 5
        };
        var targetCenter = {
            x: target.x,
            y: target.y,
            width: 5,
            height: 5
        };
        if (areColliding(seekerCenter, targetCenter)) {
            seeker.x = target.x;
            seeker.y = target.y;
        }
    }

    function init() {
        canvas = document.createElement("canvas");
        context = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        while (true) {
            var temp = prompt("Enter the pixels per second of the smiley");
            if (isNaN(temp)) continue;
            player.speed = +temp;
            break;
        }
        loadImage("./assets/player.png").then(function(img) {
            player.image = img;
            player.width = player.image.width;
            player.height = player.image.height;
            player.x = ~~(Math.random() * (canvas.width - player.width)) + player.width;
            player.y = ~~(Math.random() * (canvas.height - player.height)) + player.height;
            mouse.x = player.x;
            mouse.y = player.y;
            window.requestAnimationFrame(loop);
        });
        document.body.appendChild(canvas);
    }

    function update(dt) {
        moveTowards(player, mouse, dt);
        alignIfClose(player, mouse, dt);
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
        context.strokeStyle = "rebeccapurple";
        context.moveTo(player.x, player.y);
        context.lineTo(mouse.x, mouse.y);
        context.stroke();
    }

    function loop(time) {
        if (typeof lastCall !== "undefined") {
            update((time - lastCall) / 1000);
            draw();
        }
        lastCall = time;
        window.requestAnimationFrame(loop);
    }

    init();
});
