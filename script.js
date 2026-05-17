// 現在の年をフッターに表示
document.getElementById("year").textContent = new Date().getFullYear();

// モバイルナビの開閉
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// スクロールでカードをフェードイン
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// お問い合わせフォームのバリデーション
const form = document.querySelector(".contact-form");
const status = document.querySelector(".form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "form-status";
  status.textContent = "";

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message) {
    status.classList.add("error");
    status.textContent = "すべての項目を入力してください。";
    return;
  }
  if (!emailPattern.test(email)) {
    status.classList.add("error");
    status.textContent = "メールアドレスの形式が正しくありません。";
    return;
  }

  // Formspree のフォームIDが未設定の場合は送信せず案内を表示
  if (form.action.includes("your-form-id")) {
    status.classList.add("error");
    status.textContent =
      "フォームの送信先が未設定です。Formspree のフォームIDを設定してください。";
    return;
  }

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      status.classList.add("success");
      status.textContent = "送信しました。ありがとうございます。";
      form.reset();
    } else {
      throw new Error("送信に失敗しました");
    }
  } catch (err) {
    status.classList.add("error");
    status.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
  }
});
