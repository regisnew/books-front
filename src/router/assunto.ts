const names = {
  list: 'AssuntoList',
  create: 'AssuntoCreate',
  update: 'AssuntoUpdate',
  show: 'AssuntoShow',
}

const breadcrumbs = {
  list: { title: 'Listar Assunto', to: { name: names.list } },
  create: { title: 'Cadastrar Assunto', to: { name: names.create } },
  update: { title: 'Atualizar Assunto', to: { name: names.update } },
  show: { title: 'Visualizar Assunto', to: { name: names.show } },
}

export default [
  {
    name: names.list,
    path: '/assuntos',
    component: () => import('@/views/assunto/ViewList.vue'),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: '/assuntos/create',
    component: () => import('@/views/assunto/ViewCreate.vue'),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: '/assuntos/edit/:id',
    component: () => import('@/views/assunto/ViewUpdate.vue'),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: '/assuntos/show/:id',
    component: () => import('@/views/assunto/ViewShow.vue'),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
]
