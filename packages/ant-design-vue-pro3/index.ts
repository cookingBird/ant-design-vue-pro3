import type { App, Component } from 'vue';
import AFormPro from './components/FormPro/index.vue';
import AButtonGroup from './components/ButtonGroupPro/index.vue';
import ATablePro from './components/TablePro/index.vue';

const components = [AFormPro, AButtonGroup, ATablePro] as (Component & {
  name: string;
})[];

export default {
  install: function (app: App) {
    components.forEach((component) => {
      app.component(component.name, component);
    });
  },
};
