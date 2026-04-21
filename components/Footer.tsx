import Link from 'next/link'
import styles from './Footer.module.css'

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.49c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.12.35.03.74-.24 1.02l-2.2 2.2Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logoText}>
              <span className={styles.logoPit}>pit</span>
              <span className={styles.logoPet}>pet</span>
              <span className={styles.logoStore}>store</span>
            </div>
            <p className={styles.tagline}>
              Amor e cuidado para o seu melhor amigo desde 2019. 🐾
            </p>
            <nav className={styles.navLinks}>
              <Link href="/hotel">Hotel</Link>
              <Link href="/creche">Creche</Link>
              <Link href="/banho-tosa">Banho & Tosa</Link>
              <Link href="/sobre">Sobre nós</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className={styles.contact}>
            <h4>FALE COM A GENTE</h4>
            <p className={styles.contactItem}>
              <PhoneIcon />
              <strong>(00) 00000-0000</strong>
            </p>
            <a
              href="https://wa.me/5500000000000"
              className={styles.contactItem}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
          </div>

          {/* Social */}
          <div className={styles.social}>
            <h4>NAS REDES</h4>
            <div className={styles.socialIcons}>
              <a
                href="https://www.instagram.com/pitpetstore"
                aria-label="Instagram PitPet Store"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </a>
            </div>
            <p className={styles.socialHandle}>@pitpetstore</p>

            <div className={styles.requirements}>
              <h5>Requisitos para hospedagem:</h5>
              <ul>
                <li>🔵 Vacinas em dia (V8/V10, antirrábica, gripe)</li>
                <li>🔵 Vermifugação em dia</li>
                <li>🔵 Sem pulgas e carrapatos</li>
                <li>🔵 Fêmeas não podem estar no cio</li>
                <li>🔵 Machos precisam ser castrados</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p>
            O PitPet Store cuida do seu pet com amor, afeto e respeito. Todos os animais ficam
            livres, nunca em gaiolas, e recebem o mesmo carinho de casa.
          </p>
          <p className={styles.legal}>&copy; {new Date().getFullYear()} PitPet Store — Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  )
}
