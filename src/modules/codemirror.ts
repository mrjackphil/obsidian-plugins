export function CMInst(): CodeMirror.Editor {
  // @ts-ignore
  return window.app.workspace.activeLeaf.view.sourceMode.cmEditor;
};

export function getUrlsFromText(cmInst: CodeMirror.Editor) {
  const rx = /\[\[(.+?)\]\]/g;
  const strs = cmInst.getValue();

  let res = [];
  let m;

  while(m = rx.exec(strs)) {
    const linkName = m[1];
    res.push([m.index, linkName]);
  }

  return res;
}

