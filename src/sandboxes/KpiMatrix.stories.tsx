import { Fragment, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BatchBar, KpiCard, MatrixRow, ResultBanner } from '../components'
import type { MatrixRowStatus, MatrixRowValues } from '../components'
import { KpiCardPanel } from './screens/panels'
import type { Kpi } from './screens/data'
import s from './Sandboxes.module.css'

/**
 * Песочница «KPI-матрица» — главный блок продукта: ResultBanner + MatrixRow (группы и показатели) + BatchBar + KpiCard.
 * Группы раскрываются, показатели отмечаются чекбоксами — BatchBar считает отмеченные и снимает отметки;
 * KpiCard рядом — те же показатели карточками, выбор синхронен с матрицей.
 * Клик по показателю (по названию или свободному месту строки) — карточка показателя как в макете (272:17842),
 * «Изменить показатель» — правка названия, веса, плана и факта; сохранение обновляет строку и карточку.
 */
const meta = {
  title: 'Sandboxes/KPI-матрица',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

interface Item {
  id: string
  name: string
  status: MatrixRowStatus
  values: MatrixRowValues
}

interface Group {
  id: string
  name: string
  status: MatrixRowStatus
  values: MatrixRowValues
  items: Item[]
}

const GROUPS: Group[] = [
  {
    id: 'sales',
    name: 'Продажи',
    status: 'done',
    values: { weight: '70%', plan: '—', fact: '—', completion: '—', score: '104%', weighted: '73%' },
    items: [
      { id: 'revenue', name: 'Выручка', status: 'done', values: { weight: '40%', plan: '1 200 000 ₽', fact: '1 176 000 ₽', completion: '98%', score: '98%', weighted: '39%' } },
      { id: 'conversion', name: 'Конверсия в сделку', status: 'done', values: { weight: '30%', plan: '20%', fact: '22%', completion: '110%', score: '110%', weighted: '33%' } },
    ],
  },
  {
    id: 'quality',
    name: 'Качество',
    status: 'progress',
    values: { weight: '30%', plan: '—', fact: '—', completion: '—', score: '80%', weighted: '24%' },
    items: [
      { id: 'nps', name: 'NPS клиентов', status: 'progress', values: { weight: '20%', plan: '60', fact: '51', completion: '85%', score: '85%', weighted: '17%' } },
      { id: 'crm', name: 'Заполнение CRM', status: 'fail', values: { weight: '10%', plan: '100%', fact: '70%', completion: '70%', score: '70%', weighted: '7%' } },
    ],
  },
]

const num = (v: unknown) => Number(String(v ?? '').replace(/[^d.,]/g, '').replace(',', '.')) || 0

/** Строка матрицы → данные карточки показателя (272:17842). */
const toKpi = (it: Item): Kpi => ({
  id: it.id,
  name: it.name,
  status: it.status,
  weight: num(it.values.weight),
  plan: String(it.values.plan ?? '—'),
  fact: String(it.values.fact ?? '—'),
  completion: num(it.values.completion),
  about: 'Описание показателя задаёт руководитель при сборке матрицы.',
  unit: '—',
  source: 'Ручной ввод',
})

function KpiMatrixSandbox() {
  const [expanded, setExpanded] = useState<string[]>(['sales'])
  const [selected, setSelected] = useState<string[]>([])
  const [groups, setGroups] = useState(GROUPS)
  const [openKpi, setOpenKpi] = useState<Kpi | null>(null)
  const allItems = groups.flatMap((g) => g.items)
  // Правка показателя из карточки — обновляет строку матрицы и карточку KpiCard
  const saveKpi = (k: Kpi) => {
    setGroups((list) =>
      list.map((g) => ({
        ...g,
        items: g.items.map((it) =>
          it.id === k.id ? { ...it, name: k.name, values: { ...it.values, weight: `${k.weight}%`, plan: k.plan, fact: k.fact } } : it,
        ),
      })),
    )
    setOpenKpi(k)
  }
  const openFromRow = (it: Item) => (e: { target: EventTarget }) => {
    if ((e.target as HTMLElement).closest('button, input, a, label')) return
    setOpenKpi(toKpi(it))
  }
  const toggle = (id: string, on: boolean) => setSelected((list) => (on ? [...list, id] : list.filter((x) => x !== id)))

  return (
    <div className={s.canvas}>
      <ResultBanner type="month-result" title="Ноябрь 2026 · выполнение 97%" status="progress" linkLabel="Подробнее" />

      <div className={s.card}>
        <h2 className="ui-heading-1-semibold">Матрица · Иван Петров</h2>
        <div>
          {groups.map((g) => {
            const open = expanded.includes(g.id)
            return (
              <Fragment key={g.id}>
                <MatrixRow
                  level="group"
                  name={g.name}
                  status={g.status}
                  values={g.values}
                  checked={g.items.every((it) => selected.includes(it.id))}
                  onCheckedChange={(on) =>
                    setSelected((list) => {
                      const rest = list.filter((x) => !g.items.some((it) => it.id === x))
                      return on ? [...rest, ...g.items.map((it) => it.id)] : rest
                    })
                  }
                  expanded={open}
                  onExpandedChange={(on) => setExpanded((list) => (on ? [...list, g.id] : list.filter((x) => x !== g.id)))}
                />
                {open &&
                  g.items.map((it) => (
                    <MatrixRow
                      key={it.id}
                      level="item"
                      name={it.name}
                      status={it.status}
                      statusLabel={it.values.score}
                      values={it.values}
                      showCompletion
                      checked={selected.includes(it.id)}
                      onCheckedChange={(on) => toggle(it.id, on)}
                      tabIndex={0}
                      className={s.pointer}
                      onClick={openFromRow(it)}
                      onKeyDown={(e) => e.key === 'Enter' && setOpenKpi(toKpi(it))}
                    />
                  ))}
              </Fragment>
            )
          })}
        </div>
        {selected.length > 0 && (
          <div className={s.batch}>
            <BatchBar
              count={`Выбрано: ${selected.length}`}
              clearAction={{ label: 'Снять выбор', onClick: () => setSelected([]) }}
              primaryAction={{ label: 'Изменить план', onClick: () => setSelected([]) }}
            />
          </div>
        )}
      </div>

      <div className={s.fields}>
        {allItems.map((it) => (
          <KpiCard
            key={it.id}
            name={it.name}
            sub="Ноябрь 2026"
            weight={it.values.weight}
            plan={it.values.plan}
            fact={it.values.fact}
            status={it.status}
            selected={selected.includes(it.id)}
            onSelectedChange={(on) => toggle(it.id, on)}
          />
        ))}
      </div>

      <KpiCardPanel kpi={openKpi} onClose={() => setOpenKpi(null)} onSave={saveKpi} />
    </div>
  )
}

/** Матрица сотрудника за месяц: раскрытие групп, выбор показателей, панель действий; клик по показателю — его карточка с правкой. */
export const Default: Story = { name: 'Матрица сотрудника', render: () => <KpiMatrixSandbox /> }
