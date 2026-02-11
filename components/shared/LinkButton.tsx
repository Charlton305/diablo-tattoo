import Link from 'next/link'

interface ButtonLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function ButtonLink({ href, children, className = '' }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-block px-8 py-3 bg-accent hover:bg-accent/80 transition-colors duration-300 ease-in-out uppercase tracking-wider font-semibold ${className}`}
    >
      {children}
    </Link>
  )
}
