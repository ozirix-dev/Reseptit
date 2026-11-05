"""Prospective GI admission contract prototype, not a production calculator.

Caller supplies separately reviewed, trusted decision bindings. The default
ledger is empty. A matching string is not proof of owner authorization; the
real decision and source provenance must be verified outside this prototype.
Existing approved data are not migrated or reclassified by this module.
"""
import json
import re
import math

MEASUREMENT = {"HUMAN_MEASURED", "HUMAN_MEASURED_METHOD_UNCONFIRMED", "IN_VITRO_ESTIMATE", "NOT_MEASURED", "UNASSESSED"}
APPLICATION = {"DIRECT", "FOOD_ANALOGUE", "CATEGORY_PROXY", "PROJECT_IMPUTATION", "REFERENCE_ONLY"}
BINDINGS = ["recipeId", "recipeSourceHash", "recipeInputHash", "compositionId", "compositionEvidenceHash"]


def decision_key(record, target):
    return json.dumps({"sourceId": record["id"], "sourceEvidenceHash": record["evidenceHash"], "applicationKind": record["applicationKind"], "target": target}, sort_keys=True, separators=(",", ":"))


def issues(record, target, trusted_decisions=()):
    """Return reasons to withhold a new ingredient-GI admission, never a GK."""
    out = []
    kind = record.get("measurementKind")
    application = record.get("applicationKind")
    if kind not in MEASUREMENT or kind == "UNASSESSED":
        out.append("MEASUREMENT_NOT_CLASSIFIED")
    if application not in APPLICATION:
        out.append("APPLICATION_NOT_CLASSIFIED")
    if record.get("testObjectKind") not in {"SINGLE_FOOD", "MIXED_MEAL", "POLICY"}:
        out.append("TEST_OBJECT_NOT_CLASSIFIED")
    value = record.get("gi")
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value < 0:
        out.append("INVALID_GI")
    if not record.get("sourceUrl"):
        out.append("SOURCE_NOT_IDENTIFIED")
    if record.get("calculationUse") != "REQUEST_SCOPED_ADMISSION" or application == "REFERENCE_ONLY":
        out.append("REFERENCE_OR_REVIEW_ONLY")
    if kind == "IN_VITRO_ESTIMATE":
        out.append("IN_VITRO_IS_NOT_HUMAN_GI")
    if record.get("scale") != "GLUCOSE_100" or record.get("referenceVerified") is not True:
        out.append("REFERENCE_SCALE_NOT_VERIFIED")
    if kind == "HUMAN_MEASURED" and record.get("humanProtocolVerified") is not True:
        out.append("HUMAN_METHOD_NOT_VERIFIED")
    if kind in {"HUMAN_MEASURED", "HUMAN_MEASURED_METHOD_UNCONFIRMED"} and not (isinstance(record.get("participants"), int) and record["participants"] > 0):
        out.append("HUMAN_PARTICIPANTS_NOT_RECORDED")
    if kind == "HUMAN_MEASURED_METHOD_UNCONFIRMED" and record.get("methodLimitDisclosed") is not True:
        out.append("METHOD_LIMIT_NOT_DISCLOSED")
    if kind == "NOT_MEASURED" and application != "PROJECT_IMPUTATION":
        out.append("UNMEASURED_NOT_AN_IMPUTATION")
    if application == "PROJECT_IMPUTATION" and (kind != "NOT_MEASURED" or not record.get("policyId")):
        out.append("IMPUTATION_NOT_MEASURED")
    if record.get("testObjectKind") == "MIXED_MEAL" and target.get("scope") != "SAME_TESTED_WHOLE_MEAL":
        out.append("MIXED_MEAL_NOT_INGREDIENT")
    identity = record.get("identity", {})
    if application == "DIRECT":
        if kind not in {"HUMAN_MEASURED", "HUMAN_MEASURED_METHOD_UNCONFIRMED"}:
            out.append("DIRECT_REQUIRES_HUMAN_FOOD_TEST")
        for key in ["productId", "brandOrGeneric", "physicalForm", "preparation", "ingredientsHash"]:
            if not identity.get(key) or identity.get(key) != target.get("identity", {}).get(key):
                out.append("PRODUCT_OR_PREPARATION_MISMATCH:" + key)
    binding = record.get("binding", {})
    for key in BINDINGS:
        if not binding.get(key) or binding.get(key) != target.get(key):
            out.append("UNBOUND_TARGET:" + key)
    for value in [record.get("evidenceHash"), binding.get("recipeSourceHash"), binding.get("recipeInputHash"), binding.get("compositionEvidenceHash")]:
        if not isinstance(value, str) or not re.fullmatch(r"[0-9a-f]{64}", value):
            out.append("INVALID_EVIDENCE_HASH")
    try:
        approved = decision_key(record, target) in trusted_decisions
    except KeyError:
        approved = False
    if not approved:
        out.append("NO_SEPARATE_SCOPED_DECISION")
    return sorted(set(out))
