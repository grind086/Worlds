pc.script.create("Orbiter", function (context) {
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
            this.__defineGetter__('ecc', this.getEccentricity);
            this.__defineSetter__('ecc', this.setEccentricity);

            this._parent = null;
            this.__defineGetter__('parent', this.getParent);
            this.__defineSetter__('parent', this.setParent);
        },

        update: function (dt) {
            this.angle += this.speed * dt;
            if (this.angle > 360) {
                this.angle -= 360;
            }

            this.entity.setLocalPosition(this._periapsis * Math.sin(dt), 0, this._apoapsis * Math.cos(dt))
        },

        setEccentricity: function(e) {
            // Only allow ellipses
            if (0 < e && e < 1) {
                this._periapsis = this.radius * (1 - e);
                this._apoapsis = this.radius * (1 + e);
                this._eccentricity = e;
            }
        },

        getEccentricity: function(e) {
            return this._eccentricity;
        },

        setParent: function(entity) {
            this._parent = entity;
        },

        getParent: function() {
            return this._parent;
        }
    };

    return Orbiter;
});