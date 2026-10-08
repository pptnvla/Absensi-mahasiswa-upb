// ============================================================
// nav.js — Script navigasi bersama untuk semua halaman app
// ============================================================

(function () {
  // Tandai menu aktif berdasarkan nama file halaman saat ini
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item[data-page]').forEach(function (item) {
    if (item.getAttribute('data-page') === currentPage) {
      item.classList.add('active');
    }
  });

  // Toggle sidebar untuk mobile
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });

    overlay.addEventListener('click', function () {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }

  // Tampilkan jam realtime di topbar
  const timeEl = document.getElementById('topbarTime');
  if (timeEl) {
    function updateTime() {
      const now = new Date();
      const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      timeEl.textContent = now.toLocaleDateString('id-ID', options);
    }
    updateTime();
    setInterval(updateTime, 60000);
  }

  // Logout
  document.querySelectorAll('.btn-logout, .nav-item.logout').forEach(function (el) {
    el.addEventListener('click', function () {
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('userName');
        window.location.href = 'login.html';
      }
    });
  });
})();
