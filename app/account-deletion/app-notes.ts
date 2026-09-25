/**
 * Per-app deletion notes, shown when that app is chosen in the form.
 *
 * The page as a whole describes how codeBage handles deletion in general. Some
 * apps need more than that: an app that deletes on the spot should say so rather
 * than let the reader assume the thirty-day email route is the only one, and an
 * app holding a credential for another service has to say what happens to it.
 *
 * Plain data, not JSX, because these cross the server-client boundary into the
 * form and props sent that way have to be serializable.
 */
export interface AppDeletionNote {
  /** What the app removes, and how the user triggers it. */
  inApp?: { steps: string; removes: string[] };
  /** Things deletion does not do, which a reader would otherwise assume it did. */
  caveats?: string[];
  /** How to get a copy first. */
  exportSteps?: string;
}

export const APP_DELETION_NOTES: Record<string, AppDeletionNote> = {
  Postweek: {
    inApp: {
      steps:
        "Open Postweek, go to Settings, tap Delete account and type DELETE to confirm. " +
        "This happens immediately and cannot be undone — you do not need to email us.",
      removes: [
        "Your profile and sign-in",
        "Every product, brand, post, saved page text and schedule",
        "Your Instagram connection and its access token",
        "Your subscription record and usage history",
        "Every generated image and export held in file storage",
      ],
    },
    caveats: [
      "It does not cancel a paid subscription. Cancel that in Google Play, or billing continues.",
      "It does not remove posts already published to Instagram. Those live on your Instagram account and only you can delete them.",
      "You can revoke Postweek's access at any time in Instagram, under Settings, Apps and Websites.",
    ],
    exportSteps:
      "Settings, then Export my data, gives you everything Postweek holds in one file. " +
      "Your Instagram access token is left out of it: that is a credential, not information about you.",
  },
};
