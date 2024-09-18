const propsRegex = /{{(?<prop>.*)}}/g;


export default class ComponentElement extends HTMLElement {
  isRendered = false;
  cachedContent = null;

  constructor() {
    super();
  }

  async render() {
    if (!this.cachedContent) {
      const response = await fetch(this.getAttribute("src"));
      this.cachedContent = await response.text();
    }

    let template = this.cachedContent;

    const matches = template.matchAll(propsRegex);

    for (const match of matches) {
      template = template.replace(match[0], this.getAttribute(match.groups.prop));
    }

    this.innerHTML = template;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }
}

customElements.define("a-component", ComponentElement);

