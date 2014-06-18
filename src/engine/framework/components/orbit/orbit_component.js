pc.extend(pc.fw, function () {
    /**
     * @component
     * @name pc.fw.OrbitComponent
     * @class The Orbit Component causes an Entity to orbit a parent Entity.
     * @constructor Create a new Orbit Component
     * @param {pc.fw.OrbitComponentSystem} system The ComponentSystem that created this Component
     * @param {pc.fw.Entity} entity The Entity that this Component is attached to.
     * @extends pc.fw.Component
     * @property {Boolean} enabled If true the child Entity will orbit its parent.
     * @property {Number} radius The distance at which to orbit.
     * @property {Number} eccentricity The deviation of the orbit from a perfect circle
     * @property {Number} speed The speed at which the entity will orbit
     * @property {Entity} parent The entity about which this entity will orbit
     */
    var OrbitComponent = function OrbitComponent(system, entity) {
        this.on("set_eccentricity", this.onSetEccentricity, this);
    };
    OrbitComponent = pc.inherits(OrbitComponent, pc.fw.Component);

    pc.extend(OrbitComponent.prototype, {
        onSetEccentricity: function(name, oldValue, newValue) {
            // Only allow ellipses
            if (0 <= newValue && newValue < 1) {
                this.data.periapsis = this.radius * (1 - newValue);
                this.data.apoapsis = this.radius * (1 + newValue);
                this.data.eccentricity = newValue;
            }
        },

        onEnable: function () {
            OrbitComponent._super.onEnable.call(this);
        },

        onDisable: function () {
            OrbitComponent._super.onDisable.call(this);
        }
    });

    return {
        OrbitComponent: OrbitComponent
    }
}());
