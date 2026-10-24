const pageLoader = document.getElementById("page-loader");
    const hideLoader = () => pageLoader.classList.add("hidden");
    window.addEventListener("load", () => setTimeout(hideLoader, 1800), { once: true });
    setTimeout(hideLoader, 3500);
    document.getElementById("year").textContent = new Date().getFullYear();
    const topbar = document.querySelector(".topbar");
    const menuToggle = document.getElementById("menu-toggle");
    const closeMenu = () => {
      topbar.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    };
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      topbar.classList.toggle("menu-open", !isOpen);
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    });
    document.querySelectorAll(".nav a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    const revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealItems.forEach((item) => observer.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("visible"));
    }

    // Chatbot
    const chatToggle = document.getElementById("chat-toggle");
    const chatBox = document.getElementById("chat-box");
    const chatClose = document.getElementById("chat-close");
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const chatSend = document.getElementById("chat-send");

    const botKnowledge = {
      name: "Aditia Bagas Hermawan (DrkF0rest)",
      age: "20",
      github: "https://github.com/DrkF0rest",
      linkedin: "https://linkedin.com/in/aditiabagashermawan",
      instagram: "https://instagram.com/_darkfrst",
      education: "Fakultas Teknik Informatika - Universitas Pamulang",
      skills: ["Linux System Administration", "Network Infrastructure", "Docker & Containerization", "Apache Web Server", "MySQL Database", "PHP Development", "System Security", "Automation & Scripting"],
      projects: ["DocAMPP - Docker-based LAMP stack", "Dental Presence - Attendance system with QR Code"],
      location: "Indonesia"
    };

    function addMessage(text, isUser = false) {
      const msgDiv = document.createElement("div");
      msgDiv.className = `chat-message ${isUser ? "user" : "bot"}`;
      
      if (typeof text === "object" && text.type === "options") {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "8px";
        container.style.width = "100%";
        
        if (text.message) {
          const bubble = document.createElement("div");
          bubble.className = "chat-bubble";
          bubble.textContent = text.message;
          container.appendChild(bubble);
        }

        const optionsDiv = document.createElement("div");
        optionsDiv.style.display = "flex";
        optionsDiv.style.flexWrap = "wrap";
        optionsDiv.style.gap = "6px";
        
        text.options.forEach(opt => {
          const btn = document.createElement("button");
          btn.className = "chat-suggestion";
          btn.style.margin = "0";
          btn.textContent = opt.label;
          btn.onclick = () => {
            if (opt.targetId) {
              const target = document.getElementById(opt.targetId);
              if (!target) {
                console.error(`Chatbot project target not found: ${opt.targetId}`);
                return;
              }
              target.open = true;
              chatBox.classList.remove("open");
              chatToggle.classList.remove("hidden");
              target.scrollIntoView({ behavior: "smooth", block: "center" });
              return;
            }
            if (opt.url) {
              window.open(opt.url, "_blank", "noopener,noreferrer");
              return;
            }
            if (opt.value.match(/\b(language english|english)\b/)) {
              chatLanguage = "en";
            } else if (opt.value.match(/\b(bahasa indonesia|indonesia)\b/)) {
              chatLanguage = "id";
            }
            chatInput.value = opt.value;
            sendMessage();
          };
          optionsDiv.appendChild(btn);
        });
        
        container.appendChild(optionsDiv);
        msgDiv.appendChild(container);
      } else if (typeof text === "object" && text.type === "skills") {
        const container = document.createElement("div");
        container.className = "chat-answer";

        const heading = document.createElement("div");
        heading.className = "chat-answer-title";
        heading.textContent = text.title;
        container.appendChild(heading);

        const tags = document.createElement("div");
        tags.className = "chat-answer-tags";
        text.items.forEach((item) => {
          const tag = document.createElement("span");
          tag.className = "chat-answer-tag";
          tag.textContent = item;
          tags.appendChild(tag);
        });
        container.appendChild(tags);
        msgDiv.appendChild(container);
      } else {
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble";
        bubble.textContent = text;
        msgDiv.appendChild(bubble);
      }

      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    let chatLanguage = "en";

    const botResponses = {
      en: {
        name: `I'm ${botKnowledge.name}, professionally known as DrkF0rest. I'm still a student focused on networking and system administration.`,
        age: `I'm ${botKnowledge.age} years old.`,
        github: `You can find my work on GitHub: ${botKnowledge.github}. I maintain several projects and contributions there.`,
        linkedin: `Connect with me on LinkedIn: ${botKnowledge.linkedin}`,
        contact: {
          type: "options",
          message: "Choose a platform to contact me:",
          options: [
            { label: "LinkedIn", value: "Open LinkedIn", url: botKnowledge.linkedin },
            { label: "GitHub", value: "Open GitHub", url: botKnowledge.github },
            { label: "Instagram", value: "Open Instagram", url: botKnowledge.instagram }
          ]
        },
        skills: {
          type: "skills",
          title: "Core skills",
          items: botKnowledge.skills
        },
        projects: {
          type: "options",
          message: "Here are my projects. Select one to learn more or visit the page:",
          options: [
            { label: "DocAMPP (Docker LAMP)", value: "DocAMPP", url: "https://github.com/DrkF0rest/Docampp" },
            { label: "Dental Presence (QR Attendance)", value: "Dental Presence", targetId: "dental-presence" }
          ]
        },
        work: `I'm still a student, focused on networking and system administration while developing practical skills in infrastructure and systems.`,
        education: `I study at ${botKnowledge.education}.`,
        greeting: `Hello! Feel free to ask me about my background, skills, or projects.`,
        thanks: `You're welcome! Please don't hesitate to ask if you have more questions.`,
        default: `I'm sorry, I don't have information about that. Please ask about my background, age, skills, projects, or how to contact me.`,
        langSwitch: `Language switched to English.`
      },
      id: {
        name: `Saya ${botKnowledge.name}, lebih dikenal sebagai DrkF0rest. Saya masih mahasiswa yang berfokus pada networking dan system administration.`,
        age: `Saya berusia ${botKnowledge.age} tahun.`,
        github: `Anda dapat menemukan pekerjaan saya di GitHub: ${botKnowledge.github}. Saya mempertahankan beberapa proyek dan kontribusi di sana.`,
        linkedin: `Terhubung dengan saya di LinkedIn: ${botKnowledge.linkedin}`,
        contact: {
          type: "options",
          message: "Pilih platform untuk menghubungi saya:",
          options: [
            { label: "LinkedIn", value: "Buka LinkedIn", url: botKnowledge.linkedin },
            { label: "GitHub", value: "Buka GitHub", url: botKnowledge.github },
            { label: "Instagram", value: "Buka Instagram", url: botKnowledge.instagram }
          ]
        },
        skills: {
          type: "skills",
          title: "Keahlian utama",
          items: botKnowledge.skills
        },
        projects: {
          type: "options",
          message: "Berikut adalah proyek saya. Pilih salah satu untuk info lebih lanjut:",
          options: [
            { label: "DocAMPP (Docker LAMP)", value: "DocAMPP", url: "https://github.com/DrkF0rest/Docampp" },
            { label: "Dental Presence (QR Attendance)", value: "Dental Presence", targetId: "dental-presence" }
          ]
        },
        work: `Saya masih mahasiswa, berfokus pada networking dan system administration sambil mengembangkan keterampilan praktis di bidang infrastruktur dan sistem.`,
        education: `Saya belajar di ${botKnowledge.education}.`,
        greeting: `Halo! Silakan tanyakan saya tentang latar belakang, keterampilan, atau proyek saya.`,
        thanks: `Sama-sama! Jangan ragu untuk bertanya jika Anda memiliki pertanyaan lebih lanjut.`,
        default: `Maaf, saya tidak memiliki informasi tentang itu. Silakan tanyakan tentang latar belakang, usia, keterampilan, proyek, atau cara menghubungi saya.`,
        langSwitch: `Bahasa diubah ke Indonesia.`
      }
    };

    function getBotResponse(input) {
      const query = input.toLowerCase().trim();
      const lang = chatLanguage;

      if (query.match(/\b(apa yang kamu tahu|apa yang anda tahu|what do you know|tell me about you|tentang kamu|about you)\b/)) {
        return {
          type: "options",
          message: lang === "en" ? "What would you like to know about me?" : "Apa yang ingin Anda ketahui tentang saya?",
          options: [
            { label: lang === "en" ? "Background" : "Profil", value: lang === "en" ? "Who are you?" : "Siapa kamu?" },
            { label: lang === "en" ? "Age" : "Usia", value: lang === "en" ? "How old are you?" : "Berapa umur kamu?" },
            { label: lang === "en" ? "Education" : "Pendidikan", value: lang === "en" ? "Where do you study?" : "Kamu kuliah di mana?" },
            { label: lang === "en" ? "Skills" : "Keahlian", value: lang === "en" ? "What are your skills?" : "Apa keahlian kamu?" },
            { label: lang === "en" ? "Projects" : "Proyek", value: lang === "en" ? "What projects have you made?" : "Apa project kamu?" },
            { label: lang === "en" ? "Contact" : "Kontak", value: lang === "en" ? "How can I contact you?" : "Gimana cara hubungin kamu?" }
          ]
        };
      }
      
      if (query.match(/\b(bahasa|language|en|id|indonesia|inggris|english)\b/)) {
        chatLanguage = query.match(/\b(en|english|inggris)\b/) ? "en" : "id";
        return botResponses[chatLanguage].langSwitch;
      }
      
      if (query.match(/\b(siapa|who|nama|name)\b/)) {
        return botResponses[lang].name;
      }
      if (query.match(/\b(umur|age|berapa|old|how old)\b/)) {
        return botResponses[lang].age;
      }
      if (query.match(/\b(github|git|code|repo)\b/)) {
        return botResponses[lang].github;
      }
      if (query.match(/\b(linkedin|professional|koneksi)\b/)) {
        return botResponses[lang].linkedin;
      }
      if (query.match(/\b(sosial|social|media|kontak|contact|hubungi|hubungin|contacting|call|message)\b/)) {
        return botResponses[lang].contact;
      }
      if (query.match(/\b(skills?|kemampuan|keahlian|expertise)\b/)) {
        return botResponses[lang].skills;
      }
      if (query.match(/\b(project|karya|portfolio|made)\b/)) {
        return botResponses[lang].projects;
      }
      if (query.match(/\b(kerja|work|job|profesi|profession|specializing)\b/)) {
        return botResponses[lang].work;
      }
      if (query.match(/\b(kuliah|pendidikan|education|kampus|university|study)\b/)) {
        return botResponses[lang].education;
      }
      if (query.match(/\b(halo|hai|hi|hello|hey)\b/)) {
        return botResponses[lang].greeting;
      }
      if (query.match(/\b(thanks|terima|makasih|thx)\b/)) {
        return botResponses[lang].thanks;
      }
      
      return botResponses[lang].default;
    }

    function sendMessage() {
      const msg = chatInput.value.trim();
      if (!msg) return;
      
      addMessage(msg, true);
      chatInput.value = "";
      
      setTimeout(() => {
        const response = getBotResponse(msg);
        addMessage(response, false);
      }, 500);
    }

    chatToggle.addEventListener("click", () => {
      chatBox.classList.add("open");
      chatToggle.classList.add("hidden");
      if (chatMessages.children.length === 0) {
        const greeting = chatLanguage === "en" 
          ? "Hello! Feel free to ask me about my background, skills, or projects."
          : "Halo! Silakan tanyakan saya tentang latar belakang, keterampilan, atau proyek saya.";
        addMessage(greeting, false);
      }
    });

    chatClose.addEventListener("click", () => {
      chatBox.classList.remove("open");
      chatToggle.classList.remove("hidden");
    });

    chatSend.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
    document.querySelectorAll(".chat-suggestion").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.action === "language") {
          addMessage({
            type: "options",
            message: "Choose a language / Pilih bahasa:",
            options: [
              { label: "English", value: "language english" },
              { label: "Indonesia", value: "bahasa indonesia" }
            ]
          }, false);
          return;
        }
        if (button.dataset.action === "about") {
          const lang = chatLanguage;
          addMessage({
            type: "options",
            message: lang === "en" ? "What would you like to know about me?" : "Apa yang ingin Anda ketahui tentang saya?",
            options: [
              { label: lang === "en" ? "Background" : "Profil", value: lang === "en" ? "Who are you?" : "Siapa kamu?" },
              { label: lang === "en" ? "Age" : "Usia", value: lang === "en" ? "How old are you?" : "Berapa umur kamu?" },
              { label: lang === "en" ? "Education" : "Pendidikan", value: lang === "en" ? "Where do you study?" : "Kamu kuliah di mana?" },
              { label: lang === "en" ? "Skills" : "Keahlian", value: lang === "en" ? "What are your skills?" : "Apa keahlian kamu?" },
              { label: lang === "en" ? "Projects" : "Proyek", value: lang === "en" ? "What projects have you made?" : "Apa project kamu?" },
              { label: lang === "en" ? "Contact" : "Kontak", value: lang === "en" ? "How can I contact you?" : "Gimana cara hubungin kamu?" }
            ]
          }, false);
          return;
        }
        chatInput.value = button.dataset.question;
        sendMessage();
      });
    });
