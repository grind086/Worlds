function ScriptLoader() {
    this.timeout = 500;
    this.gameurl = 'contrib/game.js';
    this.depurl = 'dependencies.txt';

    this.MODE_NORMAL = 0;
    this.MODE_MULTI = 1;
    this.MODE_ERROR = 2;

    this.SCRIPT_NEW = 'new';
    this.SCRIPT_SUCCESS = 'success';
    this.SCRIPT_FAILURE = 'failure';

    this.mode = this.MODE_NORMAL;
    this.request(this.gameurl, null, this.loadDependencies);
}

ScriptLoader.prototype = {
    request: function(url, succb, errcb) {
        var self = this;

        var head = document.getElementsByTagName('head')[0];
        if (!head) {
            console.error("Unable to find DOM head element");
            return;
        }

        var script = document.createElement('script');
        script.setAttribute('data-loaded', self.SCRIPT_NEW);

        var onSuccess = function() {
            if (script.getAttribute('data-loaded') === self.SCRIPT_FAILURE) {
                console.warn(script.src + " loaded after timing out");
                return;
            }
            script.setAttribute('data-loaded', self.SCRIPT_SUCCESS);

            if (typeof succb == 'function') {
                succb.call(self);
            }
        };

        var onError = function() {
            if (script.getAttribute('data-loaded') === self.SCRIPT_SUCCESS) return;
            script.setAttribute('data-loaded', self.SCRIPT_FAILURE);

            if (typeof errcb == 'function') {
                console.error(script.src + " timed out");
                errcb.call(self);
            }
        };

        script.onload = onSuccess;
        script.src = url;
        head.appendChild(script);
        setTimeout(onError, this.timeout);
    },

    loadDependencies: function() {
        console.log("Attempting to load unbuilt game files");
        this.mode = this.MODE_MULTI;

        // Use playcanvas' AJAX functions
        var self = this;
        pc.net.http.request("GET", this.depurl, {
            success: function(response) {
                console.log(response);

                var files = response.split('\n');
                self.loadDependency(files, 0);
            },

            error: function(status) {
                console.error("Unable to load dependencies: " + status);
                self.mode = self.MODE_ERROR;
            }
        })
    },

    loadDependency: function(list, index) {
        var self = this;

        if (index < list.length) {
            this.request(list[index], function() {
                console.log("Loaded: " + list[index]);
                self.loadDependency(list, index + 1);
            }, function() {
                console.error("Unable to find game files.");
            });
        } else {
            console.log("All dependencies loaded.");
        }
    }
};

new ScriptLoader();
