import copy
import json
import unittest
from decimal import Decimal
from pathlib import Path
from prototype import available,dec,evaluate,interval_display,run


class Controls(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data=json.loads(Path(__file__).with_name('pilot-inputs.json').read_text(encoding='utf8'))
        cls.spice=next(r for r in cls.data['recipes'] if r['recipeId']=='nakkikeitto-kukkakaalilla')

    def test_unknown_and_known_zero_differ(self):
        self.assertIsNone(available(10,2,None,'US_TOTAL'))
        self.assertEqual(available(10,2,0,'US_TOTAL'),8)
        self.assertRaises(ValueError,dec,None)

    def test_source_fields_and_no_double_subtraction(self):
        self.assertEqual(available(10,2,3,'US_TOTAL'),5)
        self.assertEqual(available(10,2,3,'EU_LABEL'),7)
        self.assertEqual(available(10,2,None,'AVAILABLE_EXCLUDING_POLYOLS'),10)

    def test_unknown_sweetener_mass_never_bypasses(self):
        r=copy.deepcopy(self.spice);x=r['uncertainties'][0]
        x.update(massG=100,scenarioPoolUpperPer100=100,unknownPoolPer100=100,group='P4')
        out=evaluate(r,150,.5)
        self.assertFalse(out['passesArithmeticBudget']);self.assertFalse(out['publicationEligible'])

    def test_erythritol_is_not_inferred_from_total_zero(self):
        # AFCD carbohydrate excluding polyols can be zero in a 100 g polyol food.
        r=copy.deepcopy(self.spice);x=r['uncertainties'][0]
        x.update(massG=100,choPer100=0,modelChoPer100=0,unknownPoolPer100=None,scenarioPoolUpperPer100=None,group='P4')
        self.assertIn('NO_COMPOSITION_POLYOL_CEILING',evaluate(r,150,.5)['blockers'])
        self.assertEqual(available(100,0,100,'EU_LABEL'),0)  # exact synthetic known erythritol only
        self.assertIsNone(available(100,0,None,'EU_LABEL'))

    def test_small_items_accumulate(self):
        r=copy.deepcopy(self.spice);r['uncertainties']*=10
        self.assertGreater(evaluate(r,150,.1)['sourceScenarioWidth'],Decimal('.1'))

    def test_label_rounding_and_zero_declaration(self):
        r=next(r for r in self.data['recipes'] if r['recipeId']=='kana-parmesaanipannu-parsakaali')
        self.assertEqual(evaluate(r,150,.1)['sourceScenarioWidth'],Decimal('.140625'))
        # A rounded EU "0" can represent <=0.5 g/100 g: it is not measured zero.
        x=copy.deepcopy(r);x['uncertainties'][0].update(choPer100=0,scenarioPoolUpperPer100=.5)
        self.assertEqual(evaluate(x,150,.1)['sourceScenarioWidth'],Decimal('.28125'))

    def test_missing_gi_remains_blocking(self):
        r=copy.deepcopy(self.spice);r['uncertainties'][0]['assignedGi']=None
        self.assertIn('MISSING_GI',evaluate(r,150,.1)['blockers'])

    def test_preparation_and_scope_remain_blocking(self):
        r=copy.deepcopy(self.spice);r['otherPreparationBlockers']=['UNRESOLVED_PREPARATION'];r['completeScope']=False
        out=evaluate(r,150,.1)
        self.assertFalse(out['researchShortlist']);self.assertIn('INCOMPLETE_SCOPE',out['blockers'])

    def test_stale_source_remains_blocking(self):
        r=copy.deepcopy(self.spice);r['currentSourceMatches']=False
        self.assertIn('STALE_SOURCE_VERSION',evaluate(r,150,.1)['blockers'])

    def test_class_crossing_even_with_stable_display(self):
        # A modeled 10.00 -> 10.05 still displays 10, but crosses the exact public band.
        out=interval_display(Decimal('10'),Decimal('10.05'))
        self.assertTrue(out['classMayChange']);self.assertFalse(out['displayedValueMayChange'])
        r=copy.deepcopy(self.spice);r['baselineModelGk']='10.01'
        self.assertTrue(evaluate(r,150,.05)['sourceScenario']['classMayChange'])

    def test_actual_near_boundary_recipe(self):
        # Published lohikeitto 10.457325 plus a synthetic unknown is a control,
        # not an assertion that this recipe actually lacks polyol data.
        r=copy.deepcopy(self.spice);r['baselineModelGk']='10.457325'
        r['uncertainties'][0].update(massG=4,scenarioPoolUpperPer100=100,unknownPoolPer100=100,modelChoPer100=100)
        self.assertTrue(evaluate(r,150,.5)['sourceScenario']['classMayChange'])

    def test_caps_and_thresholds_do_not_authorize_publication(self):
        out=run(self.data)
        self.assertEqual(len(out['results']),144)
        self.assertTrue(all(not r['publicationEligible'] for r in out['results']))
        self.assertTrue(all(i['polyolsPer100'] is None for r in self.data['recipes'] for i in r['uncertainties']))


if __name__=='__main__':
    unittest.main()
