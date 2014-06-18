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

        application.context.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

        this.application = application;

        // Debug
        if (true) {
            //var material = new pc.scene.PhongMaterial
            // Create a planet
            var star = new game.entity.Star({
                orbit: {
                    enabled: false
                },
                light: {
                    color: new pc.Color(1, 1, 0)
                }
            });
            var planet = new game.entity.Star({
                scale: .5,
                orbit: {
                    radius: 3,
                    eccentricity: .2
                },
                light: {
                    color: new pc.Color(0, 0, 1)
                }
            });
            var planet2 = new game.entity.Star({
                scale: .2,
                orbit: {
                    speed: -0.5 * Math.sqrt(2),
                    radius: 1.05,
                    eccentricity: .01
                },
                light: {
                    color: new pc.Color(1, 0, 0)
                }
            });
            star.setEulerAngles(0, 0, 10);
            planet.setEulerAngles(0, 0, -10);
            planet.setMaterial();

            window.planet = planet;

            // Create an Entity with a camera component
            var camera = new pc.fw.Entity();
            application.context.systems.camera.addComponent(camera, {
                clearColor: new pc.Color(0.4, 0.45, 0.5)
            });

            // Add the new Entities to the hierarchy
            application.context.root.addChild(star);
            star.addChild(planet);
            planet.addChild(planet2);
            application.context.root.addChild(camera);

            // Move the camera 10m along the z-axis
            camera.translate(0, 0, 10);
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