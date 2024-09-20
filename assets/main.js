function getIdFromUrl(url) {
  const splits = url.split("/");

  return splits[splits.length - 2];
}

function setInnerHTML(element, html) {
  element.innerHTML = html;

  Array.from(element.querySelectorAll("script"))
    .forEach(oldScriptEl => {
      const newScriptEl = document.createElement("script");

      Array.from(oldScriptEl.attributes).forEach(attr => {
        newScriptEl.setAttribute(attr.name, attr.value)
      });

      const scriptText = document.createTextNode(oldScriptEl.innerHTML);
      newScriptEl.appendChild(scriptText);

      oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
    });
}
