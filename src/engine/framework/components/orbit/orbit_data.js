pc.extend(pc.fw, function() {
    /**
     * @private
     * @name pc.fw.OrbitComponentData
     * @class ComponentData structure for Orbit components.
     * @extends pc.fw.ComponentData
     */
    var OrbitComponentData = function () {
        // Serialize?
        this.enabled = true;
        this.radius = 0;
        this.eccentricity = 0;
        this.speed = 1;
        this.angle = 0;

        // Don't serialize?
        this.periapsis = null;
        this.apoapsis = null;
    };
    OrbitComponentData = pc.inherits(OrbitComponentData, pc.fw.ComponentData);

    return {
        OrbitComponentData: OrbitComponentData
    };
}());