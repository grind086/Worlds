var game = {
    version: "__CURRENT_GAME_VERSION__",
    debugInfo: {},

    init: function() {
        this.canvas = document.getElementById("application-canvas");

        // Create the application and start the update loop
        var application = new pc.fw.Application(this.canvas);
        application.start();

        // Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
        application.setCanvasFillMode(pc.fw.FillMode.FILL_WINDOW);
        application.setCanvasResolution(pc.fw.ResolutionMode.AUTO);

        application.context.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

        this.application = application;

        // Debug
        if (true) {
            // Create a planet
            var star = new game.entity.Star();
            var planet = new game.entity.Planet();
            planet.setOrbiting(star);
            window.planet = planet;
            //console.log(planet.script.orbiter.radius);

            // Create an Entity with a camera component
            var camera = new pc.fw.Entity();
            application.context.systems.camera.addComponent(camera, {
                clearColor: new pc.Color(0.4, 0.45, 0.5)
            });

            // Add the new Entities to the hierarchy
            application.context.root.addChild(star);
            application.context.root.addChild(planet);
            application.context.root.addChild(camera);

            // Move the camera 10m along the z-axis
            camera.translate(0, 0, 10);

            // Set an update function on the application's update event
            var angle = 0;
            application.on("update", function (dt) {
                angle += dt;
                if (angle > 360) {
                    angle = 0;
                }

                // Move the planet in a circle
                planet.setLocalPosition(3 * Math.sin(angle),.2*Math.cos(angle), 3 * Math.cos(angle));

                //camera.setLocalPosition(4 * Math.sin(angle), 0, 4 * Math.cos(angle));
            });
        }

        console.log("Game started with mode " + this.debugInfo.ScriptLoader.mode);
    }
};
