import { useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// يدعم رابط Cloudinary الكامل (https://...) والروابط النسبية القديمة (/uploads/...)
const imgUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API}${path}`;
};

const S = {
  wrap:{minHeight:'100vh',background:'#080808',color:'white',fontFamily:"'Jost',sans-serif"},
  header:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid rgba(201,168,76,0.2)',flexWrap:'wrap',gap:'10px'},
  title:{fontFamily:"'Cormorant Garamond',serif",color:'#c9a84c',fontSize:'20px',letterSpacing:'3px'},
  sub:{color:'rgba(255,255,255,0.35)',fontSize:'11px',letterSpacing:'2px',marginTop:'3px'},
  tabs:{display:'flex',gap:'4px',padding:'20px 40px 0'},
  tab:{padding:'10px 24px',background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.45)',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'11px',letterSpacing:'2px',transition:'0.3s'},
  tabActive:{borderColor:'#c9a84c',color:'#c9a84c'},
  body:{padding:'30px 40px'},
  filters:{display:'flex',gap:'10px',marginBottom:'24px',flexWrap:'wrap'},
  search:{flex:1,minWidth:'200px',padding:'10px 16px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontFamily:"'Jost',sans-serif",fontSize:'13px',outline:'none'},
  fBtn:{padding:'10px 18px',background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.45)',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'11px',letterSpacing:'1px',transition:'0.3s'},
  fBtnA:{borderColor:'#c9a84c',color:'#c9a84c'},
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'12px'},
  card:{background:'#111',border:'1px solid #1a1a1a',cursor:'pointer',transition:'border-color 0.3s',overflow:'hidden'},
  cardHover:{borderColor:'rgba(201,168,76,0.4)'},
  imgBox:{height:'160px',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'},
  imgEl:{width:'100%',height:'100%',objectFit:'cover'},
  avatar:{fontSize:'2.5rem',opacity:0.3},
  info:{padding:'14px 16px'},
  name:{fontFamily:"'Cormorant Garamond',serif",fontSize:'17px',color:'white',marginBottom:'4px'},
  phone:{color:'rgba(255,255,255,0.4)',fontSize:'12px',marginBottom:'6px'},
  badge:{display:'inline-block',padding:'2px 10px',border:'1px solid rgba(201,168,76,0.4)',color:'#c9a84c',fontSize:'10px',letterSpacing:'1px',marginBottom:'6px'},
  date:{color:'rgba(255,255,255,0.25)',fontSize:'10px'},
  center:{textAlign:'center',padding:'60px',color:'rgba(255,255,255,0.25)'},
  pag:{display:'flex',alignItems:'center',justifyContent:'center',gap:'12px',marginTop:'30px',color:'rgba(255,255,255,0.4)',fontSize:'13px'},
  pagBtn:{background:'transparent',border:'1px solid rgba(201,168,76,0.4)',color:'#c9a84c',padding:'8px 16px',cursor:'pointer',fontFamily:"'Jost',sans-serif"},
  overlay:{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'16px'},
  modal:{background:'#111',border:'1px solid rgba(201,168,76,0.25)',padding:'32px',maxWidth:'460px',width:'100%',position:'relative',textAlign:'center',maxHeight:'90vh',overflowY:'auto'},
  closeBtn:{position:'absolute',top:'12px',right:'14px',background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:'20px',cursor:'pointer'},
  modalImg:{width:'100%',height:'220px',objectFit:'cover',border:'1px solid rgba(201,168,76,0.3)',marginBottom:'16px',cursor:'pointer'},
  modalName:{fontFamily:"'Cormorant Garamond',serif",color:'#c9a84c',fontSize:'22px',marginBottom:'8px'},
  modalInfo:{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'5px'},
  modalMsg:{color:'rgba(255,255,255,0.7)',fontStyle:'italic',margin:'16px 0',padding:'16px',background:'rgba(255,255,255,0.03)',fontSize:'13px',lineHeight:'1.7',textAlign:'left'},
  delBtn:{marginTop:'12px',background:'transparent',border:'1px solid #e74c3c',color:'#e74c3c',padding:'10px 24px',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'11px',letterSpacing:'1px'},
  logoutBtn:{background:'transparent',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.4)',padding:'8px 20px',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'11px',letterSpacing:'1px',transition:'0.3s'},
  // Gallery
  galleryGrid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'8px'},
  galleryCard:{position:'relative',overflow:'hidden',background:'#111',aspectRatio:'1'},
  galleryImg:{width:'100%',height:'100%',objectFit:'cover'},
  galleryDel:{position:'absolute',top:'8px',right:'8px',background:'rgba(231,76,60,0.9)',color:'white',border:'none',width:'30px',height:'30px',borderRadius:'50%',cursor:'pointer',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center'},
  uploadArea:{border:'2px dashed rgba(201,168,76,0.3)',padding:'40px',textAlign:'center',color:'rgba(255,255,255,0.35)',cursor:'pointer',marginBottom:'20px',transition:'0.3s'},
  uploadBtn:{padding:'12px 32px',background:'#c9a84c',color:'#0a0a0a',border:'none',fontFamily:"'Jost',sans-serif",fontSize:'11px',letterSpacing:'2px',cursor:'pointer'},
};

// ── Login ────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [c, setC] = useState({ username:'', password:'' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault(); setLoading(true); setErr('');
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(c),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message);
      localStorage.setItem('adminToken', j.token);
      onLogin(j.token);
    } catch(e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#080808'}}>
      <div style={{background:'#111',border:'1px solid rgba(201,168,76,0.25)',padding:'50px 44px',width:'100%',maxWidth:'400px',textAlign:'center'}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",color:'#c9a84c',letterSpacing:'4px',fontSize:'20px',marginBottom:'6px'}}>VIKTORIA KOTEKH</h2>
        <p style={{color:'rgba(255,255,255,0.3)',fontSize:'10px',letterSpacing:'3px',marginBottom:'36px'}}>ADMIN PANEL</p>
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <input style={{padding:'14px 16px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontFamily:"'Jost',sans-serif",fontSize:'13px',outline:'none'}} placeholder="Username" value={c.username} onChange={e=>setC(p=>({...p,username:e.target.value}))} required />
          <input style={{padding:'14px 16px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontFamily:"'Jost',sans-serif",fontSize:'13px',outline:'none'}} type="password" placeholder="Password" value={c.password} onChange={e=>setC(p=>({...p,password:e.target.value}))} required />
          {err && <p style={{color:'#e74c3c',fontSize:'12px'}}>{err}</p>}
          <button style={{padding:'14px',background:'#c9a84c',color:'#0a0a0a',border:'none',fontFamily:"'Jost',sans-serif",fontSize:'11px',letterSpacing:'3px',cursor:'pointer',marginTop:'6px'}} disabled={loading}>{loading?'Signing in...':'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}

// ── Clients Tab ──────────────────────────────────────────────
function Clients({ token, onLogout }) {
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [service, setService] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [imgLightbox, setImgLightbox] = useState(null);

  const fetch2 = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit:12 });
      if (search) p.set('search', search);
      if (service) p.set('service', service);
      const res = await fetch(`${API}/api/admin/clients?${p}`, { headers:{ Authorization:`Bearer ${token}` } });
      if (res.status === 401) { onLogout(); return; }
      const j = await res.json();
      setClients(j.clients); setTotal(j.total); setPages(j.pages);
    } finally { setLoading(false); }
  }, [token, page, search, service, onLogout]);

  useEffect(() => { fetch2(); }, [fetch2]);

  async function del(id) {
    if (!confirm('Delete this client permanently?')) return;
    await fetch(`${API}/api/admin/clients/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
    setSelected(null); fetch2();
  }

  const services = ['','Custom Bridal Design','Evening & Occasion Wear','Expert Alterations','Style Consultation','Arabic & Oriental Gowns','International Fitting'];

  return (
    <div>
      <div style={S.filters}>
        <input style={S.search} placeholder="🔍 Search name, phone, country..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} />
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
          {services.map(sv=>(
            <button key={sv} style={{...S.fBtn,...(service===sv?S.fBtnA:{})}} onClick={()=>{setService(sv);setPage(1);}}>
              {sv||'All'}
            </button>
          ))}
        </div>
      </div>
      <p style={{color:'rgba(255,255,255,0.25)',fontSize:'11px',letterSpacing:'1px',marginBottom:'20px'}}>{total} requests total</p>
      {loading ? <p style={S.center}>Loading...</p>
        : clients.length === 0 ? <p style={S.center}>No results found</p>
        : <div style={S.grid}>
            {clients.map(c=>(
              <div key={c._id} style={S.card} onClick={()=>setSelected(c)}>
                <div style={S.imgBox}>
                  {c.image ? <img src={imgUrl(c.image)} alt={c.name} style={S.imgEl} /> : <div style={S.avatar}>👤</div>}
                </div>
                <div style={S.info}>
                  <div style={S.name}>{c.name}</div>
                  <div style={S.phone}>{c.phone}</div>
                  {c.country && <div style={S.phone}>📍 {c.country}</div>}
                  {c.service && <div style={S.badge}>{c.service}</div>}
                  <div style={S.date}>{new Date(c.createdAt).toLocaleDateString('en-GB')}</div>
                </div>
              </div>
            ))}
          </div>
      }
      {pages > 1 && (
        <div style={S.pag}>
          <button style={S.pagBtn} disabled={page===1} onClick={()=>setPage(p=>p-1)}>◀</button>
          <span>{page} / {pages}</span>
          <button style={S.pagBtn} disabled={page===pages} onClick={()=>setPage(p=>p+1)}>▶</button>
        </div>
      )}
      {imgLightbox && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.97)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10000}} onClick={() => setImgLightbox(null)}>
          <button style={{position:'absolute',top:'20px',left:'24px',background:'none',border:'1px solid rgba(255,255,255,0.2)',color:'white',padding:'8px 18px',cursor:'pointer',fontSize:'12px',letterSpacing:'2px'}} onClick={() => setImgLightbox(null)}>Back</button>
          <button style={{position:'absolute',top:'20px',right:'24px',background:'none',border:'none',color:'white',fontSize:'28px',cursor:'pointer'}} onClick={() => setImgLightbox(null)}>X</button>
          <img src={imgLightbox} style={{maxWidth:'95vw',maxHeight:'92vh',objectFit:'contain'}} onClick={e => e.stopPropagation()} alt="" />
        </div>
      )}

      {selected && (
        <div style={S.overlay} onClick={()=>setSelected(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <button style={S.closeBtn} onClick={()=>setSelected(null)}>✕</button>
            {selected.image && (
              <div style={{position:"relative"}}>
                <img
                  src={imgUrl(selected.image)}
                  alt=""
                  style={S.modalImg}
                  onClick={() => setImgLightbox(imgUrl(selected.image))}
                  title="Click to view full size"
                />
                <span style={{fontSize:'10px',color:'rgba(255,255,255,0.3)',letterSpacing:'1px'}}>Click image to enlarge</span>
              </div>
            )}
            <div style={S.modalName}>{selected.name}</div>
            <div style={S.modalInfo}>📞 {selected.phone}</div>
            {selected.email && <div style={S.modalInfo}>✉️ {selected.email}</div>}
            {selected.country && <div style={S.modalInfo}>📍 {selected.country}</div>}
            {selected.service && <div style={S.modalInfo}>✂️ {selected.service}</div>}
            <div style={S.modalMsg}>"{selected.message}"</div>
            <div style={{...S.date,marginBottom:'12px'}}>📅 {new Date(selected.createdAt).toLocaleDateString('en-GB')}</div>
            <button style={S.delBtn} onClick={()=>del(selected._id)}>🗑 Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Gallery Tab ──────────────────────────────────────────────
function GalleryAdmin({ token }) {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadImgs = useCallback(async () => {
    const res = await fetch(`${API}/api/admin/gallery`, { headers:{ Authorization:`Bearer ${token}` } });
    const j = await res.json();
    setImages(j);
  }, [token]);

  useEffect(() => { loadImgs(); }, [loadImgs]);

  async function upload() {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    fd.append('caption', caption);
    await fetch(`${API}/api/admin/gallery`, { method:'POST', headers:{ Authorization:`Bearer ${token}` }, body:fd });
    setFile(null); setCaption(''); setUploading(false);
    loadImgs();
  }

  async function del(id) {
    if (!confirm('Delete this image from gallery?')) return;
    await fetch(`${API}/api/admin/gallery/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
    loadImgs();
  }

  return (
    <div>
      <div style={{...S.uploadArea, borderColor: file ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.3)'}}
        onClick={()=>document.getElementById('gal-input').click()}>
        {file
          ? <p style={{color:'#c9a84c',fontSize:'13px'}}>{file.name}</p>
          : <>
              <p style={{fontSize:'28px',marginBottom:'8px'}}>+</p>
              <p style={{fontSize:'11px',letterSpacing:'2px'}}>Click to upload image to gallery</p>
            </>
        }
        <input id="gal-input" type="file" accept="image/*" hidden onChange={e=>setFile(e.target.files[0])} />
      </div>
      {file && (
        <div style={{display:'flex',gap:'10px',marginBottom:'20px',flexWrap:'wrap'}}>
          <input
            style={{...S.search,flex:1}}
            placeholder="Caption (optional)"
            value={caption}
            onChange={e=>setCaption(e.target.value)}
          />
          <button style={S.uploadBtn} onClick={upload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload to Gallery'}
          </button>
        </div>
      )}
      <div style={S.galleryGrid}>
        {images.map(img=>(
          <div key={img._id} style={S.galleryCard}>
            <img src={imgUrl(img.url)} alt={img.caption} style={S.galleryImg} />
            <button style={S.galleryDel} onClick={()=>del(img._id)}>✕</button>
          </div>
        ))}
      </div>
      {images.length === 0 && <p style={S.center}>No images yet. Upload your first photo.</p>}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────
function Dashboard({ token, onLogout }) {
  const [tab, setTab] = useState('clients');
  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div>
          <div style={S.title}>VIKTORIA KOTEKH</div>
          <div style={S.sub}>ADMIN PANEL</div>
        </div>
        <button style={S.logoutBtn} onClick={onLogout}>Logout</button>
      </div>
      <div style={S.tabs}>
        {['clients','gallery'].map(t=>(
          <button key={t} style={{...S.tab,...(tab===t?S.tabActive:{})}} onClick={()=>setTab(t)}>
            {t === 'clients' ? '📋 Requests' : '🖼 Gallery'}
          </button>
        ))}
      </div>
      <div style={S.body}>
        {tab === 'clients' && <Clients token={token} onLogout={onLogout} />}
        {tab === 'gallery' && <GalleryAdmin token={token} />}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState(()=>localStorage.getItem('adminToken'));
  function logout() { localStorage.removeItem('adminToken'); setToken(null); }
  if (!token) return <Login onLogin={setToken} />;
  return <Dashboard token={token} onLogout={logout} />;
}
