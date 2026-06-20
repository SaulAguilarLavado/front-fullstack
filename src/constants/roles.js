// El backend retorna el rol como string plano: "CLIENT", "ORGANIZER", "ADMIN"
// (LoginResponse.role y UserResponse.roleName). Sin prefijo "ROLE_" —
// ese prefijo solo existe internamente en Spring Security (AppUserDetails).
export const ROLES = {
  CLIENTE: 'CLIENT',
  ORGANIZADOR: 'ORGANIZER',
  ADMIN: 'ADMIN',
}

export const ROLE_LABELS = {
  CLIENT: 'Cliente',
  ORGANIZER: 'Organizador',
  ADMIN: 'Administrador',
}
