const nav = (data, currentNavItem) => String.raw`
  <script type="module" src="${data.assetsUrlPath}/modules/mod-nav/nav.js" async></script>
  <ui-nav current="${currentNavItem}"></ui-nav>
`;

export default nav;
