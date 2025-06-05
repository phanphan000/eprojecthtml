


function getIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

async function loadFromJSON() {
    try {
        const response = await fetch('/Data/beach_data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const allBlogData = await response.json();
        window.allBlogs = allBlogData;

        const id = getIdFromURL();
        const blog = allBlogData.find(item => item.id === id);

        loadBlogData(blog || allBlogData[0]); // Nếu không có id hoặc không tìm thấy thì hiển thị blog đầu tiên
    } catch (error) {
        console.error('Lỗi khi tải file JSON:', error);
        loadBlogData(fallbackData);
    }
}

// Function to load data into HTML
function loadBlogData(blogData) {
    // Update main image
    document.querySelector('.main-image').src = blogData.image;
    document.querySelector('.main-image').alt = blogData.title;

    // Update title
    document.querySelector('h2.fw-bold').textContent = blogData.title;

    // Update descriptions
    const contentContainer = document.querySelector('.bg-white.p-4');
    const shortDescP = contentContainer.querySelectorAll('p.text-muted')[0];
    const longDescP = contentContainer.querySelectorAll('p.text-muted')[1];

    shortDescP.textContent = blogData.shortDescription;
    longDescP.textContent = blogData.longDescription2;

    // Update quote
    document.querySelector('.quote-text em').textContent = blogData.highlightQuote;

    // Add long description before quote
    const quoteDiv = document.querySelector('.quote-text');
    const newLongDescP = document.createElement('p');
    newLongDescP.className = 'text-muted';
    newLongDescP.textContent = blogData.longDescription;
    quoteDiv.parentNode.insertBefore(newLongDescP, quoteDiv);

    // Update tags
    const tagsContainer = document.querySelector('.mb-4');
    const tagsDiv = tagsContainer.querySelector('span').parentNode;

    // Xóa các thẻ <span> nhưng giữ lại thẻ <i>
    const spans = tagsDiv.querySelectorAll('span');
    spans.forEach(span => span.remove());

    // Thêm các thẻ <span> mới
    blogData.tags.forEach((tag, index) => {
        const span = document.createElement('span');
        span.className = 'badge bg-light text-dark tag-hover';
        if (index < blogData.tags.length - 1) {
            span.className += ' me-2';
        }
        span.textContent = tag;
        tagsDiv.appendChild(span);
    });

    // Update comments
    const commentsContainer = document.querySelector('#comments-container');

    // Add new comments
    blogData.comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-item';
        commentDiv.innerHTML = `
            <div class="d-flex gap-3">
                <img src="${comment.avatar}" alt="User" class="comment-avatar">
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="mb-0">${comment.name}</h6>
                        <small class="text-muted">${comment.date}</small>
                    </div>
                    <p class="mb-2">${comment.content}</p>
                    <button class="reply-btn">Reply</button>
                </div>
            </div>
        `;
        commentsContainer.appendChild(commentDiv);
    });

    // Update comments count
    document.querySelector('h4.mb-4').textContent = `${blogData.comments.length} Comments`;
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadFromJSON);







// phần cmt


// Function to get user avatar initials
// Function to get user avatar initials
function getInitials(name) {
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
}

// Function to format current date
function getCurrentDate() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
}

// Function to generate random avatar color
function getRandomColor() {
    const colors = ['#007cba', '#28a745', '#dc3545', '#6f42c1', '#fd7e14', '#20c997'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to create new comment element
function createCommentElement(commentData) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';

    const initials = getInitials(commentData.name);
    const avatarColor = getRandomColor();

    commentDiv.innerHTML = `
        <div class="comment-avatar" style="background: ${avatarColor}">
            ${initials}
        </div>
        <div class="comment-content">
            <div class="comment-header d-flex col-5">
                <span class="comment-author">${commentData.name}</span>
                <span class="comment-date">${getCurrentDate()}</span>
            </div>
            <div class="comment-text">
                ${commentData.comment}
            </div>
            <button class="reply-button rounded">Reply</button>
        </div>
    `;

    return commentDiv;
}

// Function to validate form
function validateForm(formData) {
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.error').forEach(error => error.textContent = '');

    // Validate comment
    if (!formData.comment.trim()) {
        document.getElementById('comment-error').textContent = 'Vui lòng nhập bình luận';
        isValid = false;
    }

    // Validate name
    if (!formData.name.trim()) {
        document.getElementById('name-error').textContent = 'Vui lòng nhập tên';
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
        document.getElementById('email-error').textContent = 'Vui lòng nhập email';
        isValid = false;
    } else if (!emailRegex.test(formData.email)) {
        document.getElementById('email-error').textContent = 'Email không hợp lệ';
        isValid = false;
    }

    return isValid;
}

// Function to show success message
function showSuccessMessage() {
    const successMsg = document.getElementById('success-message');
    successMsg.style.display = 'block';

    // Hide after 5 seconds
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 5000);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // Handle form submission
    document.getElementById('comment-form').addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = {
            comment: document.getElementById('comment').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Disable submit button
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi...';

        // Simulate API call delay
        setTimeout(() => {
            // Create and add new comment
            const newComment = createCommentElement(formData);
            const commentsSection = document.getElementById('comments-container');
            commentsSection.appendChild(newComment);

            // Show success message
            showSuccessMessage();

            // Reset form
            document.getElementById('comment-form').reset();

            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post comment';

            // Scroll to new comment
            newComment.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Add highlight effect to new comment
            newComment.style.animation = 'fadeIn 0.5s ease-in';

        }, 1000); // 1 second delay to simulate network request
    });

    // Handle reply button clicks (you can expand this functionality)
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('reply-button')) {
            // Scroll to comment form
            document.getElementById('comment-form').scrollIntoView({
                behavior: 'smooth'
            });

            // Focus on comment textarea
            document.getElementById('comment').focus();
        }
    });

}); // End of DOMContentLoaded