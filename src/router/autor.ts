const names = {
  list: 'AutorList',
  create: 'AutorCreate',
  update: 'AutorUpdate',
  show: 'AutorShow',
}

const breadcrumbs = {
  list: { title: 'Listar Autores(as)', to: { name: names.list } },
  create: { title: 'Cadastrar Autor(a)', to: { name: names.create } },
  update: { title: 'Atualizar Autor(a)', to: { name: names.update } },
  show: { title: 'Visualizar Autor(a)', to: { name: names.show } },
}

export default [
  {
    name: names.list,
    path: '/autors',
    component: () => import('@/views/autor/ViewList.vue'),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: '/autors/create',
    component: () => import('@/views/autor/ViewCreate.vue'),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: '/autors/edit/:id',
    component: () => import('@/views/autor/ViewUpdate.vue'),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: '/autors/show/:id',
    component: () => import('@/views/autor/ViewShow.vue'),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
]
