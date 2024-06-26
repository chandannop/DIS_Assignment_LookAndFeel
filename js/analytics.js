document.addEventListener('DOMContentLoaded', () => {
  let reviews = JSON.parse(localStorage.getItem('reviews')) || [
    {
      id: Date.now(),
      name: "Sanjay Mehta",
      rating: 5.0,
      review: "An excellent website! Easy to navigate and filled with useful information. Booking our trip to Kerala was a breeze. The detailed itineraries and beautiful images helped us choose the perfect destinations. Drift Destiny truly made our travel planning stress-free and enjoyable.",
      editable: false
    },
    {
      id: Date.now() + 1,
      name: "Priya Nair",
      rating: 4.8,
      review: "Loved the design and user-friendly interface. The itineraries were well-detailed and helped us plan our trip to Goa effortlessly. The booking process was smooth and hassle-free. Drift Destiny provides everything you need to plan a perfect vacation.",
      editable: false
    },
    {
      id: Date.now() + 2,
      name: "Amit Kumar",
      rating: 4.7,
      review: "Great website! The reviews and ratings were very helpful in choosing our destinations. We had an amazing time in Shimla thanks to Drift Destiny. The information provided was accurate and the travel guides were very informative.",
      editable: false
    },
    {
      id: Date.now() + 3,
      name: "Ritu Sharma",
      rating: 4.6,
      review: "Very informative and visually appealing. It made planning our vacation to Coorg very easy and enjoyable. The website is well-organized and the customer support was prompt in answering our queries. Highly recommend Drift Destiny for all travel planning needs.",
      editable: false
    },
    {
      id: Date.now() + 4,
      name: "Vikram Singh",
      rating: 5.0,
      review: "Outstanding service! The website provided all the necessary details and made the booking process seamless. We loved the detailed descriptions and the high-quality images. Drift Destiny is a fantastic resource for anyone looking to plan a memorable trip.",
      editable: false
    },
    {
      id: Date.now() + 5,
      name: "Anjali Patel",
      rating: 4.5,
      review: "Good website with lots of useful information. However, I faced a slight issue while booking, but customer support was very helpful and resolved it quickly. Overall, a great experience using Drift Destiny for planning our vacation.",
      editable: false
    }
  ];

  const reviewsList = document.getElementById('reviewsList');
  const reviewForm = document.getElementById('reviewForm');
  const starRatingElements = document.querySelectorAll('.star-rating .star');
  let currentRating = 0;

  function displayReviews() {
    reviewsList.innerHTML = '';
    reviews.forEach((review, index) => {
      const reviewCard = document.createElement('div');
      reviewCard.classList.add('review-card');
      reviewCard.innerHTML = `
        <p><strong>${review.name}</strong> - ${review.rating}/5</p>
        <p>"${review.review}"</p>
        ${review.editable ? `<button onclick="editReview(${index})">Edit</button>
        <button onclick="deleteReview(${index})">Delete</button>` : ''}
      `;
      reviewsList.appendChild(reviewCard);
    });
  }

  function handleStarClick(event) {
    currentRating = parseInt(event.target.getAttribute('data-value'));
    starRatingElements.forEach(star => star.classList.remove('selected'));
    for (let i = 0; i < currentRating; i++) {
      starRatingElements[i].classList.add('selected');
    }
    document.getElementById('rating').value = currentRating;
  }

  starRatingElements.forEach(star => {
    star.addEventListener('click', handleStarClick);
  });

  reviewForm.addEventListener('submit', event => {
    event.preventDefault();
    const reviewerName = document.getElementById('reviewerName').value;
    const reviewText = document.getElementById('reviewText').value;

    if (reviewerName && reviewText && currentRating > 0) {
      const newReview = {
        id: Date.now(),
        name: reviewerName,
        rating: currentRating,
        review: reviewText,
        editable: true
      };
      reviews.push(newReview);
      localStorage.setItem('reviews', JSON.stringify(reviews));
      displayReviews();
      reviewForm.reset();
      starRatingElements.forEach(star => star.classList.remove('selected'));
      currentRating = 0;
      showPopup('Review successfully submitted!');
    } else {
      alert('Please fill in all fields and select a rating.');
    }
  });

  window.editReview = function(index) {
    const review = reviews[index];
    const editModal = document.createElement('div');
    editModal.id = 'editModal';
    editModal.classList.add('modal');
    editModal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="closeEditModal()">&times;</span>
        <form id="editForm">
          <input type="hidden" id="edit-id" value="${index}">
          <label for="editName">Name:</label>
          <input type="text" id="editName" name="editName" value="${review.name}" required>
          <label for="editReview">Review:</label>
          <textarea id="editReview" name="editReview" required>${review.review}</textarea>
          <label for="editRating">Rating:</label>
          <div class="star-rating">
            <span class="star" data-value="1">&#9733;</span>
            <span class="star" data-value="2">&#9733;</span>
            <span class="star" data-value="3">&#9733;</span>
            <span class="star" data-value="4">&#9733;</span>
            <span class="star" data-value="5">&#9733;</span>
          </div>
          <input type="hidden" id="editRating" name="editRating" value="${review.rating}" required>
          <button type="submit">Save Changes</button>
          <button type="button" class="cancel-btn" onclick="closeEditModal()">Cancel</button>
        </form>
      </div>
    `;
    document.body.appendChild(editModal);

    const editStarRatingElements = editModal.querySelectorAll('.star-rating .star');
    editStarRatingElements.forEach(star => star.classList.remove('selected'));
    for (let i = 0; i < review.rating; i++) {
      editStarRatingElements[i].classList.add('selected');
    }

    editStarRatingElements.forEach(star => {
      star.addEventListener('click', event => {
        const rating = parseInt(event.target.getAttribute('data-value'));
        editStarRatingElements.forEach(star => star.classList.remove('selected'));
        for (let i = 0; i < rating; i++) {
          editStarRatingElements[i].classList.add('selected');
        }
        document.getElementById('editRating').value = rating;
      });
    });

    document.getElementById('editForm').addEventListener('submit', event => {
      event.preventDefault();
      const index = document.getElementById('edit-id').value;
      const editName = document.getElementById('editName').value;
      const editReview = document.getElementById('editReview').value;
      const editRating = document.getElementById('editRating').value;

      if (editName && editReview && editRating > 0) {
        reviews[index] = {
          id: reviews[index].id,
          name: editName,
          rating: parseInt(editRating),
          review: editReview,
          editable: true
        };
        localStorage.setItem('reviews', JSON.stringify(reviews));
        displayReviews();
        closeEditModal();
        showPopup('Review successfully updated!');
      } else {
        alert('Please fill in all fields and select a rating.');
      }
    });
  };

  window.deleteReview = function(index) {
    reviews.splice(index, 1);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    displayReviews();
  };

  window.closeEditModal = function() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
      document.body.removeChild(editModal);
    }
  };

  function showPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerText = message;
    document.body.appendChild(popup);
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 3000);
  }

  displayReviews();
});
