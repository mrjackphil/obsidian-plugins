import {CMInst, getUrlsFromText} from "./modules/codemirror"
import {drawPopovers} from "./modules/draw"

interface VolcanoPlugin {
  id: string;
  name: string;
  description: string;
  defaultOn: boolean;

  init: (app, instance) => void;
  onEnable: (app, instance) => void;
  onDisable: (app, instance) => void;
}

class JumpLinksPlugin implements VolcanoPlugin {
  id: string;
  name: string;
  authour: string;
  description: string;
  defaultOn: boolean;
  modal: HTMLElement;
  cancel: (ev) => void;
  app: () => any;

  constructor() {
    this.id = 'mrj_jl'
    this.name = 'Jump links'
    this.authour = "MrJackphil",
    this.description = 'Jump links plugin'
    this.defaultOn = true // Whether or not to enable the plugin on load

    this.modal = undefined,
    this.cancel = undefined,
    this.app = undefined,

    this.initHotkey = this.initHotkey.bind(this);
  }

  init(app, instance) {
    this.app = app;
    console.log('Plugin initialized');
  }

  onEnable(app, instance) {
    document.addEventListener('keydown', this.initHotkey);
    console.log('Plugin is on');
  }

  onDisable(app, instance) {
    document.removeEventListener('keydown', this.initHotkey);
    console.log('Plugin is off');
  }

  initHotkey(ev) {
    const cmInst = CMInst();
    const {modal} = this;

    if (ev.key === ';' && ev.ctrlKey && !modal && cmInst) {
      const urls = getUrlsFromText(cmInst);
      const {app} = this;

      this.showJumpLetters(app, urls, cmInst)
    }
  }

  showJumpLetters(app, array, cmInst) {
    const hotkeys = 'abcdefghijklmnopqrstuvwxyz';
    const hotkeyAr = array.map( (e, i) => [i, hotkeys[i]] );

    const handleHotkey = (i) => {
      const pos = cmInst.posFromIndex(array[i][0] + 2);

      cmInst.setCursor(pos);
      setTimeout(() => app.commands.executeCommandById('editor:follow-link'), 100);
    }

    // drawLinks(array, hotkeyAr);
    drawPopovers(array, hotkeyAr, cmInst);

    this.cancel = (ev) => {
      const h = hotkeyAr.filter(e => e[1] === ev.key);
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();

      h.length && handleHotkey(h[0][0]);

      document.removeEventListener('keydown', this.cancel);
      document.querySelectorAll('.jl.popover').forEach(e => e.remove());
      this.modal?.remove();
      this.modal = null;
    };

    document.addEventListener('keydown', this.cancel);

    return hotkeyAr;
  }
}

// @ts-ignore
module.exports = () => new JumpLinksPlugin()

