# Replay the historical GK80 checks

Run from the repository root with Python 3, PyYAML and Beautiful Soup 4.

```sh
python -m pip install PyYAML beautifulsoup4
cd docs/research/gk80-international-20261102/stock-and-current-bindings
python verify_decimal.py --overlap-dir historical-artifacts --baseline-report historical-artifacts/glycemic-load-pilot.json --production-html historical-artifacts/published-main92.html --approval-matrix historical-artifacts/current-decision-matrix.csv
```

A successful full replay exits with code 0 and prints no SKIP messages.
The verifier checks the pinned SHA-256 values in the adjacent manifests.

- priority77.csv and joint-proposal-index.csv are the two historical handoff queues.
- glycemic-load-pilot.json is the baseline report with 156 calculated recipes.
- published-main92.html is the historical production capture with 172 numeric recipes.
- current-decision-matrix.csv is the approval matrix from commit 98e1b21ee5bdd4745a041024abb0dde851bbb806.

These files describe historical snapshots. The HTML file is an input to the offline parser.
