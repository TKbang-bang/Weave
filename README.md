<h1 align="center">🧵 Weave</h1>

<p align="center">
  A modern fullstack social media web application.
  <br />
  Built with <strong>React, Node.js, Express, and PostgreSQL</strong>.
</p>

<hr />

<h2>🚀 Features</h2>
<ul>
  <li>✅ User registration and login</li>
  <li>📧 Email verification via Nodemailer</li>
  <li>🔍 Search for posts and users</li>
  <li>👥 Follow and unfollow users</li>
  <li>🖼 Upload and post images or videos</li>
  <li>✏️ Edit titles of your own posts</li>
  <li>❤️ Like and unlike posts</li>
  <li>💬 Comment on posts</li>
  <li>💾 Save posts to your collection</li>
  <li>👤 View other users' profiles</li>
  <li>🙋 View and edit your own profile</li>
  <li>🖼 Change profile picture</li>
  <li>⚙️ Edit account credentials (name, alias, email, password)</li>
  <li>🗑 Delete account</li>
  <li>🚪 Logout</li>
</ul>

<h2>🧩 Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li>React</li>
  <li>Axios</li>
  <li>React Router DOM</li>
  <li>SASS</li>
  <li>Socket.io-client</li>
  <li>Sonner (notifications)</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Node.js + Express</li>
  <li>PostgreSQL + Sequelize ORM</li>
  <li>JWT (Access & Refresh Tokens with HttpOnly cookies)</li>
  <li>Socket.io</li>
  <li>Multer (file uploads)</li>
  <li>Bcrypt (password hashing)</li>
  <li>CORS</li>
  <li>Date-fns</li>
  <li>Dotenv</li>
  <li>Nanoid (unique tokens)</li>
  <li>Nodemailer (email sending)</li>
</ul>

<h1>📸 Previews</h1>
<img src="/client/public/preview1.png" alt="preview 1" width="600px">
<img src="/client/public/preview2.png" alt="preview 2" width="600px">
<img src="/client/public/preview3.png" alt="preview 3" width="600px">

<h2>⚙️ Installation & Setup</h2>

<h3>1. Clone the repository</h3>
<pre>
git clone https://github.com/TKbang-bang/Weave.git
cd weave
</pre>

<h3>2. Set up the client</h3>
<pre>
cd client
npm install
npm run dev
</pre>

<p>Create a <code>.env</code> file in the <strong>client/</strong> folder:</p>
<pre>
# URL of the backend API
VITE_BACKEND_URL=http://localhost:4000
</pre>

<h3>3. Set up the server</h3>
<pre>
cd server
npm install
npx sequelize db:migrate
npm run dev
</pre>

<p>Create a <code>.env</code> file in the <strong>server/</strong> folder:</p>
<pre>
# Frontend URL
CLIENT_URL=http://localhost:5173

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CODE_TOKEN_SECRET=your_code_token_secret
EMAIL_TOKEN_SECRET=your_email_token_secret
PASSWORD_TOKEN_SECRET=your_password_token_secret

# Email credentials for Nodemailer
EMAIL=your_email@gmail.com
PASSWORD=your_email_app_password

# Database connection (PostgreSQL)
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_PORT=5432
DB_HOST=localhost
DB_NAME=weave_db
DB_DIALECT=postgres
</pre>

<p><strong>⚠️ Important:</strong> If you're using Gmail, enable 2-Step Verification and generate an <strong>App Password</strong>.</p>

<h2>📄 Environment Variables Explained</h2>
<ul>
  <li><strong>CLIENT_URL</strong>: URL of the frontend (React).</li>
  <li><strong>ACCESS_TOKEN_SECRET</strong>: Secret key for signing access tokens (JWT).</li>
  <li><strong>REFRESH_TOKEN_SECRET</strong>: Secret key for signing refresh tokens.</li>
  <li><strong>CODE_TOKEN_SECRET</strong>: Secret key for generating temporary verification codes.</li>
  <li><strong>EMAIL_TOKEN_SECRET</strong>: Secret key for validating email verification links.</li>
  <li><strong>PASSWORD_TOKEN_SECRET</strong>: Secret key for generating secure password reset links.</li>
  <li><strong>EMAIL</strong>: Email address used to send notifications (Nodemailer).</li>
  <li><strong>PASSWORD</strong>: Email password or app password.</li>
  <li><strong>DB_USER</strong>: PostgreSQL database user.</li>
  <li><strong>DB_PASSWORD</strong>: PostgreSQL database password.</li>
  <li><strong>DB_PORT</strong>: Database connection port (default is 5432 for PostgreSQL).</li>
  <li><strong>DB_HOST</strong>: Database server address.</li>
  <li><strong>DB_NAME</strong>: Name of the database.</li>
  <li><strong>DB_DIALECT</strong>: Database dialect (postgres).</li>
</ul>

<h2>🧠 Author</h2>
<p>Developed with 💻 Windows, by <a href="https://github.com/TKbang-bang/" target="_blank">Woodley Tanis K.</a> — Backend-focused Fullstack Developer</p>
