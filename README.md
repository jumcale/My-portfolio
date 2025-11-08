# Professional Portfolio Website

A modern, full-stack portfolio website for **Jimcaale Cabdiraxmaan Cabdilaahi Maaweel**, AI Developer and Founder of Sombuilder Online.

## Features

### Frontend
- **Hero Section** with professional introduction and tagline
- **About Me** section with bio and quick info cards
- **Skills & Expertise** section with progress bars and categories
- **Projects** section with dynamic loading from database
- **Resume** section with downloadable PDF
- **Contact Form** with email notifications
- **Dark/Light Mode** toggle
- **Responsive Design** for all devices
- **Smooth Animations** and transitions

### Admin Dashboard
- **Secure Login** with JWT authentication
- **Projects Management** - Add, edit, and delete portfolio projects
- **Messages Inbox** - View and manage contact form submissions
- **Settings Panel** - Update profile information and social links
- **Real-time Updates** - Changes reflect immediately on the portfolio

### Backend
- **Express.js** server with RESTful API
- **PostgreSQL** database for data persistence
- **JWT Authentication** for secure admin access
- **Email Notifications** via Nodemailer
- **Security Best Practices** - HttpOnly cookies, CORS, input validation

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Replit Database)
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer
- **Hosting**: Replit

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database (automatically provided by Replit)
DATABASE_URL=your_postgres_connection_string

# Security (REQUIRED for production)
JWT_SECRET=your_secure_random_secret_here
NODE_ENV=production

# Email Configuration (optional but recommended)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Server Port
PORT=5000
```

**Important**: Generate a strong JWT secret using:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Install Dependencies

Dependencies are automatically installed on Replit. If running locally:

```bash
npm install
```

### 3. Database Setup

Initialize and seed the database:

```bash
node seed-database.js
```

This creates:
- Database tables (users, projects, contacts, settings)
- Admin user (username: `admin`, password: `admin123`)
- Sample projects
- Default settings

**⚠️ Change the admin password immediately after first login!**

### 4. Run the Server

The server starts automatically on Replit. If running locally:

```bash
npm start
```

Visit `http://localhost:5000` to view your portfolio.

## Admin Access

1. Navigate to `/admin` or click the admin link
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`
3. **Change the password immediately!**

## Email Setup (Optional)

To enable contact form email notifications:

1. Create a Gmail App Password:
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Generate a new app password for "Mail"

2. Add to `.env`:
   ```
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=your_16_digit_app_password
   ```

3. Restart the server

## Customization

### Adding Your Content

1. **Profile Photo**: Upload to `public/images/profile.jpg`
2. **Resume PDF**: Upload to `public/assets/resume.pdf`
3. **Projects**: Use the admin dashboard to add/edit projects
4. **Settings**: Update bio, tagline, and social links in admin settings

### Project Images

You can add project images in two ways:
1. Upload to `public/images/` and reference as `/images/filename.jpg`
2. Use external URLs (hosted on imgur, cloudinary, etc.)

### Styling

- Main styles: `public/css/style.css`
- Admin styles: `public/css/admin.css`
- Color scheme defined in CSS variables (easy to customize)

## Security Notes

✅ **Implemented Security Features:**
- JWT authentication with secure, random secrets
- HttpOnly cookies to prevent XSS attacks
- Secure cookies over HTTPS in production
- Password hashing with bcrypt
- SQL injection protection via parameterized queries
- Input validation on all forms

⚠️ **Important:**
- Always use a strong, random JWT_SECRET in production
- Change default admin password immediately
- Use HTTPS in production (Replit handles this automatically)
- Keep dependencies updated

## API Endpoints

### Public Endpoints
- `GET /api/projects` - Get all projects
- `POST /api/contacts` - Submit contact form

### Protected Endpoints (Require Authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify authentication
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/contacts` - Get all messages
- `PUT /api/contacts/:id/read` - Mark message as read
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

## File Structure

```
├── server.js              # Main Express server
├── db-setup.js            # Database initialization
├── seed-database.js       # Database seeding script
├── public/
│   ├── index.html         # Portfolio homepage
│   ├── css/
│   │   ├── style.css      # Main styles
│   │   └── admin.css      # Admin dashboard styles
│   ├── js/
│   │   ├── main.js        # Portfolio JavaScript
│   │   └── admin.js       # Admin dashboard JavaScript
│   ├── images/            # Project and profile images
│   └── assets/            # Resume and other assets
├── admin/
│   ├── login.html         # Admin login page
│   └── dashboard.html     # Admin dashboard
├── package.json           # Dependencies
└── README.md              # This file
```

## Troubleshooting

### Database Connection Issues
- Ensure DATABASE_URL is set in environment variables
- Check Replit database status in the Tools panel

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASS are correct
- Check Gmail security settings
- Messages are still saved to database even if email fails

### Admin Login Issues
- Verify database is seeded (run `node seed-database.js`)
- Check browser console for errors
- Clear cookies and try again

## Future Enhancements

Potential features to add:
- [ ] Blog section with markdown support
- [ ] Portfolio analytics dashboard
- [ ] Multi-language support
- [ ] Image upload functionality in admin
- [ ] Password change feature in admin
- [ ] Dark/Light mode preference persistence
- [ ] Project categories and filtering
- [ ] Testimonials section

## Credits

Built for **Jimcaale Cabdiraxmaan Cabdilaahi Maaweel**  
Founder of **Sombuilder Online**  
Arabsiyo, Somaliland

## License

MIT License - Feel free to use this template for your own portfolio!

---

Made with ❤️ using Replit
