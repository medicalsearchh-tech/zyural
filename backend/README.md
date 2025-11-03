# E-Learning Platform Backend

A complete Node.js backend for an e-learning platform built with Express.js, Sequelize ORM, and PostgreSQL.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT
- **Payment**: Stripe
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Express Validator

## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elearning_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

4. **Database Setup**

Create PostgreSQL database:
```sql
CREATE DATABASE elearning_db;
```

Run the setup script to create tables and sample data:
```bash
node setup.js
```

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## Development Scripts

```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start

# Run database migrations
npm run migrate

# Seed database with sample data
npm run seed

# Run setup script
node setup.js
```

## File Structure

```
backend/
├── models/           # Sequelize models
├── routes/           # API routes
├── middleware/       # Custom middleware
├── utils/            # Utility functions
├── config/           # Configuration files
├── server.js         # Main server file
├── setup.js          # Database setup script
└── package.json      # Dependencies
```