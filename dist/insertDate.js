'use strict';

function CMInst() {
    // @ts-ignore
    return window.app.workspace.activeLeaf.view.sourceMode.cmEditor;
}

(function () {
    var isAltD = function (ev) { return ev.key === 'd' && ev.altKey; };
    var handler = function (ev) {
        if (!isAltD(ev)) {
            return;
        }
        var cm = CMInst();
        var dateString = new Date().toDateString();
        cm.replaceSelection(dateString);
    };
    document.addEventListener('keydown', handler);
})();
