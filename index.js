let chat_history = [];

// ==========================================
// PARTICLE BACKGROUND EFFECT
// ==========================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() * 30 + 220; // soft blue-purple range
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.8;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 30%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles based on screen size
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(180, 180, 210, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animId = requestAnimationFrame(animate);
  }
  animate();
})();

// ==========================================
// SCROLL REVEAL OBSERVER
// ==========================================
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  // Experience entries sometimes sit inside large containers; observe them with
  // slightly more forgiving settings so they reliably trigger on scroll.
  const expEntries = document.querySelectorAll('.exp-entry.reveal');
  if (expEntries.length) {
    const expObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -30% 0px'
    });

    expEntries.forEach(el => expObserver.observe(el));
  }

  // Timeline line animation
  const timelineLine = document.querySelector('.timeline-line');
  if (timelineLine) {
    const tlObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -20% 0px' });
    tlObserver.observe(timelineLine);
  }

  // Timeline dots
  const dots = document.querySelectorAll('.timeline-dot');
  const dotObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('active');
        }, 300);

        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -20% 0px' });
  dots.forEach(d => dotObserver.observe(d));

  // Contact form stagger
  const form = document.querySelector('#contact form');
  if (form) {
    const formObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('form-revealed');
        }
      });
    }, { threshold: 0.2 });
    formObserver.observe(form);
  }
})();

// ==========================================
// PROJECT MODAL
// ==========================================
const projectData = {
  luna: {
    title: 'Luna — AI Assistant',
    tags: [
      { label: 'AI', color: 'blue' },
      { label: 'RAG', color: 'purple' },
      { label: 'GPT-3.5 Turbo', color: 'green' },
      { label: 'Node.js', color: 'emerald' },
      { label: 'Python', color: 'amber' }
    ],
    description: `Luna is a custom-built AI assistant powered by GPT-3.5 Turbo that uses Retrieval-Augmented Generation (RAG) to answer questions about Chetan. She continuously improves through every conversation, learning and adapting to provide more accurate and contextual responses.`,
    details: `
      <h4 class="font-semibold text-gray-900 mb-2">Key Features</h4>
      <ul class="text-sm text-gray-600 space-y-2 mb-6">
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Retrieval-Augmented Generation for contextual answers</li>
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Continuous learning from conversation history</li>
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Custom knowledge base about Chetan's experience</li>
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Real-time streaming responses</li>
      </ul>
      <h4 class="font-semibold text-gray-900 mb-2">Tech Stack</h4>
      <p class="text-sm text-gray-600">Node.js backend, Python for embeddings, OpenAI GPT-3.5 Turbo API, Vector database for semantic search, REST API architecture</p>
    `,
    images: ['./assets/projects/luna/chat.png', './assets/projects/luna/luna_arc.png'],
    links: []
  },
  picatu: {
    title: 'Picatu — Facial Recognition Search',
    tags: [
      { label: 'Deep Learning', color: 'orange' },
      { label: 'Image Recognition', color: 'pink' },
      { label: 'Python', color: 'amber' },
      { label: 'TensorFlow', color: 'red' }
    ],
    description: `Picatu is a facial recognition tool that searches for images of specific individuals across event databases. Users input an image, and the system returns all matching photos using a sophisticated deep learning model trained for facial feature extraction and comparison.`,
    details: `
      <h4 class="font-semibold text-gray-900 mb-2">Key Features</h4>
      <ul class="text-sm text-gray-600 space-y-2 mb-6">
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Advanced facial recognition and matching</li>
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Event-based image database management</li>
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> High accuracy deep learning model</li>
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Fast search across thousands of images</li>
      </ul>
      <h4 class="font-semibold text-gray-900 mb-2">Tech Stack</h4>
      <p class="text-sm text-gray-600">Python, TensorFlow/Keras, OpenCV, Face embedding vectors, REST API</p>
    `,
    images: ['./assets/projects/picatu/landing1.png', './assets/projects/picatu/landing2.png', './assets/projects/picatu/landing3.png'],
    links: []
  },
  doctors: {
    title: 'Trusted Doctors — Healthcare Platform',
    tags: [
      { label: 'Healthcare', color: 'teal' },
      { label: 'Web App', color: 'indigo' },
      { label: 'Full Stack', color: 'blue' }
    ],
    description: `Trusted Doctors is a comprehensive web application connecting users with verified healthcare professionals. The platform enables seamless communication, appointment scheduling, and access to quality healthcare services through an intuitive digital interface.`,
    details: `
      <h4 class="font-semibold text-gray-900 mb-2">Key Features</h4>
      <ul class="text-sm text-gray-600 space-y-2 mb-6">
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Doctor discovery and verification system</li>
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Appointment scheduling and management</li>
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Secure patient-doctor communication</li>
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Review and rating system</li>
      </ul>
      <h4 class="font-semibold text-gray-900 mb-2">Tech Stack</h4>
      <p class="text-sm text-gray-600">Full-stack web application with modern frontend, RESTful backend, and database management</p>
    `,
    images: ['./assets/projects/doctors.png'],
    links: [
      { label: 'View Report', url: './assets/projects/doctors.pdf', icon: 'doc' }
    ]
  },
  travellers: {
    title: "Travellers Jungle Camp — Resort Website",
    tags: [
      { label: 'Travel', color: 'emerald' },
      { label: 'Booking', color: 'amber' },
      { label: 'Web Design', color: 'blue' }
    ],
    description: `A beautifully designed resort website for Chitwan's Travellers Jungle Camp. The platform allows customers to explore the resort, browse available packages, book rooms, schedule jungle safaris, and discover the natural beauty of Chitwan National Park.`,
    details: `
      <h4 class="font-semibold text-gray-900 mb-2">Key Features</h4>
      <ul class="text-sm text-gray-600 space-y-2 mb-6">
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Online room booking system</li>
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Jungle safari package browsing</li>
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Photo gallery and virtual tours</li>
        <li class="flex items-start gap-2"><span class="text-emerald-500 mt-0.5">&#10003;</span> Responsive mobile-first design</li>
      </ul>
      <h4 class="font-semibold text-gray-900 mb-2">Tech Stack</h4>
      <p class="text-sm text-gray-600">Modern web technologies, responsive design, booking integration, SEO optimized</p>
    `,
    images: ['./assets/projects/travellers/landing1.png', './assets/projects/travellers/landing2.png', './assets/projects/travellers/landing3.png'],
    links: [
      { label: 'Visit Website', url: 'https://nepaljunglecamp.com/', icon: 'link' }
    ]
  }
};

const tagColors = {
  blue: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
  green: 'bg-green-50 text-green-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  orange: 'bg-orange-50 text-orange-700',
  pink: 'bg-pink-50 text-pink-700',
  red: 'bg-red-50 text-red-700',
  teal: 'bg-teal-50 text-teal-700',
  indigo: 'bg-indigo-50 text-indigo-700'
};

function openProjectModal(projectKey) {
  const project = projectData[projectKey];
  if (!project) return;

  const modal = document.getElementById('projectModal');

  // Image area — slider for multiple images
  const imageArea = document.getElementById('modalImageArea');
  if (project.images.length > 1) {
    let currentSlide = 0;
    imageArea.innerHTML = `
      <div class="relative w-full h-full">
        <img id="modalSlideImg" src="${project.images[0]}" alt="${project.title}" class="w-full h-full object-cover transition-opacity duration-500" />
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          ${project.images.map((_, i) => `<button class="modal-dot w-2.5 h-2.5 rounded-full transition-all ${i === 0 ? 'bg-white scale-110' : 'bg-white/50'}" data-index="${i}"></button>`).join('')}
        </div>
      </div>`;
    // Auto-slide
    const slideImg = document.getElementById('modalSlideImg');
    const dots = imageArea.querySelectorAll('.modal-dot');
    let slideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % project.images.length;
      slideImg.style.opacity = 0;
      setTimeout(() => {
        slideImg.src = project.images[currentSlide];
        slideImg.style.opacity = 1;
        dots.forEach((d, i) => {
          d.className = `modal-dot w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-white scale-110' : 'bg-white/50'}`;
        });
      }, 300);
    }, 3000);
    // Click dots
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentSlide = parseInt(dot.dataset.index);
        slideImg.style.opacity = 0;
        setTimeout(() => {
          slideImg.src = project.images[currentSlide];
          slideImg.style.opacity = 1;
          dots.forEach((d, i) => {
            d.className = `modal-dot w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-white scale-110' : 'bg-white/50'}`;
          });
        }, 300);
      });
    });
    // Store interval for cleanup
    modal._slideInterval = slideInterval;
  } else {
    imageArea.innerHTML = `<img src="${project.images[0]}" alt="${project.title}" class="w-full h-full object-cover" />`;
  }

  // Tags
  const tagsEl = document.getElementById('modalTags');
  tagsEl.innerHTML = project.tags.map(t =>
    `<span class="px-2.5 py-0.5 text-xs font-medium rounded-full ${tagColors[t.color] || 'bg-gray-100 text-gray-700'}">${t.label}</span>`
  ).join('');

  // Title & description
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDescription').textContent = project.description;

  // Details
  document.getElementById('modalDetails').innerHTML = project.details;
   
  // Links
  const linksEl = document.getElementById('modalLinks');
  if (project.links && project.links.length > 0) {
    linksEl.innerHTML = project.links.map(l =>
      `<a href="${l.url}" target="_blank" class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity">${l.label} &rarr;</a>`
    ).join('');
  } else {
    linksEl.innerHTML = '';
  }

  // Show modal
  requestAnimationFrame(() => {
    modal.classList.add('open');
    document.body.classList.add('modal-open');
  });
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
  if (modal._slideInterval) {
    clearInterval(modal._slideInterval);
    modal._slideInterval = null;
  }
}

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ==========================================
// SLIDE ANIMATION IN PROJECTS SECTION
// ==========================================
const sliders = document.querySelectorAll('.slider');
let counter = 1;
setInterval(() => {
  sliders.forEach(slider => {
    const images = slider.querySelectorAll('img');
    images.forEach(img => img.style.transform = `translateX(-${counter * 100}%)`);
  });
  counter++;
  if (counter === 3) counter = 0;
}, 3000);

// ==========================================
// SMOOTH PARALLAX ON HEADER
// ==========================================
(function initHeaderScroll() {
  const header = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 100) {
      header.style.boxShadow = '0 1px 10px rgba(0,0,0,0.05)';
    } else {
      header.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
  }, { passive: true });
})();

// ==========================================
// ACTIVE NAV LINK HIGHLIGHTING
// ==========================================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('header nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('text-foreground', 'nav-active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-foreground', 'nav-active');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// ==========================================
// CHAT SYSTEM
// ==========================================

// Quick question buttons
document.getElementById('research').addEventListener('click', function () {
  const inputField = document.getElementById('userInput');
  inputField.value = "Tell me about Chetan's research?";
  sendMessage();
});

document.getElementById('purpose').addEventListener('click', function () {
  const inputField = document.getElementById('userInput');
  inputField.value = "What's your purpose?";
  sendMessage();
});

document.getElementById('chetan').addEventListener('click', function () {
  const inputField = document.getElementById('userInput');
  inputField.value = "Who is Chetan?";
  sendMessage();
});

// Handle chat
document.getElementById('sendMessage').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

async function sendMessage() {
  const chatboxMessages = document.getElementById('chatboxMessages');
  const userInput = document.getElementById('userInput');
  const message = userInput.value.trim();

  if (!message) return;

  appendMessage('user', message);
  userInput.value = '';

  // Show loading indicator
  const loadingEl = document.createElement('div');
  loadingEl.className = 'flex items-center gap-2 p-3 bg-gray-50 rounded-xl max-w-[75%] mr-auto';
  loadingEl.innerHTML = '<img src="./assets/icons8-loading.gif" alt="loading" class="w-5 h-5" /><span class="text-xs text-gray-400">Luna is typing...</span>';
  chatboxMessages.appendChild(loadingEl);
  chatboxMessages.scrollTop = chatboxMessages.scrollHeight;

  try {
    const response = await fetch('https://api.ticketsewa.com.np/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: message, chat_history }),
    });
    const data = await response.json();
    chatboxMessages.removeChild(loadingEl);
    appendMessage('bot', data.response, message, true);
  } catch (error) {
    console.error(error);
    chatboxMessages.removeChild(loadingEl);
    appendMessage('bot', { response: 'Sorry, something went wrong. Please try again.' }, message, true);
  }
}

function appendMessage(sender, message, userPrompt, isResponse = false) {
  const chatboxMessages = document.getElementById('chatboxMessages');
  const messageElement = document.createElement('div');

  messageElement.classList.add('px-4', 'py-2.5', 'rounded-2xl', 'text-sm', 'leading-relaxed', 'max-w-[75%]', 'w-fit');
  // Entrance animation
  messageElement.style.opacity = '0';
  messageElement.style.transform = 'translateY(10px)';
  messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

  if (sender === 'user') {
    messageElement.textContent = message;
    messageElement.classList.add('bg-foreground', 'text-background', 'ml-auto', 'rounded-br-sm');
    chatboxMessages.appendChild(messageElement);
  } else if (isResponse) {
    messageElement.classList.add('bg-gray-100', 'text-gray-800', 'mr-auto', 'rounded-bl-sm');
    messageElement.textContent = message.response;
    chat_history.push({ user: userPrompt, response: message.response });
    chatboxMessages.appendChild(messageElement);

    if (message.links !== null && message.links) {
      for (const item of message.links) {
        const linkElement = document.createElement('a');
        linkElement.href = item.link_url;
        linkElement.textContent = item.name;
        linkElement.target = '_blank';
        linkElement.classList.add('block', 'mt-1', 'text-blue-600', 'underline', 'text-xs');
        messageElement.appendChild(linkElement);
      }
    }
  }

  // Trigger entrance animation
  requestAnimationFrame(() => {
    messageElement.style.opacity = '1';
    messageElement.style.transform = 'translateY(0)';
  });

  chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
}

// ==========================================
// COPY EMAIL
// ==========================================
function copyEmail() {
  const email = 'chetan.6.pun@gmail.com';
  const messageEl = document.getElementById('copyMessage');

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email).then(() => {
      messageEl.textContent = 'Copied!';
      setTimeout(() => { messageEl.textContent = ''; }, 2000);
    }).catch(() => {
      fallbackCopy(email, messageEl);
    });
  } else {
    fallbackCopy(email, messageEl);
  }
}

function fallbackCopy(text, messageEl) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    messageEl.textContent = 'Copied!';
  } catch (err) {
    messageEl.textContent = 'Failed to copy';
  }
  document.body.removeChild(textarea);
  setTimeout(() => { messageEl.textContent = ''; }, 2000);
}

