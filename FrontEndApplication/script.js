import config from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const urlForm = document.getElementById("urlForm");
  const urlInput = document.getElementById("urlInput");
  const pasteBtn = document.getElementById("pasteBtn");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  let isMenuOpen = false;

  // Handle paste button
  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      urlInput.value = text;
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  });

  // Handle form submission
  urlForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();

    if (!url) {
      alert("Please enter a URL");
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/api/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();

      // Create result container if it doesn't exist
      let resultContainer = document.querySelector(".result-container");
      if (!resultContainer) {
        resultContainer = document.createElement("div");
        resultContainer.className = "result-container";
        urlForm.parentNode.insertBefore(resultContainer, urlForm.nextSibling);
      }

      // Update result container
      resultContainer.innerHTML = `
                <div class="result-box">
                    <input type="text" value="${data.shortUrl}" readonly>
                    <div class="button-group">
                        <button class="action-btn copy-btn">
                            <span class="material-icons">content_copy</span> Copy
                        </button>
                        <button class="action-btn visit-btn">
                            <span class="material-icons">open_in_new</span> Visit
                        </button>
                    </div>
                </div>
            `;

      // Add event listeners to new buttons
      const copyBtn = resultContainer.querySelector(".copy-btn");
      const visitBtn = resultContainer.querySelector(".visit-btn");

      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(data.shortUrl);
          copyBtn.innerHTML =
            '<span class="material-icons">check</span> Copied!';
          setTimeout(() => {
            copyBtn.innerHTML =
              '<span class="material-icons">content_copy</span> Copy';
          }, 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      });

      visitBtn.addEventListener("click", () => {
        window.open(data.originalUrl, "_blank");
      });

      resultContainer.style.display = "block";
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to shorten URL. Please try again.");
    }
  });

  // Mobile menu handling
  hamburger.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    navLinks.classList.toggle("active");
    hamburger.querySelector(".material-icons").textContent = isMenuOpen
      ? "close"
      : "menu";
  });

  document.addEventListener("click", (e) => {
    if (
      isMenuOpen &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      isMenuOpen = false;
      navLinks.classList.remove("active");
      hamburger.querySelector(".material-icons").textContent = "menu";
    }
  });

  // Close mobile menu when clicking navigation links
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      if (isMenuOpen) {
        isMenuOpen = false;
        navLinks.classList.remove("active");
        hamburger.querySelector(".material-icons").textContent = "menu";
      }
    });
  });

  // Contact form handling
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    const submitBtn = contactForm.querySelector(".submit-btn");

    // Function to show error message
    const showError = (message) => {
      const error = document.getElementById("error");
      error.textContent = message;
      error.style.display = "block";
      setTimeout(() => {
        error.style.display = "none";
      }, 5000);
    };

    // Function to handle contact form submission
    const handleContactSubmit = (e) => {
      e.preventDefault();

      // Add success class to trigger animation
      submitBtn.classList.add("success");

      // Reset form
      contactForm.reset();

      // Remove success class after animation
      setTimeout(() => {
        submitBtn.classList.remove("success");
      }, 3000);
    };

    // Event listeners
    contactForm.addEventListener("submit", handleContactSubmit);
  }
});
