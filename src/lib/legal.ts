/** Contact and policy details referenced by the Terms, Privacy Policy, and
 * Refund Policy. Kept in one place so updating an address or window does not
 * mean hunting through three documents for stale copies. */

export const LEGAL = {
  /** The operating entity. Currently a sole proprietorship, so this is the
   * owner's legal name with NumberSmith as the trading name. If an LLC is
   * formed later, replace this with the registered company name. */
  entityName: "Aarit Chakraborty, doing business as NumberSmith",

  /** Governing law for the Terms of Service. */
  jurisdiction: "the State of California, United States",

  /** Support and privacy requests both route here. */
  contactEmail: "supportnumbersmith@gmail.com",

  /** Full-refund window from the first payment, no questions asked. */
  refundWindowDays: 14,

  /** How long personal data is retained after an account is deleted. */
  dataRetentionDays: 30,

  /** Target first response to a support request. */
  supportResponseTime: "2 business days",

  /** Shown as "Last updated" on each policy page. */
  lastUpdated: "August 30, 2026",
} as const;
