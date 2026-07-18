import { useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getFirestoreDb, PACKAGE_ID } from '../lib/firebase'
import { progressDocId, recordWatchComplete, type AutoResource } from '../lib/progress-client'

export function useMediaProgress(itemKey: string | undefined) {
  const { user, hasAccess } = useAuth()

  const trackWatchComplete = useCallback(
    async (resource: AutoResource) => {
      if (!user || !hasAccess || !itemKey) return
      try {
        const level = await recordWatchComplete(
          getFirestoreDb(),
          user.uid,
          PACKAGE_ID,
          itemKey,
          resource,
        )
        console.info('Progress saved:', { packageId: PACKAGE_ID, itemKey, resource, level })
      } catch (err) {
        const id = progressDocId(user.uid, PACKAGE_ID, itemKey, resource)
        console.warn('Could not save watch progress:', { id, packageId: PACKAGE_ID, itemKey, resource, err })
      }
    },
    [user, hasAccess, itemKey],
  )

  return { trackWatchComplete }
}
