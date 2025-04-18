// Firebase Configuration (Replace with your Firebase project config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    db.collection('contacts').add({
        name: name,
        email: email,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert('Message sent successfully!');
        document.getElementById('contact-form').reset();
    }).catch((error) => {
        alert('Error sending message: ' + error.message);
    });
});

// Login Form
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Login successful! Welcome, ' + userCredential.user.email);
            document.getElementById('login-form').reset();
        })
        .catch((error) => {
            alert('Login failed: ' + error.message);
        });
});

// Signup Form
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Sign up successful! Welcome, ' + userCredential.user.email);
            document.getElementById('signup-form').reset();
            showLoginForm();
        })
        .catch((error) => {
            alert('Sign up failed: ' + error.message);
        });
});

// Toggle Login/Signup Forms
document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.add('d-none');
    document.getElementById('signup-form').classList.remove('d-none');
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-form').classList.add('d-none');
    document.getElementById('login-form').classList.remove('d-none');
});

// Load Blog Posts from Firestore
function loadBlogPosts() {
    const blogPostsContainer = document.getElementById('blog-posts');
    db.collection('blogs').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
        blogPostsContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            blogPostsContainer.innerHTML += `
                <div class="col-md-6 blog-post">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.content.substring(0, 100)}...</p>
                            <p class="text-muted">Posted on ${new Date(post.timestamp.toDate()).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            `;
        });
    });
}

// Initialize Blog Posts
loadBlogPosts();

// Sample Blog Post (Add this manually in Firebase Firestore for testing)
db.collection('blogs').add({
    title: 'The Future of AI in Agriculture',
    content: 'Artificial intelligence is transforming agriculture by providing predictive analytics for crop health, pest control, and soil optimization...',
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
});