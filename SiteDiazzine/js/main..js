document.addEventListener("DOMContentLoaded", () => {
  // Variável para armazenar o interesse capturado do botão clicado
  let interesseDoCliente = ""; // Inicializa vazia

  // --- Menu Hamburger Responsivo ---
  const menuIcon = document.querySelector(".menu-icon");
  const ul = document.querySelector(".ul");
  const body = document.body; // Referência ao body para controle de scroll

  // Abre/fecha o menu e controla a classe 'ativo' no menu e 'menu-active' no body
  menuIcon.addEventListener("click", () => {
    ul.classList.toggle("ativo");
    body.classList.toggle("menu-active"); 
    // Impede o scroll do body quando o menu está aberto
    if (ul.classList.contains("ativo")) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  });

  // Ocultar o menu ao clicar em um link de navegação
  document.querySelectorAll(".ul li a").forEach((item) => {
    item.addEventListener("click", () => {
      ul.classList.remove("ativo");
      body.classList.remove("menu-active");
      body.style.overflow = "auto"; // Restaura scroll do body
    });
  });

  // --- Modal de Contato ---
  const contactModal = document.getElementById("contactModal");
  // Seleciona TODOS os botões que devem abrir o modal (com a classe 'open-modal')
  const openModalButtons = document.querySelectorAll(".open-modal");
  const closeModalButton = document.querySelector(".close-button");

  // Adiciona event listener para abrir o modal e capturar o interesse
  openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // CAPTURA O VALOR DO ATRIBUTO data-interesse QUANDO O BOTÃO É CLICADO
      // 'dataset.interesse' é a forma de acessar 'data-interesse'
      interesseDoCliente = button.dataset.interesse || "Não especificado"; 
      
      contactModal.style.display = "flex"; // Usa flex para centralizar o modal
      body.style.overflow = "hidden"; // Impede scroll do body quando modal está aberto
    });
  });

  // Adiciona event listener para fechar o modal pelo botão 'X'
  closeModalButton.addEventListener("click", () => {
    contactModal.style.display = "none";
    body.style.overflow = "auto"; // Restaura scroll do body
    interesseDoCliente = ""; // Limpa o interesse ao fechar o modal
  });

  // Adiciona event listener para fechar o modal clicando fora dele
  window.addEventListener("click", (event) => {
    if (event.target === contactModal) {
      contactModal.style.display = "none";
      body.style.overflow = "auto";
      interesseDoCliente = ""; // Limpa o interesse ao fechar o modal
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
    // Esta URL é gerada pelo Power Automate quando você salva o fluxo.
    const powerAutomateWebhookUrl = "https://default2e14bbabd7214a2d9ab2415eba9c66.76.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/76104a4302694b6e8b25ee0e01eb5062/triggers/manual/paths/invoke/?api-version=1&tenantId=tId&environmentName=Default-2e14bbab-d721-4a2d-9ab2-415eba9c6676&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=heKarW1s7UsuY1NB35Gesdfxmc52kS9r3iii7gFRaSc"; 
    
    // Objeto com os dados a serem enviados para o Power Automate
    const formData = {
      Nome: name,
      Email: email,
      Telefone: phone,
      Mensagem: message,
      DataHoraContato: new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo", // Ajuste o fuso horário se necessário
      }), 
      ServicoInteresse: interesseDoCliente // O CAMPO DE INTERESSE AGORA É ENVIADO!
    };

    try {
      const response = await fetch(powerAutomateWebhookUrl, {
        method: "POST", // Método HTTP para enviar dados
        headers: {
          "Content-Type": "application/json", // Tipo de conteúdo que está sendo enviado
        },
        body: JSON.stringify(formData), // Converte o objeto JavaScript em string JSON
      });

      if (response.ok) {
        console.log(
          "Dados enviados para o SharePoint via Power Automate com sucesso!"
        );
      } else {
        console.error(
          "Falha ao enviar dados para o Power Automate:",
          response.status, // Código de status da resposta (ex: 400, 500)
          response.statusText // Mensagem de status (ex: "Bad Request")
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

    // 2. Redirecionar para o WhatsApp com mensagem pré-preenchida
    // A mensagem agora inclui o interesse do cliente
    const defaultMessage = `Olá, gostaria de agendar um horário ou saber mais sobre os serviços da Diazzine Studium. Meu nome é ${name}, meu e-mail é ${email} e meu telefone é ${phone}.`;
    const finalMessage = message 
        ? `${defaultMessage} Meu interesse é: ${interesseDoCliente}. Mensagem: ${message}` 
        : `${defaultMessage} Meu interesse é: ${interesseDoCliente}.`;

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      finalMessage
    )}`;

    // Abre o link do WhatsApp em uma nova aba/janela
    window.open(whatsappLink, "_blank");

    // Fecha o modal e limpa o formulário após o envio
    contactForm.reset();
    contactModal.style.display = "none";
    body.style.overflow = "auto";
    interesseDoCliente = ""; // Limpa o interesse após o envio para o próximo clique
  });

  // --- Scroll Suave para Ancoras (links internos) ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault(); // Impede o comportamento padrão do link

      const targetId = this.getAttribute("href"); // Pega o ID do elemento de destino
      if (targetId === "#") { // Se for apenas '#', rola para o topo
        window.scrollTo({
          top: 0,
          behavior: "smooth", // Rola suavemente
        });
      } else { // Rola para a seção com o ID correspondente
        document.querySelector(targetId).scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // --- Animações ao Scroll (Opcional, mas recomendado para dinamismo) ---
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".servico-card, .conteudo-card, .futuro-card, .portfolio-item, .resultados-texto-descritivo" // Elementos que terão animação ao aparecer
    );

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect(); // Pega a posição do elemento na tela
      // Verifica se o elemento está visível na viewport (com uma margem de 100px)
      const isVisible = rect.top < window.innerHeight - 100 && rect.bottom >= 0;

      if (isVisible) {
        element.style.opacity = 1; // Torna visível
        element.style.transform = "translateY(0)"; // Move para a posição original
        element.style.transition =
          "opacity 0.6s ease-out, transform 0.6s ease-out"; // Aplica transição suave
      } else {
        // Opcional: esconder novamente se sair da tela, para reanimar no scroll up
        // element.style.opacity = 0;
        // element.style.transform = "translateY(50px)";
      }
    });
  };

  // Inicializa as animações na carga da página e no scroll
  window.addEventListener("scroll", animateOnScroll); // Adiciona listener para o scroll
  animateOnScroll(); // Chama a função uma vez para elementos já visíveis ao carregar a página
});
