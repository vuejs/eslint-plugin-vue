/**
 * @author ItMaga
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/padding-lines-in-component-definition'
import { getTypeScriptFixtureTestOptions } from '../../test-utils/typescript'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('padding-lines-in-component-definition', rule, {
  valid: [
    {
      filename: 'Never.vue',
      code: `
        <script>
          export default {
            name: 'Never',
            props: {
                foo: {
                    type: String,
                    required: true,
                },
                bar: {
                    type: Number,
                    required: true,
                },
            },
            data() {
                return {
                    title: '',
                    message: '',
                };
            },
            customOption: 'custom'
          };
        </script>
      `,
      options: ['never']
    },
    {
      filename: 'Setup.vue',
      code: `
        import { ref, defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'Setup',
            setup() {
                const foo = ref('');
                const bar = ref('');

                return { foo, bar };
            }
        })
        </script>
      `,
      options: ['never']
    },
    {
      filename: 'BetweenOptionsNever.vue',
      code: `
        import { defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'BetweenOptionsNever',
            props: {
                foo: {
                    type: String,
                    required: true,
                },
                bar: {
                    type: Number,
                    required: true,
                },
            }
        })
        </script>
      `,
      options: [
        {
          betweenOptions: 'never',
          withinOption: 'never'
        }
      ]
    },
    {
      filename: 'GroupSingleLineProperties.vue',
      code: `
        import { defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'GroupSingleLineProperties',
            inheritAttrs: false,

            props: {
                foo: String,
                bar: Number
            }
        })
        </script>
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: 'never',
          groupSingleLineProperties: true
        }
      ]
    },
    {
      filename: 'WithinOption.vue',
      code: `
        import { defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'WithinOption',

            props: {
                foo: {
                    type: String,

                    required: true,
                },
                bar: {
                    type: Number,

                    required: true,
                },
            },

            data: () => ({
                title: '',

                message: '',
            }),
        })
        </script>
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: {
            props: {
              betweenItems: 'never',
              withinEach: 'always'
            },
            data: {
              betweenItems: 'always',
              withinEach: 'never'
            }
          }
        }
      ]
    },
    {
      filename: 'CustomOptions.vue',
      code: `
        <script>
        export default {
            name: 'CustomOptions',

            props: {
                foo: {
                    type: String,
                    required: true,
                },

                bar: {
                    type: Number,
                    required: true,
                },
            },

            customOption: {
                getString() {
                    return '1';
                },

                getNumber: () => 1,
            },

            data: () => ({
                title: '',

                message: '',
            }),
        }
        </script>
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: {
            props: {
              betweenItems: 'always',
              withinEach: 'never'
            },
            customOption: {
              betweenItems: 'always'
            }
          }
        }
      ]
    },
    {
      filename: 'NewVue.js',
      code: `
        new Vue({
          name: 'NewVue',
          inheritAttrs: false,
          props: {
              foo: {
                  type: String,
                  required: true,
              },
              bar: {
                  type: String,
                  required: true,
              }
          },
          customOption: {
              getString() { return '1' },
              getNumber: () => 1,
          },
        })
      `,
      options: ['never']
    },
    {
      filename: 'Mixin.js',
      code: `
        Vue.mixin({
          name: 'Mixin',
          inheritAttrs: false,
          props: {
              foo: {
                  type: String,
                  required: true,
              },
              bar: {
                  type: String,
                  required: true,
              }
          },
          customOption: {
              getString() { return '1' },
              getNumber: () => 1,
          },
        })
      `,
      options: [
        {
          betweenOptions: 'never',
          withinOption: 'ignore',
          groupSingleLineProperties: true
        }
      ]
    },
    {
      filename: 'DefineProps.vue',
      code: `
        import { defineProps } from 'vue'
        <script setup>
        const props = defineProps({
            foo: {
                type: String,
                required: true,
            },
            bar: {
                type: String,
                required: true,
            },
        })
        </script>
      `,
      options: ['never']
    },
    {
      filename: 'DefineEmits.vue',
      code: `
        import { defineEmits } from 'vue'
        <script setup>
        const emits = defineEmits(['foo', 'bar']);
        const emitsObject = defineEmits({
          change: (id) => typeof id == 'number',

          update: (value) => typeof value == 'string'
        })
        </script>
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: {
            emits: {
              betweenItems: 'always'
            }
          },
          groupSingleLineProperties: false
        }
      ]
    },
    {
      filename: 'Comment.vue',
      code: `
        <script>
        export default {
            name: 'Comment',

            props: {
                a: {
                    type: String,
                },

                /** JSDoc */
                b: {
                    type: String,
                },

                // single
                c: {
                    type: String,
                },

                /* block */
                d: String,
                /* block */
                f: String
            }
        }
        </script>
      `,
      options: ['always']
    },
    {
      filename: 'Spread.vue',
      code: `
        <script>
        export default {
            name: 'Spread',
            ...spread,
            props: {
                a: {
                    type: String,
                },
                ...lost,
                b: {
                    type: String,
                }
            }
        }
        </script>
      `,
      options: ['never']
    },
    {
      filename: 'SpreadWithComment.vue',
      code: `
        <script>
        export default {
            name: 'Spread',
            // comment
            ...spread,

            props: {
                a: {
                    type: String,
                },

                // comment
                ...lost,

                b: {
                    type: String,
                }
            }
        }
        </script>
      `,
      options: ['always']
    },
    {
      filename: 'MyComment.vue',
      code: `
        <script setup>
        defineOptions({
            name: 'MyComment',

            inheritAttrs: false,
        })
        </script>
      `,
      options: [{ betweenOptions: 'always', groupSingleLineProperties: false }]
    },
    {
      code: `
      <script setup lang="ts">
      import {Props1 as Props} from './test01'
      defineProps<Props>()
      </script>`,
      ...getTypeScriptFixtureTestOptions()
    }
  ],
  invalid: [
    {
      filename: 'Always.vue',
      code: `
      <script>
          export default {
            name: 'Always',
            props: {
                foo: {
                    type: String,
                    required: true,
                },
                bar: {
                    type: Number,
                    required: true,
                },
            },
            data() {
                return {
                    title: '',
                    message: '',
                };
            },
          };
      </script>
      `,
      output: `
      <script>
          export default {
            name: 'Always',

            props: {
                foo: {
                    type: String,
                    required: true,
                },

                bar: {
                    type: Number,
                    required: true,
                },
            },

            data() {
                return {
                    title: '',
                    message: '',
                };
            },
          };
      </script>
      `,
      options: ['always'],
      errors: [
        {
          message: 'Expected blank line before this definition.',
          line: 5,
          column: 13,
          endLine: 14,
          endColumn: 14
        },
        {
          message: 'Expected blank line before this definition.',
          line: 10,
          column: 17,
          endLine: 13,
          endColumn: 18
        },
        {
          message: 'Expected blank line before this definition.',
          line: 15,
          column: 13,
          endLine: 20,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'Setup.vue',
      code: `
        import { ref, defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'Setup',

            setup() {
                const foo = ref('');
                const bar = ref('');

                return { foo, bar };
            }
        })
        </script>
      `,
      output: `
        import { ref, defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'Setup',
            setup() {
                const foo = ref('');
                const bar = ref('');

                return { foo, bar };
            }
        })
        </script>
      `,
      options: ['never'],
      errors: [
        {
          message: 'Unexpected blank line before this definition.',
          line: 7,
          column: 13,
          endLine: 12,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'BetweenOptionsAlways.vue',
      code: `
        import { defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'BetweenOptionsAlways',
            props: {
                foo: {
                    type: String,
                    required: true,
                },
                bar: {
                    type: Number,
                    required: true,
                },
            }
        })
        </script>
      `,
      output: `
        import { defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'BetweenOptionsAlways',

            props: {
                foo: {
                    type: String,
                    required: true,
                },
                bar: {
                    type: Number,
                    required: true,
                },
            }
        })
        </script>
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: 'never'
        }
      ],
      errors: [
        {
          message: 'Expected blank line before this definition.',
          line: 6,
          column: 13,
          endLine: 15,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'GroupSingleLineProperties.vue',
      code: `
        import { defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'GroupSingleLineProperties',

            inheritAttrs: false,

            props: {
                foo: String,
                bar: Number
            }
        })
        </script>
      `,
      output: `
        import { defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'GroupSingleLineProperties',
            inheritAttrs: false,

            props: {
                foo: String,
                bar: Number
            }
        })
        </script>
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: 'never',
          groupSingleLineProperties: true
        }
      ],
      errors: [
        {
          message: 'Unexpected blank line between single line properties.',
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'WithinOption.vue',
      code: `
        import { defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'WithinOption',

            props: {
                foo: {
                    type: String,
                    required: true,
                },
                bar: {
                    type: Number,
                    required: true,
                },
            },
        })
        </script>
      `,
      output: `
        import { defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'WithinOption',

            props: {
                foo: {
                    type: String,

                    required: true,
                },

                bar: {
                    type: Number,

                    required: true,
                },
            },
        })
        </script>
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: {
            props: {
              betweenItems: 'always',
              withinEach: 'always'
            },
            data: {
              betweenItems: 'always',
              withinEach: 'never'
            }
          }
        }
      ],
      errors: [
        {
          message: 'Expected blank line before this definition.',
          line: 10,
          column: 21,
          endLine: 10,
          endColumn: 35
        },
        {
          message: 'Expected blank line before this definition.',
          line: 12,
          column: 17,
          endLine: 15,
          endColumn: 18
        },
        {
          message: 'Expected blank line before this definition.',
          line: 14,
          column: 21,
          endLine: 14,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'CustomOptions.vue',
      code: `
        <script>
        export default {
            name: 'CustomOptions',

            props: {
                foo: {
                    type: String,
                    required: true,
                },

                bar: {
                    type: Number,
                    required: true,
                },
            },

            customOption: {
                getString() {
                    return '1';
                },

                getNumber: () => 1,
            },

            data: () => ({
                title: '',

                message: '',
            }),
        }
        </script>
      `,
      output: `
        <script>
        export default {
            name: 'CustomOptions',

            props: {
                foo: {
                    type: String,
                    required: true,
                },

                bar: {
                    type: Number,
                    required: true,
                },
            },

            customOption: {
                getString() {
                    return '1';
                },
                getNumber: () => 1,
            },

            data: () => ({
                title: '',

                message: '',
            }),
        }
        </script>
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: {
            props: {
              betweenItems: 'always',
              withinEach: 'never'
            },
            customOption: {
              betweenItems: 'never'
            }
          }
        }
      ],
      errors: [
        {
          message: 'Unexpected blank line before this definition.',
          line: 23,
          column: 17,
          endLine: 23,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'NewVue.js',
      code: `
        new Vue({
          name: 'NewVue',

          inheritAttrs: false,

          props: {
              foo: {
                  type: String,
                  required: true,
              },
              bar: {
                  type: String,
                  required: true,
              }
          },
          customOption: {
              getString() { return '1' },
              getNumber: () => 1,
          },
        })
      `,
      output: `
        new Vue({
          name: 'NewVue',
          inheritAttrs: false,

          props: {
              foo: {
                  type: String,
                  required: true,
              },
              bar: {
                  type: String,
                  required: true,
              }
          },

          customOption: {
              getString() { return '1' },
              getNumber: () => 1,
          },
        })
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: 'ignore',
          groupSingleLineProperties: true
        }
      ],
      errors: [
        {
          message: 'Unexpected blank line between single line properties.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 30
        },
        {
          message: 'Expected blank line before this definition.',
          line: 17,
          column: 11,
          endLine: 20,
          endColumn: 12
        }
      ]
    },
    {
      filename: 'Mixin.js',
      code: `
        Vue.mixin({
          name: 'NewVue',
          inheritAttrs: false,
          props: {
              foo: {
                  type: String,
                  required: true,
              },
              bar: {
                  type: String,
                  required: true,
              }
          },
          customOption: {
              getString() { return '1' },
              getNumber: () => 1,
          },
        })
      `,
      output: `
        Vue.mixin({
          name: 'NewVue',

          inheritAttrs: false,

          props: {
              foo: {
                  type: String,
                  required: true,
              },
              bar: {
                  type: String,
                  required: true,
              }
          },

          customOption: {
              getString() { return '1' },
              getNumber: () => 1,
          },
        })
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: 'ignore',
          groupSingleLineProperties: false
        }
      ],
      errors: [
        {
          message: 'Expected blank line before this definition.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 30
        },
        {
          message: 'Expected blank line before this definition.',
          line: 5,
          column: 11,
          endLine: 14,
          endColumn: 12
        },
        {
          message: 'Expected blank line before this definition.',
          line: 15,
          column: 11,
          endLine: 18,
          endColumn: 12
        }
      ]
    },
    {
      filename: 'DefineProps.vue',
      code: `
        import { defineProps } from 'vue'
        <script setup>
        const props = defineProps({
            foo: {
                type: String,

                required: true,
            },
            bar: {
                type: String,
                required: true,
            },
        })
        </script>
      `,
      output: `
        import { defineProps } from 'vue'
        <script setup>
        const props = defineProps({
            foo: {
                type: String,
                required: true,
            },

            bar: {
                type: String,
                required: true,
            },
        })
        </script>
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: {
            props: {
              betweenItems: 'always',
              withinEach: 'never'
            }
          }
        }
      ],
      errors: [
        {
          message: 'Unexpected blank line before this definition.',
          line: 8,
          column: 17,
          endLine: 8,
          endColumn: 31
        },
        {
          message: 'Expected blank line before this definition.',
          line: 10,
          column: 13,
          endLine: 13,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'DefineEmits.vue',
      code: `
        import { defineEmits } from 'vue'
        <script setup>
        const emits = defineEmits(['foo', 'bar']);
        const emitsObject = defineEmits({
          change: (id) => typeof id == 'number',

          update: (value) => typeof value == 'string'
        })
        </script>
      `,
      output: `
        import { defineEmits } from 'vue'
        <script setup>
        const emits = defineEmits(['foo', 'bar']);
        const emitsObject = defineEmits({
          change: (id) => typeof id == 'number',
          update: (value) => typeof value == 'string'
        })
        </script>
      `,
      options: ['never'],
      errors: [
        {
          message: 'Unexpected blank line before this definition.',
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 54
        }
      ]
    },
    {
      filename: 'WithinOption.vue',
      code: `
        import { defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'PropertiesInOneLine',props: {
                foo: {
                    type: String,
                    required: true,
                },bar: {
                    type: Number,
                    required: true,
                },
            },
        })
        </script>
      `,
      output: `
        import { defineComponent } from 'vue';
        <script>
        export default defineComponent({
            name: 'PropertiesInOneLine',

            props: {
                foo: {
                    type: String,
                    required: true,
                },

                bar: {
                    type: Number,
                    required: true,
                },
            },
        })
        </script>
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: {
            props: {
              betweenItems: 'always',
              withinEach: 'always'
            }
          },
          groupSingleLineProperties: true
        }
      ],
      errors: [
        {
          message: 'Expected blank line before this definition.',
          line: 5,
          column: 41,
          endLine: 13,
          endColumn: 14
        },
        {
          message: 'Expected blank line before this definition.',
          line: 9,
          column: 19,
          endLine: 12,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'Comment.vue',
      code: `
        <script>
        export default {
            name: 'Comment',
            props: {
                a: {
                    type: String,
                },
                /** JSDoc */
                b: {
                    type: String,
                },
                // foo
                c: {
                    type: String,
                },

                /* block */
                d: String,

                /* block */
                f: String,
            }
        }
        </script>
      `,
      output: `
        <script>
        export default {
            name: 'Comment',

            props: {
                a: {
                    type: String,
                },

                /** JSDoc */
                b: {
                    type: String,
                },

                // foo
                c: {
                    type: String,
                },

                /* block */
                d: String,
                /* block */
                f: String,
            }
        }
        </script>
      `,
      options: ['always'],
      errors: [
        {
          message: 'Expected blank line before this definition.',
          line: 5,
          column: 13,
          endLine: 23,
          endColumn: 14
        },
        {
          message: 'Expected blank line before this definition.',
          line: 9,
          column: 17,
          endLine: 9,
          endColumn: 29
        },
        {
          message: 'Expected blank line before this definition.',
          line: 13,
          column: 17,
          endLine: 13,
          endColumn: 23
        },
        {
          message: 'Unexpected blank line between single line properties.',
          line: 21,
          column: 17,
          endLine: 21,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'Spread.vue',
      code: `
        <script>
        export default {
            name: 'Spread',
            ...spread,
            props: {
                a: {
                    type: String,
                },
                ...lost,
                b: {
                    type: String,
                }
            }
        }
        </script>
      `,
      output: `
        <script>
        export default {
            name: 'Spread',
            ...spread,

            props: {
                a: {
                    type: String,
                },

                ...lost,

                b: {
                    type: String,
                }
            }
        }
        </script>
      `,
      options: ['always'],
      errors: [
        {
          message: 'Expected blank line before this definition.',
          line: 6,
          column: 13,
          endLine: 14,
          endColumn: 14
        },
        {
          message: 'Expected blank line before this definition.',
          line: 10,
          column: 17,
          endLine: 10,
          endColumn: 24
        },
        {
          message: 'Expected blank line before this definition.',
          line: 11,
          column: 17,
          endLine: 13,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'DefineWithSpreadAndComment.vue',
      code: `
        import { defineEmits, defineProps } from 'vue'
        <script setup>
        const emits = defineEmits(['foo', 'bar']);
        const emitsObject = defineEmits({
          change: (id) => typeof id == 'number',
          ...spread,
          update: (value) => typeof value == 'string'
        })
        const props = defineProps({
            foo: {
                type: String,
                required: true,
            },

            // comment
            bar: {
                type: String,
                required: true,
            },
        })
        </script>
      `,
      output: `
        import { defineEmits, defineProps } from 'vue'
        <script setup>
        const emits = defineEmits(['foo', 'bar']);
        const emitsObject = defineEmits({
          change: (id) => typeof id == 'number',

          ...spread,

          update: (value) => typeof value == 'string'
        })
        const props = defineProps({
            foo: {
                type: String,
                required: true,
            },
            // comment
            bar: {
                type: String,
                required: true,
            },
        })
        </script>
      `,
      options: [
        {
          betweenOptions: 'always',
          withinOption: {
            emits: 'always',
            props: 'never'
          },
          groupSingleLineProperties: false
        }
      ],
      errors: [
        {
          message: 'Expected blank line before this definition.',
          line: 7,
          column: 11,
          endLine: 7,
          endColumn: 20
        },
        {
          message: 'Expected blank line before this definition.',
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 54
        },
        {
          message: 'Unexpected blank line before this definition.',
          line: 16,
          column: 13,
          endLine: 16,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'MyComment.vue',
      code: `
        <script setup>
        defineOptions({
            name: 'MyComment',
            inheritAttrs: false,
        })
        </script>
      `,
      output: `
        <script setup>
        defineOptions({
            name: 'MyComment',

            inheritAttrs: false,
        })
        </script>
      `,
      options: [{ betweenOptions: 'always', groupSingleLineProperties: false }],
      errors: [
        {
          message: 'Expected blank line before this definition.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 32
        }
      ]
    }
  ]
})
