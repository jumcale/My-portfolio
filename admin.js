async function verifyAuth() {
  try {
    const response = await fetch('/api/auth/verify');
    if (!response.ok) {
      window.location.href = '/admin';
      return false;
    }
    return true;
  } catch (error) {
    window.location.href = '/admin';
    return false;
  }
}

const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
const tabs = {
  projects: document.getElementById('projects-tab'),
  messages: document.getElementById('messages-tab'),
  settings: document.getElementById('settings-tab')
};
const contentTitle = document.getElementById('content-title');
const logoutBtn = document.getElementById('logout-btn');
const projectModal = document.getElementById('project-modal');
const projectForm = document.getElementById('project-form');
const addProjectBtn = document.getElementById('add-project-btn');
const settingsForm = document.getElementById('settings-form');

let currentEditingProject = null;

const titles = {
  projects: 'Projects Management',
  messages: 'Contact Messages',
  settings: 'Portfolio Settings'
};

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = item.dataset.tab;
    if (tab) {
      switchTab(tab);
    }
  });
});

function switchTab(tabName) {
  navItems.forEach(item => item.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  Object.keys(tabs).forEach(key => {
    tabs[key].style.display = key === tabName ? 'block' : 'none';
  });
  
  contentTitle.textContent = titles[tabName];
  
  if (tabName === 'projects') {
    loadProjects();
  } else if (tabName === 'messages') {
    loadMessages();
  } else if (tabName === 'settings') {
    loadSettings();
  }
}

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin';
  } catch (error) {
    console.error('Logout error:', error);
  }
});

addProjectBtn.addEventListener('click', () => {
  currentEditingProject = null;
  document.getElementById('modal-title').textContent = 'Add New Project';
  projectForm.reset();
  document.getElementById('project-id').value = '';
  projectModal.classList.add('active');
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    projectModal.classList.remove('active');
  });
});

projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) {
    projectModal.classList.remove('active');
  }
});

projectForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const projectId = document.getElementById('project-id').value;
  const projectData = {
    title: document.getElementById('project-title').value,
    description: document.getElementById('project-description').value,
    tech_stack: document.getElementById('project-tech').value,
    image_url: document.getElementById('project-image').value || null,
    github_url: document.getElementById('project-github').value || null,
    demo_url: document.getElementById('project-demo').value || null,
    order_index: parseInt(document.getElementById('project-order').value) || 0,
    is_featured: document.getElementById('project-featured').checked
  };
  
  try {
    const url = projectId ? `/api/projects/${projectId}` : '/api/projects';
    const method = projectId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    });
    
    if (response.ok) {
      projectModal.classList.remove('active');
      loadProjects();
    } else {
      const data = await response.json();
      alert('Error: ' + (data.error || 'Failed to save project'));
    }
  } catch (error) {
    console.error('Error saving project:', error);
    alert('Failed to save project');
  }
});

async function loadProjects() {
  try {
    const response = await fetch('/api/projects');
    const projects = await response.json();
    
    const projectsList = document.getElementById('projects-list');
    
    if (projects.length === 0) {
      projectsList.innerHTML = '<div class="empty-state"><i class="fas fa-project-diagram"></i><p>No projects yet. Add your first project!</p></div>';
      return;
    }
    
    projectsList.innerHTML = projects.map(project => `
      <div class="project-item">
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-meta">
            ${project.tech_stack.split(',').map(tech => `<span class="meta-tag">${tech.trim()}</span>`).join('')}
            ${project.is_featured ? '<span class="meta-tag" style="background: #ffd700; color: #000;">⭐ Featured</span>' : ''}
          </div>
        </div>
        <div class="project-actions">
          <button class="btn btn-sm btn-secondary" onclick="editProject(${project.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteProject(${project.id})">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
    document.getElementById('projects-list').innerHTML = '<div class="loading">Failed to load projects</div>';
  }
}

async function editProject(id) {
  try {
    const response = await fetch(`/api/projects/${id}`);
    const project = await response.json();
    
    document.getElementById('modal-title').textContent = 'Edit Project';
    document.getElementById('project-id').value = project.id;
    document.getElementById('project-title').value = project.title;
    document.getElementById('project-description').value = project.description;
    document.getElementById('project-tech').value = project.tech_stack;
    document.getElementById('project-image').value = project.image_url || '';
    document.getElementById('project-github').value = project.github_url || '';
    document.getElementById('project-demo').value = project.demo_url || '';
    document.getElementById('project-order').value = project.order_index;
    document.getElementById('project-featured').checked = project.is_featured;
    
    projectModal.classList.add('active');
  } catch (error) {
    console.error('Error loading project:', error);
    alert('Failed to load project');
  }
}

async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      loadProjects();
    } else {
      alert('Failed to delete project');
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    alert('Failed to delete project');
  }
}

async function loadMessages() {
  try {
    const response = await fetch('/api/contacts');
    const messages = await response.json();
    
    const messagesList = document.getElementById('messages-list');
    const unreadCount = messages.filter(m => !m.is_read).length;
    document.getElementById('unread-count').textContent = unreadCount;
    
    if (messages.length === 0) {
      messagesList.innerHTML = '<div class="empty-state"><i class="fas fa-envelope-open"></i><p>No messages yet</p></div>';
      return;
    }
    
    messagesList.innerHTML = messages.map(message => `
      <div class="message-item ${!message.is_read ? 'unread' : ''}" onclick="markAsRead(${message.id})">
        <div class="message-header">
          <div>
            <div class="message-from">${message.name}</div>
            <div class="message-email">${message.email}</div>
          </div>
          <div class="message-date">${new Date(message.created_at).toLocaleDateString()}</div>
        </div>
        <div class="message-body">${message.message}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading messages:', error);
    document.getElementById('messages-list').innerHTML = '<div class="loading">Failed to load messages</div>';
  }
}

async function markAsRead(id) {
  try {
    await fetch(`/api/contacts/${id}/read`, {
      method: 'PUT'
    });
    loadMessages();
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
}

async function loadSettings() {
  try {
    const response = await fetch('/api/settings');
    if (response.ok) {
      const settings = await response.json();
      
      document.getElementById('tagline').value = settings.tagline || '';
      document.getElementById('bio').value = settings.bio || '';
      document.getElementById('location').value = settings.location || '';
      document.getElementById('company').value = settings.company || '';
      document.getElementById('telegram').value = settings.telegram || '';
      document.getElementById('github').value = settings.github || '';
      document.getElementById('linkedin').value = settings.linkedin || '';
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

settingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const settingsData = {
    tagline: document.getElementById('tagline').value,
    bio: document.getElementById('bio').value,
    location: document.getElementById('location').value,
    company: document.getElementById('company').value,
    telegram: document.getElementById('telegram').value,
    github: document.getElementById('github').value,
    linkedin: document.getElementById('linkedin').value
  };
  
  const messageEl = document.getElementById('settings-message');
  
  try {
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settingsData)
    });
    
    if (response.ok) {
      messageEl.textContent = 'Settings saved successfully!';
      messageEl.className = 'form-message success';
    } else {
      throw new Error('Failed to save settings');
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    messageEl.textContent = 'Failed to save settings';
    messageEl.className = 'form-message error';
  }
  
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
});

verifyAuth().then(isAuth => {
  if (isAuth) {
    loadProjects();
    loadMessages();
  }
});
