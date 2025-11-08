const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');

const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (theme === 'dark') {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  }

  let current = '';
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
    }
  });
});

async function loadProjects() {
  try {
    const response = await fetch('/api/projects');
    const projects = await response.json();
    
    const projectsGrid = document.getElementById('projects-grid');
    
    if (projects.length === 0) {
      projectsGrid.innerHTML = '<p class="loading">No projects available yet.</p>';
      return;
    }
    
    projectsGrid.innerHTML = projects.map(project => {
      const techStackArray = project.tech_stack ? project.tech_stack.split(',').map(t => t.trim()) : [];
      
      return `
        <div class="project-card">
          <div class="project-image">
            ${project.image_url ? `<img src="${project.image_url}" alt="${project.title}">` : '<i class="fas fa-code"></i>'}
          </div>
          <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tech">
              ${techStackArray.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
              ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="project-link github"><i class="fab fa-github"></i> GitHub</a>` : ''}
              ${project.demo_url ? `<a href="${project.demo_url}" target="_blank" class="project-link demo"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
    document.getElementById('projects-grid').innerHTML = '<p class="loading">Failed to load projects.</p>';
  }
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  const btnText = contactForm.querySelector('.btn-text');
  const btnLoading = contactForm.querySelector('.btn-loading');
  const formMessage = document.getElementById('form-message');
  
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  formMessage.style.display = 'none';
  
  try {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      formMessage.textContent = data.message;
      formMessage.className = 'form-message success';
      formMessage.style.display = 'block';
      contactForm.reset();
    } else {
      throw new Error(data.error || 'Failed to send message');
    }
  } catch (error) {
    formMessage.textContent = error.message || 'An error occurred. Please try again.';
    formMessage.className = 'form-message error';
    formMessage.style.display = 'block';
  } finally {
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
  }
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.skill-card, .project-card, .resume-item, .info-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

loadProjects();

async function loadSettings() {
  try {
    const response = await fetch('/api/settings');
    if (response.ok) {
      const settings = await response.json();
      
      if (settings.tagline) {
        document.getElementById('tagline').textContent = settings.tagline;
      }
      if (settings.bio) {
        document.getElementById('bio').textContent = settings.bio;
      }
      if (settings.location) {
        document.getElementById('location').textContent = settings.location;
      }
      if (settings.company) {
        document.getElementById('company').textContent = settings.company;
      }
      if (settings.telegram) {
        document.getElementById('telegram').textContent = settings.telegram;
      }
    }
  } catch (error) {
    console.log('Using default settings');
  }
}

loadSettings();
