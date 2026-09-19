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


// ── Reply Modal ──────────────────────────────────────────────
function ReplyModal({ token, client, onClose }) {
  const [open, setOpen]       = useState(false);
  const [subject, setSubject] = useState(`Re: Your inquiry — Viktoria Kotekh`);
  const [message, setMessage] = useState(`Dear ${client.name},\n\nThank you for reaching out to Viktoria Kotekh.\n\n`);
  const [sending, setSending] = useState(false);
  const [done, setDone]       = useState(false);

  async function send() {
    setSending(true);
    try {
      const res = await fetch(`${API}/api/admin/clients/${client._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subject, message }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      setTimeout(() => { setOpen(false); setDone(false); }, 2000);
    } catch { alert('Failed to send email'); }
    setSending(false);
  }

  if (!open) return (
    <button
      style={{marginTop:'8px',background:'transparent',border:'1px solid rgba(201,168,76,0.5)',color:'#c9a84c',padding:'10px 24px',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'11px',letterSpacing:'1px',width:'100%'}}
      onClick={()=>setOpen(true)}
    >
      ✉️ Reply by Email
    </button>
  );

  return (
    <div style={{marginTop:'12px',background:'rgba(0,0,0,0.4)',border:'1px solid rgba(201,168,76,0.2)',padding:'16px'}}>
      {done ? (
        <p style={{color:'#c9a84c',textAlign:'center',padding:'10px'}}>✓ Email sent!</p>
      ) : (
        <>
          <input
            value={subject}
            onChange={e=>setSubject(e.target.value)}
            style={{...{width:'100%',padding:'10px 12px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontFamily:"'Jost',sans-serif",fontSize:'12px',outline:'none',marginBottom:'8px',boxSizing:'border-box'}}}
            placeholder="Subject"
          />
          <textarea
            value={message}
            onChange={e=>setMessage(e.target.value)}
            style={{width:'100%',padding:'10px 12px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontFamily:"'Jost',sans-serif",fontSize:'12px',outline:'none',minHeight:'120px',resize:'vertical',boxSizing:'border-box',marginBottom:'8px'}}
          />
          <div style={{display:'flex',gap:'8px'}}>
            <button style={{flex:1,padding:'10px',background:'#c9a84c',color:'#0a0a0a',border:'none',fontFamily:"'Jost',sans-serif",fontSize:'11px',letterSpacing:'2px',cursor:'pointer'}} onClick={send} disabled={sending}>
              {sending ? 'Sending...' : 'Send Email'}
            </button>
            <button style={{padding:'10px 16px',background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'11px'}} onClick={()=>setOpen(false)}>
              Cancel
            </button>
          </div>
        </>
      )}
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
            {selected.email && (
              <ReplyModal token={token} client={selected} onClose={()=>setSelected(null)} />
            )}
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
  const [category, setCategory] = useState('Couture');
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
    fd.append('category', category);
    await fetch(`${API}/api/admin/gallery`, { method:'POST', headers:{ Authorization:`Bearer ${token}` }, body:fd });
    setFile(null); setCaption(''); setCategory('Couture'); setUploading(false);
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
          <select
            style={{...S.search,width:'140px',flex:'none',background:'rgba(255,255,255,0.06)',cursor:'pointer'}}
            value={category}
            onChange={e=>setCategory(e.target.value)}
          >
            <option value="Bridal">Bridal</option>
            <option value="Evening">Evening</option>
            <option value="Couture">Couture</option>
            <option value="Alterations">Alterations</option>
          </select>
          <button style={S.uploadBtn} onClick={upload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload to Gallery'}
          </button>
        </div>
      )}
      <div style={S.galleryGrid}>
        {images.map(img=>(
          <div key={img._id} style={S.galleryCard}>
            <img src={imgUrl(img.url)} alt={img.caption} style={S.galleryImg} />
            {img.category && <span style={{position:'absolute',bottom:'30px',left:'6px',background:'rgba(201,168,76,0.85)',color:'#000',fontSize:'9px',padding:'2px 6px',letterSpacing:'1px'}}>{img.category}</span>}
            <button style={S.galleryDel} onClick={()=>del(img._id)}>✕</button>
          </div>
        ))}
      </div>
      {images.length === 0 && <p style={S.center}>No images yet. Upload your first photo.</p>}
    </div>
  );
}


const SERVICES_LABELS = [
  "01 — Custom Bridal Design",
  "02 — Evening & Occasion Wear",
  "03 — Expert Alterations",
  "04 — Express Wedding Dress Rescue",
  "05 — Bridal Transformation",
  "06 — International Bridal Service",
];
const SVC_FALLBACK = [
  "/images/service1.webp","/images/service2.jpg",
  "/images/service1.webp","/images/service2.jpg",
  "/images/service1.webp","/images/service2.jpg",
];

function ServicesAdmin({ token }) {
  const [serviceImgs, setServiceImgs] = useState({});
  const [uploading, setUploading] = useState(null);

  const loadImgs = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/services`, { headers:{ Authorization:`Bearer ${token}` } });
      const data = await res.json();
      const map = {};
      data.forEach(item => { map[item.serviceIndex] = item.imageUrl; });
      setServiceImgs(map);
    } catch {}
  }, [token]);

  useEffect(() => { loadImgs(); }, [loadImgs]);

  async function uploadForService(index, file) {
    if (!file) return;
    setUploading(index);
    const fd = new FormData();
    fd.append('image', file);
    await fetch(`${API}/api/admin/services/${index}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    setUploading(null);
    loadImgs();
  }

  return (
    <div>
      <p style={{color:'rgba(255,255,255,0.35)',fontSize:'12px',letterSpacing:'1px',marginBottom:'28px'}}>
        Click "Change Image" on any service to update its photo. Changes appear on the website immediately.
      </p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'16px'}}>
        {SERVICES_LABELS.map((label, i) => {
          const index = i + 1;
          const imgSrc = serviceImgs[index] || SVC_FALLBACK[i];
          const isUp = uploading === index;
          return (
            <div key={index} style={{background:'#111',border:'1px solid rgba(201,168,76,0.15)',overflow:'hidden'}}>
              <div style={{height:'180px',overflow:'hidden',position:'relative'}}>
                <img src={imgSrc} alt={label} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                {isUp && (
                  <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <span style={{color:'#c9a84c',fontSize:'13px',letterSpacing:'2px'}}>Uploading...</span>
                  </div>
                )}
              </div>
              <div style={{padding:'12px 14px 14px'}}>
                <p style={{color:'rgba(255,255,255,0.7)',fontSize:'12px',letterSpacing:'1px',marginBottom:'10px'}}>{label}</p>
                <label style={{display:'block',padding:'10px',border:'1px dashed rgba(201,168,76,0.4)',color:'#c9a84c',fontSize:'11px',letterSpacing:'1px',textAlign:'center',cursor:'pointer'}}>
                  {isUp ? 'Uploading...' : '📷 Change Image'}
                  <input type="file" accept="image/*" hidden disabled={isUp}
                    onChange={e => { const f=e.target.files[0]; if(f) uploadForService(index,f); e.target.value=''; }} />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────

// ── Blog Admin Tab ───────────────────────────────────────────
const BLOG_CATEGORIES = ['Style','Bridal Tips','Alterations','International','Cairo','Culture'];

function BlogAdmin({ token }) {
  const [posts, setPosts]       = useState([]);
  const [editing, setEditing]   = useState(null); // null | 'new' | post object
  const [form, setForm]         = useState({ title:'', subtitle:'', category:'Style', content:'', excerpt:'', published:true, image:null });
  const [saving, setSaving]     = useState(false);
  const [imgPreview, setImgPreview] = useState('');

  const loadPosts = async () => {
    const res = await fetch(`${API}/api/admin/blog`, { headers:{ Authorization:`Bearer ${token}` } });
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
  };

  useEffect(() => { loadPosts(); }, []);

  function openNew() {
    setForm({ title:'', subtitle:'', category:'Style', content:'', excerpt:'', published:true, image:null });
    setImgPreview('');
    setEditing('new');
  }

  function openEdit(post) {
    setForm({ title:post.title, subtitle:post.subtitle||'', category:post.category||'Style', content:post.content, excerpt:post.excerpt||'', published:post.published, image:null });
    setImgPreview(post.image || '');
    setEditing(post);
  }

  async function save() {
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
    const isNew = editing === 'new';
    const url = isNew ? `${API}/api/admin/blog` : `${API}/api/admin/blog/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    await fetch(url, { method, headers:{ Authorization:`Bearer ${token}` }, body: fd });
    setSaving(false);
    setEditing(null);
    loadPosts();
  }

  async function del(id) {
    if (!confirm('Delete this article permanently?')) return;
    await fetch(`${API}/api/admin/blog/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
    loadPosts();
  }

  const inp = {...S.search, marginBottom:'10px', display:'block', width:'100%'};
  const ta  = {...inp, minHeight:'120px', resize:'vertical', fontFamily:"'Jost',sans-serif"};

  if (editing !== null) return (
    <div style={{maxWidth:'680px'}}>
      <h3 style={{color:'#c9a84c',fontSize:'16px',letterSpacing:'2px',marginBottom:'24px'}}>
        {editing === 'new' ? 'New Article' : 'Edit Article'}
      </h3>
      <input style={inp} placeholder="Title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
      <input style={inp} placeholder="Subtitle" value={form.subtitle} onChange={e=>setForm(f=>({...f,subtitle:e.target.value}))} />
      <select style={{...inp,background:'rgba(255,255,255,0.06)',cursor:'pointer'}} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
        {BLOG_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
      </select>
      <textarea style={ta} placeholder="Content *" value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} />
      <textarea style={{...ta,minHeight:'70px'}} placeholder="Excerpt (short summary)" value={form.excerpt} onChange={e=>setForm(f=>({...f,excerpt:e.target.value}))} />
      <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'10px'}}>
        <label style={{color:'rgba(255,255,255,0.5)',fontSize:'12px',display:'flex',alignItems:'center',gap:'6px',cursor:'pointer'}}>
          <input type="checkbox" checked={form.published} onChange={e=>setForm(f=>({...f,published:e.target.checked}))} />
          Published
        </label>
      </div>
      <label style={{display:'block',padding:'12px',border:'1px dashed rgba(201,168,76,0.4)',color:'#c9a84c',fontSize:'11px',textAlign:'center',cursor:'pointer',marginBottom:'16px'}}>
        📷 {form.image ? form.image.name : (imgPreview ? 'Change Image' : 'Add Cover Image')}
        <input type="file" accept="image/*" hidden onChange={e=>{const f=e.target.files[0];if(f){setForm(p=>({...p,image:f}));setImgPreview(URL.createObjectURL(f));}}} />
      </label>
      {imgPreview && <img src={imgPreview} style={{width:'100%',maxHeight:'200px',objectFit:'cover',marginBottom:'16px'}} />}
      <div style={{display:'flex',gap:'10px'}}>
        <button style={S.uploadBtn} onClick={save} disabled={saving}>{saving?'Saving...':'Save Article'}</button>
        <button style={{...S.fBtn,padding:'12px 24px'}} onClick={()=>setEditing(null)}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <p style={{color:'rgba(255,255,255,0.35)',fontSize:'12px'}}>{posts.length} articles</p>
        <button style={S.uploadBtn} onClick={openNew}>+ New Article</button>
      </div>
      {posts.length === 0 && <p style={S.center}>No articles yet. Create your first one.</p>}
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {posts.map(post=>(
          <div key={post._id} style={{background:'#111',border:'1px solid rgba(201,168,76,0.1)',padding:'16px 20px',display:'flex',alignItems:'center',gap:'16px',flexWrap:'wrap'}}>
            {post.image && <img src={post.image.startsWith('http')?post.image:`${API}${post.image}`} style={{width:'70px',height:'50px',objectFit:'cover',flexShrink:0}} />}
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:'white',fontSize:'14px',fontFamily:"'Cormorant Garamond',serif",marginBottom:'4px'}}>{post.title}</div>
              <div style={{color:'rgba(255,255,255,0.3)',fontSize:'11px'}}>{post.category} · {new Date(post.createdAt).toLocaleDateString('en-GB')} · {post.published?'✅ Published':'⬜ Draft'}</div>
            </div>
            <div style={{display:'flex',gap:'8px'}}>
              <button style={{...S.fBtn,padding:'6px 14px'}} onClick={()=>openEdit(post)}>Edit</button>
              <button style={{...S.fBtn,padding:'6px 14px',borderColor:'#e74c3c',color:'#e74c3c'}} onClick={()=>del(post._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ── Newsletter Admin Tab ─────────────────────────────────────
function NewsletterAdmin({ token }) {
  const [subscribers, setSubscribers] = useState([]);
  const [subject, setSubject]         = useState('');
  const [message, setMessage]         = useState('');
  const [sending, setSending]         = useState(false);
  const [sent, setSent]               = useState(null);
  const [view, setView]               = useState('compose'); // compose | subscribers

  const loadSubs = useCallback(async () => {
    const res = await fetch(`${API}/api/admin/newsletter/subscribers`, { headers:{ Authorization:`Bearer ${token}` } });
    const d = await res.json();
    setSubscribers(Array.isArray(d) ? d : []);
  }, [token]);

  useEffect(() => { loadSubs(); }, [loadSubs]);

  async function sendNewsletter() {
    if (!subject.trim() || !message.trim()) return alert('Subject and message required');
    if (!confirm(`Send to ${subscribers.length} subscribers?`)) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/api/admin/newsletter/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          subject,
          html: message.split('\n').map(l => `<p style="margin:0 0 12px;font-size:15px;line-height:1.8;color:#333;">${l}</p>`).join(''),
        }),
      });
      const d = await res.json();
      setSent(d.sent);
      setSubject(''); setMessage('');
    } catch { alert('Error sending'); }
    setSending(false);
  }

  async function deleteSub(id) {
    if (!confirm('Remove this subscriber?')) return;
    await fetch(`${API}/api/admin/newsletter/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
    loadSubs();
  }

  const inp = {...S.search, marginBottom:'10px', display:'block', width:'100%'};
  const ta  = {...inp, minHeight:'180px', resize:'vertical', fontFamily:"'Jost',sans-serif"};

  return (
    <div>
      <div style={{display:'flex',gap:'8px',marginBottom:'24px'}}>
        <button style={{...S.fBtn,...(view==='compose'?S.fBtnA:{})}} onClick={()=>setView('compose')}>✉️ Compose</button>
        <button style={{...S.fBtn,...(view==='subscribers'?S.fBtnA:{})}} onClick={()=>{setView('subscribers');loadSubs();}}>
          👥 Subscribers ({subscribers.length})
        </button>
      </div>

      {view === 'compose' && (
        <div style={{maxWidth:'680px'}}>
          {sent !== null && (
            <div style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',padding:'14px 18px',marginBottom:'20px',color:'#c9a84c',fontSize:'13px'}}>
              ✓ Email sent to {sent} subscribers!
            </div>
          )}
          <input style={inp} placeholder="Email Subject *" value={subject} onChange={e=>setSubject(e.target.value)} />
          <textarea style={ta} placeholder="Email Message (plain text, each line = a paragraph) *" value={message} onChange={e=>setMessage(e.target.value)} />
          <p style={{color:'rgba(255,255,255,0.25)',fontSize:'11px',marginBottom:'16px'}}>
            Will be sent to {subscribers.length} active subscribers · Unsubscribe link added automatically
          </p>
          <button style={S.uploadBtn} onClick={sendNewsletter} disabled={sending || !subscribers.length}>
            {sending ? 'Sending...' : `Send to ${subscribers.length} subscribers`}
          </button>
        </div>
      )}

      {view === 'subscribers' && (
        <div>
          {subscribers.length === 0 && <p style={S.center}>No subscribers yet.</p>}
          <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
            {subscribers.map(sub => (
              <div key={sub._id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',background:'#111',border:'1px solid rgba(255,255,255,0.05)'}}>
                <div>
                  <span style={{color:'white',fontSize:'13px'}}>{sub.email}</span>
                  <span style={{color:'rgba(255,255,255,0.25)',fontSize:'11px',marginLeft:'16px'}}>
                    {new Date(sub.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <button style={{...S.fBtn,padding:'5px 12px',borderColor:'#e74c3c',color:'#e74c3c',fontSize:'11px'}} onClick={()=>deleteSub(sub._id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ── Collection Admin Tab ─────────────────────────────────────
const BADGE_OPTIONS = ['COUTURE','BRIDAL','EVENING','READY-TO-WEAR','LIMITED'];
const ACCENT_COLORS = [
  { label:'Gold',   value:'#b8956a' },
  { label:'Rose',   value:'#d4a5b5' },
  { label:'Silver', value:'#8a8a8a' },
  { label:'Ivory',  value:'#c8bfa8' },
  { label:'Black',  value:'#c9a84c' },
];

function CollectionAdmin({ token }) {
  const [cols, setCols]       = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [form, setForm] = useState({ title:'', subtitle:'', description:'', tag:'', badge:'COUTURE', accent:'#b8956a', bg:'#0e0b07', published:true, image:null });
  const [imgPreview, setImgPreview] = useState('');

  const load = useCallback(async () => {
    const res = await fetch(`${API}/api/admin/collections`, { headers:{ Authorization:`Bearer ${token}` } });
    const d = await res.json();
    setCols(Array.isArray(d) ? d : []);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setForm({ title:'', subtitle:'', description:'', tag:'SS 2026', badge:'COUTURE', accent:'#b8956a', bg:'#0e0b07', published:true, image:null });
    setImgPreview(''); setEditing('new');
  }

  function openEdit(col) {
    setForm({ title:col.title, subtitle:col.subtitle||'', description:col.description||'', tag:col.tag||'', badge:col.badge||'COUTURE', accent:col.accent||'#b8956a', bg:col.bg||'#0e0b07', published:col.published, image:null });
    setImgPreview(col.image||''); setEditing(col);
  }

  async function save() {
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => { if (v !== null && v !== undefined) fd.append(k,v); });
    const isNew = editing === 'new';
    const url = isNew ? `${API}/api/admin/collections` : `${API}/api/admin/collections/${editing._id}`;
    await fetch(url, { method: isNew?'POST':'PUT', headers:{ Authorization:`Bearer ${token}` }, body:fd });
    setSaving(false); setEditing(null); load();
  }

  async function del(id) {
    if (!confirm('Delete this collection?')) return;
    await fetch(`${API}/api/admin/collections/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
    load();
  }

  const inp = { width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'white', fontFamily:"'Jost',sans-serif", fontSize:'13px', outline:'none', marginBottom:'10px', boxSizing:'border-box' };

  if (editing !== null) return (
    <div style={{maxWidth:'640px'}}>
      <h3 style={{color:'#c9a84c',fontSize:'16px',letterSpacing:'2px',marginBottom:'24px'}}>
        {editing === 'new' ? 'New Collection' : 'Edit Collection'}
      </h3>
      <input style={inp} placeholder="Collection Title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
      <input style={inp} placeholder="Subtitle (optional, any language)" value={form.subtitle} onChange={e=>setForm(f=>({...f,subtitle:e.target.value}))} />
      <textarea style={{...inp,minHeight:'100px',resize:'vertical'}} placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
      <input style={inp} placeholder="Tag (e.g. HERITAGE · SS 2026)" value={form.tag} onChange={e=>setForm(f=>({...f,tag:e.target.value}))} />

      {/* Badge */}
      <p style={{color:'rgba(255,255,255,0.4)',fontSize:'11px',marginBottom:'8px',letterSpacing:'1px'}}>BADGE TYPE</p>
      <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px'}}>
        {BADGE_OPTIONS.map(b=>(
          <button key={b} style={{padding:'7px 14px',background:form.badge===b?'#c9a84c':'transparent',border:'1px solid rgba(201,168,76,'+(form.badge===b?'1)':'0.3)'),color:form.badge===b?'#0a0a0a':'rgba(255,255,255,0.5)',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'10px',letterSpacing:'1px'}} onClick={()=>setForm(f=>({...f,badge:b}))}>
            {b}
          </button>
        ))}
      </div>

      {/* Accent color */}
      <p style={{color:'rgba(255,255,255,0.4)',fontSize:'11px',marginBottom:'8px',letterSpacing:'1px'}}>ACCENT COLOR</p>
      <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
        {ACCENT_COLORS.map(c=>(
          <button key={c.value} onClick={()=>setForm(f=>({...f,accent:c.value}))} style={{width:'32px',height:'32px',background:c.value,border:form.accent===c.value?'2px solid white':'2px solid transparent',borderRadius:'50%',cursor:'pointer'}} title={c.label} />
        ))}
      </div>

      <label style={{display:'flex',alignItems:'center',gap:'8px',color:'rgba(255,255,255,0.5)',fontSize:'12px',marginBottom:'16px',cursor:'pointer'}}>
        <input type="checkbox" checked={form.published} onChange={e=>setForm(f=>({...f,published:e.target.checked}))} />
        Published
      </label>

      <label style={{display:'block',padding:'14px',border:'1px dashed rgba(201,168,76,0.4)',color:'#c9a84c',fontSize:'11px',textAlign:'center',cursor:'pointer',marginBottom:'16px'}}>
        📷 {form.image ? form.image.name : (imgPreview ? 'Change Image' : 'Add Collection Image')}
        <input type="file" accept="image/*" hidden onChange={e=>{const f=e.target.files[0];if(f){setForm(p=>({...p,image:f}));setImgPreview(URL.createObjectURL(f));}}} />
      </label>
      {imgPreview && <img src={imgPreview} style={{width:'100%',maxHeight:'220px',objectFit:'cover',marginBottom:'16px'}} />}

      <div style={{display:'flex',gap:'10px'}}>
        <button style={{...S.uploadBtn}} onClick={save} disabled={saving}>{saving?'Saving...':'Save Collection'}</button>
        <button style={{...S.fBtn,padding:'12px 24px'}} onClick={()=>setEditing(null)}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <p style={{color:'rgba(255,255,255,0.3)',fontSize:'12px'}}>{cols.length} collections</p>
        <button style={S.uploadBtn} onClick={openNew}>+ New Collection</button>
      </div>
      {cols.length === 0 && <p style={S.center}>No collections yet. Add your first one.</p>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'16px'}}>
        {cols.map(col => (
          <div key={col._id} style={{background:'#111',border:'1px solid rgba(201,168,76,0.15)',overflow:'hidden'}}>
            {col.image && <img src={col.image.startsWith('http')?col.image:`${API}${col.image}`} alt={col.title} style={{width:'100%',height:'160px',objectFit:'cover'}} />}
            <div style={{padding:'12px 14px 14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
                <span style={{width:'12px',height:'12px',borderRadius:'50%',background:col.accent||'#b8956a',display:'inline-block'}}></span>
                <p style={{color:'white',fontSize:'13px',fontFamily:"'Cormorant Garamond',serif"}}>{col.title}</p>
              </div>
              <p style={{color:'rgba(255,255,255,0.3)',fontSize:'11px',marginBottom:'12px'}}>{col.badge} · {col.published?'✅':'⬜ Draft'}</p>
              <div style={{display:'flex',gap:'8px'}}>
                <button style={{...S.fBtn,padding:'7px 14px',flex:1}} onClick={()=>openEdit(col)}>Edit</button>
                <button style={{...S.fBtn,padding:'7px 14px',borderColor:'#e74c3c',color:'#e74c3c'}} onClick={()=>del(col._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        {[
          {key:'clients',  label:'📋 Requests'},
          {key:'gallery',    label:'🖼 Gallery'},
          {key:'services',   label:'✂️ Services'},
          {key:'blog',       label:'📝 Journal'},
          {key:'newsletter',  label:'📧 Newsletter'},
          {key:'collection',  label:'✨ Collection'},
        ].map(t=>(
          <button key={t.key} style={{...S.tab,...(tab===t.key?S.tabActive:{})}} onClick={()=>setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={S.body}>
        {tab === 'clients' && <Clients token={token} onLogout={onLogout} />}
        {tab === 'gallery' && <GalleryAdmin token={token} />}
        {tab === 'services' && <ServicesAdmin token={token} />}
        {tab === 'blog' && <BlogAdmin token={token} />}
        {tab === 'newsletter' && <NewsletterAdmin token={token} />}
        {tab === 'collection' && <CollectionAdmin token={token} />}
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