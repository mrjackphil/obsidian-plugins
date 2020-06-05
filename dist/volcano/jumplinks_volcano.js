'use strict';

function CMInst() {
    // @ts-ignore
    return window.app.workspace.activeLeaf.view.sourceMode.cmEditor;
}
function getUrlsFromText(cmInst) {
    var rx = /\[\[(.+?)\]\]/g;
    var strs = cmInst.getValue();
    var res = [];
    var m;
    while (m = rx.exec(strs)) {
        var linkName = m[1];
        res.push([m.index, linkName]);
    }
    return res;
}

function drawPopovers(links, hotkeys, cmInst) {
    var createWidgetElement = function (content) {
        var div = document.createElement('div');
        div.style.padding = '5px';
        div.classList.add('popover');
        div.classList.add('jl');
        div.style.zIndex = '10';
        div.style.opacity = '0.7';
        div.style.marginTop = '-20px';
        div.innerHTML = content;
        return div;
    };
    var drawWidget = function (cmInst, index, value) {
        var pos = cmInst.posFromIndex(index);
        return cmInst.addWidget(pos, createWidgetElement(value), false);
    };
    links.forEach(function (_a, i) {
        var index = _a[0], content = _a[1];
        return drawWidget(cmInst, index, hotkeys[i][1]);
    });
}

var JumpLinksPlugin = /** @class */ (function () {
    function JumpLinksPlugin() {
        this.id = 'mrj_jl';
        this.name = 'Jump links';
        this.authour = "MrJackphil",
            this.description = 'Jump links plugin';
        this.defaultOn = true; // Whether or not to enable the plugin on load
        this.modal = undefined,
            this.cancel = undefined,
            this.app = undefined,
            this.initHotkey = this.initHotkey.bind(this);
    }
    JumpLinksPlugin.prototype.init = function (app, instance) {
        this.app = app;
        console.log('Plugin initialized');
    };
    JumpLinksPlugin.prototype.onEnable = function (app, instance) {
        document.addEventListener('keydown', this.initHotkey);
        console.log('Plugin is on');
    };
    JumpLinksPlugin.prototype.onDisable = function (app, instance) {
        document.removeEventListener('keydown', this.initHotkey);
        console.log('Plugin is off');
    };
    JumpLinksPlugin.prototype.initHotkey = function (ev) {
        var cmInst = CMInst();
        var modal = this.modal;
        if (ev.key === ';' && ev.ctrlKey && !modal && cmInst) {
            var urls = getUrlsFromText(cmInst);
            var app = this.app;
            this.showJumpLetters(app, urls, cmInst);
        }
    };
    JumpLinksPlugin.prototype.showJumpLetters = function (app, array, cmInst) {
        var _this = this;
        var hotkeys = 'abcdefghijklmnopqrstuvwxyz';
        var hotkeyAr = array.map(function (e, i) { return [i, hotkeys[i]]; });
        var handleHotkey = function (i) {
            var pos = cmInst.posFromIndex(array[i][0] + 2);
            cmInst.setCursor(pos);
            setTimeout(function () { return app.commands.executeCommandById('editor:follow-link'); }, 100);
        };
        // drawLinks(array, hotkeyAr);
        drawPopovers(array, hotkeyAr, cmInst);
        this.cancel = function (ev) {
            var _a;
            var h = hotkeyAr.filter(function (e) { return e[1] === ev.key; });
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            h.length && handleHotkey(h[0][0]);
            document.removeEventListener('keydown', _this.cancel);
            document.querySelectorAll('.jl.popover').forEach(function (e) { return e.remove(); });
            (_a = _this.modal) === null || _a === void 0 ? void 0 : _a.remove();
            _this.modal = null;
        };
        document.addEventListener('keydown', this.cancel);
        return hotkeyAr;
    };
    return JumpLinksPlugin;
}());
// @ts-ignore
module.exports = function () { return new JumpLinksPlugin(); };
