// ========================================================
// CONVITE DIGITAL - TROPICAL PARTY (BIANCA 15 ANOS)
// ========================================================

import { db, collection, addDoc, serverTimestamp } from './firebase-config.js';

// ===== DADOS DO CONVITE =====
const DADOS = window.CONVITE_DADOS || {
  nome: 'Bianca',
  idade: '15',
  titulo: '15 anos',
  dia_semana: 'domingo',
  dia: '06',
  mes: 'dezembro',
  ano: '2026',
  horario: '11:00',
  local_nome: 'Jhon Eventos',
  local_endereco: 'Rua Brasil, N04, Redenção',
  local_maps_link: 'https://share.google/Yv5tpkmpNZF2qYuD3',
  data_limite_confirmacao: '10 de Novembro',
  pix_chave: 'biancasantos115@gmail.com',
  pix_nome: 'Bianca dos Santos Silva',
  pix_banco: '',
  mensagem_principal: 'Venha celebrar esse dia tão especial comigo!'
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  populateInvitation();
  initOpeningScreen();
  initParticles();
  initCountdown();
  initRSVPForm();
  initCopyPix();
  initSmoothScroll();
});

// ===== POPULAR CONVITE COM DADOS =====
function populateInvitation() {
  // Opening screen
  const opName = document.getElementById('opening-name');
  if (opName) opName.textContent = DADOS.nome;
  const opAge = document.getElementById('opening-age');
  if (opAge) opAge.textContent = (DADOS.titulo || '15 ANOS').toUpperCase();

  // Hero section
  const heroName = document.getElementById('hero-name');
  if (heroName) heroName.textContent = DADOS.nome;
  const heroAge = document.getElementById('hero-age');
  if (heroAge) heroAge.textContent = (DADOS.titulo || '15 ANOS').toUpperCase();
  const heroMsg = document.getElementById('hero-message');
  if (heroMsg) heroMsg.textContent = DADOS.mensagem_principal;

  // Date section
  const dateWd = document.getElementById('date-weekday');
  if (dateWd) dateWd.textContent = DADOS.dia_semana.toLowerCase();
  const dateM = document.getElementById('date-month');
  if (dateM) dateM.textContent = DADOS.mes.toLowerCase();
  const dateD = document.getElementById('date-day');
  if (dateD) dateD.textContent = DADOS.dia;
  const dateT = document.getElementById('date-time');
  if (dateT) dateT.textContent = `às ${DADOS.horario}`;

  // Action Buttons
  const venueLabel = document.getElementById('action-venue-label');
  if (venueLabel) venueLabel.textContent = DADOS.local_nome;

  // Venue section
  const vName = document.getElementById('venue-name');
  if (vName) vName.textContent = DADOS.local_nome;
  const vAddr = document.getElementById('venue-address');
  if (vAddr) vAddr.textContent = DADOS.local_endereco;
  const mapLink = document.getElementById('venue-map-link');
  if (mapLink) mapLink.href = DADOS.local_maps_link;

  // RSVP deadline
  const rsvpDl = document.getElementById('rsvp-deadline');
  if (rsvpDl) rsvpDl.textContent = `Confirmação obrigatória até ${DADOS.data_limite_confirmacao}`;

  // Gift section
  const pixK = document.getElementById('pix-key');
  if (pixK) pixK.textContent = DADOS.pix_chave;
  const pixN = document.getElementById('pix-name');
  if (pixN) pixN.textContent = DADOS.pix_nome;

  // Footer
  const footerName = document.getElementById('footer-name');
  if (footerName) footerName.textContent = DADOS.nome;

  // Page title
  document.title = `Convite ${DADOS.titulo} - ${DADOS.nome} | Tropical Party`;
}

// ===== TELA DE ABERTURA COM SELO DE CERA =====
function initOpeningScreen() {
  const screen = document.getElementById('opening-screen');
  const sealBtn = document.getElementById('open-invite');
  const envelope = document.getElementById('open-envelope-trigger') || screen;
  const invitation = document.getElementById('invitation');

  if (!screen || !invitation) return;

  function openEnvelope() {
    if (sealBtn) {
      sealBtn.style.transform = 'scale(0.92)';
      setTimeout(() => {
        sealBtn.style.transform = 'scale(1.15)';
      }, 150);
    }

    setTimeout(() => {
      screen.classList.add('hide');
      setTimeout(() => {
        screen.style.display = 'none';
        invitation.classList.add('show');
        
        const hash = window.location.hash;
        if (hash) {
          const target = document.querySelector(hash);
          if (target) {
            setTimeout(() => {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            return;
          }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 750);
    }, 200);
  }

  envelope.addEventListener('click', openEnvelope);
}

// ===== NAVEGAÇÃO SUAVE DOS BOTÕES CIRCULARES =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

// ===== PARTÍCULAS TROPICAIS (SUNBEAMS / SPARKLES) =====
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = (Math.random() * 100) + '%';
    const size = Math.random() * 6 + 3;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.animationDuration = (Math.random() * 12 + 10) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    
    // Sunny gold / warm hibiscus tones
    const hue = Math.random() > 0.4 ? 42 : 345;
    p.style.background = `radial-gradient(circle, hsla(${hue}, 100%, 75%, 0.85) 0%, hsla(${hue}, 90%, 60%, 0.2) 65%, transparent 100%)`;

    container.appendChild(p);
  }
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
  const months = {
    'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
    'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
    'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
  };

  const rawMonth = (DADOS.mes || 'dezembro').toLowerCase().trim();
  const monthIndex = months[rawMonth] !== undefined ? months[rawMonth] : 11;
  const day = parseInt(DADOS.dia) || 6;
  const year = parseInt(DADOS.ano) || 2026;

  // Parse time (e.g. "11:00" or "11h00")
  const timeClean = (DADOS.horario || '11:00').replace('h', ':');
  const parts = timeClean.split(':');
  const hour = parseInt(parts[0]) || 11;
  const minute = parseInt(parts[1]) || 0;

  const eventDate = new Date(year, monthIndex, day, hour, minute);

  function update() {
    const now = new Date();
    const diff = eventDate - now;

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minsEl = document.getElementById('countdown-minutes');
    const secsEl = document.getElementById('countdown-seconds');

    if (!daysEl) return;

    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minsEl.textContent = '0';
      secsEl.textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  update();
  setInterval(update, 1000);
}

// ===== FORMULÁRIO RSVP =====
function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando confirmação...';

    const formData = {
      nome: form.querySelector('#rsvp-name').value.trim(),
      telefone: form.querySelector('#rsvp-phone')?.value.trim() || '',
      presenca: form.querySelector('#rsvp-attending')?.value || 'sim',
      acompanhantes: 5, // Fixo: Válido para 5 acompanhantes
      mensagem: form.querySelector('#rsvp-message')?.value.trim() || '',
      status: 'confirmado',
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'convidados'), formData);

      // Show success
      form.style.display = 'none';
      const success = document.getElementById('rsvp-success');
      if (success) success.classList.add('show');

      showToast('Presença confirmada com sucesso! 🌺🎉');
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      showToast('Erro ao confirmar. Tente novamente.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// ===== COPIAR PIX =====
function initCopyPix() {
  const copyBtn = document.getElementById('copy-pix');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const pixKey = DADOS.pix_chave || 'biancasantos115@gmail.com';
    navigator.clipboard.writeText(pixKey).then(() => {
      const origHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = '✓ Chave Copiada com Sucesso!';
      showToast('Chave PIX copiada para a área de transferência! ✨');

      setTimeout(() => {
        copyBtn.innerHTML = origHtml;
      }, 3000);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = pixKey;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Chave PIX copiada! ✨');
    });
  });
}

// ===== TOAST FEEDBACK =====
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 2900);
}
