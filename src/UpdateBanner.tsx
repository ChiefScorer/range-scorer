import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdateBanner() {
  const {
    needRefresh,
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW() { /* optional logging */ },
    onNeedRefresh() { /* state handled by needRefresh */ },
  })

  if (!needRefresh) return null

  return (
    <div style={{
      position:'fixed', bottom:16, left:16, right:16,
      background:'#111', color:'#fff', padding:'12px 14px',
      borderRadius:12, display:'flex', gap:10, alignItems:'center',
      boxShadow:'0 6px 20px rgba(0,0,0,.2)', zIndex: 9999
    }}>
      <span>New version ready.</span>
      <button
        onClick={() => updateServiceWorker(true)}
        style={{marginLeft:'auto', padding:'8px 12px', borderRadius:8, border:'1px solid #444'}}
      >
        Update
      </button>
    </div>
  )
}