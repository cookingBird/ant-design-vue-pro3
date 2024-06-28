import type { App, Component } from 'vue';
import FormPro from './components/FormPro/index.vue';
import ButtonGroupPro from './components/ButtonGroupPro/index.vue';
import TablePro from './components/TablePro/index.vue';
import GridLayout from './components/GridLayout/index.vue';
export * from './components/GridLayout/index.vue';

const components = [FormPro, ButtonGroupPro, TablePro, GridLayout] as (Component & {
  name: string;
})[];

export { FormPro, ButtonGroupPro, TablePro, GridLayout };

export default {
  install: function (app: App) {
    components.forEach((component) => {
      app.component(component.name, component);
    });
  },
};
