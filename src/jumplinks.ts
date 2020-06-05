import {CMInst, getUrlsFromText} from "./modules/codemirror"
import {drawPopovers} from "./modules/draw"

let modal = undefined;
let cancel = undefined;

function init(app) {
  document.addEventListener('keydown', initHotkey);
}

function onDisable(app) {
  document.removeEventListener('keydown', initHotkey);
}

function initHotkey(ev) {
  const cmInst = CMInst();

  if (ev.key === ';' && ev.ctrlKey && !modal && cmInst) {
    // @ts-ignore
    const app = window.app;
    const urls = getUrlsFromText(cmInst);

    showJumpLetters(app, urls, cmInst)
  }
}

function showJumpLetters(app, array, cmInst) {
  const hotkeys = 'abcdefghijklmnopqrstuvwxyz';
  const hotkeyAr = array.map( (e, i) => [i, hotkeys[i]] );

  const handleHotkey = (i) => {
    const pos = cmInst.posFromIndex(array[i][0] + 2);

    cmInst.setCursor(pos);
    setTimeout(() => app.commands.executeCommandById('editor:follow-link'), 100);
  }

  // drawLinks(array, hotkeyAr);
  drawPopovers(array, hotkeyAr, cmInst);

  cancel = (ev) => {
    const h = hotkeyAr.filter(e => e[1] === ev.key);
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();

    h.length && handleHotkey(h[0][0]);

    document.removeEventListener('keydown', cancel);
    document.querySelectorAll('.jl.popover').forEach(e => e.remove());
    modal?.remove();
    modal = null;
  };

  document.addEventListener('keydown', cancel);

  return hotkeyAr;
}

// @ts-ignore
init(window.app)
