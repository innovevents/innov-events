const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  document.querySelectorAll('.nav-item.open').forEach(item => {
    item.classList.remove('open');
    item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
  });
}));

// Menu déroulant "Événements" (Marchés / Solutions)
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
document.querySelectorAll('.nav-item.has-mega').forEach(item => {
  const trigger = item.querySelector('.nav-trigger');
  let closeTimer = null;

  const openItem = () => {
    clearTimeout(closeTimer);
    document.querySelectorAll('.nav-item.open').forEach(el => {
      if (el !== item) {
        el.classList.remove('open');
        el.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.add('open');
    trigger?.setAttribute('aria-expanded', 'true');
  };
  const closeItem = () => {
    item.classList.remove('open');
    trigger?.setAttribute('aria-expanded', 'false');
  };

  if (supportsHover) {
    item.addEventListener('mouseenter', openItem);
    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(closeItem, 150);
    });
  }

  trigger?.addEventListener('click', (event) => {
    event.stopPropagation();
    item.classList.contains('open') ? closeItem() : openItem();
  });
});
document.addEventListener('click', (event) => {
  document.querySelectorAll('.nav-item.open').forEach(item => {
    if (!item.contains(event.target)) {
      item.classList.remove('open');
      item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
    }
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.nav-item.open').forEach(item => {
      item.classList.remove('open');
      item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
    });
  }
});

// Ouverture automatique au survol (souris), en plus du clic (tactile/clavier).
const isDesktopHover = () => window.matchMedia('(min-width: 721px)').matches;
document.querySelectorAll('.nav-item.has-mega').forEach(item => {
  const trigger = item.querySelector('.nav-trigger');
  let closeTimer;
  item.addEventListener('mouseenter', () => {
    if (!isDesktopHover()) return;
    clearTimeout(closeTimer);
    document.querySelectorAll('.nav-item.open').forEach(el => {
      if (el !== item) {
        el.classList.remove('open');
        el.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.add('open');
    trigger?.setAttribute('aria-expanded', 'true');
  });
  item.addEventListener('mouseleave', () => {
    if (!isDesktopHover()) return;
    closeTimer = setTimeout(() => {
      item.classList.remove('open');
      trigger?.setAttribute('aria-expanded', 'false');
    }, 150);
  });
});

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30), { passive: true });

const searchTrigger = document.querySelector('.search-trigger');
const searchPanel = document.querySelector('.search-panel');
const searchClose = document.querySelector('.search-close');
const searchInput = document.querySelector('#site-search');
const searchResultsEl = document.querySelector('#search-results');
const setSearch = (open) => {
  searchPanel.hidden = !open;
  searchTrigger.setAttribute('aria-expanded', String(open));
  if (open) {
    searchInput.focus();
  } else {
    searchInput.value = '';
    if (searchResultsEl) searchResultsEl.innerHTML = '';
  }
};
searchTrigger?.addEventListener('click', () => setSearch(true));
searchClose?.addEventListener('click', () => setSearch(false));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setSearch(false); });

// Index de recherche du site : chaque page avec ses mots-clés.
const SEARCH_INDEX = [
  { title: 'Accueil', url: 'index.html', tag: 'Site', keywords: 'accueil agence evenementielle douala cameroun innov events' },
  { title: 'À propos', url: 'a-propos.html', tag: 'Site', keywords: 'a propos histoire equipe qui sommes nous' },
  { title: 'Produit', url: 'product.html', tag: 'Site', keywords: 'produit materiel parc technique performance' },
  { title: 'Contact', url: 'contact.html', tag: 'Site', keywords: 'contact formulaire telephone adresse nous trouver douala' },
  { title: 'Événements', url: 'evenements.html', tag: 'Site', keywords: 'evenements marches solutions qui nous servons' },
  { title: 'Actualités', url: 'blog.html', tag: 'Site', keywords: 'actualites blog articles news coulisses' },
  { title: 'Tournées', url: 'marche-tournees.html', tag: 'Marché', keywords: 'tournees tour artiste concert route' },
  { title: 'Diffusion', url: 'marche-diffusion.html', tag: 'Marché', keywords: 'diffusion broadcast captation retransmission direct' },
  { title: 'Corporate', url: 'marche-corporate.html', tag: 'Marché', keywords: 'corporate entreprise seminaire lancement assemblee' },
  { title: 'Festivals', url: 'marche-festivals.html', tag: 'Marché', keywords: 'festivals plein air rassemblement musique' },
  { title: 'Audio', url: 'solution-audio.html', tag: 'Solution', keywords: 'audio sonorisation son line array retours de scene micro' },
  { title: 'Backline', url: 'solution-backline.html', tag: 'Solution', keywords: 'backline amplis batterie clavier materiel scenique rider' },
  { title: 'Communications', url: 'solution-communications.html', tag: 'Solution', keywords: 'communications talkies walkies intercoms radio coordination' },
  { title: 'Services data', url: 'solution-data.html', tag: 'Solution', keywords: 'services data wifi reseau connexion billetterie internet' },
  { title: 'Studios de répétition', url: 'solution-studios.html', tag: 'Solution', keywords: 'studios repetition repeter espace artiste' },
];

const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function renderSearchResults(query) {
  if (!searchResultsEl) return;
  const q = normalize(query.trim());
  if (!q) {
    searchResultsEl.innerHTML = '';
    return;
  }
  const matches = SEARCH_INDEX.filter(item =>
    normalize(item.title).includes(q) || normalize(item.keywords).includes(q)
  );
  if (!matches.length) {
    searchResultsEl.innerHTML = `<p class="search-empty">Aucun résultat pour « ${query.trim()} ».</p>`;
    return;
  }
  searchResultsEl.innerHTML = matches.map((item, i) =>
    `<a href="${item.url}" class="${i === 0 ? 'active-result' : ''}"><span>${item.title}</span><span class="result-tag">${item.tag}</span></a>`
  ).join('');
}

searchInput?.addEventListener('input', () => renderSearchResults(searchInput.value));
searchInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const first = searchResultsEl?.querySelector('a');
    if (first) window.location.href = first.getAttribute('href');
  }
});

// Formulaire de contact : validation côté client uniquement.
// L'envoi réel nécessite un service backend (voir note dans la page).
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const required = contactForm.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    const filled = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
    if (!filled || (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))) {
      valid = false;
    }
  });
  formStatus.classList.add('visible');
  if (!valid) {
    formStatus.classList.remove('success');
    formStatus.textContent = 'Merci de remplir tous les champs obligatoires avec une adresse e-mail valide.';
    return;
  }
  formStatus.classList.add('success');
  formStatus.textContent = 'Merci ! Votre demande a bien été prise en compte.';
  contactForm.reset();
});

// Modules carrousel (Histoire / Domaines d'expertise / Solutions) : onglets +
// flèches, avec changement de titre, texte, image (et lien optionnel) en fondu.
function initTabCarousel(cardSelector, tabsSelector, titleId, textId, imageSelector, linkId) {
  const card = document.querySelector(cardSelector);
  if (!card) return;
  const tabs = Array.from(card.querySelectorAll(tabsSelector));
  if (!tabs.length) return;
  const titleEl = document.getElementById(titleId);
  const textEl = document.getElementById(textId);
  const imageEl = card.querySelector(imageSelector);
  const linkEl = linkId ? document.getElementById(linkId) : null;
  let index = Math.max(0, tabs.findIndex(t => t.classList.contains('active')));

  const render = () => {
    tabs.forEach((t, i) => t.classList.toggle('active', i === index));
    const tab = tabs[index];
    if (titleEl) titleEl.innerHTML = tab.dataset.title;
    if (textEl) textEl.innerHTML = tab.dataset.text;
    if (linkEl && tab.dataset.link) linkEl.setAttribute('href', tab.dataset.link);
    if (imageEl && tab.dataset.image) {
      imageEl.style.opacity = '0';
      setTimeout(() => {
        imageEl.style.backgroundImage = `url('${tab.dataset.image}')`;
        imageEl.style.opacity = '1';
      }, 220);
    }
  };

  tabs.forEach((tab, i) => tab.addEventListener('click', () => { index = i; render(); }));
  card.querySelectorAll('.arrow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      index = (index + Number(btn.dataset.dir) + tabs.length) % tabs.length;
      render();
    });
  });
}

initTabCarousel('.history-card', '.history-tabs button', 'history-title', 'history-text', '.history-image');
initTabCarousel('.expertise-card', '.expertise-tabs button', 'expertise-title', 'expertise-text', '.expertise-image');
initTabCarousel('.solutions-card', '.solutions-tabs button', 'solutions-title', 'solutions-text', '.solutions-image', 'solutions-link');

// Sélecteur d'apparence : clair / sombre / système, + couleur d'accent
// (préréglages ou personnalisée). Choix mémorisés pour les prochaines visites.
(function () {
  const root = document.documentElement;
  const MODE_KEY = 'innov-theme-mode';
  const ACCENT_KEY = 'innov-theme-accent';
  const CUSTOM_KEY = 'innov-theme-accent-custom';
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const getMode = () => localStorage.getItem(MODE_KEY) || 'system';
  const getAccent = () => localStorage.getItem(ACCENT_KEY) || 'red';
  const resolveTheme = (mode) => (mode === 'system' ? (media.matches ? 'dark' : 'light') : mode);

  const applyMode = (mode) => {
    root.setAttribute('data-theme', resolveTheme(mode));
    document.querySelectorAll('.theme-option').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
  };
  const applyAccent = (accent) => {
    root.setAttribute('data-accent', accent);
    document.querySelectorAll('.theme-swatch').forEach(sw => sw.classList.toggle('active', sw.dataset.accent === accent));
    const customInput = document.getElementById('theme-custom-color');
    if (accent === 'custom') {
      const saved = localStorage.getItem(CUSTOM_KEY);
      if (saved) {
        root.style.setProperty('--accent-custom', saved);
        if (customInput) customInput.value = saved;
      }
    }
  };

  applyMode(getMode());
  applyAccent(getAccent());

  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem(MODE_KEY, btn.dataset.mode);
      applyMode(btn.dataset.mode);
    });
  });
  document.querySelectorAll('.theme-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      localStorage.setItem(ACCENT_KEY, sw.dataset.accent);
      applyAccent(sw.dataset.accent);
    });
  });
  const customInput = document.getElementById('theme-custom-color');
  customInput?.addEventListener('input', () => {
    root.style.setProperty('--accent-custom', customInput.value);
    localStorage.setItem(CUSTOM_KEY, customInput.value);
    localStorage.setItem(ACCENT_KEY, 'custom');
    applyAccent('custom');
  });
  document.getElementById('theme-reset')?.addEventListener('click', () => {
    localStorage.removeItem(MODE_KEY);
    localStorage.removeItem(ACCENT_KEY);
    localStorage.removeItem(CUSTOM_KEY);
    root.style.removeProperty('--accent-custom');
    applyMode('system');
    applyAccent('red');
  });
  media.addEventListener('change', () => { if (getMode() === 'system') applyMode('system'); });

  const themeTrigger = document.querySelector('.theme-trigger');
  const themePanel = document.getElementById('theme-panel');
  themeTrigger?.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = themePanel.classList.toggle('open');
    themeTrigger.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (event) => {
    if (themePanel && themePanel.classList.contains('open') && !themePanel.contains(event.target) && !themeTrigger?.contains(event.target)) {
      themePanel.classList.remove('open');
      themeTrigger?.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && themePanel?.classList.contains('open')) {
      themePanel.classList.remove('open');
      themeTrigger?.setAttribute('aria-expanded', 'false');
    }
  });
})();
