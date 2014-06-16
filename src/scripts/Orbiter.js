pc.script.create("orbiter", function (context) {
    /**
     * @name Orbiter
     * @class A script extension that handles simple orbital movement.
     */
    var Orbiter = function (entity) {
        this.entity = entity;
    };

    Orbiter.prototype = {
        initialize: function () {
            this.radius = 0;
            this.angle = 0;
            this.speed = 1;

            this._eccentricity = 0;
            this._periapsis = 0;
            this._apoapsis = 0;

            this._parent = null;
        },

        update: function (dt) {
            this.angle += this.speed * dt;
            if (this.angle > 360) {
                this.angle -= 360;
            }

            this.entity.setLocalPosition(this._periapsis * Math.sin(dt), 0, this._apoapsis * Math.cos(dt))
        },

        /**
         * @property
         * @name Orbiter#eccentricity
         * @description The eccentricity of the Entity's orbit. Must be between 0 and 1.
         * @type {number}
         */
        setEccentricity: function(e) {
            // Only allow ellipses
            if (0 < e && e < 1) {
                this._periapsis = this.radius * (1 - e);
                this._apoapsis = this.radius * (1 + e);
                this._eccentricity = e;
            }
        },
        getEccentricity: function() {
            return this._eccentricity;
        },

        /**
         * @property
         * @name Orbiter#parent
         * @description The Entity about which this entity orbits.
         * @type {Entity}
         */
        setParent: function(entity) {
            this._parent = entity;
        },
        getParent: function() {
            return this._parent;
        }
    };

    return Orbiter;
});