import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, IconButton, Table, Toast, Tooltip } from '../components'
import type { TableRow, TagType, ToastState } from '../components'
import { EmployeeMatrixPanel, KpiCardPanel } from './screens/panels'
import { KPIS } from './screens/data'
import type { Kpi } from './screens/data'
import s from './Sandboxes.module.css'

/**
 * Песочница «Данные и обратная связь»: Table + Toast + Tooltip.
 * Отметь сотрудников в таблице — «Отправить на согласование» станет доступна и покажет Toast;
 * без отметок кнопка недоступна, «Напомнить» без отметок даёт предупреждение. Tooltip — у «?» по наведению и фокусу.
 * Клик по имени или свободному месту строки — матрица сотрудника (панель как в макетах), из неё — карточка показателя.
 */
const meta = {
  title: 'Sandboxes/Данные и обратная связь',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

interface Employee {
  id: string
  name: string
  role: string
  completion: string
  status: { label: string; type: TagType }
}

const EMPLOYEES: Employee[] = [
  { id: '1', name: 'Иван Петров', role: 'Менеджер по продажам', completion: '98%', status: { label: 'Выполнен', type: 'success' } },
  { id: '2', name: 'Анна Смирнова', role: 'Руководитель отдела', completion: '112%', status: { label: 'Выполнен', type: 'success' } },
  { id: '3', name: 'Олег Кузнецов', role: 'Менеджер по продажам', completion: '74%', status: { label: 'В процессе', type: 'warning' } },
  { id: '4', name: 'Мария Иванова', role: 'Аккаунт-менеджер', completion: '41%', status: { label: 'Не выполнен', type: 'danger' } },
  { id: '5', name: 'Дмитрий Орлов', role: 'Стажёр', completion: '—', status: { label: 'Нет данных', type: 'neutral' } },
]

interface Note {
  id: number
  state: ToastState
  title: string
  description: string
}

function DataSandbox() {
  const [selected, setSelected] = useState<string[]>(['1'])
  const [notes, setNotes] = useState<Note[]>([])
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState<string | null>(null)
  const [kpi, setKpi] = useState<Kpi | null>(null)
  const opened = EMPLOYEES.find((e) => e.id === openId)

  const push = (n: Omit<Note, 'id'>) => setNotes((list) => [...list.slice(-2), { ...n, id: Date.now() }])
  const toggle = (id: string, on: boolean) => setSelected((list) => (on ? [...list, id] : list.filter((x) => x !== id)))
  const allOn = selected.length === EMPLOYEES.length

  const rows: TableRow[] = EMPLOYEES.map((e) => ({
    id: e.id,
    cells: {
      name: {
        checkbox: { checked: selected.includes(e.id), onChange: (ev) => toggle(e.id, ev.target.checked), 'aria-label': e.name },
        children: e.name,
        description: e.role,
      },
      completion: e.completion,
      status: { tags: [{ label: e.status.label, type: e.status.type }] },
    },
  }))

  return (
    <div className={s.canvas}>
      <div className={`${s.card} ${s.relative}`}>
        <div className={s.row}>
          <h2 className="ui-heading-1-semibold">Итоги ноября · Отдел продаж</h2>
          <span className={s.tipAnchor}>
            <IconButton type="flat" size="sm" icon="help" aria-label="Как считается выполнение" />
            <span className={s.tip}>
              <Tooltip
                direction="top-left"
                icon="info"
                heading="Как считается выполнение"
                description="Сумма взвешенных оценок по всем показателям матрицы сотрудника за месяц"
              />
            </span>
          </span>
        </div>
        <Table
          columns={[
            {
              key: 'name',
              title: 'Сотрудник',
              width: 'minmax(0, 2fr)',
              header: {
                checkbox: {
                  checked: allOn,
                  indeterminate: selected.length > 0 && !allOn,
                  onChange: (ev) => setSelected(ev.target.checked ? EMPLOYEES.map((e) => e.id) : []),
                  'aria-label': 'Выбрать всех',
                },
              },
            },
            { key: 'completion', title: 'Выполнение' },
            { key: 'status', title: 'Статус' },
          ]}
          rows={rows}
          pagination={{ page: 'less-pages', current: page, total: 3, onChange: setPage }}
          onRowClick={(r) => setOpenId(r.id)}
        />
        <div className={`${s.row} ${s.end}`}>
          <Button
            type="secondary"
            onClick={() =>
              selected.length
                ? push({ state: 'info', title: 'Напоминание отправлено', description: `Сотрудников: ${selected.length}` })
                : push({ state: 'warning', title: 'Никто не выбран', description: 'Отметьте сотрудников в таблице' })
            }
          >
            Напомнить
          </Button>
          <Button
            disabled={!selected.length}
            onClick={() => {
              push({ state: 'success', title: 'Итоги отправлены на согласование', description: `Сотрудников: ${selected.length} · Ноябрь 2026` })
              setSelected([])
            }}
          >
            Отправить на согласование
          </Button>
        </div>
        <EmployeeMatrixPanel
          employee={opened && !kpi ? { name: opened.name, role: opened.role, initials: opened.name.split(' ').map((w) => w[0]).join(''), completion: parseFloat(opened.completion) || 0 } : null}
          kpis={KPIS}
          onClose={() => setOpenId(null)}
          onOpenKpi={setKpi}
        />
        <KpiCardPanel kpi={kpi} onClose={() => setKpi(null)} />
        {notes.length > 0 && (
          <div className={s.toasts}>
            {notes.map((n) => (
              <Toast
                key={n.id}
                state={n.state}
                icon={n.state === 'success' ? 'check' : n.state === 'warning' ? 'alert' : 'info'}
                title={n.title}
                description={n.description}
                onClose={() => setNotes((list) => list.filter((x) => x.id !== n.id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** Таблица итогов с выбором строк, подсказкой и уведомлениями. */
export const Default: Story = { name: 'Итоги месяца', render: () => <DataSandbox /> }
