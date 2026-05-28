export default function Avatar({ src, alt = 'avatar' }) {
  return <img src={src} alt={alt} className="avatar" />
}
