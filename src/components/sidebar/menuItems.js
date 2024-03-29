import i18n from '@/i18n'
// const separator = {
//   template: '<hr style="border-color: rgba(0, 0, 0, 0.1); margin: 20px;">',
// }

export const menuItems = () => [
  // {
  //   header: true,
  //   title: 'Alarms',
  // },
  // {
  //   href: '',
  //   title: 'Example Alarm',
  //   icon: 'far fa-bell',
  //   badge: {
  //     text: '2m ago',
  //   },
  // },
  // {
  //   href: '',
  //   title: 'Example Alarm',
  //   icon: 'far fa-bell',
  //   badge: {
  //     text: '10m ago',
  //   },
  // },
  // {
  //   component: separator,
  // },
  {
    header: true,
    title: i18n.t('sidebar.menu.title'),
  },
  {
    href: '/projects',
    title: i18n.t('sidebar.menu.contents.projects'),
    icon: 'fa fa-folder-open',
  },
  {
    href: '/contents',
    title: i18n.t('sidebar.menu.contents.contents'),
    icon: 'fa fa-image',
  },
  {
    href: '/feed',
    title: i18n.t('sidebar.menu.contents.feed'),
    icon: 'fa fa-bolt',
  },
  {
    href: '/create/project',
    title: i18n.t('sidebar.menu.contents.create-project'),
    icon: 'fa fa-hammer',
  },
  // {
  //   header: true,
  //   title: 'Example'
  // },
  // {
  //   href: '/disabled',
  //   title: 'Disabled page',
  //   icon: 'fa fa-lock',
  //   disabled: true
  // },
  // {
  //   href: '/badge',
  //   title: 'Badge',
  //   icon: 'fa fa-cog',
  //   badge: {
  //     text: 'new',
  //     class: 'art--badge_default'
  //   }
  // },
  // {
  //   href: '/page1',
  //   title: 'Dropdown Page',
  //   icon: 'fa fa-list-ul',
  //   child: [
  //     {
  //       href: '/page1/sub-page-1',
  //       title: 'Sub Page 01',
  //       icon: 'fa fa-file-alt'
  //     },
  //     {
  //       href: '/page1/sub-page-2',
  //       title: 'Sub Page 02',
  //       icon: 'fa fa-file-alt'
  //     }
  //   ]
  // },
  // {
  //   href: '/page2',
  //   title: 'Multiple Level',
  //   icon: 'fa fa-list-alt',
  //   child: [
  //     {
  //       href: '/page2/sub-page-1',
  //       title: 'page'
  //     },
  //     {
  //       title: 'Level 2 ',
  //       child: [
  //         {
  //           href: '/page2/sub-page-1/sub-sub-page-1',
  //           title: 'page'
  //         },
  //         {
  //           href: '/page2/sub-page-1/sub-sub-page-2',
  //           title: 'Page'
  //         }
  //       ]
  //     },
  //     {
  //       href: '/page2/sub-page-2',
  //       title: 'Page'
  //     },
  //     {
  //       title: 'Another Level 2',
  //       child: [
  //         {
  //           title: 'Level 3',
  //           child: [
  //             {
  //               title: 'Page'
  //             },
  //             {
  //               title: 'Page'
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
]
