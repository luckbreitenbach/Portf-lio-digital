import { useEffect, useMemo, useState } from 'react';

type Account = {
  name: string;
  email: string;
  password: string;
};

type Project = {
  title: string;
  description: string;
  stack: string[];
  details: string;
};

type AdminState = {
  name: string;
  role: string;
  bio: string;
  email: string;
  location: string;
  phone: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  projects: Project[];
};

const ALLOWED_ADMIN_EMAIL = 'vendascomp55@gmail.com';

const defaultAdminState: AdminState = {
  name: 'NotaCerta',
  role: 'Plataforma de gestão e automação para negócios',
  bio: 'A NotaCerta é uma solução digital pensada para modernizar processos, centralizar informações e melhorar a operação de empresas com praticidade, inteligência e tecnologia.',
  email: 'vendascomp55@gmail.com',
  location: 'Brasil',
  phone: '+55 (11) 99999-9999',
  heroTitle: 'Tecnologia que organiza, automatiza e acelera o crescimento do seu negócio.',
  heroSubtitle: 'A NotaCerta combina experiência digital com inovação em desenvolvimento web e aplicações para entregar soluções mais ágeis, eficientes e escaláveis.',
  ctaPrimary: 'Conhecer a solução',
  ctaSecondary: 'Falar com a equipe',
  projects: [
    {
      title: 'Portfólio Lucas Breitenbach',
      description: 'Sistema de gestão digital para centralizar operações, melhorar processos e reduzir retrabalho.',
      stack: ['React', 'TypeScript', 'Java', 'JavaScript'],
      details: 'Projeto focado em performance, organização e experiência de uso para negócios que querem crescer com tecnologia.',
    },
  ],
};

const STORAGE_KEY = 'portfolio-admin-state';
const ACCOUNTS_KEY = 'portfolio-accounts';
const ACTIVE_ACCOUNT_KEY = 'portfolio-active-user';
const DEFAULT_ACCOUNTS: Account[] = [{
  name: 'NotaCerta',
  email: ALLOWED_ADMIN_EMAIL,
  password: 'notacerta123',
}];

const createEmptyProject = (): Project => ({
  title: 'Novo projeto',
  description: 'Descreva o que este projeto entrega para o cliente e para o negócio.',
  stack: ['React', 'TypeScript'],
  details: 'Foco em entrega, experiência e crescimento.',
});

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [activeAccount, setActiveAccount] = useState<Account | null>(() => {
    const saved = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
    return saved ? (JSON.parse(saved) as Account) : null;
  });
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem(ACCOUNTS_KEY);
    return saved ? (JSON.parse(saved) as Account[]) : DEFAULT_ACCOUNTS;
  });
  const [adminState, setAdminState] = useState<AdminState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as AdminState) : defaultAdminState;
  });

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminState));
  }, [adminState]);

  useEffect(() => {
    if (activeAccount) {
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, JSON.stringify(activeAccount));
    } else {
      localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    }
  }, [activeAccount]);

  const handleFieldChange = (field: keyof AdminState, value: string) => {
    setAdminState((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string | string[]) => {
    setAdminState((prev) => {
      const nextProjects = [...prev.projects];
      nextProjects[index] = { ...nextProjects[index], [field]: value } as Project;
      return { ...prev, projects: nextProjects };
    });
  };

  const addProject = () => {
    setAdminState((prev) => ({
      ...prev,
      projects: [...prev.projects, createEmptyProject()],
    }));
  };

  const removeProject = (index: number) => {
    setAdminState((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, projectIndex) => projectIndex !== index),
    }));
  };

  const openAdmin = () => {
    if (activeAccount) {
      setIsAdminOpen(true);
      return;
    }

    setAuthModalOpen(true);
    setAuthMode('login');
  };

  const handleCreateAccount = () => {
    const email = accountEmail.trim();
    const name = accountName.trim();

    if (!name || !email || !accountPassword.trim()) {
      window.alert('Preencha nome, email e senha para criar a conta.');
      return;
    }

    const normalizedEmail = email.toLowerCase();
    if (normalizedEmail !== ALLOWED_ADMIN_EMAIL) {
      window.alert('Acesso restrito. Apenas o e-mail vendascomp55@gmail.com pode gerenciar este site.');
      return;
    }

    const alreadyExists = accounts.some((item) => item.email.toLowerCase() === normalizedEmail);
    if (alreadyExists) {
      window.alert('Já existe uma conta com este e-mail.');
      return;
    }

    const newAccount: Account = {
      name,
      email: normalizedEmail,
      password: accountPassword.trim(),
    };

    setAccounts((prev) => [...prev, newAccount]);
    setActiveAccount(newAccount);
    setAuthModalOpen(false);
    setIsAdminOpen(true);
    setAccountName('');
    setAccountEmail('');
    setAccountPassword('');
  };

  const handleLogin = () => {
    const email = accountEmail.trim();
    const password = accountPassword.trim();

    if (!email || !password) {
      window.alert('Preencha o e-mail e a senha para continuar.');
      return;
    }

    const normalizedEmail = email.toLowerCase();
    if (normalizedEmail !== ALLOWED_ADMIN_EMAIL) {
      window.alert('Acesso restrito. Apenas o e-mail vendascomp55@gmail.com pode gerenciar este site.');
      return;
    }

    const account = accounts.find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
    );

    if (!account) {
      window.alert('E-mail ou senha inválidos.');
      return;
    }

    setActiveAccount(account);
    setAuthModalOpen(false);
    setIsAdminOpen(true);
    setAccountEmail('');
    setAccountPassword('');
  };

  const logoutAccount = () => {
    setActiveAccount(null);
    setIsAdminOpen(false);
    setAuthModalOpen(true);
    setAuthMode('login');
  };

  return (
    <>
      <header className="topbar">
        <div className="container nav">
          <div className="brand">{adminState.name}</div>
          <nav>
            <a href="#sobre">Sobre</a>
            <a href="#stack">Stack</a>
            <a href="#projetos">Projetos</a>
            <a href="#contato">Contato</a>
          </nav>
          <div className="header-actions">
            {activeAccount ? <span className="user-badge">Olá, {activeAccount.name}</span> : null}
            <button className="admin-button" onClick={openAdmin}>
              {activeAccount ? 'Administrar' : 'Entrar'}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">Desenvolvimento Web · Java · React · TypeScript</p>
              <h1>{adminState.heroTitle}</h1>
              <p className="hero-subtitle">{adminState.heroSubtitle}</p>
              <div className="cta-row">
                <a href="#projetos" className="btn btn-primary">{adminState.ctaPrimary}</a>
                <a href="#contato" className="btn btn-secondary">{adminState.ctaSecondary}</a>
              </div>
              <ul className="quick-info">
                <li>📍 {adminState.location}</li>
                <li>✉️ {adminState.email}</li>
              </ul>
            </div>

            <div className="hero-visual">
              <div className="tech-visual" aria-hidden="true">
                <span className="orb orb-one" />
                <span className="orb orb-two" />
                <span className="orb orb-three" />
                <span className="wave w1" />
                <span className="wave w2" />
                <span className="wave w3" />
                <span className="dot d1" />
                <span className="dot d2" />
                <span className="dot d3" />
                <span className="dot d4" />
              </div>
              <div className="hero-card">
                <h3>{adminState.name}</h3>
                <p>{adminState.role}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className="section">
          <div className="section-visual" aria-hidden="true">
            <span className="floating-circle circle-a" />
            <span className="floating-circle circle-b" />
            <span className="floating-line line-a" />
          </div>
          <div className="container two-columns">
            <div>
              <p className="section-tag">Sobre</p>
              <h2>Transformando processos em vantagem competitiva.</h2>
            </div>
            <div>
              <p>{adminState.bio}</p>
            </div>
          </div>
        </section>

        <section id="stack" className="section alt">
          <div className="section-visual" aria-hidden="true">
            <span className="floating-circle circle-c" />
            <span className="floating-circle circle-d" />
            <span className="floating-line line-b" />
          </div>
          <div className="container">
            <p className="section-tag">Stack</p>
            <h2>Ferramentas e tecnologias que estudo e aplico</h2>
            <div className="tech-grid">
              {['React', 'TypeScript', 'Java', 'JavaScript'].map((tech) => (
                <div className="tech-card" key={tech}>
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projetos" className="section">
          <div className="section-visual" aria-hidden="true">
            <span className="floating-circle circle-e" />
            <span className="floating-circle circle-f" />
            <span className="floating-line line-c" />
          </div>
          <div className="container">
            <p className="section-tag">Projeto</p>
            <h2>Foco em produto, experiência e eficiência</h2>
            <div className="project-grid">
              {adminState.projects.map((project, index) => (
                <article className="project-card" key={project.title}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tag-list">
                    {project.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <small>{project.details}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="section contact">
          <div className="section-visual" aria-hidden="true">
            <span className="floating-circle circle-g" />
            <span className="floating-circle circle-h" />
            <span className="floating-line line-d" />
          </div>
          <div className="container contact-box">
            <div>
              <p className="section-tag">Contato</p>
              <h2>Sou estudante de Análise e Desenvolvimento de Sistemas e estou constantemente construindo projetos, aprofundando meus conhecimentos e buscando novos desafios para evoluir como desenvolvedor.</h2>
            </div>
            <div className="contact-info">
              <p>{adminState.email}</p>
              <p>{adminState.phone}</p>
              <a href="mailto:lucas@email.com" className="btn btn-primary">Solicitar orçamento</a>
            </div>
          </div>
        </section>
      </main>

      {authModalOpen && (
        <div className="auth-overlay" onClick={() => setAuthModalOpen(false)}>
          <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
            <div className="auth-header">
              <h3>{authMode === 'login' ? 'Entrar na conta' : 'Criar conta'}</h3>
              <button onClick={() => setAuthModalOpen(false)}>Fechar</button>
            </div>

            {authMode === 'register' && (
              <label>
                Nome completo
                <input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Seu nome" />
              </label>
            )}

            <label>
              E-mail
              <input value={accountEmail} onChange={(e) => setAccountEmail(e.target.value)} placeholder="seu@email.com" />
            </label>

            <label>
              Senha
              <input type="password" value={accountPassword} onChange={(e) => setAccountPassword(e.target.value)} placeholder="••••••••" />
            </label>

            <button className="btn btn-primary full-width" onClick={authMode === 'login' ? handleLogin : handleCreateAccount}>
              {authMode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>

            <div className="auth-switch">
              {authMode === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'}
              <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                {authMode === 'login' ? 'Criar conta' : 'Fazer login'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdminOpen && (
        <aside className="admin-panel">
          <div className="admin-header">
            <h3>Configuração do portfólio</h3>
            <div className="admin-header-actions">
              <button onClick={logoutAccount} className="logout-button">Sair</button>
              <button onClick={() => setIsAdminOpen(false)}>Fechar</button>
            </div>
          </div>

          <div className="admin-note">Conta ativa: {activeAccount?.name ?? 'Visitante'}</div>

          <div className="admin-form">
            <label>
              Nome
              <input value={adminState.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
            </label>
            <label>
              Cargo
              <input value={adminState.role} onChange={(e) => handleFieldChange('role', e.target.value)} />
            </label>
            <label>
              Localização
              <input value={adminState.location} onChange={(e) => handleFieldChange('location', e.target.value)} />
            </label>
            <label>
              Email
              <input value={adminState.email} onChange={(e) => handleFieldChange('email', e.target.value)} />
            </label>
            <label>
              Telefone
              <input value={adminState.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} />
            </label>
            <label>
              Título principal
              <input value={adminState.heroTitle} onChange={(e) => handleFieldChange('heroTitle', e.target.value)} />
            </label>
            <label>
              Subtítulo
              <textarea value={adminState.heroSubtitle} onChange={(e) => handleFieldChange('heroSubtitle', e.target.value)} />
            </label>
            <label>
              Texto sobre
              <textarea value={adminState.bio} onChange={(e) => handleFieldChange('bio', e.target.value)} />
            </label>

            <div className="admin-projects">
              <button className="btn btn-primary full-width" type="button" onClick={addProject}>Adicionar projeto</button>
              {adminState.projects.map((project, index) => (
                <div key={`${project.title}-${index}`} className="project-editor">
                  <div className="project-editor-header">
                    <h4>Projeto {index + 1}</h4>
                    <button type="button" className="delete-project-button" onClick={() => removeProject(index)}>Excluir</button>
                  </div>
                  <label>
                    Título
                    <input value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} />
                  </label>
                  <label>
                    Descrição
                    <textarea value={project.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} />
                  </label>
                  <label>
                    Stack
                    <input value={project.stack.join(', ')} onChange={(e) => handleProjectChange(index, 'stack', e.target.value.split(',').map((s) => s.trim()))} />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

export default App;
