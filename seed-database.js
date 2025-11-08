const bcrypt = require('bcryptjs');
const { pool, initDatabase } = require('./db-setup');

const seedDatabase = async () => {
  try {
    await initDatabase();
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.query(`
      INSERT INTO users (username, password, email)
      VALUES ($1, $2, $3)
      ON CONFLICT (username) DO NOTHING
    `, ['admin', hashedPassword, 'jimmyabdurahman@example.com']);

    const projects = [
      {
        title: 'AI Crypto Trading Bot (MLTraderPro)',
        description: 'Advanced cryptocurrency trading bot powered by machine learning algorithms for market prediction and automated trading with comprehensive risk management features.',
        tech_stack: 'Python, TensorFlow, scikit-learn, Binance API, pandas, NumPy',
        image_url: '/images/mltrader.jpg',
        github_url: 'https://github.com/jimcaale',
        demo_url: '',
        order_index: 6,
        is_featured: true
      },
      {
        title: 'Baxnaano Vet Management System',
        description: 'Comprehensive offline/online veterinary clinic management application built for Arabsiyo-based clinic. Features appointment scheduling, patient records, and inventory management.',
        tech_stack: 'React, Node.js, Express, MongoDB, PWA',
        image_url: '/images/baxnaano.jpg',
        github_url: 'https://github.com/jimcaale',
        demo_url: '',
        order_index: 5,
        is_featured: true
      },
      {
        title: 'Sombuilder School Platform',
        description: 'Custom e-learning platform designed for students with class-based file storage, assignment management, and real-time collaboration tools.',
        tech_stack: 'React, Node.js, PostgreSQL, Socket.io, AWS S3',
        image_url: '/images/sombuilder-school.jpg',
        github_url: 'https://github.com/jimcaale',
        demo_url: '',
        order_index: 4,
        is_featured: true
      },
      {
        title: 'AI Customer Support Agent',
        description: 'Intelligent chatbot system designed for local businesses to automate customer support with natural language processing and context-aware responses.',
        tech_stack: 'Python, Natural Language Processing, Flask, React, OpenAI API',
        image_url: '/images/ai-support.jpg',
        github_url: 'https://github.com/jimcaale',
        demo_url: '',
        order_index: 3,
        is_featured: false
      }
    ];

    for (const project of projects) {
      await pool.query(`
        INSERT INTO projects (title, description, tech_stack, image_url, github_url, demo_url, order_index, is_featured)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [project.title, project.description, project.tech_stack, project.image_url, 
          project.github_url, project.demo_url, project.order_index, project.is_featured]);
    }

    await pool.query(`
      INSERT INTO settings (key, value)
      VALUES 
        ('tagline', 'Turning smart ideas into digital reality.'),
        ('bio', 'I''m Jimcaale, a passionate AI developer and web creator from Somaliland. I specialize in building intelligent digital systems that empower local businesses, startups, and individuals. Founder of Sombuilder Online, I believe technology can transform the future of Africa through innovation, creativity, and smart automation.'),
        ('location', 'Arabsiyo, Somaliland'),
        ('company', 'Sombuilder Online'),
        ('telegram', '@Jimmyabdurahman'),
        ('github', 'https://github.com/jimcaale'),
        ('linkedin', 'https://linkedin.com/in/jimcaale')
      ON CONFLICT (key) DO NOTHING
    `);

    console.log('✅ Database seeded successfully!');
    console.log('📝 Admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
