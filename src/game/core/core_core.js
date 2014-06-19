var game = {
    version: "__CURRENT_GAME_VERSION__",
    debugInfo: {},

    init: function() {
        this.canvas = document.getElementById("application-canvas");

        // Create the application and start the update loop
        var application = new pc.fw.Application(this.canvas);
        var orbitsys = new pc.fw.OrbitComponentSystem(application.context);
        application.start();

        // Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
        application.setCanvasFillMode(pc.fw.FillMode.FILL_WINDOW);
        application.setCanvasResolution(pc.fw.ResolutionMode.AUTO);

        //application.context.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

        this.application = application;

        // Debug
        if (true) {
            var nStars = 1;
            function mkSystem(target, level) {
                level = level || 0;
                if (level > 5) return;

                var nBodies = Math.floor(Math.random() * 10) + 1;

                var body;
                var scale;
                var radius;
                for (var i = 0; i < nBodies; i++) {
                    scale = Math.random();
                    radius = target.getLocalScale().data[0] + scale * (Math.random() * 2 + 1);

                    var type = game.entity.Planet;
                    if (Math.random() > 0.9 && nStars < 7) {
                        type = game.entity.Star;
                        nStars++;
                    }

                    body = new type({
                        scale: scale,
                        orbit: {
                            angle: Math.random() * 360,
                            radius: radius,
                            speed: 3 * (Math.random() * 2 - 1),
                            eccentricity: Math.random() * 0.02
                        },
                        light: {
                            color: new pc.Color(Math.random(), Math.random(), Math.random())
                        }
                    });
                    body.setEulerAngles(Math.random() * 90, Math.random() * 90, Math.random() * 90);
                    target.addChild(body);

                    if (Math.random() > 0.5) setTimeout(mkSystem.bind(this, body, level + 1),10);
                }
            }

            // Create a planet
            var star = new game.entity.Star({
                orbit: {
                    enabled: false
                },
                light: {
                    color: new pc.Color(1, 1, 0)
                }
            });

            window.star = star;
            var nPlanets = mkSystem(star);

            // Create an Entity with a camera component
            var camera = new pc.fw.Entity();
            application.context.systems.camera.addComponent(camera, {
                clearColor: new pc.Color(0.4, 0.45, 0.5)
            });

            // Add the new Entities to the hierarchy
            application.context.root.addChild(star);
            //star.addChild(planet);
            //planet.addChild(planet2);
            application.context.root.addChild(camera);

            // Move the camera 10m along the z-axis
            camera.translate(0, 10, 10);
            camera.lookAt(star.getPosition());
        }

        console.log("Game started with mode " + this.debugInfo.ScriptLoader.mode);
    },

    mergeOptions: function(options, defaults) {
        if (!options) return defaults;

        for (var key in defaults) {
            if (defaults.hasOwnProperty(key)) {
                if (!options.hasOwnProperty(key)) {
                    options[key] = defaults[key];
                } else {
                    options[key] = options[key];
                }
            }
        }
        return options;
    }
};