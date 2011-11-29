(function() {

    var PERMS_URL_PARAM = "perms",
        PERMS_FORM_PARAM = "perms",
        FORM_ID = "uiserver_form";

    function split_url_parts() {
        var query_parts = window.location.search.substring(1).split("&");
        var dict = {};
        for(var part_i in query_parts) {
            var part = query_parts[part_i];
            var key = decodeURIComponent(part.split("=")[0]);
            var value = decodeURIComponent(part.split("=")[1]);
            dict[key] = value;
        }
        return dict;
    };
    function get_active_permissions() {
        var parts = split_url_parts()
        var perms = parts[PERMS_URL_PARAM]
        if(perms) return perms.split(",");
        else return [];
    };
    function set_perms_in_form(choosen) {
        /*
        * Modify the form live instead of reloading the page.
        * Could be used in the future.
        */
        var perms = choosen.join(",");
        document.getElementById(FORM_ID)[PERMS_FORM_PARAM].value = perms;
    };

    function reload_page(choosen) {
        var portStr = window.location.port != "" ? ":" + window.location.port : "";
        var url = window.location.protocol + "//" + window.location.host + portStr + "/" + window.location.pathname;
        var parts = split_url_parts();
        parts[PERMS_URL_PARAM] = choosen.join(",");
        var new_params = [];
        var enc = encodeURIComponent;
        for(key in parts) {
            new_params.push((enc(key) + "=" + enc(parts[key])));
        }
        window.location.replace(url + "?" + new_params.join("&"));
    };

    function generate_header() {

        /*
        * FIXME: some kind of proper templating or something here.
        * Maybe find a lightweight js lib for DOM manipulation.
        * Or just use jQuery.
        */
        var permissions = get_active_permissions();
        var html = document.createElement('div');
        for(var p in permissions) {
            var perm = permissions[p];
            html.innerHTML += '<input type="checkbox" value="'+perm+'" checked=checked name="newperms" />'+perm;
        }

        settings_link = document.createElement('div');
        settings_link.innerHTML = '<a target="_new" href="https://www.facebook.com/settings?tab=applications">Application Settings</a>';

        var btn = document.createElement("button");
        btn.appendChild(document.createTextNode("Update"));
        btn.onclick = function() {
            // "Update" is clicked: figure out what's checked and reload the window.
            var elements = document.getElementsByName("newperms");
            var permissions = Array.prototype.slice.call(elements);
            permissions = permissions.filter(function(me){ return me.checked });
            permissions = permissions.map(function(me){ return me.value;});
            reload_page(permissions);
        }
        // put it in the pizza!
        document.body.insertBefore(html,document.body.firstChild);
        document.body.insertBefore(btn,document.body.firstChild);
        document.body.insertBefore(settings_link,document.body.firstChild);

    }

    generate_header();
    console.log(get_active_permissions());

})();
