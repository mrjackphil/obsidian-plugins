interface ElWithCodeMirror extends HTMLDivElement {
  CodeMirror: CodeMirror.Editor;
}

export function CMInst() {
  const el = document.querySelector('.CodeMirror.CodeMirror-focused') as ElWithCodeMirror;
  return el && el.CodeMirror;
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

