BEGIN;

-- Dados demonstrativos; contatos e históricos não fornecidos são fictícios.
INSERT INTO pessoas (
    nome,
    email,
    telefone,
    cidade,
    estado,
    resumo
)
VALUES
    (
        'Leticia Vitória Elias de Oliveira',
        'leticia.vitoria@example.com',
        NULL,
        NULL,
        NULL,
        'Desenvolvedora Backend em formação'
    ),
    (
        'Marina Costa Albuquerque',
        'marina.albuquerque@example.com',
        '(00) 00000-0000',
        'Recife',
        'PE',
        'Analista de Dados em formação; pessoa fictícia para dados demonstrativos.'
    );

INSERT INTO formacoes (
    pessoa_id,
    instituicao,
    curso,
    grau,
    data_inicio,
    data_fim,
    status,
    descricao
)
VALUES
    (
        (SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'),
        'UNICAP',
        'Sistemas para Internet',
        'Tecnólogo',
        '2024-02-01',
        NULL,
        'em andamento',
        'Formação superior em Sistemas para Internet.'
    ),
    (
        (SELECT id FROM pessoas WHERE email = 'marina.albuquerque@example.com'),
        'Instituto Fictício de Tecnologia',
        'Ciência de Dados',
        'Tecnólogo',
        '2022-02-01',
        '2025-12-15',
        'concluído',
        'Formação fictícia para demonstrar os dados de currículo.'
    );

INSERT INTO experiencias_profissionais (
    pessoa_id,
    empresa,
    cargo,
    data_inicio,
    data_fim,
    atual,
    descricao
)
VALUES
    (
        (SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'),
        'Projeto Acadêmico (exemplo)',
        'Desenvolvedora Backend em formação',
        '2025-01-01',
        NULL,
        TRUE,
        'Experiência demonstrativa desenvolvendo serviços REST e praticando SQL.'
    ),
    (
        (SELECT id FROM pessoas WHERE email = 'marina.albuquerque@example.com'),
        'Empresa Fictícia de Dados',
        'Estagiária de Análise de Dados',
        '2024-01-08',
        '2025-12-19',
        FALSE,
        'Experiência profissional fictícia para os dados de demonstração.'
    );

INSERT INTO projetos (
    pessoa_id,
    nome,
    descricao,
    tecnologias,
    url,
    repositorio,
    data_inicio,
    data_fim
)
VALUES
    (
        (SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'),
        'API de Currículo',
        'Projeto demonstrativo de API REST para organizar informações profissionais.',
        ARRAY['Java', 'Spring Boot', 'PostgreSQL', 'REST APIs']::TEXT[],
        NULL,
        NULL,
        '2025-02-01',
        NULL
    ),
    (
        (SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'),
        'Painel de Vagas',
        'Interface demonstrativa para consultar e acompanhar oportunidades.',
        ARRAY['Angular', 'Java', 'SQL']::TEXT[],
        NULL,
        NULL,
        '2025-08-01',
        NULL
    ),
    (
        (SELECT id FROM pessoas WHERE email = 'marina.albuquerque@example.com'),
        'Painel de Indicadores',
        'Projeto fictício de visualização de indicadores de vendas.',
        ARRAY['Python', 'SQL', 'Power BI']::TEXT[],
        NULL,
        NULL,
        '2024-04-01',
        '2024-09-30'
    );

INSERT INTO habilidades (pessoa_id, nome, nivel, categoria)
VALUES
    ((SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'), 'Java', 'Intermediário', 'Backend'),
    ((SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'), 'Spring Boot', 'Intermediário', 'Backend'),
    ((SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'), 'SQL', 'Intermediário', 'Banco de dados'),
    ((SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'), 'PostgreSQL', 'Intermediário', 'Banco de dados'),
    ((SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'), 'REST APIs', 'Intermediário', 'Backend'),
    ((SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'), 'Angular', 'Básico', 'Frontend'),
    ((SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'), 'Git', 'Intermediário', 'Ferramentas'),
    ((SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'), 'GitHub', 'Intermediário', 'Ferramentas'),
    ((SELECT id FROM pessoas WHERE email = 'marina.albuquerque@example.com'), 'Python', 'Intermediário', 'Programação'),
    ((SELECT id FROM pessoas WHERE email = 'marina.albuquerque@example.com'), 'SQL', 'Intermediário', 'Banco de dados'),
    ((SELECT id FROM pessoas WHERE email = 'marina.albuquerque@example.com'), 'Power BI', 'Básico', 'Visualização de dados'),
    ((SELECT id FROM pessoas WHERE email = 'marina.albuquerque@example.com'), 'Excel', 'Avançado', 'Análise de dados');

INSERT INTO certificacoes (
    pessoa_id,
    nome,
    instituicao,
    data_conclusao,
    validade,
    url
)
VALUES
    (
        (SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'),
        'Fundamentos de Java e Spring Boot (exemplo)',
        'Plataforma de Cursos (exemplo)',
        '2025-03-15',
        NULL,
        NULL
    ),
    (
        (SELECT id FROM pessoas WHERE email = 'leticia.vitoria@example.com'),
        'Introdução a SQL e PostgreSQL (exemplo)',
        'Plataforma de Cursos (exemplo)',
        '2025-06-20',
        NULL,
        NULL
    ),
    (
        (SELECT id FROM pessoas WHERE email = 'marina.albuquerque@example.com'),
        'Fundamentos de Análise de Dados (fictício)',
        'Instituto Fictício de Tecnologia',
        '2025-07-10',
        NULL,
        NULL
    );

COMMIT;