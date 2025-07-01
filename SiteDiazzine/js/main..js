document.addEventListener("DOMContentLoaded", () => {
  // --- Menu Hamburger Responsivo ---
  const menuIcon = document.querySelector(".menu-icon");
  const ul = document.querySelector(".ul");
  const body = document.body; // Referência ao body para controle de scroll

  // Abre/fecha o menu e controla a classe 'menu-active' no body
  menuIcon.addEventListener("click", () => {
    ul.classList.toggle("ativo");
    body.classList.toggle("menu-active"); // Adiciona/remove classe no body
    // Impede o scroll do body quando o menu está aberto
    if (ul.classList.contains("ativo")) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  });

  // Ocultar o menu ao clicar em um link
  document.querySelectorAll(".ul li a").forEach((item) => {
    item.addEventListener("click", () => {
      ul.classList.remove("ativo");
      body.classList.remove("menu-active");
      body.style.overflow = "auto"; // Restaura scroll do body
    });
  });

  // --- Modal de Contato ---
  const contactModal = document.getElementById("contactModal");
  // Seleciona TODOS os botões que devem abrir o modal
  const openModalButtons = document.querySelectorAll(".open-modal");
  const closeModalButton = document.querySelector(".close-button");

  openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      contactModal.style.display = "flex"; // Usa flex para centralizar o modal
      body.style.overflow = "hidden"; // Impede scroll do body quando modal está aberto
    });
  });

  closeModalButton.addEventListener("click", () => {
    contactModal.style.display = "none";
    body.style.overflow = "auto"; // Restaura scroll do body
  });

  // Fechar o modal clicando fora dele
  window.addEventListener("click", (event) => {
    if (event.target === contactModal) {
      contactModal.style.display = "none";
      body.style.overflow = "auto";
    }
  });

  // --- Lidar com o envio do formulário e redirecionamento para WhatsApp ---
  const contactForm = document.getElementById("contactForm");
  const whatsappNumber = "5585992322952"; // Seu número de WhatsApp (sem '+' ou espaços)

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Coleta dos dados do formulário
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    // 1. Enviar dados para o SharePoint via Power Automate (Webhook)
    // ATENÇÃO: SUBSTITUA 'YOUR_POWER_AUTOMATE_WEBHOOK_URL' PELA URL REAL DO SEU WEBHOOK DO POWER AUTOMATE!
    const powerAutomateWebhookUrl = "https://default2e14bbabd7214a2d9ab2415eba9c66.76.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/76104a4302694b6e8b25ee0e01eb5062/triggers/manual/paths/invoke/?api-version=1&tenantId=tId&environmentName=Default-2e14bbab-d721-4a2d-9ab2-415eba9c6676&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=heKarW1s7UsuY1NB35Gesdfxmc52kS9r3iii7gFRaSc";

    // Objeto com os dados a serem enviados
    const formData = {
      Nome: name,
      Email: email,
      Telefone: phone,
      Mensagem: message,
      DataHoraContato: new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }), // Adiciona data e hora do contato
    };

    try {
      const response = await fetch(powerAutomateWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(
          "Dados enviados para o SharePoint via Power Automate com sucesso!"
        );
      } else {
        console.error(
          "Falha ao enviar dados para o Power Automate:",
          response.status,
          response.statusText
        );
        alert(
          "Houve um pequeno problema ao registrar seus dados, mas vamos te direcionar para o WhatsApp!"
        );
      }
    } catch (error) {
      console.error("Erro de rede ao conectar com Power Automate:", error);
      alert(
        "Problema de conexão ao registrar seus dados, mas vamos te direcionar para o WhatsApp!"
      );
    }

    // 2. Redirecionar para o WhatsApp
    const defaultMessage = `Olá, gostaria de agendar um horário ou saber mais sobre os serviços da Diazzine Studium. Meu nome é ${name}, meu e-mail é ${email} e meu telefone é ${phone}.`;
    const finalMessage = message
      ? `${defaultMessage} Minha mensagem: ${message}`
      : defaultMessage;

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      finalMessage
    )}`;

    // Abre a nova janela/aba do WhatsApp
    window.open(whatsappLink, "_blank");

    // Fecha o modal e limpa o formulário
    contactForm.reset();
    contactModal.style.display = "none";
    body.style.overflow = "auto";
  });

  // --- Scroll Suave para Ancoras ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        document.querySelector(targetId).scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // --- Animações ao Scroll (Opcional, mas altamente recomendado para dinamismo) ---
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".servico-card, .conteudo-card, .futuro-card, .portfolio-item, .resultados-texto-descritivo"
    );

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 100 && rect.bottom >= 0;

      if (isVisible) {
        element.style.opacity = 1;
        element.style.transform = "translateY(0)";
        element.style.transition =
          "opacity 0.6s ease-out, transform 0.6s ease-out";
      } else {
        // Opcional: esconder novamente se sair da tela, para reanimar no scroll up
        // element.style.opacity = 0;
        // element.style.transform = "translateY(50px)";
      }
    });
  };

  // Inicializa as animações na carga da página e no scroll
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Chama uma vez para elementos já visíveis ao carregar a página
});

