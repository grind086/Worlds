pc.extend(game.entity, function () {
    game.entity.Type.PLANET = "Planet";

    var defaults = {
        scale: [1, 1, 1],
        orbit: {
            enabled: true,
            radius: 1,
            eccentricity: 0,
            speed: 1,
            angle: 0
        }
    };

    var Planet = function(options) {
        game.mergeOptions(options, defaults);

        game.application.context.systems.model.addComponent(this, {
            type: "sphere"
        });

        if (!options.material instanceof pc.scene.Material) {
            options.material = this.generateMaterial(options.material);
        }
        this.material = options.material;

        var scale;
        if (typeof options.scale == "object") {
            scale = options.scale;
        } else {
            var s = options.scale || 1;
            scale = [s, s, s];
        }
        this.setLocalScale(scale[0], scale[1], scale[2]);
        //this.setScale(scale[0], scale[1], scale[2])

        game.application.context.systems.orbit.addComponent(this, options.orbit);
    };
    Planet = pc.inherits(Planet, game.entity.Entity);

    pc.extend(Planet.prototype, {
        generateMaterial: function(options) {
            var material = new pc.scene.PhongMaterial();
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    material[key] = colors[key];
                }
            }
            material.update();
            return material;
        },

        setMaterial: function(material) {
            //this.model.material = material || this.material;
        }
    });

    return {
        Planet: Planet
    };
} ());
