/** Placeholder for Firebase Auth + Firestore.
 *  Without env keys the app stays in guest/local mode.
 */
export function isFirebaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}
