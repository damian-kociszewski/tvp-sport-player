import logoUrl from '../../../assets/logo.svg'

export function LogoMark({ className = 'size-5' }: { className?: string }) {
  return <img src={logoUrl} className={className} alt="" aria-hidden />
}

export function LogoWordmark() {
  return (
    <span className="block whitespace-nowrap">Odtwarzacz dla TVP SPORT™</span>
  )
}
