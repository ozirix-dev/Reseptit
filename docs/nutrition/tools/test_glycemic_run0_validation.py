"""Run with Python from site/; read production fixtures, mutate only memory."""
import copy
import json
import pathlib
import unittest
from glycemic_run0_validation import REFERENCE_ONLY, WITHDRAWN, unique_by, verify_regression

ROOT=pathlib.Path(__file__).resolve().parents[3]
def read(rel):
    return json.loads((ROOT/rel).read_text(encoding='utf-8-sig'))

class PlanningRegressionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base_data=(read('docs/nutrition/glycemic-coverage-batch-2b6d-baseline.json'),read('tmp/nutrition/glycemic-load-pilot.json'),read('docs/nutrition/glycemic-coconut-source-review.json'),read('docs/nutrition/glycemic-index-records.json'))
    def setUp(self):
        self.baseline,self.pilot,self.review,self.catalog=copy.deepcopy(self.base_data)
    def verify(self):
        return verify_regression(self.baseline,self.pilot,self.review,self.catalog)
    def row(self,rid):
        return next(r for r in self.pilot['results'] if r['recipeId']==rid)
    def test_documented_withdrawal_is_the_only_allowed_exception(self):
        r=self.verify()
        self.assertEqual(r['approvedWithdrawal']['recipeId'],WITHDRAWN)
        self.assertEqual(r['previouslyPublishedValuesPreserved'],self.pilot['summary']['calculated'])
    def test_other_historical_withdrawal_is_rejected(self):
        rid=next(r['recipeId'] for r in self.baseline['recipes'] if r['status']=='CALCULATED' and r['recipeId']!=WITHDRAWN)
        self.row(rid)['status']='INSUFFICIENT SOURCE DATA';self.row(rid)['glycemicLoadPerServing']=None
        with self.assertRaisesRegex(AssertionError,'Unexpected historical withdrawal'):self.verify()
    def test_changed_historical_value_is_rejected(self):
        rid=next(r['recipeId'] for r in self.baseline['recipes'] if r['status']=='CALCULATED' and r['recipeId']!=WITHDRAWN)
        self.row(rid)['glycemicLoadPerServing']+=0.01
        with self.assertRaisesRegex(AssertionError,'Historical GK changed'):self.verify()
    def test_unrounded_change_hidden_by_display_is_rejected(self):
        self.row('kiinalainen-hirssipuuro-taateleilla')['unroundedGlycemicLoadPerServing']+=0.00001
        with self.assertRaisesRegex(AssertionError,'Published GK changed'):self.verify()
    def test_second_batch_addition_change_is_rejected(self):
        self.row('pohjoisafrikkalainen-kuskus-aamiaiskulho')['glycemicLoadPerServing']+=0.01
        with self.assertRaisesRegex(AssertionError,'Published GK changed'):self.verify()
    def test_rewritten_historical_curry_is_rejected(self):
        next(r for r in self.baseline['recipes'] if r['recipeId']==WITHDRAWN)['glycemicLoadPerServing']=None
        with self.assertRaises(AssertionError):self.verify()
    def test_withdrawal_without_source_evidence_is_rejected(self):
        next(r for r in self.review['affectedRecipes'] if r['recipeId']==WITHDRAWN)['after']['blockers']=[]
        with self.assertRaisesRegex(AssertionError,'source-specific'):self.verify()
    def test_curry_does_not_silently_drop_out(self):
        self.pilot['results']=[r for r in self.pilot['results'] if r['recipeId']!=WITHDRAWN]
        with self.assertRaises(AssertionError):self.verify()
    def test_reference_only_flag_cannot_be_removed(self):
        next(r for r in self.catalog['records'] if r['id']==REFERENCE_ONLY).pop('calculationUse')
        with self.assertRaisesRegex(AssertionError,'restriction lost'):self.verify()
    def test_invalid_binding_cannot_be_restored(self):
        next(r for r in self.pilot['calculationInputs'] if r['recipeId']==WITHDRAWN)['ingredients'][1]['giRecordId']=REFERENCE_ONLY
        with self.assertRaisesRegex(AssertionError,'binding restored'):self.verify()
    def test_duplicate_recipe_ids_are_rejected(self):
        self.pilot['results'].append(copy.deepcopy(self.pilot['results'][0]))
        with self.assertRaisesRegex(AssertionError,'Duplicate identifiers'):self.verify()
    def test_duplicate_nutrition_ids_are_rejected(self):
        with self.assertRaisesRegex(AssertionError,'Duplicate identifiers'):
            unique_by([{'recipe_id':'a'},{'recipe_id':'a'}],'recipe_id','nutrition audit')
    def test_unexpected_new_calculation_is_rejected(self):
        rid=next(r['recipeId'] for r in self.pilot['results'] if r['status']!='CALCULATED' and r['recipeId'] not in self.review['affectedRecipeIds'])
        self.row(rid)['status']='CALCULATED';self.row(rid)['glycemicLoadPerServing']=1
        with self.assertRaisesRegex(AssertionError,'Unexpected calculated recipe set'):self.verify()
    def test_summary_cannot_mask_missing_rows(self):
        self.pilot['summary']['insufficientSourceData']-=1
        with self.assertRaisesRegex(AssertionError,'summary disagrees'):self.verify()

if __name__=='__main__':unittest.main(verbosity=2)
