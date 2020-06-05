export function drawLinks(links, hotkeys) {
  const node = drawUI();
  const el = node.querySelector('.modal-content');
  const linkEl = (content) => {
    const el = document.createElement('div');
    el.innerHTML = content;
    return el;
  };

  links.forEach( (e, i) => el.appendChild(linkEl(hotkeys[i][1] + ' ' + e[1])));
}

export function drawPopovers(links, hotkeys, cmInst) {
  const createWidgetElement = (content: string) => {
    const div = document.createElement('div');
    div.style.padding = '5px';
    div.classList.add('popover');
    div.classList.add('jl');
    div.style.zIndex = '10';
    div.style.opacity = '0.7';
    div.style.marginTop = '-20px';
    div.innerHTML = content;
    return div;
  }
  const drawWidget = (cmInst, index, value) => {
    const pos = cmInst.posFromIndex(index);
    return cmInst.addWidget(pos, createWidgetElement(value), false);
  }

  links.forEach( ([index, content], i) =>
    drawWidget(cmInst, index, hotkeys[i][1])
  );
}

function drawUI() {
  const el = document.createElement('div');
  el.innerHTML =  `
        <div class="modal-container">
          <div class="modal-bg"></div>
          <div class="modal">
            <div class="modal-close-button"></div>
            <div class="modal-title">Jump to links</div>
            <div class="modal-content"></div>
          </div>
        </div>
      `;
  document.body.appendChild(el);
  return el;
}
