const names = {
  list: 'LivroList',
  create: 'LivroCreate',
  update: 'LivroUpdate',
  show: 'LivroShow',
}

const breadcrumbs = {
  list: { title: 'Listar Livros', to: { name: names.list } },
  create: { title: 'Cadastrar Livros', to: { name: names.create } },
  update: { title: 'Atualizar Livros', to: { name: names.update } },
  show: { title: 'Visualizar Livros', to: { name: names.show } },
}

export default [
  {
    name: names.list,
    path: '/livros',
    component: () => import('@/views/livro/ViewList.vue'),
    meta: {
      breadcrumb: [breadcrumbs.list],
    },
  },
  {
    name: names.create,
    path: '/livros/create',
    component: () => import('@/views/livro/ViewCreate.vue'),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.create],
    },
  },
  {
    name: names.update,
    path: '/livros/edit/:id',
    component: () => import('@/views/livro/ViewUpdate.vue'),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.update],
    },
  },
  {
    name: names.show,
    path: '/livros/show/:id',
    component: () => import('@/views/livro/ViewShow.vue'),
    meta: {
      breadcrumb: [breadcrumbs.list, breadcrumbs.show],
    },
  },
]
