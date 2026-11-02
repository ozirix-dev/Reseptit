/** Isolated research contract. No production recipe, macro, filter or JSON-LD consumers. */
export type AssessmentValue =
 | {kind:'POINT_ESTIMATE';value:number;scope:'WHOLE_VERSION';evidence:string[]}
 | {kind:'EVIDENCE_BOUNDED_RANGE';lower:number;upper:number;variation:'NAMED_PRODUCTS'|'COMPOSITION'|'PREPARATION'|'RESEARCH_COMPARATORS';evidence:string[]}
 | {kind:'CONDITIONAL_SCENARIOS';alternatives:Array<{id:string;value:number;assumptions:string[]}>;scope:'COMPONENT_SUBTOTAL';isBiologicalBound:false;isConfidenceInterval:false}
 | {kind:'CLASS_ONLY';value:'LOW'|'MEDIUM'|'HIGH';evidence:string[]}
 | {kind:'UNAVAILABLE';reasons:string[]};

export type ScenarioTerm = {
 id:string;name:string;massG:number|null;gPerServing:number|null;
 species:string|null;coefficient:number|null;gkPerServing:number|null;
 evidence:'EXISTING_GK_ONLY'|'CONDITIONAL_RESEARCH'|'UNRESOLVED';
 sourceIds:string[];reason:string;
};
export type ScenarioResultV1 = {
 schemaVersion:'GK_SCENARIOS_01_V1';methodVersion:string;recipeId:string;recipeVersion:string;
 scenarioId:string;productName:string;manufacturer:string;productKind:'NAMED_PRODUCT'|'REFERENCE_COMPOSITE';
 inputHash:string;sourceHashes:Record<string,string>;productHash:string;
 confidence:'LOW';publicationAuthorized:false;macroScope:'NO_MACRO_PACKAGE_FOR_THIS_VERSION';
 servings:number;chocolateGrams:number;separateErythritolGrams:number;sweeteners:string[];
 status:'HOLD';wholeRecipe:AssessmentValue;conditional:AssessmentValue;
 calculatedPortion:number|null;terms:ScenarioTerm[];
 coverage:{calculatedOrdinaryChoG:number|null;unresolvedOrdinaryChoG:number|null;
   conditionalPolyolsG:number|null;unresolvedPolyolsG:number|null;aggregatePolyolsComplete:boolean;
   omittedOrdinaryChoG:number|null;omissionPolicySatisfied:boolean;unknownOtherIngredientPolyols:true};
 classRobustness:'NOT_DETERMINABLE';blockers:string[];notes:string[];
 sources:Array<{id:string;title:string;url:string;locator:string;note:string}>;
 original:{inputHash:string;point:number;omittedCho:number};
};
