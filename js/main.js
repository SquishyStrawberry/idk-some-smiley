document.addEventListener("DOMContentLoaded", function() {
    var canvas, context;
    var mouseX = 128,
        mouseY = 128,
        x = 128,
        y = 128,
        speed = 100,
        setCoords = true;
    var monster;

    var __images = {};

    window.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    window.addEventListener("mousemove", function(e) {
        if (setCoords) {
            mouseX = e.pageX;
            mouseY = e.pageY;
        }
    });
    
    window.addEventListener("click", function() {
        setCoords = !setCoords;
        if (setCoords) {
            monster = loadImage("./js/assets/sadFace.png");
        }
        else {
            monster = loadImage("./js/assets/happyFace.png");
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

    function init() {
        canvas = document.createElement("canvas");
        context = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var images = [
            "./js/assets/happyFace.png",
            "./js/assets/sadFace.png"
        ].map(loadImage);
        Promise.all(images).then(function(loaded) {
            console.info("Starting game");
            monster = loadImage("./js/assets/sadFace.png");
            window.requestAnimationFrame(loop);
        });
        document.body.appendChild(canvas);
    }

    function update(dt) {
        if (setCoords) {
            var dx = mouseX - x;
            var dy = mouseY - y;
            var len = Math.sqrt(dx * dx + dy * dy);
            if (len !== 0) {
                x += dx / len * speed * dt;
                y += dy / len * speed * dt;
            }
        }
        if (Math.abs(mouseX - x) <= speed) x = mouseX;
        if (Math.abs(mouseY - y) <= speed) y = mouseY;
    }
    
    function draw() {
        var realX = x - monster.width / 2,
            realY = y - monster.height / 2;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(monster,
                          realX, realY);
        context.beginPath();
        context.font = "15px Monospace";
        context.lineWidth = 1;
        context.strokeText("Y: " + realY.toString(), realX, realY);
        context.strokeText("X: " + realX.toString(), realX, realY - 15);
        context.lineWidth = 5;
        context.strokeStyle = "tomato";
        if (setCoords) {
            context.moveTo(x, y);
            context.lineTo(mouseX, mouseY);
        }
        context.stroke();
    }

    function loop() {
        // FIXME Add DeltaTime
        update(1);
        draw();
        window.requestAnimationFrame(loop);
    }

    init();
});
