import Link from 'next/link'
import styles from './SecondaryNav.module.css'

const navItems = [
  { label: '🏠 Hotel para Cães', href: '/hotel' },
  { label: '🌞 Creche', href: '/creche' },
  { label: '🛁 Banho & Tosa', href: '/banho-tosa' },
  { label: '💰 Preços', href: '/precos' },
  { label: '❤️ Sobre nós', href: '/sobre' },
  { label: '📞 Contato', href: '/contato' },
]

export default function SecondaryNav() {
  return (
    <nav className={styles['secondary-nav']} data-nav-id="secondary">
      <div className={styles['secondary-nav__container']}>
        <ul className={styles['secondary-nav__list']}>
          {navItems.map((item) => (
            <li key={item.href} className={styles['secondary-nav__item']}>
              <Link href={item.href} prefetch={false} className={styles['secondary-nav__link']}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
