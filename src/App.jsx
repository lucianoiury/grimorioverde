import { useState, useEffect } from 'react'
import './App.css'
import { useErvas } from './hooksErvas'
import { supabase } from './supabaseClient'
import { uploadImagem } from './uploadImagem'

function HomeScreen({ onNavigate }) {
  return (
    <div className="screen home" style={{position:'relative',overflow:'hidden'}}>
      <img src="/favicon.svg" className="illustration-leaf" alt="folha decorativa" />
      <h1>Grimório Verde Clã Michetti 🌿</h1>
      <p className="subtitle">O poder da natureza ao alcance da sua intuição.</p>
      <div className="quick-access">
        <button onClick={() => onNavigate('search')}>🔍 Buscar erva</button>
        <button onClick={() => onNavigate('list')}>📖 Lista completa</button>
        <button onClick={() => onNavigate('categories')}>🌒 Categorias</button>
      </div>
      <svg className="illustration-branch" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 50 Q60 10 110 50" stroke="#357a38" strokeWidth="4" fill="none"/>
        <ellipse cx="30" cy="40" rx="8" ry="18" fill="#b6e2b6" stroke="#357a38" strokeWidth="2"/>
        <ellipse cx="90" cy="40" rx="8" ry="18" fill="#b6e2b6" stroke="#357a38" strokeWidth="2"/>
      </svg>
    </div>
  )
}

function SearchScreen({ onNavigate, onSelectHerb, refresh }) {
  const { ervas, loading, error } = useErvas(refresh)
  const [busca, setBusca] = useState('')
  const [filtroElemento, setFiltroElemento] = useState('')
  const [filtroPlaneta, setFiltroPlaneta] = useState('')
  const [filtroPropriedade, setFiltroPropriedade] = useState('')

  const elementos = ['Fogo', 'Água', 'Ar']
  const planetas = ['Marte', 'Sol', 'Mercúrio', 'Júpiter']
  const propriedades = ['proteção', 'cura', 'purificação', 'amor', 'calma', 'memória', 'sabedoria', 'sono', 'limpeza']

  const filtradas = (ervas || []).filter(e =>
    (e.nome_popular?.toLowerCase().includes(busca.toLowerCase()) || e.nome_cientifico?.toLowerCase().includes(busca.toLowerCase())) &&
    (!filtroElemento || e.elemento === filtroElemento) &&
    (!filtroPlaneta || e.planeta === filtroPlaneta) &&
    (!filtroPropriedade || (e.propriedades || []).includes(filtroPropriedade))
  )

  return (
    <div className="screen search">
      <h2>Buscar Erva</h2>
      <input placeholder="Nome popular ou científico" value={busca} onChange={e => setBusca(e.target.value)} />
      <div className="filters">
        <select value={filtroElemento} onChange={e => setFiltroElemento(e.target.value)}>
          <option value="">Elemento</option>
          {elementos.map(el => <option key={el} value={el}>{el}</option>)}
        </select>
        <select value={filtroPlaneta} onChange={e => setFiltroPlaneta(e.target.value)}>
          <option value="">Planeta</option>
          {planetas.map(pl => <option key={pl} value={pl}>{pl}</option>)}
        </select>
        <select value={filtroPropriedade} onChange={e => setFiltroPropriedade(e.target.value)}>
          <option value="">Propriedade</option>
          {propriedades.map(pr => <option key={pr} value={pr}>{pr}</option>)}
        </select>
      </div>
      {loading && <p>Carregando ervas...</p>}
      {error && <p>Erro ao carregar ervas.</p>}
      <div className="herb-list">
        {filtradas.length === 0 && !loading && <p>Nenhuma erva encontrada.</p>}
        {filtradas.map((erva, idx) => (
          <div key={erva.id || idx} className="herb-list-item" onClick={() => onSelectHerb(erva)}>
            <img src={erva.imagem_url} alt={erva.nome_popular} />
            <div>
              <b>{erva.nome_popular}</b>
              <div className="herb-latin">{erva.nome_cientifico}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => onNavigate('home')}>Voltar</button>
    </div>
  )
}

function CategoriesScreen({ onNavigate }) {
  return (
    <div className="screen categories">
      <h2>Categorias de Exploração</h2>
      <ul>
        <li>Amor, proteção, prosperidade...</li>
        <li>Por elemento ou planeta</li>
        <li>Uso seguro x restrições</li>
      </ul>
      <button onClick={() => onNavigate('home')}>Voltar</button>
    </div>
  )
}

function ExtrasScreen({ onNavigate }) {
  return (
    <div className="screen extras">
      <h2>Extras Místicos</h2>
      <ul>
        <li>Diário de práticas mágicas</li>
        <li>Calendário lunar e dias mágicos</li>
        <li>Notificações com dicas e ervas do dia</li>
      </ul>
      <button onClick={() => onNavigate('home')}>Voltar</button>
    </div>
  )
}

function SettingsScreen({ onNavigate }) {
  return (
    <div className="screen settings">
      <h2>Configurações</h2>
      <ul>
        <li>Modo escuro / claro 🌗</li>
        <li>Idioma (PT-BR, EN...)</li>
        <li>Termos de uso + aviso</li>
      </ul>
      <button onClick={() => onNavigate('home')}>Voltar</button>
    </div>
  )
}

function HerbDetailScreen({ herb, onNavigate }) {
  if (!herb) {
    return (
      <div className="screen herb-detail">
        <h2>Detalhes da Erva</h2>
        <p>Nenhuma erva selecionada.</p>
        <button onClick={() => onNavigate('search')}>Voltar</button>
      </div>
    )
  }
  return (
    <div className="screen herb-detail">
      <h2>{herb.nome_popular} <span className="herb-latin">({herb.nome_cientifico})</span></h2>
      <img src={herb.imagem_url} alt={herb.nome_popular} className="herb-img" />
      <ul className="herb-info">
        <li><b>Propriedades mágicas:</b> {(herb.propriedades || []).join(', ')}</li>
        <li><b>Função ritualística:</b> {(herb.funcoes || []).join(', ')}</li>
        <li><b>Elemento regente:</b> {herb.elemento}</li>
        <li><b>Planeta regente:</b> {herb.planeta}</li>
        <li><b>Associações:</b> {(herb.associacoes || []).join(', ')}</li>
      </ul>
      <button onClick={() => onNavigate('search')}>Voltar</button>
    </div>
  )
}

function LoginScreen({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const { error, data } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) setMsg('Erro: ' + error.message)
    else {
      setMsg('Login realizado!')
      if (onLogin) onLogin(data.session)
    }
    setLoading(false)
  }
  return (
    <div className="screen login">
      <h2>Login Admin</h2>
      <form onSubmit={handleSubmit} className="herb-form">
        <input type="email" placeholder="Seu e-mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
      {msg && <p>{msg}</p>}
      <button onClick={() => onNavigate('home')}>Voltar</button>
    </div>
  )
}

function AdminScreen({ onNavigate, onHerbAdded }) {
  const [form, setForm] = useState({
    nome_popular: '',
    nome_cientifico: '',
    propriedades: '',
    funcoes: '',
    elemento: '',
    planeta: '',
    associacoes: '',
    imagem_url: ''
  })
  const [editId, setEditId] = useState(null)
  const [ervas, setErvas] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // Carregar ervas cadastradas
  useEffect(() => {
    async function fetchErvas() {
      const { data } = await supabase.from('ervas').select('*').order('nome_popular')
      setErvas(data || [])
    }
    fetchErvas()
  }, [msg])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleEdit = erva => {
    setEditId(erva.id)
    setForm({
      nome_popular: erva.nome_popular || '',
      nome_cientifico: erva.nome_cientifico || '',
      propriedades: (erva.propriedades || []).join(', '),
      funcoes: (erva.funcoes || []).join(', '),
      elemento: erva.elemento || '',
      planeta: erva.planeta || '',
      associacoes: (erva.associacoes || []).join(', '),
      imagem_url: erva.imagem_url || ''
    })
    window.scrollTo(0, 0)
  }
  const handleDelete = async id => {
    if (!window.confirm('Tem certeza que deseja excluir esta erva?')) return
    setLoading(true)
    setMsg('')
    const { error } = await supabase.from('ervas').delete().eq('id', id)
    if (error) setMsg('Erro ao excluir: ' + error.message)
    else setMsg('Erva excluída!')
    setLoading(false)
  }
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const payload = {
      ...form,
      propriedades: form.propriedades.split(',').map(s => s.trim()),
      funcoes: form.funcoes.split(',').map(s => s.trim()),
      associacoes: form.associacoes.split(',').map(s => s.trim())
    }
    let error
    if (editId) {
      ({ error } = await supabase.from('ervas').update(payload).eq('id', editId))
    } else {
      ({ error } = await supabase.from('ervas').insert([payload]))
    }
    if (error) setMsg('Erro ao salvar: ' + error.message)
    else {
      setMsg(editId ? 'Erva atualizada!' : 'Erva cadastrada com sucesso!')
      setForm({
        nome_popular: '', nome_cientifico: '', propriedades: '', funcoes: '', elemento: '', planeta: '', associacoes: '', imagem_url: ''
      })
      setEditId(null)
      if (onHerbAdded) onHerbAdded()
    }
    setLoading(false)
  }
  return (
    <div className="screen admin">
      <h2>{editId ? 'Editar Erva' : 'Cadastro de Erva'}</h2>
      <form onSubmit={handleSubmit} className="herb-form" encType="multipart/form-data">
        <input name="nome_popular" placeholder="Nome popular" value={form.nome_popular} onChange={handleChange} required />
        <input name="nome_cientifico" placeholder="Nome científico" value={form.nome_cientifico} onChange={handleChange} />
        <input name="propriedades" placeholder="Propriedades (separar por vírgula)" value={form.propriedades} onChange={handleChange} />
        <input name="funcoes" placeholder="Funções (separar por vírgula)" value={form.funcoes} onChange={handleChange} />
        <input name="elemento" placeholder="Elemento" value={form.elemento} onChange={handleChange} />
        <input name="planeta" placeholder="Planeta" value={form.planeta} onChange={handleChange} />
        <input name="associacoes" placeholder="Associações (separar por vírgula)" value={form.associacoes} onChange={handleChange} />
        <input name="imagem_url" placeholder="URL da imagem" value={form.imagem_url} onChange={handleChange} />
        <input type="file" accept="image/*" onChange={async e => {
          const file = e.target.files[0]
          if (file) {
            setLoading(true)
            setMsg('Enviando imagem...')
            const url = await uploadImagem(file)
            if (url) setForm(f => ({ ...f, imagem_url: url }))
            setMsg(url ? 'Imagem enviada!' : 'Erro ao enviar imagem')
            setLoading(false)
          }
        }} />
        {form.imagem_url && <img src={form.imagem_url} alt="Pré-visualização" style={{maxWidth:'180px',margin:'0.5rem auto',display:'block',borderRadius:'1rem',boxShadow:'0 2px 8px #b6e2b6aa'}} />}
        <button type="submit" disabled={loading}>{loading ? 'Salvando...' : (editId ? 'Atualizar' : 'Salvar')}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nome_popular: '', nome_cientifico: '', propriedades: '', funcoes: '', elemento: '', planeta: '', associacoes: '', imagem_url: '' }) }}>Cancelar edição</button>}
      </form>
      {msg && <p>{msg}</p>}
      <h3>Ervas cadastradas</h3>
      <ul style={{marginTop:'1rem'}}>
        {ervas.map(erva => (
          <li key={erva.id} style={{marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'0.7rem'}}>
            <b>{erva.nome_popular}</b>
            <button onClick={() => handleEdit(erva)}>Editar</button>
            <button onClick={() => handleDelete(erva.id)} style={{background:'#ffdddd',color:'#a00',border:'1px solid #faa'}}>Excluir</button>
          </li>
        ))}
      </ul>
      <button onClick={() => onNavigate('home')}>Voltar</button>
    </div>
  )
}

function App() {
  const [screen, setScreen] = useState(() => {
    if (window.location.pathname === '/admin') return 'login'
    return 'home'
  })
  const [selectedHerb, setSelectedHerb] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [session, setSession] = useState(null)

  // Atualiza a tela se o usuário acessar /admin manualmente
  window.onpopstate = () => {
    if (window.location.pathname === '/admin') setScreen('login')
    else setScreen('home')
  }

  return (
    <div className="app-container">
      {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
      {screen === 'search' && <SearchScreen onNavigate={s => s === 'herb' ? setScreen('herb') : setScreen(s)} onSelectHerb={erva => { setSelectedHerb(erva); setScreen('herb'); }} refresh={refresh} />}
      {screen === 'herb' && <HerbDetailScreen herb={selectedHerb} onNavigate={setScreen} />}
      {screen === 'login' && <LoginScreen onLogin={sess => { setSession(sess); setScreen('admin'); window.history.replaceState({}, '', '/admin'); }} onNavigate={setScreen} />}
      {screen === 'admin' && session && <AdminScreen onNavigate={setScreen} onHerbAdded={() => setRefresh(r => !r)} />}
      {screen === 'categories' && <CategoriesScreen onNavigate={setScreen} />}
      {screen === 'extras' && <ExtrasScreen onNavigate={setScreen} />}
      {screen === 'settings' && <SettingsScreen onNavigate={setScreen} />}
      <footer>
        <span className="footer-brand">Grimório Verde Clã Michetti © {new Date().getFullYear()}</span>
        <button onClick={() => setScreen('home')}>🏠 Início</button>
        <button onClick={() => setScreen('search')}>🔍 Buscar</button>
        <button onClick={() => setScreen('categories')}>🌒 Categorias</button>
        <button onClick={() => setScreen('extras')}>✨ Extras</button>
        <button onClick={() => setScreen('settings')}>⚙️ Config</button>
        {session && <button onClick={() => { setSession(null); setScreen('home'); window.history.replaceState({}, '', '/'); }}>Sair</button>}
      </footer>
    </div>
  )
}

export default App
