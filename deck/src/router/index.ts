import { createRouter, createWebHistory } from 'vue-router';
import DeckView from '../views/DeckView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/deck/0/-1'
    },
    {
      path: '/deck/:slide/:step',
      name: 'deck',
      component: DeckView
    }
  ]
});

export default router;
