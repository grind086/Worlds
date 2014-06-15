pc.extend(game.entity, function () {
    game.entity.Type.PLANET = "Planet";

    var Planet = function() {
        application.context.systems.script.addComponent(this, {
            scripts: [{
                url: 'scripts/Orbiter.js'
            }]
        })
    };
    Planet = pc.inherits(Planet, game.entity.Entity);

    return {
        Planet: Planet
    };
} ());
