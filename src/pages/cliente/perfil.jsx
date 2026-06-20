import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import usuariosService from '@/services/usuarios.service.js'
import useAuthStore from '@/store/auth.store.js'

export default function Perfil() {
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({ fullName: '' })
  const [pwForm, setPwForm] = useState({ newPassword: '', confirmar: '' })

  useEffect(() => {
    if (user) setForm({ fullName: user.fullName ?? '' })
  }, [user])

  const updateMut = useMutation({
    mutationFn: (data) => usuariosService.updateMyProfile(data),
    onSuccess: (updated) => {
      updateUser(updated)
      toast.success('Perfil actualizado')
    },
    onError: (e) => toast.error(e.message),
  })

  const pwMut = useMutation({
    mutationFn: (pw) => usuariosService.cambiarPassword(user.id, pw),
    onSuccess: () => {
      toast.success('Contraseña actualizada')
      setPwForm({ newPassword: '', confirmar: '' })
    },
    onError: (e) => toast.error(e.message),
  })

  const handlePerfil = (e) => {
    e.preventDefault()
    updateMut.mutate(form)
  }

  const handlePassword = (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmar) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    pwMut.mutate(pwForm.newPassword)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Mi perfil</h1>
          <p>Actualiza tu información personal</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 720 }}>
        {/* Datos personales */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Datos personales</h3>
          <form onSubmit={handlePerfil}>
            <div className="field">
              <label className="field-label">Correo</label>
              <input className="input" value={user?.email ?? ''} disabled style={{ opacity: 0.6 }} />
              <span className="field-hint">El correo no se puede cambiar</span>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="fullName">Nombre completo</label>
              <input
                id="fullName"
                className="input"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Tu nombre completo"
              />
            </div>
            <div className="field">
              <label className="field-label">Rol</label>
              <input className="input" value={user?.roleName ?? ''} disabled style={{ opacity: 0.6 }} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={updateMut.isPending}>
              {updateMut.isPending ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </form>
        </div>

        {/* Cambiar contraseña */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Cambiar contraseña</h3>
          <form onSubmit={handlePassword}>
            <div className="field">
              <label className="field-label" htmlFor="newPw">Nueva contraseña</label>
              <input
                id="newPw"
                type="password"
                className="input"
                placeholder="Mínimo 8 caracteres"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="confirmarPw">Confirmar</label>
              <input
                id="confirmarPw"
                type="password"
                className="input"
                placeholder="Repite la contraseña"
                value={pwForm.confirmar}
                onChange={(e) => setPwForm({ ...pwForm, confirmar: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-secondary" disabled={pwMut.isPending}>
              {pwMut.isPending ? 'Actualizando…' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
