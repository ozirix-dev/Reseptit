"""Map Git paths, observed build-time reads and historical test references."""
from collections import Counter
from pathlib import PurePosixPath
import re

import gi_gk_maintainer as maintainer


def asset_map(folder):
    manifest, audit, _ = maintainer.load_capture(folder)
    revision = manifest["revision"]
    tree = maintainer.git("ls-tree", "-r", "--full-tree", revision, "--", "docs/nutrition", "docs/research")
    observed = {}
    for reader, paths in audit["maintainerReadTrace"].items():
        for path in paths:
            observed.setdefault(path, []).append(reader)
    # Only the runtime trace proves a build-time read.
    references = {}
    matches = maintainer.git("grep", "-n", "-I", "-E", "docs/(nutrition|research)/",
                             revision, "--", "site/tests", "site/scripts")
    for line in matches.splitlines():
        _, reader, number, content = line.split(":", 3)
        if reader.startswith("site/scripts/gi_"):
            continue
        for path in re.findall(r"docs/(?:nutrition|research)/[a-z0-9_./-]+\.(?:jsonl?|md|csv|tsv|txt)\b", content, re.I):
            references.setdefault(path, set()).add(f"{reader}:{number}")
    tracked = {}
    for line in tree.splitlines():
        record, path = line.split("\t", 1)
        _, kind, blob = record.split()
        if kind == "blob":
            tracked[path] = blob
    if missing := observed.keys() - tracked.keys():
        raise ValueError("Build read an untracked nutrition or research file: " + str(sorted(missing)))
    canon = set(maintainer.INPUTS[:2])
    assets = []
    for path, blob in sorted(tracked.items()):
        readers = sorted(observed.get(path, []))
        refs = sorted(references.get(path, []))
        if path.startswith("docs/research/") and not (readers or refs):
            continue
        name = PurePosixPath(path).name
        test_refs = [ref for ref in refs if ref.startswith("site/tests/")]
        if path in canon:
            lifecycle, owner = "CANONICAL_SOURCE", "GI and food-composition source review"
        elif readers and (re.search(r"(approval|manifest|bindings|registry|authorization)", name)
                          or "/gk100-approved-releases/" in path):
            lifecycle, owner = "APPROVAL_EVIDENCE", "Scoped GK review and release gate"
        elif readers:
            lifecycle, owner = "ACTIVE_CALCULATION_INPUT", "Production content, nutrition or GK build"
        elif test_refs and re.search(r"(historical|baseline|fixture)", name):
            lifecycle, owner = "IMMUTABLE_HISTORY", "Pinned historical regression"
        elif test_refs:
            lifecycle, owner = "TEST_FIXTURE", "Referenced by regression tests"
        elif path.startswith("docs/research/") or "/gk-research-" in path:
            lifecycle, owner = "RESEARCH", "Research references"
        else:
            lifecycle, owner = "UNRESOLVED", None
        assets.append({
            "path": path, "gitBlob": blob, "lifecycle": lifecycle, "owner": owner,
            "readers": readers, "codeReferences": refs,
            "updaters": ["Scoped source/approval PR"] if readers or path in canon else [],
            "publicationImpact": "BUILD_INPUT" if readers else "UNVERIFIED",
            "shaDependency": manifest["activeInputs"].get(path),
            "regenerable": False if readers or lifecycle == "IMMUTABLE_HISTORY" else None,
            "classification": "OBSERVED" if readers else "REFERENCED" if test_refs else "UNCERTAIN",
        })
    outputs = [*((p, "GI/GK build") for p in maintainer.GENERATED),
               ("tmp/gi-gk/maintainer.sqlite", "Maintainer index"),
               ("tmp/gi-gk/d1-preview/", "Local D1 export")]
    for path, owner in outputs:
        public = path.startswith("site/")
        assets.append({"path": path, "gitBlob": None, "lifecycle": "GENERATED_CURRENT", "owner": owner,
                       "updaters": [owner], "regenerable": True, "classification": "DECLARED_OUTPUT",
                       "readers": ["Static recipe build"] if public else ["Maintainer tools"],
                       "publicationImpact": "PUBLIC_PROJECTION" if public else "LOCAL_ONLY",
                       "shaDependency": manifest["publicModuleSha256"].get(path), "codeReferences": []})
    counts = dict(sorted(Counter(row["lifecycle"] for row in assets).items()))
    result = {"revision": revision, "tree": manifest["tree"], "counts": counts,
              "coverage": "Runtime capture reads, literal code references and Git blobs. Historical Git "
                          "commands and conditional paths outside the capture can be missing. "
                          "UNRESOLVED grants no removal authority.", "assets": assets}
    maintainer.save(folder / "asset-map.json", result)
    summary = [
        "# Generoitu GI/GK-aineistokartta", "", f"Git-revisio: {revision}", "",
        "Git sisältää lähteet ja hyväksynnät. Build tuottaa staattisen julkisen aineiston.",
        "Paikallinen SQLite ja tuleva D1-lukukopio muodostetaan Gitistä.",
        "", "| Elinkaariluokka | Polkuja |", "| --- | ---: |",
        *(f"| {name} | {count} |" for name, count in counts.items()), "",
        "Tarkat polut, Git-blobit ja lukijat löytyvät tiedostosta asset-map.json.",
        "Ajonaikainen havainto kattaa capture-ajon haarat. Historialliset Git-haut ja",
        "muut haarat vaativat erillisen tarkistuksen ennen tiedoston siirtoa.",
    ]
    (folder / "asset-map.md").write_text("\n".join(summary) + "\n", encoding="utf-8", newline="\n")
    return {"revision": revision, "counts": counts, "directory": str(folder)}
