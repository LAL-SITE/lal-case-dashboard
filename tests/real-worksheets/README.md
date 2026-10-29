# Real worksheets for the golden test set

Goal: 40–50 closed or mediated cases whose child support (and, where present, alimony, ED equalizer and retro) were run in FLS or DPA and in Laia.

For each case add two files:
- `<id>.case.json` — the Laia case file (File › Save .json), with every name, address, account number and case number replaced by tokens (`[PETITIONER]`, `[RESPONDENT]`, `[CHILD_1]`, `[CASE_NO]`, `[ACCT_1234]`).
- `<id>.expected.json` — the accepted results: child support amount and payer, each party's net income, each scenario's amount, alimony if any, ED equalizer if any, plus the FLS/DPA figure and a one-line note when the two differ (for example "Laia uses current-year tax tables; FLS used prior-year").

Cover the hard cases on purpose: shared parenting just over and under the threshold, self-employment and S-corp K-1, imputed income, three or more children, child care paid directly, health insurance over the 5% flag, step-downs, modification, retro across years, alimony linked to child support, a large ED estate with retirement offsets.

Never add a file that still contains a real name or number. Folder location is not a substitute for anonymizing.
