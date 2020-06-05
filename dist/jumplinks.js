'use strict';

function CMInst() {
    var el = document.querySelector('.CodeMirror.CodeMirror-focused');
    return el && el.CodeMirror;
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

(function () {
    var modal = undefined;
    var cancel = undefined;
    function init(app) {
        document.addEventListener('keydown', initHotkey);
    }
    function initHotkey(ev) {
        var cmInst = CMInst();
        if (ev.key === ';' && ev.ctrlKey && !modal && cmInst) {
            // @ts-ignore
            var app = window.app;
            var urls = getUrlsFromText(cmInst);
            showJumpLetters(app, urls, cmInst);
        }
    }
    function showJumpLetters(app, array, cmInst) {
        var hotkeys = 'abcdefghijklmnopqrstuvwxyz';
        var hotkeyAr = array.map(function (e, i) { return [i, hotkeys[i]]; });
        var handleHotkey = function (i) {
            var pos = cmInst.posFromIndex(array[i][0] + 2);
            cmInst.setCursor(pos);
            setTimeout(function () { return app.commands.executeCommandById('editor:follow-link'); }, 100);
        };
        // drawLinks(array, hotkeyAr);
        drawPopovers(array, hotkeyAr, cmInst);
        cancel = function (ev) {
            var h = hotkeyAr.filter(function (e) { return e[1] === ev.key; });
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            h.length && handleHotkey(h[0][0]);
            document.removeEventListener('keydown', cancel);
            document.querySelectorAll('.jl.popover').forEach(function (e) { return e.remove(); });
            modal === null || modal === void 0 ? void 0 : modal.remove();
            modal = null;
        };
        document.addEventListener('keydown', cancel);
        return hotkeyAr;
    }
    // @ts-ignore
    init();
})();
