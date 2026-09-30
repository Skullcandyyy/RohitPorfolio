// Rohit Kumar Portfolio — Interactive Capabilities

// Smooth scrolling for navigation anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  });
});

// ============================================================
// LIGHTBOX MODAL WITH FULL CAROUSEL NAVIGATION (PREV / NEXT / KEYS)
// ============================================================
let currentGalleryItems = [];
let currentGalleryIndex = 0;

function openLightbox(src, caption) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-counter');

  // Collect all images in the same gallery if possible
  const clickedCard = document.querySelector(`.visual-img-wrap[onclick*="${src}"]`) ||
                      document.querySelector(`img[src="${src}"]`);
  
  if (clickedCard) {
    const gallery = clickedCard.closest('.visuals-gallery') || document;
    const wraps = Array.from(gallery.querySelectorAll('.visual-img-wrap'));
    currentGalleryItems = wraps.map(wrap => {
      const im = wrap.querySelector('img');
      const onclickAttr = wrap.getAttribute('onclick') || '';
      // extract caption from onclick or alt
      const match = onclickAttr.match(/openLightbox\(['"](.*?)['"]\s*,\s*['"](.*?)['"]\)/);
      return {
        src: match ? match[1] : (im ? im.src : ''),
        caption: match ? match[2] : (im ? im.alt : '')
      };
    }).filter(item => item.src);

    currentGalleryIndex = currentGalleryItems.findIndex(item => item.src.includes(src));
    if (currentGalleryIndex === -1) currentGalleryIndex = 0;
  } else {
    currentGalleryItems = [{ src, caption }];
    currentGalleryIndex = 0;
  }

  updateLightboxContent();

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function updateLightboxContent() {
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-counter');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (currentGalleryItems.length > 0 && currentGalleryIndex >= 0) {
    const current = currentGalleryItems[currentGalleryIndex];
    if (img) img.src = current.src;
    if (cap) cap.textContent = current.caption;
    if (counter) {
      if (currentGalleryItems.length > 1) {
        counter.textContent = `${currentGalleryIndex + 1} of ${currentGalleryItems.length}`;
        counter.style.display = 'inline-block';
      } else {
        counter.style.display = 'none';
      }
    }

    if (prevBtn && nextBtn) {
      const showArrows = currentGalleryItems.length > 1 ? 'flex' : 'none';
      prevBtn.style.display = showArrows;
      nextBtn.style.display = showArrows;
    }
  }
}

function prevLightbox(e) {
  if (e) e.stopPropagation();
  if (currentGalleryItems.length > 1) {
    currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    updateLightboxContent();
  }
}

function nextLightbox(e) {
  if (e) e.stopPropagation();
  if (currentGalleryItems.length > 1) {
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryItems.length;
    updateLightboxContent();
  }
}

function closeLightbox(event) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');

  // Do not close if clicking inside modal content controls or image
  if (event.target.id === 'lightbox-modal' || event.target.classList.contains('lightbox-close') || event.target.closest('.lightbox-close')) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      if (img) img.src = '';
    }
  }
}

// Keyboard controls: ArrowLeft, ArrowRight, Escape
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('lightbox-modal');
  if (modal && modal.classList.contains('active')) {
    if (e.key === 'Escape') {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    } else if (e.key === 'ArrowLeft') {
      prevLightbox();
    } else if (e.key === 'ArrowRight') {
      nextLightbox();
    }
  }
});

// ============================================================
// 1-CLICK COPY EMAIL TO CLIPBOARD WITH TOOLTIP FEEDBACK
// ============================================================
function copyEmail(btnElement, email) {
  if (!email) email = 'rohitk22910@gmail.com';
  
  navigator.clipboard.writeText(email).then(() => {
    const originalHTML = btnElement.innerHTML;
    btnElement.classList.add('copied');
    btnElement.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Copied!
    `;
    
    setTimeout(() => {
      btnElement.classList.remove('copied');
      btnElement.innerHTML = originalHTML;
    }, 2200);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}