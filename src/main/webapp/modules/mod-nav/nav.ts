import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

interface NavItemLink {
  title: string;
  href: string;
}

@customElement('ui-nav')
export class Nav extends LitElement {
  static styles = css`
    :host {
      contain: content;
    }
    ul,
    li {
      margin: 0;
      padding: 0;
    }
    ul {
      display: flex;
      gap: 2rem;
    }
    li {
      list-style: none;
    }
    li a {
      display: block;
    }
    li a.current {
      font-weight: bold;
      text-decoration: none;
    }
  `;

  @property()
  current = '';

  items: Array<NavItemLink> = [
    {title: 'Home', href: '/'},
    {title: 'RSS', href: '/rss/index.xml'},
    {title: 'About', href: '/about/'}
  ];

  getCssClass(title: string) {
    return this.current.toLowerCase() === title.toLowerCase() ? 'current' : '';
  }

  render() {
    return html`
      <ul>
        ${this.items.map(item => html`
          <li><a class="${this.getCssClass(item.title)}" href="${item.href}">${item.title}</a></li>
        `)}
      </ul>
    `;
  }
}
