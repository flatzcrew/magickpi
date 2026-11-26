import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { KipiLauncher, MatrixRow, Sidebar, Switcher, TabNav, Table, TaskRow, Toast } from '../components'
import type { KipiAvatarState, KipiLauncherState, SidebarSection, TableRow } from '../components'
import { EMPLOYEES, KPIS, TASKS, fmtPct, scaleScore } from './screens/data'
import type { Kpi, Task } from './screens/data'
import { KipiPage } from './screens/KipiPage'
import type { Role } from './screens/KipiPage'
import { EmployeeMatrixPanel, KpiCardPanel, TaskCardPanel, TaskClosePanel } from './screens/panels'
import s from './Sandboxes.module.css'

/**
 * Экраны и окна из макетов kpi-bro · web — как маленькое приложение: сайдбар переключает экраны
 * (Ассистент Кипи — SCR-13, Моя матрица, Сотрудники, Задачи), окна открываются панелью справа поверх
 * затемнённого экрана (локальный TaskCreatePanel: карточка задачи 276:19739, закрытие 290:14897, показатель 272:17842).
 * Над экраном — роль: руководитель или сотрудник. Кипи есть у всех сотрудников независимо от роли
 * (решение дизайнера 2026-11-26): пункт «Ассистент Кипи» в меню и кнопка Кипи в правом нижнем углу каждого экрана,
 * кнопка повторяет состояние Кипи (думает, нашёл, ошибка). Всё собрано из компонентов базы.
 */
const meta = {
  title: 'Sandboxes/Окна из макетов',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', liveArgs: false },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type Page = 'kipi' | 'matrix' | 'team' | 'tasks'

const USERS: Record<Role, { name: string; subtitle: string; initials: string }> = {
  manager: { name: 'Андрей Смирнов', subtitle: 'Руководитель отдела', initials: 'АС' },
  employee: { name: 'Пётр Сидоров', subtitle: 'Торговый представитель', initials: 'ПС' },
}

/** Меню по роли: Кипи и матрица — у всех; «Сотрудники» — только у руководителя. */
const nav = (role: Role): SidebarSection[] => [
  {
    items: [
      { value: 'kipi', label: 'Ассистент Кипи', icon: 'ai' },
      { value: 'matrix', label: 'Моя матрица', icon: 'pie-chart' },
      ...(role === 'manager' ? [{ value: 'team', label: 'Сотрудники', icon: 'users' }] : []),
      { value: 'tasks', label: 'Задачи', icon: 'list', tag: role === 'manager' ? '8' : '2' },
    ],
  },
]

const TITLES: Record<Page, string> = { kipi: 'Ассистент Кипи', matrix: 'Моя матрица', team: 'Сотрудники', tasks: 'Задачи' }

/** KipiLauncher показывает idle · thinking · success · error; welcome у кнопки нет — тогда idle. */
const launcherState = (st: KipiAvatarState): KipiLauncherState => (st === 'welcome' ? 'idle' : st)

function App({ initialPage = 'kipi', initialRole = 'manager' }: { initialPage?: Page; initialRole?: Role }) {
  const [role, setRole] = useState<Role>(initialRole)
  const [page, setPage] = useState<Page>(initialPage)
  const [kipiState, setKipiState] = useState<KipiAvatarState>('welcome')
  const user = USERS[role]
  const current: Page = role === 'employee' && page === 'team' ? 'matrix' : page

  return (
    <div className={s.canvas}>
      <div className={s.row}>
        <span className="ui-body-1-medium">Роль:</span>
        <Switcher
          size="sm"
          items={[
            { value: 'manager', label: 'Руководитель' },
            { value: 'employee', label: 'Сотрудник' },
          ]}
          value={role}
          onChange={(v) => setRole(v as Role)}
        />
      </div>
      <div className={s.desktop}>
        <div className={s.desktopNav}>
          <Sidebar
            title="Magic KPI"
            subtitle="ver. 1.0"
            headerAction={{ icon: 'panel', 'aria-label': 'Свернуть меню' }}
            cta={false}
            sections={nav(role)}
            value={current}
            onChange={(v) => setPage(v as Page)}
            activeType="active-neutral"
            profile={{ name: user.name, subtitle: user.subtitle, initials: user.initials, icon: 'edit-note' }}
          />
        </div>
        {/* Экран Кипи не размонтируется при переходах: диалог и состояние Кипи живут, пока открыт портал (key — новый диалог при смене роли) */}
        <div className={s.pageSlot} hidden={current !== 'kipi'}>
          <KipiPage key={role} role={role} name={user.name} onStateChange={setKipiState} />
        </div>
        {current !== 'kipi' && (
          <main className={s.desktopMain}>
            <h1 className="ui-heading-4-medium">{TITLES[current]}</h1>
            {current === 'matrix' && <MatrixScreen />}
            {current === 'team' && <TeamScreen />}
            {current === 'tasks' && <TasksScreen role={role} />}
          </main>
        )}
        {/* Кипи на каждом экране у любой роли; на самом экране Кипи кнопки нет — чат уже открыт (SCR-13) */}
        {current !== 'kipi' && (
          <div className={s.launcher}>
            <KipiLauncher state={launcherState(kipiState)} onClick={() => setPage('kipi')} />
          </div>
        )}
      </div>
    </div>
  )
}

function Hint({ children }: { children: ReactNode }) {
  return <p className="ui-body-1-normal">{children}</p>
}

/* ---------- Задачи → карточка задачи → закрытие ---------- */

function TasksScreen({ role }: { role: Role }) {
  const [tasks, setTasks] = useState(role === 'manager' ? TASKS : TASKS.filter((t) => t.assignee.name === USERS.employee.name))
  const [open, setOpen] = useState<Task | null>(null)
  const [closing, setClosing] = useState<Task | null>(null)
  const [done, setDone] = useState<string | null>(null)
  return (
    <>
      <Hint>Нажмите на задачу — откроется её карточка; «Сменить статус» — окно закрытия задачи.</Hint>
      <div className={`${s.stack} ${s.clickableRows}`}>
        {tasks.map((t) => (
          <TaskRow
            key={t.id}
            title={t.title}
            meta={`${t.assignee.name} · план ${t.plan}`}
            status={t.status}
            primaryAction={null}
            secondaryAction={null}
            tabIndex={0}
            onClick={() => setOpen(t)}
            onKeyDown={(e) => e.key === 'Enter' && setOpen(t)}
          />
        ))}
      </div>
      <TaskCardPanel
        task={open}
        onClose={() => setOpen(null)}
        onChangeStatus={(t) => {
          setOpen(null)
          setClosing(t)
        }}
      />
      <TaskClosePanel
        task={closing}
        onClose={() => setClosing(null)}
        onDone={(fact) => {
          if (!closing) return
          setTasks((list) => list.map((x) => (x.id === closing.id ? { ...x, status: 'done', fact } : x)))
          setDone(closing.title)
          setClosing(null)
        }}
      />
      {done && (
        <div className={s.toasts}>
          <Toast state="success" icon="check" title="Задача закрыта" description={done} onClose={() => setDone(null)} />
        </div>
      )}
    </>
  )
}

/* ---------- Матрица → показатель строки → правка ---------- */

function MatrixScreen() {
  const [kpis, setKpis] = useState(KPIS)
  const [open, setOpen] = useState<Kpi | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  return (
    <>
      <Hint>Нажмите на показатель — справа откроются значения этой строки; «Изменить показатель» — правка названия, веса, плана и факта.</Hint>
      <div className={s.clickableRows}>
        {kpis.map((k) => (
          <MatrixRow
            key={k.id}
            level="item"
            name={k.name}
            status={k.status}
            statusLabel={fmtPct(scaleScore(k.completion))}
            values={{
              weight: `${k.weight}%`,
              plan: k.plan,
              fact: k.fact,
              completion: fmtPct(k.completion),
              score: fmtPct(scaleScore(k.completion)),
              weighted: fmtPct((scaleScore(k.completion) * k.weight) / 100),
            }}
            tabIndex={0}
            onClick={(e) => !(e.target as HTMLElement).closest('button, input, a') && setOpen(k)}
            onKeyDown={(e) => e.key === 'Enter' && setOpen(k)}
          />
        ))}
      </div>
      <KpiCardPanel
        kpi={open}
        onClose={() => setOpen(null)}
        onSave={(next) => {
          setKpis((list) => list.map((x) => (x.id === next.id ? next : x)))
          setOpen(next)
          setSaved(next.name)
        }}
      />
      {saved && (
        <div className={s.toasts}>
          <Toast state="success" icon="check" title="Показатель сохранён" description={saved} onClose={() => setSaved(null)} />
        </div>
      )}
    </>
  )
}

/* ---------- Сотрудники: таблица → матрица сотрудника или задача ---------- */

function TeamScreen() {
  const [tab, setTab] = useState('people')
  const [employee, setEmployee] = useState<(typeof EMPLOYEES)[number] | null>(null)
  const [kpi, setKpi] = useState<Kpi | null>(null)
  const [task, setTask] = useState<Task | null>(null)

  const peopleRows: TableRow[] = EMPLOYEES.map((e) => ({
    id: e.id,
    cells: { name: { children: e.name, description: e.role }, completion: fmtPct(e.completion), tasks: String(e.tasks) },
  }))
  const taskRows: TableRow[] = TASKS.map((t) => ({
    id: t.id,
    cells: { title: { children: t.title, description: t.assignee.name }, plan: t.plan, fact: t.fact },
  }))

  return (
    <>
      <TabNav
        items={[
          { value: 'people', label: 'Сотрудники' },
          { value: 'tasks', label: 'Задачи' },
        ]}
        value={tab}
        onChange={setTab}
      />
      <Hint>Нажмите на название или на свободное место строки: сотрудник — откроется его матрица, задача — карточка задачи.</Hint>
      {tab === 'people' ? (
        <Table
          columns={[
            { key: 'name', title: 'Сотрудник', width: 'minmax(0, 2fr)' },
            { key: 'completion', title: 'Итог месяца' },
            { key: 'tasks', title: 'Задач' },
          ]}
          rows={peopleRows}
          pagination={false}
          scroller={false}
          onRowClick={(r) => setEmployee(EMPLOYEES.find((e) => e.id === r.id) ?? null)}
        />
      ) : (
        <Table
          columns={[
            { key: 'title', title: 'Задача', width: 'minmax(0, 3fr)' },
            { key: 'plan', title: 'План' },
            { key: 'fact', title: 'Факт' },
          ]}
          rows={taskRows}
          pagination={false}
          scroller={false}
          onRowClick={(r) => setTask(TASKS.find((t) => t.id === r.id) ?? null)}
        />
      )}
      <EmployeeMatrixPanel employee={kpi ? null : employee} kpis={KPIS} onClose={() => setEmployee(null)} onOpenKpi={setKpi} />
      <KpiCardPanel kpi={kpi} onClose={() => setKpi(null)} />
      <TaskCardPanel task={task} onClose={() => setTask(null)} />
    </>
  )
}

/** Всё приложение: начинается с экрана Кипи (SCR-13) — чат с живыми состояниями; сайдбар переключает экраны, роль — сверху. */
export const AppKipi: Story = { name: 'Приложение · Ассистент Кипи', render: () => <App initialPage="kipi" /> }

/** То же глазами сотрудника: Кипи, матрица и задачи — те же; «Сотрудников» в меню нет. */
export const AppEmployee: Story = { name: 'Приложение · сотрудник', render: () => <App initialPage="kipi" initialRole="employee" /> }

/** Задачи: клик по задаче — карточка (276:19739), «Сменить статус» — закрытие (290:14897), «Закрыть» — Toast. */
export const Tasks: Story = { name: 'Задачи → карточка и закрытие', render: () => <App initialPage="tasks" /> }

/** Матрица: клик по показателю — значения этой строки списком справа; «Изменить показатель» — правка строки. */
export const Matrix: Story = { name: 'Матрица → показатель (правка)', render: () => <App initialPage="matrix" /> }

/** Сотрудники: строка сотрудника — его матрица (дальше — показатель), строка задачи — карточка задачи. */
export const FromTable: Story = { name: 'Таблица → матрица или задача', render: () => <App initialPage="team" /> }
