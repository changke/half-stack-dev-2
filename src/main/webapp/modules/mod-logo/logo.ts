import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('ui-logo')
export class Logo extends LitElement {
  static styles = css`
    :host {
      contain: content;
    }
    .shelf {
      box-sizing: border-box;
      width: 60px;
      height: 60px;
      border: 6px solid #39536d;
      border-top-style: dashed;
    }
    .plate {
      height: 8px;
    }
    .plate.p1 {
      background-color: #d5d9de;
    }
    .plate.p2 {
      background-color: #a2adb8;
    }
    .plate.p3 {
      background-color: #778899;
    }
  `;

  render() {
    return html`
      <div class="shelf">
        <div class="plate ph"></div>
        <div class="plate ph"></div>
        <div class="plate ph"></div>
        <div class="plate p1"></div>
        <div class="plate p2"></div>
        <div class="plate p3"></div>
      </div>
    `;
  }
}
