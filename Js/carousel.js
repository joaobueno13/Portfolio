document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-images");
    const realSlides = Array.from(track.children);
    const prevButton = carousel.querySelector(".carousel-button.prev");
    const nextButton = carousel.querySelector(".carousel-button.next");

    const totalReal = realSlides.length;

    // ── Clones para o loop infinito sem rewind ──────────────────────────
    // Estrutura final: [clone do último] [slides reais...] [clone do primeiro]
    const firstClone = realSlides[0].cloneNode(true);
    const lastClone  = realSlides[totalReal - 1].cloneNode(true);
    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden",  "true");

    track.appendChild(firstClone);   // cópia do 1º no final
    track.prepend(lastClone);         // cópia do último no início

    // Índice atual começa em 1 (primeiro slide real, pulando o clone inicial)
    let currentIndex = 1;
    let isTransitioning = false;

    // ── Indicadores (dots) ──────────────────────────────────────────────
    const indicators = document.createElement("div");
    indicators.classList.add("carousel-indicators");

    realSlides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Ir para slide ${i + 1}`);
      dot.addEventListener("click", () => goToSlide(i + 1)); // +1 por causa do clone inicial
      indicators.appendChild(dot);
    });

    carousel.appendChild(indicators);
    const dots = Array.from(indicators.children);

    // ── Atualiza dots imediatamente (índice lógico 0..totalReal-1) ────────
    function updateDots(logicalIndex) {
      dots.forEach((dot, i) => dot.classList.toggle("active", i === logicalIndex));
    }

    // ── Atualiza apenas a posição do track ──────────────────────────────
    function updateSlidePosition(animate = true) {
      track.style.transition = animate ? "transform 0.5s ease-in-out" : "none";
      track.style.transform  = `translateX(-${currentIndex * 100}%)`;

      // Pausa vídeos fora do slide visível
      Array.from(track.children).forEach((slide, i) => {
        const iframe = slide.querySelector("iframe");
        if (iframe && i !== currentIndex) {
          iframe.contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}', "*"
          );
        }
      });
    }

    // ── Navegação ───────────────────────────────────────────────────────
    function goToSlide(index) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex = index;

      // Calcula o índice lógico correto ANTES da transição
      // index 0           → clone do último → dot totalReal - 1
      // index totalReal+1 → clone do primeiro → dot 0
      // qualquer outro    → index - 1
      let logicalIndex;
      if (index === 0)              logicalIndex = totalReal - 1;
      else if (index === totalReal + 1) logicalIndex = 0;
      else                          logicalIndex = index - 1;

      updateDots(logicalIndex);
      updateSlidePosition(true);
    }

    // Após a transição: detecta se caiu num clone e salta para o real
    // Os dots já foram atualizados no goToSlide, só move o track silenciosamente
    track.addEventListener("transitionend", () => {
      const allSlides = Array.from(track.children);

      // Caiu no clone do primeiro (último elemento) → salta para o real
      if (currentIndex === allSlides.length - 1) {
        currentIndex = 1;
        updateSlidePosition(false);
      }

      // Caiu no clone do último (índice 0) → salta para o real
      if (currentIndex === 0) {
        currentIndex = totalReal;
        updateSlidePosition(false);
      }

      isTransitioning = false;
    });

    // ── Botões ──────────────────────────────────────────────────────────
    prevButton.addEventListener("click", () => goToSlide(currentIndex - 1));
    nextButton.addEventListener("click", () => goToSlide(currentIndex + 1));

    // ── Teclado ─────────────────────────────────────────────────────────
    carousel.setAttribute("tabindex", "0");
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft")  goToSlide(currentIndex - 1);
      if (e.key === "ArrowRight") goToSlide(currentIndex + 1);
    });

    // ── Swipe mobile ────────────────────────────────────────────────────
    let startX = 0;

    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (diff >  50) goToSlide(currentIndex + 1); // swipe esquerda → próximo
      if (diff < -50) goToSlide(currentIndex - 1); // swipe direita  → anterior
    });

    // ── Posição inicial (sem animação) ───────────────────────────────────
    updateDots(0);
    updateSlidePosition(false);
  });
});