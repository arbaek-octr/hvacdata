/* ═══════════════════════════════════════
   app.js — Entry point
   Bootstraps components and router
   ═══════════════════════════════════════ */
import * as Header   from './components/Header.js';
import * as Sidebar  from './components/Sidebar.js';
import * as Modal    from './components/Modal.js';
import * as Overview from './pages/Overview.js';
import * as AhuDetail from './pages/AhuDetail.js';
import { on, init as routerInit } from './router.js';

function mountPage(html, mountFn, params) {
  const root = document.getElementById('page-root');
  root.innerHTML = html;
  if (mountFn) mountFn(root, params);
}

function bootstrap() {
  // Static shell components (render once)
  const headerRoot  = document.getElementById('header-root');
  const sidebarRoot = document.getElementById('sidebar-root');
  const modalRoot   = document.getElementById('modal-root');

  headerRoot.innerHTML  = Header.render();
  Header.mount(headerRoot);

  sidebarRoot.innerHTML = Sidebar.render();
  Sidebar.mount(sidebarRoot);

  modalRoot.innerHTML = Modal.render();
  Modal.mount(modalRoot);

  // Routes
  on('overview', () => {
    mountPage(Overview.render(), Overview.mount);
  });

  on('ahu', params => {
    mountPage(AhuDetail.render(params), AhuDetail.mount, params);
  });

  // Start router (reads current hash or defaults to 'overview')
  routerInit();
}

bootstrap();
