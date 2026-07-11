import { usePlayerState } from '@/app/hooks/usePlayerState'

export const useCanCast = (): boolean => {
  const canGoogleCast = usePlayerState('canGoogleCast')
  return __CAST_AVAILABLE__ && canGoogleCast
}
