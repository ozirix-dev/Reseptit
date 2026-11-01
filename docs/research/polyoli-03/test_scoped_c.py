import copy,json,unittest
from decimal import Decimal
from pathlib import Path
from scoped_c import d,evaluate_case,gk_display,group,run,slack,stable

class ScopedC(unittest.TestCase):
    @classmethod
    def setUpClass(cls):cls.data=json.loads(Path(__file__).with_name('cases.json').read_text(encoding='utf8'))

    def test_five_reviewed_two_conditional_never_publishable(self):
        r=run(self.data);self.assertEqual(r['conditionalArithmeticCandidates'],2)
        self.assertTrue(all(not x['publicationEligible'] for x in r['results']))
        self.assertFalse(r['productionEnabled'])

    def test_unknown_values_remain_unknown(self):
        before=copy.deepcopy(self.data);run(self.data);self.assertEqual(before,self.data)
        self.assertRaises(ValueError,d,None)

    def test_other_recipe_or_servings_rejected(self):
        c=copy.deepcopy(self.data['cases'][0]);c['recipeId']='new-erythritol-recipe'
        self.assertRaisesRegex(ValueError,'OUT_OF_SCOPE',evaluate_case,c)
        c=copy.deepcopy(self.data['cases'][0]);c['servings']=1
        self.assertRaisesRegex(ValueError,'UNREVIEWED_VERSION',evaluate_case,c)

    def test_mass_and_product_identity_are_pinned(self):
        c=copy.deepcopy(self.data['cases'][0]);i=next(i for i in c['ingredients'] if i['targetDefinition']);i['massG']='50'
        self.assertRaisesRegex(ValueError,'MASS_CHANGED',evaluate_case,c)
        i['massG']='0.6';i['sourceId']='erythritol-product'
        self.assertRaisesRegex(ValueError,'UNREVIEWED_SOURCE',evaluate_case,c)

    def test_added_unknown_is_not_silently_omitted(self):
        c=copy.deepcopy(self.data['cases'][0]);c['ingredients'].append(copy.deepcopy(next(i for i in c['ingredients'] if i['targetDefinition'])))
        self.assertRaisesRegex(ValueError,'ADDITIONAL_UNKNOWN',evaluate_case,c)

    def test_marjoram_polyols_are_outside_available_cho(self):
        r=evaluate_case(self.data['cases'][0]);self.assertEqual(r['unknownPPerServing']['max'],Decimal('.02'))
        self.assertEqual(r['sourceModelGk']['width'],Decimal('.03'))

    def test_derived_water_cannot_create_a_zero(self):
        m=dict(availableCarbohydrate='20.3',fibre='40',protein='12.7',fat='7',water='20')
        self.assertEqual(slack(m),20)
        m['fat']='30';self.assertRaisesRegex(ValueError,'INCONSISTENT',slack,m)

    def test_us_total_is_constant_without_polyol_zero(self):
        r=evaluate_case(self.data['cases'][2]);self.assertEqual(r['macros']['carbsTotalG']['lower'],r['macros']['carbsTotalG']['upper'])
        self.assertLess(r['macros']['carbsNetG']['lower'],r['macros']['carbsNetG']['upper'])
        self.assertIsNone(r['unknownSourcePolyolsPer100g'])

    def test_macro_precision_is_coarsened_only_until_stable(self):
        a=evaluate_case(self.data['cases'][0]);b=evaluate_case(self.data['cases'][1])
        self.assertEqual(a['macros']['carbsTotalG']['decimalPlaces'],0)
        self.assertEqual(b['macros']['carbsTotalG']['decimalPlaces'],1)
        self.assertEqual(a['macros']['carbsNetG']['decimalPlaces'],2)

    def test_same_display_does_not_mask_a_class_crossing(self):
        self.assertTrue(stable(Decimal('9.99'),Decimal('10.02'),0)['stable'])
        self.assertNotEqual(group(Decimal('9.99')),group(Decimal('10.02')))

    def test_positive_subunit_never_becomes_zero(self):
        self.assertFalse(gk_display(Decimal('0.01'),Decimal('0.03'))['stable'])
        self.assertIsNone(gk_display(Decimal(0),Decimal('.02'))['value'])

    def test_partial_afcd_evidence_is_visible_and_aggregated(self):
        r=run(self.data)
        self.assertEqual(sum(len(x['afcdPartialEvidence']) for x in r['results']),10)
        self.assertTrue(all(abs(x['broaderSpeciesStressWidth']-x['sourceModelGk']['width'])<Decimal('1e-30') for x in r['results']))
        primary=next(x for x in r['comparisons'] if x['cap']=='150' and x['fullWidthBudget']=='0.05')
        self.assertEqual(primary['broaderSpeciesBudgetMatches'],0)

    def test_missing_gi_or_preparation_stays_blocking(self):
        c=copy.deepcopy(self.data['cases'][0]);next(i for i in c['ingredients'] if Decimal(i['macro']['availableCarbohydrate'])>0)['gi']=None
        self.assertRaisesRegex(ValueError,'MISSING_GI',evaluate_case,c)
        c=copy.deepcopy(self.data['cases'][0]);c['completeScope']=False
        self.assertRaisesRegex(ValueError,'UNREVIEWED_VERSION',evaluate_case,c)

    def test_missing_or_conflicting_paired_source_stays_blocking(self):
        c=copy.deepcopy(self.data['cases'][0]);i=next(i for i in c['ingredients'] if i['pairedCarbohydrates']);i['pairedCarbohydrates']=None
        self.assertRaisesRegex(ValueError,'MISSING_PAIRED',evaluate_case,c)

    def test_unreviewed_label_definition_is_rejected(self):
        c=copy.deepcopy(self.data['cases'][2]);i=next(i for i in c['ingredients'] if i['targetDefinition']);i['targetDefinition']='EU_LABEL'
        self.assertRaisesRegex(ValueError,'UNREVIEWED_TARGET',evaluate_case,c)

if __name__=='__main__':unittest.main()
