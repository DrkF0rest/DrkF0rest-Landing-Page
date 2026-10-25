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
    let greetingTimer = null;
    let responseTimers = [];
    let pendingResponses = 0;
    let typingIndicator = null;

    function showTypingIndicator() {
      if (typingIndicator) return;

      typingIndicator = document.createElement("div");
      typingIndicator.className = "chat-message bot chat-typing";
      typingIndicator.setAttribute("role", "status");
      typingIndicator.setAttribute("aria-label", chatLanguage === "en" ? "DrkF0rest is typing" : "DrkF0rest sedang mengetik");

      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      for (let index = 0; index < 3; index += 1) {
        const dot = document.createElement("span");
        dot.className = "typing-dot";
        dot.setAttribute("aria-hidden", "true");
        bubble.appendChild(dot);
      }

      typingIndicator.appendChild(bubble);
      chatMessages.appendChild(typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTypingIndicator() {
      if (!typingIndicator) return;
      typingIndicator.remove();
      typingIndicator = null;
    }

    function cancelGreeting() {
      if (greetingTimer) {
        clearTimeout(greetingTimer);
        greetingTimer = null;
      }
      hideTypingIndicator();
    }

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
        name: `I'm Aditia Bagas Hermawan, though most people know me as DrkF0rest. I'm currently a student, and I really enjoy working with networking and system administration.`,
        age: `I'm ${botKnowledge.age} years old. Let me know if there's anything else you'd like to know!`,
        github: `Sure! You can check out my projects and contributions on GitHub: ${botKnowledge.github}`,
        linkedin: `I'd be happy to connect! You can find me on LinkedIn here: ${botKnowledge.linkedin}`,
        location: `I'm based in ${botKnowledge.location}. What else would you like to know?`,
        contact: {
          type: "options",
          message: "I'd be happy to hear from you! You can find me here:",
          options: [
            { label: "LinkedIn", value: "Open LinkedIn", url: botKnowledge.linkedin },
            { label: "GitHub", value: "Open GitHub", url: botKnowledge.github },
            { label: "Instagram", value: "Open Instagram", url: botKnowledge.instagram }
          ]
        },
        skills: {
          type: "skills",
          title: "Some of the areas I work with",
          items: botKnowledge.skills
        },
        projects: {
          type: "options",
          message: "Here are a couple of projects I've worked on. Pick one if you'd like to take a look:",
          options: [
            { label: "DocAMPP (Docker LAMP)", value: "DocAMPP", url: "https://github.com/DrkF0rest/Docampp" },
            { label: "Dental Presence (QR Attendance)", value: "Dental Presence", targetId: "dental-presence" }
          ]
        },
        work: `I'm currently a student, focusing on networking and system administration while building hands-on experience with infrastructure and systems. It's a field I genuinely enjoy.`,
        education: `I'm studying ${botKnowledge.education}. Happy to share more if you're curious!`,
        greeting: `Hi, glad you're here! Feel free to ask me about my background, what I do, or the projects I've been working on. Tap 🌐 Language below and choose Indonesia if you'd prefer Indonesian.`,
        thanks: `You're welcome! Please don't hesitate to ask if you have more questions.`,
        default: `I don't have that information yet. For a quick intro, tap "Tell me about you" below. To switch to Indonesian, tap 🌐 Language and choose Indonesia.`,
        langSwitch: `You're all set! I'll chat with you in English from here on.`
      },
      id: {
        name: `Aku Aditia Bagas Hermawan, tapi biasanya dikenal sebagai DrkF0rest. Sekarang aku masih kuliah dan senang mendalami networking serta system administration.`,
        age: `Usiaku ${botKnowledge.age} tahun. Mau tahu hal lain tentang aku?`,
        github: `Tentu! Kamu bisa lihat project dan kontribusiku di GitHub: ${botKnowledge.github}`,
        linkedin: `Dengan senang hati! Kamu bisa terhubung denganku di LinkedIn: ${botKnowledge.linkedin}`,
        location: `Aku berdomisili di ${botKnowledge.location}. Ada hal lain yang ingin kamu tahu?`,
        contact: {
          type: "options",
          message: "Bisa hubungi aku lewat salah satu platform ini:",
          options: [
            { label: "LinkedIn", value: "Buka LinkedIn", url: botKnowledge.linkedin },
            { label: "GitHub", value: "Buka GitHub", url: botKnowledge.github },
            { label: "Instagram", value: "Buka Instagram", url: botKnowledge.instagram }
          ]
        },
        skills: {
          type: "skills",
          title: "Beberapa bidang yang aku tekuni",
          items: botKnowledge.skills
        },
        projects: {
          type: "options",
          message: "Ini beberapa project yang pernah aku kerjakan. Pilih salah satu kalau mau lihat lebih lanjut:",
          options: [
            { label: "DocAMPP (Docker LAMP)", value: "DocAMPP", url: "https://github.com/DrkF0rest/Docampp" },
            { label: "Dental Presence (QR Attendance)", value: "Dental Presence", targetId: "dental-presence" }
          ]
        },
        work: `Sekarang aku masih kuliah sambil fokus di networking dan system administration. Aku juga terus cari pengalaman langsung di bidang infrastruktur dan sistem karena memang tertarik banget di sana.`,
        education: `Aku kuliah di ${botKnowledge.education}. Kalau mau tahu lebih lanjut, tanya aja!`,
        greeting: `Hai, senang kamu mampir! Tanya aja kalau mau tahu tentang diriku, bidang yang aku tekuni, atau project yang pernah aku kerjakan. Tekan 🌐 Language lalu pilih English kalau kamu lebih nyaman pakai bahasa Inggris.`,
        thanks: `Sama-sama, senang bisa bantu! Kalau masih penasaran, tanya aja lagi.`,
        default: `Aku belum punya info soal itu. Untuk kenalan singkat, pilih "Tell me about you" di bawah. Kalau mau pakai bahasa Inggris, tekan 🌐 Language lalu pilih English.`,
        langSwitch: `Siap, mulai sekarang aku jawab pakai bahasa Indonesia, ya.`
      }
    };

    function normalizeChatText(input) {
      return input.toLowerCase()
        .replace(/\b(gue|gua|gw)\b/g, "aku")
        .replace(/\b(lo|lu|elu)\b/g, "kamu")
        .replace(/\b(gak|ga|nggak|enggak)\b/g, "tidak")
        .replace(/\b(gimana|gmn)\b/g, "bagaimana")
        .replace(/\bhubungin\b/g, "hubungi")
        .replace(/\b(makasi|makasih)\b/g, "terima kasih")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
    }

    function getTokenForms(token) {
      const forms = new Set([token]);
      const suffixes = ["nya", "kah", "lah", "tah", "pun", "kan", "an", "i", "ku", "mu"];
      let current = token;

      for (let index = 0; index < 2; index += 1) {
        const suffix = suffixes.find((ending) => current.length > ending.length + 2 && current.endsWith(ending));
        if (!suffix) break;
        current = current.slice(0, -suffix.length);
        forms.add(current);
      }

      const prefix = ["ber", "ter", "mem", "men", "meng", "me", "pem", "pen", "peng", "pe", "di", "ke", "se"]
        .find((start) => current.length > start.length + 2 && current.startsWith(start));
      if (prefix) forms.add(current.slice(prefix.length));

      return forms;
    }

    const chatIntentAliases = {
      about: ["tentang diri", "cerita tentang", "ceritain tentang", "ceritain diri", "ceritakan dirimu", "latar belakang", "background", "kenal lebih", "apa yang kamu tahu", "tell me about", "what do you know about", "about yourself", "introduce yourself"],
      name: ["nama", "name", "siapa kamu", "siapa dirimu", "who are you", "who is", "profil diri"],
      age: ["umur", "usia", "age", "how old", "berapa umur", "berapa usia"],
      location: ["tinggal", "domisili", "lokasi", "asal", "where do you live", "where are you from", "location"],
      github: ["github", "git hub", "repo", "repository", "kode", "coding", "code"],
      linkedin: ["linkedin", "karier profesional", "professional profile"],
      contact: ["kontak", "contact", "hubungi", "menghubungi", "sosial media", "social media", "cara menghubungi", "contact me"],
      skills: ["skill", "skills", "keahlian", "keterampilan", "kemampuan", "bisa apa", "jago apa", "expertise", "technical ability"],
      projects: ["project", "projects", "projek", "proyek", "karya", "portfolio", "portofolio", "pernah bikin", "pernah buat", "what have you built"],
      work: ["kerja", "pekerjaan", "pengalaman kerja", "profesi", "occupation", "work", "job", "specializing", "fokus bidang"],
      education: ["kuliah", "kampus", "pendidikan", "sekolah", "jurusan", "university", "education", "study", "studi"],
      greeting: ["halo", "hai", "hello", "hi", "hey", "pagi", "siang", "malam"],
      thanks: ["terima kasih", "thanks", "thank you", "makasih", "thx"]
    };

    function getIntentScore(query, aliases) {
      const queryTokens = query.split(" ");
      const queryForms = queryTokens.map(getTokenForms);
      let bestScore = 0;

      aliases.forEach((alias) => {
        const normalizedAlias = normalizeChatText(alias);
        if (query === normalizedAlias || query.includes(` ${normalizedAlias} `) ||
            query.startsWith(`${normalizedAlias} `) || query.endsWith(` ${normalizedAlias}`)) {
          bestScore = Math.max(bestScore, normalizedAlias.split(" ").length + 1);
          return;
        }

        const aliasTokens = normalizedAlias.split(" ");
        if (aliasTokens.length === 1 && queryForms.some((forms) => {
          const aliasForms = getTokenForms(aliasTokens[0]);
          return [...aliasForms].some((form) => forms.has(form));
        })) {
          bestScore = Math.max(bestScore, 1);
        }
      });

      return bestScore;
    }

    function getBotResponse(input) {
      const query = normalizeChatText(input);
      if (["english", "inggris", "bahasa inggris", "language english", "change language to english", "switch to english", "ganti ke bahasa inggris", "ubah bahasa ke inggris"].includes(query)) {
        chatLanguage = "en";
        return botResponses[chatLanguage].langSwitch;
      }
      if (["indonesia", "bahasa indonesia", "language indonesia", "ubah bahasa", "ganti bahasa", "switch language", "switch to indonesian", "ganti ke bahasa indonesia", "ubah bahasa ke indonesia"].includes(query)) {
        chatLanguage = "id";
        return botResponses[chatLanguage].langSwitch;
      }

      const lang = chatLanguage;
      const intents = Object.keys(chatIntentAliases)
        .map((intent) => ({ intent, score: getIntentScore(query, chatIntentAliases[intent]) }))
        .sort((left, right) => right.score - left.score);
      const intent = intents[0].score > 0 ? intents[0].intent : null;

      if (intent === "about") {
        return {
          type: "options",
          message: lang === "en" ? "What would you like to know about me?" : "Mau tahu soal apa tentang aku?",
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

      if (intent === "name") return botResponses[lang].name;
      if (intent === "age") return botResponses[lang].age;
      if (intent === "github") return botResponses[lang].github;
      if (intent === "linkedin") return botResponses[lang].linkedin;
      if (intent === "location") return botResponses[lang].location;
      if (intent === "contact") return botResponses[lang].contact;
      if (intent === "skills") return botResponses[lang].skills;
      if (intent === "projects") return botResponses[lang].projects;
      if (intent === "work") return botResponses[lang].work;
      if (intent === "education") return botResponses[lang].education;
      if (intent === "greeting") return botResponses[lang].greeting;
      if (intent === "thanks") return botResponses[lang].thanks;

      return {
        type: "options",
        message: botResponses[lang].default,
        options: [
          {
            label: "Tell me about you",
            value: "tell me about you"
          }
        ]
      };
    }

    function sendMessage() {
      const msg = chatInput.value.trim();
      if (!msg) return;

      cancelGreeting();
      addMessage(msg, true);
      chatInput.value = "";

      pendingResponses += 1;
      showTypingIndicator();
      const responseTimer = setTimeout(() => {
        responseTimers = responseTimers.filter((timer) => timer !== responseTimer);
        pendingResponses -= 1;
        if (pendingResponses === 0) hideTypingIndicator();
        const response = getBotResponse(msg);
        addMessage(response, false);
      }, 750);
      responseTimers.push(responseTimer);
    }

    chatToggle.addEventListener("click", () => {
      chatBox.classList.add("open");
      chatToggle.classList.add("hidden");
      if (chatMessages.children.length === 0) {
        showTypingIndicator();
        greetingTimer = setTimeout(() => {
          greetingTimer = null;
          hideTypingIndicator();
          if (chatBox.classList.contains("open")) {
            addMessage(botResponses[chatLanguage].greeting, false);
          }
        }, 1100);
      }
    });

    chatClose.addEventListener("click", () => {
      cancelGreeting();
      responseTimers.forEach(clearTimeout);
      responseTimers = [];
      pendingResponses = 0;
      hideTypingIndicator();
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
