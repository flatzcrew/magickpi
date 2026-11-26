import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination, Sidebar, TabNav, TopNav } from '../components'
import type { SidebarSection, SidebarState } from '../components'
import s from './Sandboxes.module.css'

/**
 * Песочница «Навигация»: Sidebar + TopNav + TabNav + Pagination в одном экране.
 * Пункт сайдбара меняет раздел, кнопка в шапке сворачивает сайдбар, период и вкладка переключаются,
 * пагинация листает страницы. В ките нет Navbar и Breadcrumb — их роль здесь у Sidebar и TopNav.
 */
const meta = {
  title: 'Sandboxes/Навигация',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SECTIONS: SidebarSection[] = [
  {
    heading: 'KPI',
    items: [
      { value: 'my', label: 'Мои KPI', icon: 'analytics' },
      { value: 'team', label: 'Команда', icon: 'users', tag: '12' },
      { value: 'matrix', label: 'Матрица', icon: 'all' },
      { value: 'tasks', label: 'Задачи', icon: 'tick', tag: '3' },
    ],
  },
  {
    heading: 'Отчёты',
    items: [
      { value: 'results', label: 'Итоги месяца', icon: 'chart' },
      { value: 'archive', label: 'Архив', icon: 'folder' },
    ],
  },
]

const TITLES: Record<string, string> = {
  my: 'Мои KPI',
  team: 'Команда',
  matrix: 'Матрица',
  tasks: 'Задачи',
  results: 'Итоги месяца',
  archive: 'Архив',
}

function NavigationSandbox({ initialState }: { initialState: SidebarState }) {
  const [state, setState] = useState<SidebarState>(initialState)
  const [section, setSection] = useState('team')
  const [period, setPeriod] = useState('month')
  const [tab, setTab] = useState('kpi')
  const [page, setPage] = useState(3)

  return (
    <div className={s.canvas}>
      <div className={s.app}>
        <Sidebar
          state={state}
          title="KPI Bro"
          subtitle="Отдел продаж"
          cta={{ label: 'Добавить KPI', icon: 'plus' }}
          headerAction={{
            icon: state === 'expanded' ? 'panel' : 'panel-filled',
            'aria-label': state === 'expanded' ? 'Свернуть меню' : 'Развернуть меню',
            onClick: () => setState((x) => (x === 'expanded' ? 'collapsed-compact' : 'expanded')),
          }}
          sections={SECTIONS}
          value={section}
          onChange={setSection}
          profile={{ name: 'Анна Смирнова', subtitle: 'Руководитель отдела', initials: 'АС' }}
          themes={false}
        />
        <main className={s.appMain}>
          <div className={s.row}>
            <h2 className="ui-heading-1-semibold">{TITLES[section]}</h2>
          </div>
          <TopNav
            items={[
              { value: 'month', label: 'Месяц' },
              { value: 'quarter', label: 'Квартал' },
              { value: 'year', label: 'Год' },
            ]}
            value={period}
            onChange={setPeriod}
          />
          <TabNav
            items={[
              { value: 'kpi', label: 'Показатели' },
              { value: 'tasks', label: 'Задачи', secondaryText: '3' },
              { value: 'history', label: 'История' },
            ]}
            value={tab}
            onChange={setTab}
          />
          <p className={`ui-body-1-normal ${s.muted}`}>
            Раздел «{TITLES[section]}» · период: {period === 'month' ? 'Ноябрь 2026' : period === 'quarter' ? 'IV квартал 2026' : '2026 год'} · вкладка:{' '}
            {tab === 'kpi' ? 'Показатели' : tab === 'tasks' ? 'Задачи' : 'История'} · страница {page} из 12
          </p>
          <Pagination page="center" current={page} total={12} onChange={setPage} />
        </main>
      </div>
    </div>
  )
}

/** Сайдбар развёрнут. */
export const Expanded: Story = { name: 'Сайдбар развёрнут', render: () => <NavigationSandbox initialState="expanded" /> }

/** Сайдбар свёрнут до иконок. */
export const Collapsed: Story = { name: 'Сайдбар свёрнут', render: () => <NavigationSandbox initialState="collapsed-compact" /> }
