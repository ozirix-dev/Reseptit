"""Aggregate gh-aw usage estimates for the public Recipavo review pilot."""

import json
import os
import subprocess
import tempfile
from collections import defaultdict
from datetime import datetime, time, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

REPO = "ozirix-dev/Reseptit"
WORKFLOW = "recipavo-review.lock.yml"
HELSINKI = ZoneInfo("Europe/Helsinki")

def day_of(timestamp):
    return datetime.fromisoformat(timestamp.replace("Z", "+00:00")).astimezone(HELSINKI).date()

def get_runs(start, end):
    def utc_midnight(day):
        return datetime.combine(day, time.min, HELSINKI).astimezone(timezone.utc).isoformat().replace("+00:00", "Z")

    endpoint = (
        f"repos/{REPO}/actions/workflows/{WORKFLOW}/runs?branch=main&event=workflow_dispatch"
        f"&created={utc_midnight(start)}..{utc_midnight(end)}&per_page=100"
    )
    pages = subprocess.check_output(["gh", "api", "--paginate", "--slurp", endpoint])
    return [run for page in json.loads(pages) for run in page["workflow_runs"]
            if start <= day_of(run["created_at"]) < end]

def get_usage(runs):
    ids = [str(run["id"]) for run in runs if run["status"] == "completed"]
    if not ids:
        return {}
    with tempfile.TemporaryDirectory() as directory:
        output = subprocess.run(
            [os.environ["GH_AW_BIN"], "logs", "--stdin", "--repo", REPO, "--artifacts", "usage",
             "--count", str(len(ids)), "--json", "--output", directory, "--timeout", "5"],
            input="\n".join(ids) + "\n", text=True, capture_output=True, check=False,
            encoding="utf-8",
        )
        if output.returncode:
            print(f"::warning::gh aw logs exited {output.returncode}; usage may be unavailable.")
        try:
            report = json.loads(output.stdout)
        except json.JSONDecodeError:
            return {}
    return {item["run_id"]: item for item in report.get("runs") or []}

def summarize(start, end, runs, usage):
    lines = [
        "## Recipavo: pilotin päivittäiset kulut",
        "",
        "Päivä määräytyy ajon käynnistysajasta (Europe/Helsinki). "
        "USD on gh-aw:n AIC-arvio (1 AIC = 0,01 USD). Julkisen repon vakiorunnerit ovat maksuttomia.",
        "",
        "| Päivä | Ajot | Mitattu | Odottaa tai tieto puuttuu | AIC | USD-arvio |",
        "|---|---:|---:|---:|---:|---:|",
    ]
    by_day = defaultdict(list)
    details = []
    incomplete = False
    for run in runs:
        run_id = run["id"]
        day = day_of(run["created_at"])
        row = usage.get(run_id, {})
        aic = row.get("aic")
        measured = isinstance(aic, (int, float)) and aic > 0
        state = f"{aic:.3f} AIC / {aic / 100:.4f} USD" if measured else "ei varmennettua kulutietoa"
        if run["run_attempt"] > 1:
            state += " (uusinta: aiempien yritysten käyttö voi puuttua)"
            incomplete = True
        if not measured:
            incomplete = True
        by_day[day].append(aic if measured else None)
        details.append(f"- {day} · [ajo {run_id}]({run['html_url']}) · {state}")
    for i in range((end - start).days):
        day = start + timedelta(days=i)
        values = by_day[day]
        known = [value for value in values if value is not None]
        amount = sum(known)
        cost = f"{amount:.3f} | {amount / 100:.4f}" if known or not values else "— | —"
        lines.append(f"| {day} | {len(values)} | {len(known)} | {len(values) - len(known)} | {cost} |")
    if details:
        lines.extend(["", "### Ajokohtainen erittely", "", *details])
    if incomplete:
        lines.extend(["", "Tarkista puuttuvat tiedot tai uusintayritykset OpenAI-projektin Usage-näkymästä. "
                      "Taulukko sisältää ainoastaan mitatut arviot."])
    return "\n".join(lines) + "\n"

def main():
    end = datetime.now(HELSINKI).date()
    start = end - timedelta(days=7)
    runs = get_runs(start, end)
    report = summarize(start, end, runs, get_usage(runs))
    with Path(os.environ["GITHUB_STEP_SUMMARY"]).open("a", encoding="utf-8") as summary:
        summary.write(report)

if __name__ == "__main__":
    main()
