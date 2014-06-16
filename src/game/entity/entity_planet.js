pc.extend(game.entity, function () {
    game.entity.Type.PLANET = "Planet";

    var Planet = function(options) {
        game.application.context.systems.model.addComponent(this, {
            type: "sphere"
        });
        game.application.context.systems.script.addComponent(this, {
            scripts: [{
                url: 'scripts/orbiter.js'
            }]
        });
    };
    Planet = pc.inherits(Planet, game.entity.Entity);

    pc.extend(Planet.prototype, {
        setOrbiting: function(entity) {
            this.script.send('orbiter', 'setParent', entity);
        }
    });

    return {
        Planet: Planet
    };
} ());
