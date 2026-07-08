import logoUrl from '@/assets/logo.svg'

export const LogoMark = ({ className = 'size-5' }: { className?: string }) => {
  return <img src={logoUrl} className={className} alt="" aria-hidden />
}

export const LogoWordmark = () => {
  return (
    <span className="block whitespace-nowrap">Odtwarzacz dla TVP SPORT™</span>
  )
}
