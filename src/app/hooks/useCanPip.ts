import { usePlayerState } from '@/app/hooks/usePlayerState'

export const useCanPip = (): boolean => usePlayerState('canPictureInPicture')
