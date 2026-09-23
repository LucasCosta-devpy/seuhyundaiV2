// Conteúdo inicial (seed) — tudo isso é editável depois pelo painel /admin
export const defaultContent = {
  brand: {
    name: 'Rumo Mais Uma Rota',
    tagline: 'Consultoria de Viagens Personalizada & Exclusiva',
    logoUrl: '/logo.jpg',
    logoSize: 'lg',
    logoScale: 100,
    logoOffsetX: 0,
    logoOffsetY: 0,
    instagram: '@rumomaisumarota',
    whatsapp: '5551982710564',
  },
  socialLinks: [
    { platform: 'instagram', name: 'Instagram', url: 'https://instagram.com/rumomaisumarota', iconUrl: '' },
  ],
  hero: {
    countryTags: [
      'Brasil', 'Argentina', 'Uruguai', 'Chile', 'Venezuela', 'Guianas',
      'Portugal', 'Espanha', 'França', 'Itália', 'Alemanha', 'Polônia',
      'Eslováquia', 'Hungria', 'Suíça', 'Áustria', 'Países Baixos',
      'Bélgica', 'Reino Unido', 'Marrocos',
    ],
  },
  about: {
    title: 'Nossa Experiência, O Seu Guia Perfeito',
    paragraphs: [
      'Viajar é muito mais do que apenas visitar novos lugares; é colecionar momentos e viver histórias inesquecíveis. Na Rumo Mais Uma Rota, transformamos o seu sonho em realidade com planejamento rigoroso e atendimento boutique.',
      'Com anos de estrada explorando destinos fascinantes ao redor do mundo, nós testamos, vivemos e aprovamos cada detalhe. Confira abaixo o nosso portfólio de rotas:',
    ],
  },
  destinationGroups: [
    {
      region: 'América do Sul & Brasil',
      items: [
        { name: 'Brasil', desc: 'Roteiros completos pelo país, praias, capitais e serras.', imageUrl: '' },
        { name: 'Argentina', desc: 'Buenos Aires, Patagônia e Cordilheira dos Andes.', imageUrl: '' },
        { name: 'Uruguai', desc: 'Montevidéu, Punta del Este e vinícolas charmosas.', imageUrl: '' },
        { name: 'Chile', desc: 'Santiago, paisagens andinas e experiências únicas.', imageUrl: '' },
        { name: 'Venezuela & Guianas', desc: 'Explorações pela Venezuela, Guiana Francesa e Guiana Inglesa.', imageUrl: '' },
      ],
    },
    {
      region: 'Europa (Ampla Experiência e Conhecimento)',
      items: [
        { name: 'Portugal', desc: 'Lisboa, Porto e vilas históricas lusitanas.', imageUrl: '' },
        { name: 'Espanha', desc: 'Madri, Barcelona e rica gastronomia regional.', imageUrl: '' },
        { name: 'França', desc: 'Paris e o Palácio de Versalhes.', imageUrl: '' },
        { name: 'Itália', desc: 'Roma, Pisa e marcos históricos milenares.', imageUrl: '' },
        { name: 'Alemanha', desc: 'Berlim e castelos tradicionais.', imageUrl: '' },
        { name: 'Polônia', desc: 'Cracóvia e o Museu Auschwitz.', imageUrl: '' },
        { name: 'Reino Unido (Londres)', desc: "British Museum, Tower of London e St. Paul's.", imageUrl: '' },
        { name: 'Suíça & Áustria', desc: 'Paisagens alpinas, Viena e lagos deslumbrantes.', imageUrl: '' },
        { name: 'Hungria & Eslováquia', desc: 'Budapeste, Bratislava e roteiros centro-europeus.', imageUrl: '' },
        { name: 'Bélgica & Países Baixos', desc: 'Bruxelas, Amsterdã e canais históricos.', imageUrl: '' },
      ],
    },
    {
      region: 'África',
      items: [
        { name: 'Marrocos', desc: 'Medinas milenares, mercados tradicionais e paisagens do deserto.', imageUrl: '' },
      ],
    },
  ],
  services: [
    { title: 'Roteiros Personalizados', desc: 'Planejamento dia a dia adaptado ao seu ritmo e estilo de viagem.' },
    { title: 'Carta Verde (Mercosul)', desc: 'Orientação de rotas de carro e emissão do Seguro Carta Verde obrigatório para circular de veículo pelo Mercosul.' },
    { title: 'Seguro Viagem', desc: 'Indicação e contratação das melhores opções de Seguro Viagem com cobertura médica completa.' },
    { title: 'Onde Comer e Evitar', desc: 'Indicações gastronômicas que cabem no bolso e alertas de armadilhas para turistas.' },
  ],
  reasons: [
    { title: 'Atendimento Exclusivo', desc: 'Atendimento 100% humanizado e personalizado. Suporte ativo via WhatsApp inclusive durante a sua viagem.' },
    { title: 'Economia Real', desc: 'Qualidade com o melhor custo-benefício. Nossas dicas fazem o valor investido na consultoria se pagar facilmente.' },
    { title: 'Vivência e Experiência', desc: 'Experiência prática em viagens internacionais e nacionais. Conhecimento real de quem esteve presente em cada destino!' },
  ],
  process: [
    { title: 'Conversa Inicial', desc: 'Alinhamento de perfil, escolhas de rotas, orçamento e envio de orientações burocráticas (Carta Verde, Seguro Viagem).' },
    { title: 'Passagem Aérea', desc: 'Acompanhamento semanal de valores para indicar o momento ideal de compra na plataforma da sua preferência.' },
    { title: 'Acomodações', desc: 'Seleção criteriosa de opções ideais de hospedagem ajustadas ao seu estilo e orçamento.' },
    { title: 'Passeios e Ingressos', desc: 'Curadoria completa das atrações imperdíveis e auxílio para compra garantida e antecipada dos ingressos.' },
    { title: 'Entrega do Roteiro', desc: 'Material completo em PDF com o itinerário detalhado, sugestões gastronômicas, logística e dicas de câmbio.' },
    { title: 'Hora de Viajar!', desc: 'Suporte e acompanhamento por WhatsApp disponível durante o seu itinerário para emergências e orientações rápidas.' },
  ],
  pricing: {
    title: 'Investimento na Consultoria',
    intro: 'Escolha o nível de planejamento ideal para a complexidade da sua viagem.',
    plans: [
      {
        name: 'Consultoria de Viagem',
        priceLabel: 'A partir de R$ 197',
        tagline: 'Para quem já sabe para onde quer ir e precisa de orientação para tomar as melhores decisões.',
        bullets: [
          'Análise estratégica do destino e da melhor época pra viajar',
          'Curadoria de hospedagem, mobilidade e onde comer bem',
          'Sessão de alinhamento individual pra tirar todas as dúvidas',
        ],
      },
      {
        name: 'Roteiro Personalizado',
        priceLabel: 'A partir de R$ 397',
        tagline: 'Para quem quer que a gente estude a viagem e construa um itinerário exclusivo.',
        bullets: [
          'Itinerário diário sob medida, desenhado pro seu ritmo',
          'Guia completo de atrações e experiências alinhadas ao seu perfil',
          'Documentação de viagem organizada num guia digital exclusivo',
        ],
      },
      {
        name: 'Planejamento Completo',
        priceLabel: 'A partir de R$ 797 (orçamento personalizado para roteiros de altíssima complexidade)',
        tagline: 'Para viagens complexas, como uma Europa + África de 50 dias, com múltiplos destinos.',
        bullets: [
          'Gestão logística de alta complexidade (voos, trens, traslados)',
          'Curadoria integral de hospedagens em todo o percurso',
          'Suporte dedicado com plano de contingência pra imprevistos',
        ],
      },
    ],
    paymentInfo: 'Forma de pagamento: 50% de sinal via Pix no ato da contratação e 50% restantes na entrega final do roteiro em PDF.',
  },
  consultant: {
    name: 'Patricia Costa',
    role: 'Consultora Rumo Mais Uma Rota',
    photoUrl: '',
    bio: 'Como fundadora e especialista da Rumo Mais Uma Rota, transformo minha paixão por viajar em um planejamento sob medida, exclusivo e detalhado para cada cliente. Com uma trajetória consolidada em roteiros nacionais e internacionais de alto padrão — explorando a América do Sul, a Europa e a África —, ofereço a curadoria e a segurança necessárias para transformar a sua próxima jornada em uma experiência inesquecível.',
    quote: 'Um bom planejamento é a chave para economizar!',
  },
  cta: {
    title: 'Pronto para dar o próximo passo?',
    desc: 'Deixe a burocracia, os seguros e o planejamento pesado com a gente. Foque apenas em arrumar as malas e aproveitar o destino!',
  },
  footer: {
    text: 'Todos os direitos reservados. | Transformando rotas em memórias inesquecíveis.',
  },
}
