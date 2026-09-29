// ===================================
// ADMIN PANEL - DASHBOARD
// ===================================

import { db, auth, collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, orderBy, onSnapshot, signInWithEmailAndPassword, signOut, onAuthStateChanged, serverTimestamp } from './firebase-config.js';

// ===== STATE =====
let currentFilter = 'todos';
let searchTerm = '';
let allGuests = [];

// ===== DOM ELEMENTS =====
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');

// ===== AUTH =====
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initLoginForm();
  initSearch();
  initFilters();
  initExport();
  initAddGuest();
});

function initAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      showDashboard();
      loadGuests();
    } else {
      showLogin();
    }
  });
}

function showLogin() {
  loginSection.style.display = 'flex';
  dashboardSection.classList.remove('show');
}

function showDashboard() {
  loginSection.style.display = 'none';
  dashboardSection.classList.add('show');
}

function initLoginForm() {
  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const email = form.querySelector('#admin-email').value;
    const password = form.querySelector('#admin-password').value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      errorEl.textContent = 'E-mail ou senha incorretos.';
      errorEl.style.display = 'block';
    }
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  });
}

// ===== LOAD GUESTS (REALTIME) =====
function loadGuests() {
  const q = query(collection(db, 'convidados'), orderBy('criadoEm', 'desc'));

  onSnapshot(q, (snapshot) => {
    allGuests = [];
    snapshot.forEach((docSnap) => {
      allGuests.push({ id: docSnap.id, ...docSnap.data() });
    });
    updateStats();
    renderTable();
  }, (error) => {
    console.error('Error loading guests:', error);
  });
}

// ===== UPDATE STATS =====
function updateStats() {
  const confirmed = allGuests.filter(g => g.status === 'confirmado');
  const pending = allGuests.filter(g => g.status === 'pendente');
  const declined = allGuests.filter(g => g.status === 'recusado');

  const totalCompanions = confirmed.reduce((sum, g) => sum + (g.acompanhantes || 0), 0);

  document.getElementById('stat-confirmed').textContent = confirmed.length;
  document.getElementById('stat-pending').textContent = pending.length;
  document.getElementById('stat-declined').textContent = declined.length;
  document.getElementById('stat-total').textContent = allGuests.length;

  document.getElementById('stat-confirmed-detail').textContent = `+ ${totalCompanions} acompanhante(s)`;
  document.getElementById('stat-total-detail').textContent = `${confirmed.length + totalCompanions} pessoas ao total`;
}

// ===== RENDER TABLE =====
function renderTable() {
  const tbody = document.getElementById('guests-tbody');
  const emptyState = document.getElementById('empty-state');

  let filtered = allGuests;

  // Apply filter
  if (currentFilter !== 'todos') {
    filtered = filtered.filter(g => g.status === currentFilter);
  }

  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(g =>
      g.nome?.toLowerCase().includes(term) ||
      g.email?.toLowerCase().includes(term) ||
      g.telefone?.includes(term)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  tbody.innerHTML = filtered.map(guest => {
    const date = guest.criadoEm?.toDate ? guest.criadoEm.toDate().toLocaleDateString('pt-BR') : '-';
    const statusLabel = {
      'confirmado': 'Confirmado',
      'pendente': 'Pendente',
      'recusado': 'Recusado'
    };

    return `
      <tr data-id="${guest.id}">
        <td>
          <strong>${escapeHtml(guest.nome || '-')}</strong>
        </td>
        <td>${escapeHtml(guest.email || '-')}</td>
        <td>${escapeHtml(guest.telefone || '-')}</td>
        <td>${guest.acompanhantes || 0}</td>
        <td>
          <span class="status-badge ${guest.status}">
            ${guest.status === 'confirmado' ? '✓' : guest.status === 'recusado' ? '✕' : '●'}
            ${statusLabel[guest.status] || guest.status}
          </span>
        </td>
        <td>${date}</td>
        <td>${escapeHtml(guest.mensagem || '-')}</td>
        <td>
          <div class="action-btns">
            ${guest.status !== 'confirmado' ? `<button class="action-btn confirm" onclick="confirmGuest('${guest.id}')" title="Confirmar">✓</button>` : ''}
            ${guest.status !== 'recusado' ? `<button class="action-btn decline" onclick="declineGuest('${guest.id}')" title="Recusar">✕</button>` : ''}
            <button class="action-btn delete" onclick="deleteGuest('${guest.id}')" title="Excluir">🗑</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== GUEST ACTIONS =====
window.confirmGuest = async (id) => {
  try {
    await updateDoc(doc(db, 'convidados', id), {
      status: 'confirmado',
      atualizadoEm: serverTimestamp()
    });
  } catch (error) {
    console.error('Error confirming guest:', error);
  }
};

window.declineGuest = async (id) => {
  try {
    await updateDoc(doc(db, 'convidados', id), {
      status: 'recusado',
      atualizadoEm: serverTimestamp()
    });
  } catch (error) {
    console.error('Error declining guest:', error);
  }
};

window.deleteGuest = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este convidado?')) return;

  try {
    await deleteDoc(doc(db, 'convidados', id));
  } catch (error) {
    console.error('Error deleting guest:', error);
  }
};

// ===== SEARCH =====
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchTerm = e.target.value;
      renderTable();
    }, 300);
  });
}

// ===== FILTERS =====
function initFilters() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelector('.filter-tab.active')?.classList.remove('active');
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderTable();
    });
  });
}

// ===== EXPORT CSV =====
function initExport() {
  const exportBtn = document.getElementById('export-btn');
  if (!exportBtn) return;

  exportBtn.addEventListener('click', () => {
    let filtered = allGuests;
    if (currentFilter !== 'todos') {
      filtered = filtered.filter(g => g.status === currentFilter);
    }

    const headers = ['Nome', 'Email', 'Telefone', 'Acompanhantes', 'Status', 'Data', 'Mensagem'];
    const rows = filtered.map(g => {
      const date = g.criadoEm?.toDate ? g.criadoEm.toDate().toLocaleDateString('pt-BR') : '-';
      return [
        g.nome || '-',
        g.email || '-',
        g.telefone || '-',
        g.acompanhantes || 0,
        g.status || '-',
        date,
        g.mensagem || '-'
      ];
    });

    const csv = [headers, ...rows].map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `convidados_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

// ===== ADD GUEST MODAL =====
function initAddGuest() {
  const addBtn = document.getElementById('add-guest-btn');
  const modal = document.getElementById('add-guest-modal');
  const closeBtn = document.getElementById('modal-close');
  const form = document.getElementById('add-guest-form');

  if (!addBtn || !modal) return;

  addBtn.addEventListener('click', () => {
    modal.classList.add('show');
  });

  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const guestData = {
      nome: form.querySelector('#add-name').value.trim(),
      email: form.querySelector('#add-email')?.value.trim() || '',
      telefone: form.querySelector('#add-phone')?.value.trim() || '',
      acompanhantes: parseInt(form.querySelector('#add-companions')?.value) || 0,
      status: form.querySelector('#add-status')?.value || 'pendente',
      mensagem: '',
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
      adicionadoPeloAdmin: true
    };

    try {
      await addDoc(collection(db, 'convidados'), guestData);
      modal.classList.remove('show');
      form.reset();
    } catch (error) {
      console.error('Error adding guest:', error);
      alert('Erro ao adicionar convidado.');
    }
  });
}
