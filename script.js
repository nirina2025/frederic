// Variables globales
let isMenuOpen = false;
let currentFilter = 'all';

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSearch();
    initializeFilters();
    initializeAnimations();
    initializeStats();
    initializeFavorites();
    initializeGPS();
});

// Navigation
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect sur la navbar
    window.addEventListener('scroll', () => {
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
    });

    // Menu hamburger
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Animation des barres du hamburger
            const spans = hamburger.querySelectorAll('span');
            if (isMenuOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Navigation smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Fermer le menu mobile
                if (isMenuOpen && navMenu && hamburger) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    isMenuOpen = false;
                }
                
                // Mettre à jour le lien actif
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}

// Recherche
function initializeSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const locationInput = document.getElementById('locationInput');

    // Vérifier que les éléments existent avant d'ajouter les event listeners
    if (!searchBtn || !searchInput || !locationInput) {
        return; // Sortir de la fonction si les éléments n'existent pas
    }

    // Fonction de recherche
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        const location = locationInput.value.trim();
        
        if (searchTerm || location) {
            // Animation de chargement
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recherche...';
            searchBtn.disabled = true;
            
            // Simulation de recherche
            setTimeout(() => {
                console.log('Recherche:', { searchTerm, location, filter: currentFilter });
                
                // Afficher les résultats (simulation)
                showSearchResults(searchTerm, location);
                
                // Restaurer le bouton
                searchBtn.innerHTML = '<span>Rechercher</span><i class="fas fa-arrow-right"></i>';
                searchBtn.disabled = false;
            }, 1500);
        } else {
            // Animation d'erreur
            searchInput.style.borderColor = '#DC3545';
            setTimeout(() => {
                searchInput.style.borderColor = '';
            }, 2000);
        }
    }

    // Event listeners
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Autocomplétion (simulation)
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value.length > 2) {
            // Ici on pourrait ajouter une vraie autocomplétion
            console.log('Autocomplétion pour:', value);
        }
    });
}

// Filtres
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mettre à jour l'état actif
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Mettre à jour le filtre actuel
            currentFilter = btn.dataset.filter;
            
            // Animation du filtre
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
            
            // Appliquer le filtre
            applyFilter(currentFilter);
        });
    });
}

function applyFilter(filter) {
    const cards = document.querySelectorAll('.friterie-card');
    
    cards.forEach(card => {
        // Animation de sortie
        card.style.opacity = '0.5';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            // Logique de filtrage (simulation)
            let shouldShow = true;
            
            switch(filter) {
                case 'traditional':
                    shouldShow = card.querySelector('.specialty-tag[data-type="traditional"]') !== null;
                    break;
                case 'gourmet':
                    shouldShow = card.querySelector('.specialty-tag[data-type="gourmet"]') !== null;
                    break;
                case '24h':
                    shouldShow = card.querySelector('.card-status').textContent.includes('24h');
                    break;
                default:
                    shouldShow = true;
            }
            
            // Animation d'entrée
            if (shouldShow) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
            }
        }, 200);
    });
    
    console.log('Filtre appliqué:', filter);
}

// Animations
function initializeAnimations() {
    // Observer pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.friterie-card, .feature-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Animation du scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('.about-section');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Statistiques animées
function initializeStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;
    
    const animateStats = () => {
        if (statsAnimated) return;
        statsAnimated = true;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Formatage des nombres
                if (target >= 1000) {
                    stat.textContent = Math.floor(current).toLocaleString('fr-FR');
                } else {
                    stat.textContent = Math.floor(current);
                }
                
                if (target < 100 && current === target) {
                    stat.textContent += '%';
                }
            }, 16);
        });
    };
    
    // Observer pour déclencher l'animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
}

// Favoris
function initializeFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const isActive = btn.classList.contains('active');
            const icon = btn.querySelector('i');
            
            // Animation
            btn.style.transform = 'scale(0.8)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
            
            if (isActive) {
                btn.classList.remove('active');
                icon.className = 'far fa-heart';
                showNotification('Retiré des favoris', 'info');
            } else {
                btn.classList.add('active');
                icon.className = 'fas fa-heart';
                showNotification('Ajouté aux favoris', 'success');
                
                // Animation de coeur
                createHeartAnimation(btn);
            }
            
            // Mettre à jour le compteur
            updateFavoriteCount();
        });
    });
}

function createHeartAnimation(button) {
    const heart = document.createElement('div');
    heart.innerHTML = '<i class="fas fa-heart"></i>';
    heart.style.cssText = `
        position: absolute;
        color: #FF6B35;
        font-size: 1.5rem;
        pointer-events: none;
        animation: heartFloat 1s ease-out forwards;
        z-index: 1000;
    `;
    
    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + rect.width / 2 + 'px';
    heart.style.top = rect.top + rect.height / 2 + 'px';
    
    document.body.appendChild(heart);
    
    // Supprimer après l'animation
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

function updateFavoriteCount() {
    const activeHearts = document.querySelectorAll('.favorite-btn.active').length;
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = activeHearts;
        
        // Animation du compteur
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }
}

// GPS
function initializeGPS() {
    const gpsBtn = document.getElementById('gpsBtn');
    const locationInput = document.getElementById('locationInput');
    
    // Vérifier que les éléments existent avant d'ajouter les event listeners
    if (!gpsBtn || !locationInput) {
        return; // Sortir de la fonction si les éléments n'existent pas
    }
    
    gpsBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            // Animation de chargement
            gpsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            gpsBtn.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Simulation de géocodage inverse
                    setTimeout(() => {
                        locationInput.value = 'Bruxelles, 1000'; // Simulation
                        gpsBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                        gpsBtn.disabled = false;
                        
                        showNotification('Position détectée', 'success');
                    }, 1000);
                },
                (error) => {
                    gpsBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                    gpsBtn.disabled = false;
                    showNotification('Impossible de détecter votre position', 'error');
                }
            );
        } else {
            showNotification('Géolocalisation non supportée', 'error');
        }
    });
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animation de sortie
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#28A745';
        case 'error': return '#DC3545';
        case 'warning': return '#FFC107';
        default: return '#17A2B8';
    }
}

// Résultats de recherche
function showSearchResults(searchTerm, location) {
    // Simulation d'affichage des résultats
    const resultsSection = document.querySelector('.popular-friteries');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Mettre en évidence les résultats
        const cards = document.querySelectorAll('.friterie-card');
        cards.forEach(card => {
            card.style.border = '2px solid #FF6B35';
            setTimeout(() => {
                card.style.border = '';
            }, 2000);
        });
    }
    
    showNotification(`${Math.floor(Math.random() * 20) + 5} friteries trouvées`, 'success');
}

// Actions des cartes
document.addEventListener('click', (e) => {
    // Boutons d'action des cartes
    if (e.target.closest('.action-btn')) {
        const btn = e.target.closest('.action-btn');
        const card = btn.closest('.friterie-card');
        const friterieNameEl = card.querySelector('.card-title');
        const friterieName = friterieNameEl ? friterieNameEl.textContent : 'Friterie';
        
        if (btn.querySelector('.fa-phone')) {
            showNotification(`Appel vers ${friterieName}`, 'info');
        } else if (btn.querySelector('.fa-directions')) {
            showNotification(`Itinéraire vers ${friterieName}`, 'info');
        } else if (btn.textContent.includes('Voir détails')) {
            showNotification(`Ouverture des détails de ${friterieName}`, 'info');
        }
    }
    
    // Boutons de région
    if (e.target.classList.contains('region-btn')) {
        const regionBtns = document.querySelectorAll('.region-btn');
        regionBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        showNotification(`Région sélectionnée: ${e.target.textContent}`, 'info');
    }
});

// CSS pour les animations personnalisées
const style = document.createElement('style');
style.textContent = `
    @keyframes heartFloat {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -150px) scale(1.5);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .friterie-card {
        transition: all 0.3s ease;
    }
    
    .action-btn {
        transition: all 0.2s ease;
    }
    
    .action-btn:active {
        transform: scale(0.95);
    }
`;
document.head.appendChild(style);