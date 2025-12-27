import logo from '../mod-logo/logo.tmpl.mjs';
import nav from '../mod-nav/nav.tmpl.mjs';

const header = (data, currentNavItem) => String.raw`
  <header data-mod-name="header" data-mod-bypass>
    ${logo(data)}
    <h3 class="header__title">Half-Stack Developer</h3>
    ${nav(data, currentNavItem)}
  </header>
`;

export default header;
