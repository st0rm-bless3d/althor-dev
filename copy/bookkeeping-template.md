# Bookkeeping template — platform revenue tracking

**Purpose**: Single source of truth for tracking gross / fees / net across Upwork, Toptal, Codementor, and direct engagements. Feeds quarterly estimated-tax planning.

**Recommended tool**: Wave Free (waveapps.com) for invoicing + basic ledger. Cross-reference against this template monthly.

---

## Column schema

| Column | Type | Notes |
|---|---|---|
| Date | YYYY-MM-DD | Invoice date or platform payout date |
| Platform | enum | Upwork / Toptal / Codementor / Direct / Partner |
| Client | text | De-identify in public exports — use internal code if sensitive |
| Project | text | Short name |
| Hours | decimal | If hourly engagement, blank for fixed-price |
| Gross Invoice | USD | What client paid the platform OR what Althor billed direct |
| Platform Fee | USD | Upwork commission, Toptal margin (if visible), Codementor commission, Stripe fee on direct |
| Net to Althor | USD | Gross minus Platform Fee |
| Connects Spent | int | Upwork only |
| Subscription Costs (allocated) | USD | Monthly subscription costs (Freelancer Plus, etc.) divided across month's gigs |
| Tax Withheld (1099-K threshold check) | USD | None until $20K platform threshold; track regardless |
| Reimbursable Expenses | USD | Anything client-billable (tools, licenses) — list separately |
| Notes | text | Anything unusual (refund, conversion fee, scope change, etc.) |

---

## Monthly summary template

End of each month, append to a "Monthly Summary" sheet:

```
Month: YYYY-MM

Revenue by platform:
  Upwork:     $___  (___ gigs, ___ hrs)
  Toptal:     $___  (___ gigs, ___ hrs)
  Codementor: $___  (___ sessions, ___ hrs)
  Direct:     $___  (___ engagements, ___ hrs)
  Partner:    $___  (___ engagements, ___ hrs)
  Total gross: $___

Less platform fees: $___
Less subscription costs: $___
Net to Althor LLC: $___

Hours billed: ___
Effective $/hr (net / hours): $___

Notes:
  - {{anything material — rate increase, contract loss, big win, fee surprise}}
```

---

## Quarterly estimated tax reminder

Federal estimated tax due dates (revise if IRS schedule changes):
- **Q1**: April 15 (covers Jan–Mar income)
- **Q2**: June 15 (covers Apr–May income)
- **Q3**: September 15 (covers Jun–Aug income)
- **Q4**: January 15 of following year (covers Sep–Dec income)

Maryland state estimated tax same dates. Form 502D.

Rough rule of thumb for single-member LLC taxed as disregarded entity:
- Set aside **~30%** of net Althor income for federal + state + self-employment tax combined
- Adjust after first year based on actual effective rate
- Pay quarterly via IRS Direct Pay (irs.gov/payments) and Maryland's iFile

**Don't skip estimated payments**. Penalty is small but compounding; cash flow is worse than the penalty.

---

## Year-end checklist

- **1099-K**: Upwork / Toptal / Stripe will issue if platform-side payments exceed reporting threshold (varies by year, ~$5K post-2024). Reconcile against your tracking.
- **1099-NEC**: Direct clients who paid $600+ will issue. Reconcile.
- **W-9 refresh**: Confirm LLC name, EIN, address are still correct on every platform's payee record.
- **Schedule C**: Single-member LLC taxed as disregarded entity files via owner's 1040 + Schedule C.
- **Health insurance premium tax deduction**: Track if applicable.
- **Home office deduction**: Track if applicable — depends on whether home office is the principal place of business.
- **Vehicle / mileage**: Track if client meetings happen in person.
- **Professional dues, software, hardware, training**: All deductible — track in dedicated category.

---

## Per-platform fee structure quick reference (verify annually)

### Upwork (as of May 2026)
- Sliding fee: 20% on first $500 / 10% on $500.01–$10K / 5% above $10K (per client)
- Connect cost: $0.15 each; 16–40 Connects per proposal
- Freelancer Plus: $19.99/mo (optional)
- 1099-K issued at year-end if threshold met
- Conversion Fee for off-platform within 24 months: 13.5% of one year projected earnings

### Toptal
- Margin opaque inside the all-in rate (~20% effective)
- No application fee
- No connects equivalent
- Pay-out: PayPal / Payoneer / wire

### Codementor
- Commission: up to 22% of session value
- No application fee
- No subscription requirement
- Pay-out: Stripe Connect or PayPal

---

## Recommended Wave Free setup

1. Create a new account at waveapps.com using contact@althor.dev
2. Add Althor Consulting LLC + EIN as business profile
3. Connect LLC business checking (transaction sync)
4. Set up Income categories: Upwork Revenue / Toptal Revenue / Codementor Revenue / Direct Client Revenue / Partner Subcontract Revenue
5. Set up Expense categories: Platform Fees / Software Subscriptions / Professional Services / Office / Vehicle / Health / Training / Other
6. Tag every transaction. Monthly review.
7. Export to this tracking sheet at end of month for cross-check.
