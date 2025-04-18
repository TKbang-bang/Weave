<h1 align="center">🧵 Weave</h1>

<p align="center">
  A modern fullstack social media web application.
  <br />
  Built with <strong>React, Node.js, Express, and MySQL</strong>.
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
  <li>MySQL</li>
  <li>Express-session & Express-mysql-session</li>
  <li>Socket.io</li>
  <li>Multer (file uploads)</li>
  <li>Bcrypt (password hashing)</li>
  <li>CORS</li>
  <li>Date-fns</li>
  <li>Dotenv</li>
  <li>Nanoid (unique tokens)</li>
  <li>Nodemailer (email sending)</li>
</ul>

<h1>Previews</h1>
<img src="/client/public/preview1.png" alt="preview 1" width="600px">
<img src="/client/public/preview2.png" alt="preview 2" width="600px">
<img src="/client/public/preview3.png" alt="preview 3" width="600px">

<h2>⚙️ Installation & Setup</h2>

<h3>1. Clone the repository</h3>

git clone https://github.com/TKbang-bang/Weave.git

cd weave

<h3>2. Set up the client</h3>
<p><strong>>cd client</strong></p>
<p><strong>>npm install</strong></p>
<p><strong>>npm run dev</strong></p>

<h3>3. Set up the server</h3>
<p><strong>>cd server</strong></p>
<p><strong>>npm install</strong></p>
<p><strong>>npm run dev</strong></p>
<p><strong>Don't forget to create a <code>.env</code> file inside the <code>server/</code> directory. You can use the provided <code>.env.example</code> as a template.</strong></p> <h2>📄 Environment Variables</h2>
env
# Client URL (e.g., http://localhost:5173)
CLIENT_URL=http://localhost:5173

# Secret key for sessions

MY_SECRET_KEY=your_secret_key

# Email credentials for Nodemailer

EMAIL=your_email@gmail.com
PASSWORD=your_email_app_password

<p><strong>⚠️ Important:</strong> If you're using Gmail, enable 2-Step Verification and generate an <strong>App Password</strong>.

<h2>🧠 Author</h2> <p> Developed with 💻Windows, by Woodley Tanis K. <a href="https://github.com/TKbang-bang/" target="_blank">tk</a> a fullstack dev</p>
<small>The next Mark Zukerberg 😊</small>
