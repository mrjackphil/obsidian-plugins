'use strict';

function CMInst() {
    // @ts-ignore
    return window.app.workspace.activeLeaf.view.sourceMode.cmEditor;
}

(function () {
    var isCtrlEnter = function (ev) { return ev.key === 'Enter' && ev.ctrlKey; };
    var hasEmptyTODO = function (text) { return /\s\[\s]\s/.test(text); };
    var hasChechedTODO = function (text) { return /\s\[x]\s/.test(text); };
    var handler = function (ev) {
        if (!isCtrlEnter(ev)) {
            return;
        }
        var cm = CMInst();
        var lineNum = cm.getCursor().line;
        var lineContent = cm.getLine(lineNum);
        if (hasChechedTODO(lineContent)) {
            cm.replaceRange(' ', { line: lineNum, ch: 3 }, { line: lineNum, ch: 4 });
        }
        else if (hasEmptyTODO(lineContent)) {
            cm.replaceRange('x', { line: lineNum, ch: 3 }, { line: lineNum, ch: 4 });
        }
    };
    document.addEventListener('keydown', handler);
})();
