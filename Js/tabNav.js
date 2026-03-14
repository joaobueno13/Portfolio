document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll("[data-tab]");
    const tabContents = document.querySelectorAll(".tab-content");
    const underline = document.querySelector(".tab-underline");
    const mobileMenu = document.getElementById("mobileMenu");
    const hamburgerBtn = document.getElementById("hamburgerBtn");

    // Função para atualizar a posição do indicador
    function updateUnderline(activeBtn, animate = true) {
        if (!underline || !activeBtn) return;
        
        if (animate) {
            underline.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
        } else {
            underline.style.transition = "none";
        }
        
        underline.style.width = `${activeBtn.offsetWidth}px`;
        underline.style.left = `${activeBtn.offsetLeft}px`;
    }

    // Função para ativar uma aba pelo ID
    function activateTab(tabId, updateURL = true, animate = true) {
        // Remove a classe 'active' de todos os botões primeiro
        tabButtons.forEach(btn => {
            btn.classList.remove("active");
            btn.setAttribute("aria-selected", "false");
        });

        // Remove a classe 'active' de todos os conteúdos
        tabContents.forEach(content => {
            content.classList.remove("active");
            content.setAttribute("hidden", "");
        });

        // Adiciona a classe 'active' apenas ao botão e conteúdo ativos
        const activeButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        const activeContent = document.getElementById(tabId);
        
        if (activeButton) {
            activeButton.classList.add("active");
            activeButton.setAttribute("aria-selected", "true");
        }
        
        if (activeContent) {
            activeContent.classList.add("active");
            activeContent.removeAttribute("hidden");
        }

        // Move underline (apenas desktop)
        const desktopActiveBtn = document.querySelector(`.tab-nav .tab-button[data-tab="${tabId}"]`);
        updateUnderline(desktopActiveBtn, animate);

        // Fecha menu mobile se estiver aberto
        if (mobileMenu && mobileMenu.classList.contains("active")) {
            mobileMenu.classList.remove("active");
        }

        // Atualiza URL com hash sem recarregar página
        if (updateURL) {
            history.pushState({ tab: tabId }, "", `#${tabId}`);
        }
    }

    // Detecta clique em botões
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (button.dataset.tab) {
                activateTab(button.dataset.tab, true, true);
            }
        });
    });

    // Botão hambúrguer
    hamburgerBtn?.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });

    // Detecta navegação pelo botão "voltar" ou hash direto
    window.addEventListener("popstate", (event) => {
        const tabId = event.state?.tab || location.hash.replace("#", "") || "hero";
        activateTab(tabId, false, true);
    });

    // Ao carregar, verifica se tem hash na URL
    const initialTab = location.hash.replace("#", "") || "hero";
    
    // Aguarda o DOM estar completamente renderizado
    setTimeout(() => {
        activateTab(initialTab, false, false);
        
        // Re-posiciona após um breve delay
        setTimeout(() => {
            const activeBtn = document.querySelector(`.tab-nav .tab-button[data-tab="${initialTab}"]`);
            updateUnderline(activeBtn, false);
        }, 50);
    }, 10);

    // Ajusta underline no redimensionamento
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const activeBtn = document.querySelector(".tab-nav .tab-button[aria-selected='true']");
            updateUnderline(activeBtn, false);
        }, 100);
    });

    // Fecha menu mobile ao clicar em um link
    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            e.target.closest('.mobile-menu .tab-button')) {
            mobileMenu.classList.remove('active');
        }
    });
});