// ===================================
// CONVITE DIGITAL - APP PRINCIPAL
// ===================================

import { db, collection, addDoc, serverTimestamp } from './firebase-config.js';

// ===== DADOS DO CONVITE (carregados do dados.txt) =====
const DADOS = window.CONVITE_DADOS || {
  nome: 'Bianca',
  idade: '15',
  titulo: '15 anos',
  dia_semana: 'Domingo',
  dia: '06',
  mes: 'Dezembro',
  ano: '2026',
  horario: '11h00',
  local_nome: 'Jhon Eventos',
  local_endereco: 'Rua Brasil, N04, Redenção',
  local_maps_link: 'https://share.google/Yv5tpkmpNZF2qYuD3',
  data_limite_confirmacao: '10 de Novembro',
  pix_chave: 'biancasantos115@gmail.com',
  pix_nome: 'Bianca dos Santos Silva',
  pix_banco: '',
  mensagem_principal: 'Venha celebrar esse dia especial comigo!',
  cor_primaria: '#9f3653',
  cor_secundaria: '#cc4178',
  cor_rosa_claro: '#f8b5ba',
  cor_escura: '#800045',
  cor_gradiente: '#d05276'
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  populateInvitation();
  applyCustomColors();
  initOpeningScreen();
  initParticles();
  initScrollAnimations();
  initCountdown();
  initRSVPForm();
  initCopyPix();
});

// ===== POPULAR CONVITE COM DADOS =====
function populateInvitation() {
  // Opening screen
  document.getElementById('opening-name').textContent = DADOS.nome;
  document.getElementById('opening-age').textContent = DADOS.titulo;

  // Hero section
  document.getElementById('hero-name').textContent = DADOS.nome;
  document.getElementById('hero-age').textContent = DADOS.titulo;
  document.getElementById('hero-message').textContent = DADOS.mensagem_principal;

  // Date section
  document.getElementById('date-weekday').textContent = DADOS.dia_semana;
  document.getElementById('date-month').textContent = DADOS.mes;
  document.getElementById('date-day').textContent = DADOS.dia;
  document.getElementById('date-year').textContent = DADOS.ano;
  document.getElementById('date-time').textContent = `Às ${DADOS.horario}`;

  // Venue section
  document.getElementById('venue-name').textContent = DADOS.local_nome;
  document.getElementById('venue-address').textContent = DADOS.local_endereco;
  const mapLink = document.getElementById('venue-map-link');
  if (mapLink) mapLink.href = DADOS.local_maps_link;

  // RSVP
  document.getElementById('rsvp-deadline').textContent = `Confirme até ${DADOS.data_limite_confirmacao}`;

  // Gift section
  document.getElementById('pix-key').textContent = DADOS.pix_chave;
  document.getElementById('pix-name').textContent = DADOS.pix_nome;
  const pixBank = document.getElementById('pix-bank');
  if (pixBank) pixBank.textContent = DADOS.pix_banco;

  // Footer
  document.getElementById('footer-name').textContent = DADOS.nome;

  // Page title
  document.title = `Convite ${DADOS.titulo} - ${DADOS.nome}`;
}

// ===== CORES PERSONALIZADAS =====
function applyCustomColors() {
  const root = document.documentElement;
  if (DADOS.cor_primaria) root.style.setProperty('--cor-primaria', DADOS.cor_primaria);
  if (DADOS.cor_secundaria) root.style.setProperty('--cor-secundaria', DADOS.cor_secundaria);
  if (DADOS.cor_rosa_claro) root.style.setProperty('--cor-rosa-claro', DADOS.cor_rosa_claro);
  if (DADOS.cor_escura) root.style.setProperty('--cor-escura', DADOS.cor_escura);
  if (DADOS.cor_gradiente) root.style.setProperty('--cor-gradiente', DADOS.cor_gradiente);
}

// ===== TELA DE ABERTURA =====
function initOpeningScreen() {
  const screen = document.getElementById('opening-screen');
  const invitation = document.getElementById('invitation');

  screen.addEventListener('click', () => {
    screen.classList.add('hide');
    setTimeout(() => {
      screen.style.display = 'none';
      invitation.classList.add('show');
    }, 800);
  });
}

// ===== PARTÍCULAS FLUTUANTES =====
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 6 + 3) + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    particle.style.opacity = Math.random() * 0.3 + 0.1;

    // Random shapes
    if (Math.random() > 0.5) {
      particle.style.borderRadius = '50%';
      particle.style.background = `hsl(${340 + Math.random() * 30}, 70%, ${70 + Math.random() * 20}%)`;
    } else {
      particle.innerHTML = '✿';
      particle.style.background = 'none';
      particle.style.fontSize = (Math.random() * 12 + 8) + 'px';
      particle.style.color = `hsl(${340 + Math.random() * 30}, 60%, ${60 + Math.random() * 20}%)`;
      particle.style.width = 'auto';
      particle.style.height = 'auto';
    }

    container.appendChild(particle);
  }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ===== COUNTDOWN =====
function initCountdown() {
  const months = {
    'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, 'Abril': 3,
    'Maio': 4, 'Junho': 5, 'Julho': 6, 'Agosto': 7,
    'Setembro': 8, 'Outubro': 9, 'Novembro': 10, 'Dezembro': 11
  };

  const monthIndex = months[DADOS.mes] || 5;
  const hourMatch = DADOS.horario.match(/(\d+)/);
  const hour = hourMatch ? parseInt(hourMatch[1]) : 19;
  const minuteMatch = DADOS.horario.match(/h(\d+)/);
  const minute = minuteMatch ? parseInt(minuteMatch[1]) : 30;

  const eventDate = new Date(parseInt(DADOS.ano), monthIndex, parseInt(DADOS.dia), hour, minute);

  function updateCountdown() {
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
      document.getElementById('countdown-days').textContent = '0';
      document.getElementById('countdown-hours').textContent = '0';
      document.getElementById('countdown-minutes').textContent = '0';
      document.getElementById('countdown-seconds').textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown-days').textContent = days;
    document.getElementById('countdown-hours').textContent = hours;
    document.getElementById('countdown-minutes').textContent = minutes;
    document.getElementById('countdown-seconds').textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ===== FORMULÁRIO RSVP =====
function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.rsvp-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span>Enviando...';

    const formData = {
      nome: form.querySelector('#rsvp-name').value.trim(),
      email: form.querySelector('#rsvp-email')?.value.trim() || '',
      telefone: form.querySelector('#rsvp-phone')?.value.trim() || '',
      acompanhantes: parseInt(form.querySelector('#rsvp-companions')?.value) || 0,
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
      success.classList.add('show');

      showToast('Presença confirmada com sucesso! 🎉');
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      showToast('Erro ao confirmar. Tente novamente.');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// ===== COPIAR PIX =====
function initCopyPix() {
  const copyBtn = document.getElementById('copy-pix');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const pixKey = DADOS.pix_chave;
    navigator.clipboard.writeText(pixKey).then(() => {
      copyBtn.classList.add('copied');
      copyBtn.textContent = '✓ Copiado!';
      showToast('Chave PIX copiada!');

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.textContent = 'Copiar Chave PIX';
      }, 3000);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = pixKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      copyBtn.classList.add('copied');
      copyBtn.textContent = '✓ Copiado!';
      showToast('Chave PIX copiada!');

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.textContent = 'Copiar Chave PIX';
      }, 3000);
    });
  });
}

// ===== TOAST =====
function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
