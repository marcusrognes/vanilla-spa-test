export default class RouteElement extends HTMLElement {
  isRendered = false;
  boundRenderFunction = this.render.bind(this);
  cachedContent = null;

  constructor() {
    super();
  }

  async render() {
    // TODO: Update to actual pattern matching
    if (this.getAttribute("pattern") !== location.pathname) {
      this.isRendered = false;
      this.innerHTML = "";
      return;
    }

    if (this.cachedContent) {
      setInnerHTML(this, this.cachedContent);
      return;
    }

    const data = await fetch(this.getAttribute("src"));

    setInnerHTML(this, await data.text());

    if (this.hasAttribute("cache")) {
      this.cachedContent = this.innerHTML;
    }

    this.isRendered = true;
  }

  connectedCallback() {
    this.render();

    window.addEventListener('popstate', this.boundRenderFunction);
    window.addEventListener('c_pushstate', this.boundRenderFunction);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.boundRenderFunction);
    window.removeEventListener('c_pushstate', this.boundRenderFunction);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }
}

customElements.define("a-route", RouteElement);

export function setInnerHTML(elm, html) {
  elm.innerHTML = html;
  
  Array.from(elm.querySelectorAll("script"))
    .forEach( oldScriptEl => {
      const newScriptEl = document.createElement("script");
      
      Array.from(oldScriptEl.attributes).forEach( attr => {
        newScriptEl.setAttribute(attr.name, attr.value) 
      });
      
      const scriptText = document.createTextNode(oldScriptEl.innerHTML);
      newScriptEl.appendChild(scriptText);
      
      oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
  });
}

export function getATag(element) {
  if (element.localname == "a") {
    return element;
  }

  return element.closest("a");
}

window.onclick = function(e) {
  const aElement = getATag(e.target);

  if(!aElement) {
    return;
  }

  e.preventDefault();

  history.pushState(null, '', aElement.href);

  const event = document.createEvent("Event");
  event.initEvent("c_pushstate", true, true);
  window.dispatchEvent(event);
}

