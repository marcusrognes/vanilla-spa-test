const propsRegex = /{{(?<prop>.*)}}/g;

export default class RouteElement extends HTMLElement {
  isRendered = false;
  boundRenderFunction = this.render.bind(this);
  cachedContent = null;

  constructor() {
    super();
  }

  async render() {
    const matches = patternMatcher(this.getAttribute("pattern"), location.pathname, true);

    if (!matches) {
      this.isRendered = false;
      this.innerHTML = "";
      return;
    }

    if (this.cachedContent) {
      setInnerHTML(this, applyProps(this.cachedContent, matches.groups));
      return;
    }

    const response = await fetch(this.getAttribute("src"), {
      //      cache: "force-cache",
    });

    if (!response.ok) {
      return;
    }

    const text = await response.text();

    setInnerHTML(this, applyProps(text, matches.groups));

    if (this.hasAttribute("cache")) {
      this.cachedContent = text;
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

function applyProps(template, props) {
  const matches = template.matchAll(propsRegex);

  for (const match of matches) {
    template = template.replace(match[0], props?.[match.groups.prop]);
  }

  return template
}

export function getATag(element) {
  if (element.localname == "a") {
    return element;
  }

  return element.closest("a");
}

window.onclick = function (e) {
  const aElement = getATag(e.target);

  if (!aElement) {
    return;
  }

  e.preventDefault();

  history.pushState(null, '', aElement.href);

  const event = document.createEvent("Event");
  event.initEvent("c_pushstate", true, true);
  window.dispatchEvent(event);
}

export function patternMatcher(pattern, path, exact) {
  const matchProps = new RegExp(':[^\/]+', 'g');
  const array = [...pattern.matchAll(matchProps)];
  let regexString = pattern.replaceAll('/', '\\/');

  array.forEach(m => {
    regexString = regexString.replaceAll(m[0], `(?<${m[0].replace(':', '')}>[^\/]+)`);
  });

  if (exact) {
    regexString = `^${regexString}$`;
  }

  const routeRegex = new RegExp(regexString);
  return path.match(routeRegex);
}
