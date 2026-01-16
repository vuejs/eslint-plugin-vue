/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
import meta from './meta.ts'
import processor from './processor.ts'
import arrayBracketNewline from './rules/array-bracket-newline.js'
import arrayBracketSpacing from './rules/array-bracket-spacing.js'
import arrayElementNewline from './rules/array-element-newline.js'
import arrowSpacing from './rules/arrow-spacing.js'
import attributeHyphenation from './rules/attribute-hyphenation.js'
import attributesOrder from './rules/attributes-order.js'
import blockLang from './rules/block-lang.js'
import blockOrder from './rules/block-order.js'
import blockSpacing from './rules/block-spacing.js'
import blockTagNewline from './rules/block-tag-newline.js'
import braceStyle from './rules/brace-style.js'
import camelcase from './rules/camelcase.js'
import commaDangle from './rules/comma-dangle.js'
import commaSpacing from './rules/comma-spacing.js'
import commaStyle from './rules/comma-style.js'
import commentDirective from './rules/comment-directive.js'
import componentApiStyle from './rules/component-api-style.js'
import componentDefinitionNameCasing from './rules/component-definition-name-casing.js'
import componentNameInTemplateCasing from './rules/component-name-in-template-casing.js'
import componentOptionsNameCasing from './rules/component-options-name-casing.js'
import customEventNameCasing from './rules/custom-event-name-casing.js'
import defineEmitsDeclaration from './rules/define-emits-declaration.js'
import defineMacrosOrder from './rules/define-macros-order.js'
import definePropsDeclaration from './rules/define-props-declaration.js'
import definePropsDestructuring from './rules/define-props-destructuring.js'
import dotLocation from './rules/dot-location.js'
import dotNotation from './rules/dot-notation.js'
import enforceStyleAttribute from './rules/enforce-style-attribute.js'
import eqeqeq from './rules/eqeqeq.js'
import firstAttributeLinebreak from './rules/first-attribute-linebreak.js'
import funcCallSpacing from './rules/func-call-spacing.js'
import htmlButtonHasType from './rules/html-button-has-type.js'
import htmlClosingBracketNewline from './rules/html-closing-bracket-newline.js'
import htmlClosingBracketSpacing from './rules/html-closing-bracket-spacing.js'
import htmlCommentContentNewline from './rules/html-comment-content-newline.js'
import htmlCommentContentSpacing from './rules/html-comment-content-spacing.js'
import htmlCommentIndent from './rules/html-comment-indent.js'
import htmlEndTags from './rules/html-end-tags.js'
import htmlIndent from './rules/html-indent.js'
import htmlQuotes from './rules/html-quotes.js'
import htmlSelfClosing from './rules/html-self-closing.js'
import jsxUsesVars from './rules/jsx-uses-vars.js'
import keySpacing from './rules/key-spacing.js'
import keywordSpacing from './rules/keyword-spacing.js'
import matchComponentFileName from './rules/match-component-file-name.js'
import matchComponentImportName from './rules/match-component-import-name.js'
import maxAttributesPerLine from './rules/max-attributes-per-line.js'
import maxLen from './rules/max-len.js'
import maxLinesPerBlock from './rules/max-lines-per-block.js'
import maxProps from './rules/max-props.js'
import maxTemplateDepth from './rules/max-template-depth.js'
import multiWordComponentNames from './rules/multi-word-component-names.js'
import multilineHtmlElementContentNewline from './rules/multiline-html-element-content-newline.js'
import multilineTernary from './rules/multiline-ternary.js'
import mustacheInterpolationSpacing from './rules/mustache-interpolation-spacing.js'
import newLineBetweenMultiLineProperty from './rules/new-line-between-multi-line-property.js'
import nextTickStyle from './rules/next-tick-style.js'
import noArrowFunctionsInWatch from './rules/no-arrow-functions-in-watch.js'
import noAsyncInComputedProperties from './rules/no-async-in-computed-properties.js'
import noBareStringsInTemplate from './rules/no-bare-strings-in-template.js'
import noBooleanDefault from './rules/no-boolean-default.js'
import noChildContent from './rules/no-child-content.js'
import noComputedPropertiesInData from './rules/no-computed-properties-in-data.js'
import noConsole from './rules/no-console.js'
import noConstantCondition from './rules/no-constant-condition.js'
import noCustomModifiersOnVModel from './rules/no-custom-modifiers-on-v-model.js'
import noDeprecatedDataObjectDeclaration from './rules/no-deprecated-data-object-declaration.js'
import noDeprecatedDeleteSet from './rules/no-deprecated-delete-set.js'
import noDeprecatedDestroyedLifecycle from './rules/no-deprecated-destroyed-lifecycle.js'
import noDeprecatedDollarListenersApi from './rules/no-deprecated-dollar-listeners-api.js'
import noDeprecatedDollarScopedslotsApi from './rules/no-deprecated-dollar-scopedslots-api.js'
import noDeprecatedEventsApi from './rules/no-deprecated-events-api.js'
import noDeprecatedFilter from './rules/no-deprecated-filter.js'
import noDeprecatedFunctionalTemplate from './rules/no-deprecated-functional-template.js'
import noDeprecatedHtmlElementIs from './rules/no-deprecated-html-element-is.js'
import noDeprecatedInlineTemplate from './rules/no-deprecated-inline-template.js'
import noDeprecatedModelDefinition from './rules/no-deprecated-model-definition.js'
import noDeprecatedPropsDefaultThis from './rules/no-deprecated-props-default-this.js'
import noDeprecatedRouterLinkTagProp from './rules/no-deprecated-router-link-tag-prop.js'
import noDeprecatedScopeAttribute from './rules/no-deprecated-scope-attribute.js'
import noDeprecatedSlotAttribute from './rules/no-deprecated-slot-attribute.js'
import noDeprecatedSlotScopeAttribute from './rules/no-deprecated-slot-scope-attribute.js'
import noDeprecatedVBindSync from './rules/no-deprecated-v-bind-sync.js'
import noDeprecatedVIs from './rules/no-deprecated-v-is.js'
import noDeprecatedVOnNativeModifier from './rules/no-deprecated-v-on-native-modifier.js'
import noDeprecatedVOnNumberModifiers from './rules/no-deprecated-v-on-number-modifiers.js'
import noDeprecatedVueConfigKeycodes from './rules/no-deprecated-vue-config-keycodes.js'
import noDupeKeys from './rules/no-dupe-keys.js'
import noDupeVElseIf from './rules/no-dupe-v-else-if.js'
import noDuplicateAttrInheritance from './rules/no-duplicate-attr-inheritance.js'
import noDuplicateAttributes from './rules/no-duplicate-attributes.js'
import noDuplicateClassNames from './rules/no-duplicate-class-names.js'
import noEmptyComponentBlock from './rules/no-empty-component-block.js'
import noEmptyPattern from './rules/no-empty-pattern.js'
import noExportInScriptSetup from './rules/no-export-in-script-setup.js'
import noExposeAfterAwait from './rules/no-expose-after-await.js'
import noExtraParens from './rules/no-extra-parens.js'
import noImplicitCoercion from './rules/no-implicit-coercion.js'
import noImportCompilerMacros from './rules/no-import-compiler-macros.js'
import noIrregularWhitespace from './rules/no-irregular-whitespace.js'
import noLifecycleAfterAwait from './rules/no-lifecycle-after-await.js'
import noLoneTemplate from './rules/no-lone-template.js'
import noLossOfPrecision from './rules/no-loss-of-precision.js'
import noMultiSpaces from './rules/no-multi-spaces.js'
import noMultipleObjectsInClass from './rules/no-multiple-objects-in-class.js'
import noMultipleSlotArgs from './rules/no-multiple-slot-args.js'
import noMultipleTemplateRoot from './rules/no-multiple-template-root.js'
import noMutatingProps from './rules/no-mutating-props.js'
import noNegatedCondition from './rules/no-negated-condition.js'
import noNegatedVIfCondition from './rules/no-negated-v-if-condition.js'
import noParsingError from './rules/no-parsing-error.js'
import noPotentialComponentOptionTypo from './rules/no-potential-component-option-typo.js'
import noRefAsOperand from './rules/no-ref-as-operand.js'
import noRefObjectReactivityLoss from './rules/no-ref-object-reactivity-loss.js'
import noRequiredPropWithDefault from './rules/no-required-prop-with-default.js'
import noReservedComponentNames from './rules/no-reserved-component-names.js'
import noReservedKeys from './rules/no-reserved-keys.js'
import noReservedProps from './rules/no-reserved-props.js'
import noRestrictedBlock from './rules/no-restricted-block.js'
import noRestrictedCallAfterAwait from './rules/no-restricted-call-after-await.js'
import noRestrictedClass from './rules/no-restricted-class.js'
import noRestrictedComponentNames from './rules/no-restricted-component-names.js'
import noRestrictedComponentOptions from './rules/no-restricted-component-options.js'
import noRestrictedCustomEvent from './rules/no-restricted-custom-event.js'
import noRestrictedHtmlElements from './rules/no-restricted-html-elements.js'
import noRestrictedProps from './rules/no-restricted-props.js'
import noRestrictedStaticAttribute from './rules/no-restricted-static-attribute.js'
import noRestrictedSyntax from './rules/no-restricted-syntax.js'
import noRestrictedVBind from './rules/no-restricted-v-bind.js'
import noRestrictedVOn from './rules/no-restricted-v-on.js'
import noRootVIf from './rules/no-root-v-if.js'
import noSetupPropsReactivityLoss from './rules/no-setup-props-reactivity-loss.js'
import noSharedComponentData from './rules/no-shared-component-data.js'
import noSideEffectsInComputedProperties from './rules/no-side-effects-in-computed-properties.js'
import noSpacesAroundEqualSignsInAttribute from './rules/no-spaces-around-equal-signs-in-attribute.js'
import noSparseArrays from './rules/no-sparse-arrays.js'
import noStaticInlineStyles from './rules/no-static-inline-styles.js'
import noTemplateKey from './rules/no-template-key.js'
import noTemplateShadow from './rules/no-template-shadow.js'
import noTemplateTargetBlank from './rules/no-template-target-blank.js'
import noTextareaMustache from './rules/no-textarea-mustache.js'
import noThisInBeforeRouteEnter from './rules/no-this-in-before-route-enter.js'
import noUndefComponents from './rules/no-undef-components.js'
import noUndefDirectives from './rules/no-undef-directives.js'
import noUndefProperties from './rules/no-undef-properties.js'
import noUnsupportedFeatures from './rules/no-unsupported-features.js'
import noUnusedComponents from './rules/no-unused-components.js'
import noUnusedEmitDeclarations from './rules/no-unused-emit-declarations.js'
import noUnusedProperties from './rules/no-unused-properties.js'
import noUnusedRefs from './rules/no-unused-refs.js'
import noUnusedVars from './rules/no-unused-vars.js'
import noUseComputedPropertyLikeMethod from './rules/no-use-computed-property-like-method.js'
import noUseVElseWithVFor from './rules/no-use-v-else-with-v-for.js'
import noUseVIfWithVFor from './rules/no-use-v-if-with-v-for.js'
import noUselessConcat from './rules/no-useless-concat.js'
import noUselessMustaches from './rules/no-useless-mustaches.js'
import noUselessTemplateAttributes from './rules/no-useless-template-attributes.js'
import noUselessVBind from './rules/no-useless-v-bind.js'
import noVForTemplateKeyOnChild from './rules/no-v-for-template-key-on-child.js'
import noVForTemplateKey from './rules/no-v-for-template-key.js'
import noVHtml from './rules/no-v-html.js'
import noVModelArgument from './rules/no-v-model-argument.js'
import noVTextVHtmlOnComponent from './rules/no-v-text-v-html-on-component.js'
import noVText from './rules/no-v-text.js'
import noWatchAfterAwait from './rules/no-watch-after-await.js'
import objectCurlyNewline from './rules/object-curly-newline.js'
import objectCurlySpacing from './rules/object-curly-spacing.js'
import objectPropertyNewline from './rules/object-property-newline.js'
import objectShorthand from './rules/object-shorthand.js'
import oneComponentPerFile from './rules/one-component-per-file.js'
import operatorLinebreak from './rules/operator-linebreak.js'
import orderInComponents from './rules/order-in-components.js'
import paddingLineBetweenBlocks from './rules/padding-line-between-blocks.js'
import paddingLineBetweenTags from './rules/padding-line-between-tags.js'
import paddingLinesInComponentDefinition from './rules/padding-lines-in-component-definition.js'
import preferDefineOptions from './rules/prefer-define-options.js'
import preferImportFromVue from './rules/prefer-import-from-vue.js'
import preferPropTypeBooleanFirst from './rules/prefer-prop-type-boolean-first.js'
import preferSeparateStaticClass from './rules/prefer-separate-static-class.js'
import preferTemplate from './rules/prefer-template.js'
import preferTrueAttributeShorthand from './rules/prefer-true-attribute-shorthand.js'
import preferUseTemplateRef from './rules/prefer-use-template-ref.js'
import propNameCasing from './rules/prop-name-casing.js'
import quoteProps from './rules/quote-props.js'
import requireComponentIs from './rules/require-component-is.js'
import requireDefaultExport from './rules/require-default-export.js'
import requireDefaultProp from './rules/require-default-prop.js'
import requireDirectExport from './rules/require-direct-export.js'
import requireEmitValidator from './rules/require-emit-validator.js'
import requireExplicitEmits from './rules/require-explicit-emits.js'
import requireExplicitSlots from './rules/require-explicit-slots.js'
import requireExpose from './rules/require-expose.js'
import requireMacroVariableName from './rules/require-macro-variable-name.js'
import requireNameProperty from './rules/require-name-property.js'
import requirePropComment from './rules/require-prop-comment.js'
import requirePropTypeConstructor from './rules/require-prop-type-constructor.js'
import requirePropTypes from './rules/require-prop-types.js'
import requireRenderReturn from './rules/require-render-return.js'
import requireSlotsAsFunctions from './rules/require-slots-as-functions.js'
import requireToggleInsideTransition from './rules/require-toggle-inside-transition.js'
import requireTypedObjectProp from './rules/require-typed-object-prop.js'
import requireTypedRef from './rules/require-typed-ref.js'
import requireVForKey from './rules/require-v-for-key.js'
import requireValidDefaultProp from './rules/require-valid-default-prop.js'
import restrictedComponentNames from './rules/restricted-component-names.js'
import returnInComputedProperty from './rules/return-in-computed-property.js'
import returnInEmitsValidator from './rules/return-in-emits-validator.js'
import scriptIndent from './rules/script-indent.js'
import singlelineHtmlElementContentNewline from './rules/singleline-html-element-content-newline.js'
import slotNameCasing from './rules/slot-name-casing.js'
import sortKeys from './rules/sort-keys.js'
import spaceInParens from './rules/space-in-parens.js'
import spaceInfixOps from './rules/space-infix-ops.js'
import spaceUnaryOps from './rules/space-unary-ops.js'
import staticClassNamesOrder from './rules/static-class-names-order.js'
import templateCurlySpacing from './rules/template-curly-spacing.js'
import thisInTemplate from './rules/this-in-template.js'
import useVOnExact from './rules/use-v-on-exact.js'
import vBindStyle from './rules/v-bind-style.js'
import vForDelimiterStyle from './rules/v-for-delimiter-style.js'
import vIfElseKey from './rules/v-if-else-key.js'
import vOnEventHyphenation from './rules/v-on-event-hyphenation.js'
import vOnHandlerStyle from './rules/v-on-handler-style.js'
import vOnStyle from './rules/v-on-style.js'
import vSlotStyle from './rules/v-slot-style.js'
import validAttributeName from './rules/valid-attribute-name.js'
import validDefineEmits from './rules/valid-define-emits.js'
import validDefineOptions from './rules/valid-define-options.js'
import validDefineProps from './rules/valid-define-props.js'
import validModelDefinition from './rules/valid-model-definition.js'
import validNextTick from './rules/valid-next-tick.js'
import validTemplateRoot from './rules/valid-template-root.js'
import validVBindSync from './rules/valid-v-bind-sync.js'
import validVBind from './rules/valid-v-bind.js'
import validVCloak from './rules/valid-v-cloak.js'
import validVElseIf from './rules/valid-v-else-if.js'
import validVElse from './rules/valid-v-else.js'
import validVFor from './rules/valid-v-for.js'
import validVHtml from './rules/valid-v-html.js'
import validVIf from './rules/valid-v-if.js'
import validVIs from './rules/valid-v-is.js'
import validVMemo from './rules/valid-v-memo.js'
import validVModel from './rules/valid-v-model.js'
import validVOn from './rules/valid-v-on.js'
import validVOnce from './rules/valid-v-once.js'
import validVPre from './rules/valid-v-pre.js'
import validVShow from './rules/valid-v-show.js'
import validVSlot from './rules/valid-v-slot.js'
import validVText from './rules/valid-v-text.js'

export default {
  meta,
  rules: {
    'array-bracket-newline': arrayBracketNewline,
    'array-bracket-spacing': arrayBracketSpacing,
    'array-element-newline': arrayElementNewline,
    'arrow-spacing': arrowSpacing,
    'attribute-hyphenation': attributeHyphenation,
    'attributes-order': attributesOrder,
    'block-lang': blockLang,
    'block-order': blockOrder,
    'block-spacing': blockSpacing,
    'block-tag-newline': blockTagNewline,
    'brace-style': braceStyle,
    camelcase,
    'comma-dangle': commaDangle,
    'comma-spacing': commaSpacing,
    'comma-style': commaStyle,
    'comment-directive': commentDirective,
    'component-api-style': componentApiStyle,
    'component-definition-name-casing': componentDefinitionNameCasing,
    'component-name-in-template-casing': componentNameInTemplateCasing,
    'component-options-name-casing': componentOptionsNameCasing,
    'custom-event-name-casing': customEventNameCasing,
    'define-emits-declaration': defineEmitsDeclaration,
    'define-macros-order': defineMacrosOrder,
    'define-props-declaration': definePropsDeclaration,
    'define-props-destructuring': definePropsDestructuring,
    'dot-location': dotLocation,
    'dot-notation': dotNotation,
    'enforce-style-attribute': enforceStyleAttribute,
    eqeqeq,
    'first-attribute-linebreak': firstAttributeLinebreak,
    'func-call-spacing': funcCallSpacing,
    'html-button-has-type': htmlButtonHasType,
    'html-closing-bracket-newline': htmlClosingBracketNewline,
    'html-closing-bracket-spacing': htmlClosingBracketSpacing,
    'html-comment-content-newline': htmlCommentContentNewline,
    'html-comment-content-spacing': htmlCommentContentSpacing,
    'html-comment-indent': htmlCommentIndent,
    'html-end-tags': htmlEndTags,
    'html-indent': htmlIndent,
    'html-quotes': htmlQuotes,
    'html-self-closing': htmlSelfClosing,
    'jsx-uses-vars': jsxUsesVars,
    'key-spacing': keySpacing,
    'keyword-spacing': keywordSpacing,
    'match-component-file-name': matchComponentFileName,
    'match-component-import-name': matchComponentImportName,
    'max-attributes-per-line': maxAttributesPerLine,
    'max-len': maxLen,
    'max-lines-per-block': maxLinesPerBlock,
    'max-props': maxProps,
    'max-template-depth': maxTemplateDepth,
    'multi-word-component-names': multiWordComponentNames,
    'multiline-html-element-content-newline':
      multilineHtmlElementContentNewline,
    'multiline-ternary': multilineTernary,
    'mustache-interpolation-spacing': mustacheInterpolationSpacing,
    'new-line-between-multi-line-property': newLineBetweenMultiLineProperty,
    'next-tick-style': nextTickStyle,
    'no-arrow-functions-in-watch': noArrowFunctionsInWatch,
    'no-async-in-computed-properties': noAsyncInComputedProperties,
    'no-bare-strings-in-template': noBareStringsInTemplate,
    'no-boolean-default': noBooleanDefault,
    'no-child-content': noChildContent,
    'no-computed-properties-in-data': noComputedPropertiesInData,
    'no-console': noConsole,
    'no-constant-condition': noConstantCondition,
    'no-custom-modifiers-on-v-model': noCustomModifiersOnVModel,
    'no-deprecated-data-object-declaration': noDeprecatedDataObjectDeclaration,
    'no-deprecated-delete-set': noDeprecatedDeleteSet,
    'no-deprecated-destroyed-lifecycle': noDeprecatedDestroyedLifecycle,
    'no-deprecated-dollar-listeners-api': noDeprecatedDollarListenersApi,
    'no-deprecated-dollar-scopedslots-api': noDeprecatedDollarScopedslotsApi,
    'no-deprecated-events-api': noDeprecatedEventsApi,
    'no-deprecated-filter': noDeprecatedFilter,
    'no-deprecated-functional-template': noDeprecatedFunctionalTemplate,
    'no-deprecated-html-element-is': noDeprecatedHtmlElementIs,
    'no-deprecated-inline-template': noDeprecatedInlineTemplate,
    'no-deprecated-model-definition': noDeprecatedModelDefinition,
    'no-deprecated-props-default-this': noDeprecatedPropsDefaultThis,
    'no-deprecated-router-link-tag-prop': noDeprecatedRouterLinkTagProp,
    'no-deprecated-scope-attribute': noDeprecatedScopeAttribute,
    'no-deprecated-slot-attribute': noDeprecatedSlotAttribute,
    'no-deprecated-slot-scope-attribute': noDeprecatedSlotScopeAttribute,
    'no-deprecated-v-bind-sync': noDeprecatedVBindSync,
    'no-deprecated-v-is': noDeprecatedVIs,
    'no-deprecated-v-on-native-modifier': noDeprecatedVOnNativeModifier,
    'no-deprecated-v-on-number-modifiers': noDeprecatedVOnNumberModifiers,
    'no-deprecated-vue-config-keycodes': noDeprecatedVueConfigKeycodes,
    'no-dupe-keys': noDupeKeys,
    'no-dupe-v-else-if': noDupeVElseIf,
    'no-duplicate-attr-inheritance': noDuplicateAttrInheritance,
    'no-duplicate-attributes': noDuplicateAttributes,
    'no-duplicate-class-names': noDuplicateClassNames,
    'no-empty-component-block': noEmptyComponentBlock,
    'no-empty-pattern': noEmptyPattern,
    'no-export-in-script-setup': noExportInScriptSetup,
    'no-expose-after-await': noExposeAfterAwait,
    'no-extra-parens': noExtraParens,
    'no-implicit-coercion': noImplicitCoercion,
    'no-import-compiler-macros': noImportCompilerMacros,
    'no-irregular-whitespace': noIrregularWhitespace,
    'no-lifecycle-after-await': noLifecycleAfterAwait,
    'no-lone-template': noLoneTemplate,
    'no-loss-of-precision': noLossOfPrecision,
    'no-multi-spaces': noMultiSpaces,
    'no-multiple-objects-in-class': noMultipleObjectsInClass,
    'no-multiple-slot-args': noMultipleSlotArgs,
    'no-multiple-template-root': noMultipleTemplateRoot,
    'no-mutating-props': noMutatingProps,
    'no-negated-condition': noNegatedCondition,
    'no-negated-v-if-condition': noNegatedVIfCondition,
    'no-parsing-error': noParsingError,
    'no-potential-component-option-typo': noPotentialComponentOptionTypo,
    'no-ref-as-operand': noRefAsOperand,
    'no-ref-object-reactivity-loss': noRefObjectReactivityLoss,
    'no-required-prop-with-default': noRequiredPropWithDefault,
    'no-reserved-component-names': noReservedComponentNames,
    'no-reserved-keys': noReservedKeys,
    'no-reserved-props': noReservedProps,
    'no-restricted-block': noRestrictedBlock,
    'no-restricted-call-after-await': noRestrictedCallAfterAwait,
    'no-restricted-class': noRestrictedClass,
    'no-restricted-component-names': noRestrictedComponentNames,
    'no-restricted-component-options': noRestrictedComponentOptions,
    'no-restricted-custom-event': noRestrictedCustomEvent,
    'no-restricted-html-elements': noRestrictedHtmlElements,
    'no-restricted-props': noRestrictedProps,
    'no-restricted-static-attribute': noRestrictedStaticAttribute,
    'no-restricted-syntax': noRestrictedSyntax,
    'no-restricted-v-bind': noRestrictedVBind,
    'no-restricted-v-on': noRestrictedVOn,
    'no-root-v-if': noRootVIf,
    'no-setup-props-reactivity-loss': noSetupPropsReactivityLoss,
    'no-shared-component-data': noSharedComponentData,
    'no-side-effects-in-computed-properties': noSideEffectsInComputedProperties,
    'no-spaces-around-equal-signs-in-attribute':
      noSpacesAroundEqualSignsInAttribute,
    'no-sparse-arrays': noSparseArrays,
    'no-static-inline-styles': noStaticInlineStyles,
    'no-template-key': noTemplateKey,
    'no-template-shadow': noTemplateShadow,
    'no-template-target-blank': noTemplateTargetBlank,
    'no-textarea-mustache': noTextareaMustache,
    'no-this-in-before-route-enter': noThisInBeforeRouteEnter,
    'no-undef-components': noUndefComponents,
    'no-undef-directives': noUndefDirectives,
    'no-undef-properties': noUndefProperties,
    'no-unsupported-features': noUnsupportedFeatures,
    'no-unused-components': noUnusedComponents,
    'no-unused-emit-declarations': noUnusedEmitDeclarations,
    'no-unused-properties': noUnusedProperties,
    'no-unused-refs': noUnusedRefs,
    'no-unused-vars': noUnusedVars,
    'no-use-computed-property-like-method': noUseComputedPropertyLikeMethod,
    'no-use-v-else-with-v-for': noUseVElseWithVFor,
    'no-use-v-if-with-v-for': noUseVIfWithVFor,
    'no-useless-concat': noUselessConcat,
    'no-useless-mustaches': noUselessMustaches,
    'no-useless-template-attributes': noUselessTemplateAttributes,
    'no-useless-v-bind': noUselessVBind,
    'no-v-for-template-key-on-child': noVForTemplateKeyOnChild,
    'no-v-for-template-key': noVForTemplateKey,
    'no-v-html': noVHtml,
    'no-v-model-argument': noVModelArgument,
    'no-v-text-v-html-on-component': noVTextVHtmlOnComponent,
    'no-v-text': noVText,
    'no-watch-after-await': noWatchAfterAwait,
    'object-curly-newline': objectCurlyNewline,
    'object-curly-spacing': objectCurlySpacing,
    'object-property-newline': objectPropertyNewline,
    'object-shorthand': objectShorthand,
    'one-component-per-file': oneComponentPerFile,
    'operator-linebreak': operatorLinebreak,
    'order-in-components': orderInComponents,
    'padding-line-between-blocks': paddingLineBetweenBlocks,
    'padding-line-between-tags': paddingLineBetweenTags,
    'padding-lines-in-component-definition': paddingLinesInComponentDefinition,
    'prefer-define-options': preferDefineOptions,
    'prefer-import-from-vue': preferImportFromVue,
    'prefer-prop-type-boolean-first': preferPropTypeBooleanFirst,
    'prefer-separate-static-class': preferSeparateStaticClass,
    'prefer-template': preferTemplate,
    'prefer-true-attribute-shorthand': preferTrueAttributeShorthand,
    'prefer-use-template-ref': preferUseTemplateRef,
    'prop-name-casing': propNameCasing,
    'quote-props': quoteProps,
    'require-component-is': requireComponentIs,
    'require-default-export': requireDefaultExport,
    'require-default-prop': requireDefaultProp,
    'require-direct-export': requireDirectExport,
    'require-emit-validator': requireEmitValidator,
    'require-explicit-emits': requireExplicitEmits,
    'require-explicit-slots': requireExplicitSlots,
    'require-expose': requireExpose,
    'require-macro-variable-name': requireMacroVariableName,
    'require-name-property': requireNameProperty,
    'require-prop-comment': requirePropComment,
    'require-prop-type-constructor': requirePropTypeConstructor,
    'require-prop-types': requirePropTypes,
    'require-render-return': requireRenderReturn,
    'require-slots-as-functions': requireSlotsAsFunctions,
    'require-toggle-inside-transition': requireToggleInsideTransition,
    'require-typed-object-prop': requireTypedObjectProp,
    'require-typed-ref': requireTypedRef,
    'require-v-for-key': requireVForKey,
    'require-valid-default-prop': requireValidDefaultProp,
    'restricted-component-names': restrictedComponentNames,
    'return-in-computed-property': returnInComputedProperty,
    'return-in-emits-validator': returnInEmitsValidator,
    'script-indent': scriptIndent,
    'singleline-html-element-content-newline':
      singlelineHtmlElementContentNewline,
    'slot-name-casing': slotNameCasing,
    'sort-keys': sortKeys,
    'space-in-parens': spaceInParens,
    'space-infix-ops': spaceInfixOps,
    'space-unary-ops': spaceUnaryOps,
    'static-class-names-order': staticClassNamesOrder,
    'template-curly-spacing': templateCurlySpacing,
    'this-in-template': thisInTemplate,
    'use-v-on-exact': useVOnExact,
    'v-bind-style': vBindStyle,
    'v-for-delimiter-style': vForDelimiterStyle,
    'v-if-else-key': vIfElseKey,
    'v-on-event-hyphenation': vOnEventHyphenation,
    'v-on-handler-style': vOnHandlerStyle,
    'v-on-style': vOnStyle,
    'v-slot-style': vSlotStyle,
    'valid-attribute-name': validAttributeName,
    'valid-define-emits': validDefineEmits,
    'valid-define-options': validDefineOptions,
    'valid-define-props': validDefineProps,
    'valid-model-definition': validModelDefinition,
    'valid-next-tick': validNextTick,
    'valid-template-root': validTemplateRoot,
    'valid-v-bind-sync': validVBindSync,
    'valid-v-bind': validVBind,
    'valid-v-cloak': validVCloak,
    'valid-v-else-if': validVElseIf,
    'valid-v-else': validVElse,
    'valid-v-for': validVFor,
    'valid-v-html': validVHtml,
    'valid-v-if': validVIf,
    'valid-v-is': validVIs,
    'valid-v-memo': validVMemo,
    'valid-v-model': validVModel,
    'valid-v-on': validVOn,
    'valid-v-once': validVOnce,
    'valid-v-pre': validVPre,
    'valid-v-show': validVShow,
    'valid-v-slot': validVSlot,
    'valid-v-text': validVText
  },
  processors: {
    '.vue': processor,
    vue: processor
  }
}
