import {CMInst} from "./modules/codemirror"

(function() {
  const isAltD = (ev) => ev.key === 'd' && ev.altKey;
  const handler = (ev) => {
    if (!isAltD(ev)) {return;}

    const cm = CMInst();
    const dateString = new Date().toDateString();

    cm.replaceSelection(dateString);
  };

  document.addEventListener('keydown', handler);
})();
