document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------
    //       CONSTANTES GLOBAIS
    // ----------------------------------
    const NUBANK_LINK = "https://nubank.com.br/cobrar/81vxa8/691b5813-adf6-47cb-9cc3-d10924e87e6f";
    const WHATSAPP_NUMBER = "+5521966058744"; // Seu número de WhatsApp com código do país

    // ----------------------------------
    //       HOME: SLIDER DE VÍDEOS
    // ----------------------------------
    const slider = document.querySelector('.slider');
    const videos = slider ? slider.querySelectorAll('video') : [];
    
    // Nomes dos seus vídeos de destaques
    const videoSources = [
        'videos/Ainda_nao_superei_esse_cilios.mp4', 
        'videos/amo_esse_olhar.mp4',
        'videos/amo_transforma_olhares.mp4'
    ];
    let currentVideoIndex = 0;

    if (slider && videos.length > 0) {
        videos.forEach((video, index) => {
            video.src = videoSources[index % videoSources.length];
        });

        const updateSlider = () => {
            currentVideoIndex = (currentVideoIndex + 1) % videos.length;
            const offset = -currentVideoIndex * 100;
            
            // Usando 'transform' para o slider
            videos.forEach((video, index) => {
                // Aplica a transformação a cada vídeo individualmente para movê-los "juntos"
                video.style.transform = `translateX(${offset}%)`;
            });
            
            videos.forEach((video, index) => {
                if (index === currentVideoIndex) {
                    video.play();
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        };

        videos[0].play();
        videos.forEach(video => {
            video.addEventListener('ended', updateSlider);
        });
    }

    // ----------------------------------
    //  HOME: CLIQUE NOS CARDS (REDIRECIONAMENTO)
    // ----------------------------------
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceName = card.getAttribute('data-service');
            window.location.href = `agendamento.html?service=${encodeURIComponent(serviceName)}`;
        });
    });

    // ----------------------------------
    //  AGENDAMENTO: PREENCHIMENTO E PAGAMENTO
    // ----------------------------------
    const selectServico = document.getElementById('servico');
    const selectPagamento = document.getElementById('selectPagamento');
    const pixArea = document.getElementById('pixArea');
    const confirmarButton = document.getElementById('confirmarButton');
    const pagarNubankButton = document.getElementById('pagarNubank');
    const wppLink = document.getElementById('wppLink');

    if (selectServico) {
        // Preenchimento automático do serviço vindo da URL
        const urlParams = new URLSearchParams(window.location.search);
        const serviceFromUrl = urlParams.get('service');
        
        if (serviceFromUrl) {
            Array.from(selectServico.options).forEach(option => {
                // Compara o 'value' ou o texto da opção
                if (option.value.includes(serviceFromUrl) || option.text.includes(serviceFromUrl)) {
                    option.selected = true;
                }
            });
        }
    }

    if (selectPagamento) {
        // Lógica de Pagamento
        const togglePixArea = () => {
            const nomeCliente = document.getElementById('nome').value || "Cliente";
            const servicoSelecionado = selectServico.options[selectServico.selectedIndex].text;
            const dataSelecionada = document.getElementById('data').value || "[Data Pendente]";
            
            const wppMessage = `Olá! Meu nome é ${nomeCliente}, acabei de pagar 50% do agendamento para "${servicoSelecionado}" no dia ${dataSelecionada}. Segue o comprovante.`;
            wppLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(wppMessage)}`;

            if (selectPagamento.value === 'PIX') {
                pixArea.style.display = 'block';
            } else {
                pixArea.style.display = 'none';
            }
        };

        // Adiciona listeners para atualizar a mensagem do Wpp dinamicamente
        selectPagamento.addEventListener('change', togglePixArea);
        document.getElementById('nome').addEventListener('input', togglePixArea);
        selectServico.addEventListener('change', togglePixArea);
        document.getElementById('data').addEventListener('change', togglePixArea);
        
        togglePixArea(); // Executa ao carregar
    }

    if (pagarNubankButton) {
        pagarNubankButton.onclick = () => {
            window.open(NUBANK_LINK, '_blank');
        };
    }

    if (confirmarButton) {
        // Lógica de Confirmação (Alerta)
        confirmarButton.addEventListener('click', (e) => {
            e.preventDefault();
            const pagamentoSelecionado = selectPagamento ? selectPagamento.value : '';

            if (pagamentoSelecionado === 'PIX') {
                alert('Agendamento Pré-Confirmado!\n\nNão se esqueça de clicar em "Pagar 50% Agora (Nubank)" e, OBRIGATORIAMENTE, enviar o comprovante via WhatsApp para garantir sua vaga.');
            } else if (pagamentoSelecionado === 'Pagar no local') {
                alert('Agendamento Pré-Confirmado!\n\nPor favor, chegue com 10 minutos de antecedência. O pagamento será realizado antes do início do procedimento.');
            } else {
                 alert('Por favor, preencha todos os campos e selecione uma forma de pagamento.');
            }
        });
    }

    // ----------------------------------
    //  AGENDAMENTO: MINI SLIDER DE VÍDEO
    // ----------------------------------
    const miniSliderVideo = document.querySelector('.mini-slider video');
    if (miniSliderVideo) {
        // Nome do seu vídeo da página de agendamento
        miniSliderVideo.src = 'videos/WhatsApp_Video_Naturalidade.mp4'; 
        miniSliderVideo.play();
    }
});
