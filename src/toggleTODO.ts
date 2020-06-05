import {CMInst} from "./modules/codemirror"

(function() {
  const initPlugin = () => {};
  const disablePlugin = () => {};

  const isCtrlEnter = (ev) => ev.key === 'Enter' && ev.ctrlKey;
  const hasEmptyTODO = (text) => /\s\[\s]\s/.test(text);
  const hasChechedTODO = (text) => /\s\[x]\s/.test(text);
  const handler = (ev) => {
    if (!isCtrlEnter(ev)) { return; }

    const cm = CMInst();
    const lineNum = cm.getCursor().line;
    const lineContent = cm.getLine(lineNum);

    if (hasChechedTODO(lineContent)) {
      cm.replaceRange(' ', {line: lineNum, ch: 3}, {line: lineNum, ch: 4});
    } else if (hasEmptyTODO(lineContent)) {
      cm.replaceRange('x', {line: lineNum, ch: 3}, {line: lineNum, ch: 4});
    }
  }

  document.addEventListener('keydown', handler);
})();
