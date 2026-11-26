import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Stack, Stateful, Width } from '../../catalog/Catalog'
import { DEMO_MATRIX_ROW_VALUES, MatrixRow } from './MatrixRow'

const STATES = ['default', 'hover', 'focus'] as const

/** Значения ячеек для показателя «Выручка» (вес 30%, план 1 200 000 ₽, факт 1 176 000 ₽). */
const REVENUE = { weight: '30%', plan: '1 200 000 ₽', fact: '1 176 000 ₽', completion: '98%', score: '98%', weighted: '29%' }
/** Значения ячеек для группы «Продажи». */
const SALES = { ...DEMO_MATRIX_ROW_VALUES.group, weight: '70%', score: '96%', weighted: '67%' }

/**
 * Строка матрицы KPI сотрудника (desktop). Figma: kpi-bro · web, ext `MatrixRow` `176:1831` —
 * Level: group · item × State: default · hover · focus × Expanded: false · true (только group) — 9 ячеек;
 * data (`noData`), showCompletion, showAction, showTasksLink (`tasksLink`), name.
 *
 * Ячейки: статус с чекбоксом · название (у группы — ссылка на задачи) · Вес · План · Факт · Выполнение · Оценка · Взвешенно · шеврон.
 * Корень фокусируемый. Наведение и фокус — нативные; `state` только фиксирует состояние для сверки с Figma.
 * Раскрытие группы — `expanded` + `onExpandedChange`. Карточка KPI в колонке (mobile) — `KpiCard`.
 */
const meta = {
  title: 'Components/MatrixRow',
  component: MatrixRow,
  tags: ['autodocs'],
  args: {
    level: 'item',
    name: 'Выручка',
    status: 'done',
    statusLabel: '98%',
    values: REVENUE,
    noData: false,
    showCompletion: true,
    showAction: false,
    actionLabel: 'Оценить',
    align: 'center',
    checked: false,
    expanded: false,
    onExpandedChange: fn(),
    onCheckedChange: fn(),
    onAction: fn(),
    onTasksLinkClick: fn(),
  },
  argTypes: {
    level: { control: 'inline-radio', options: ['group', 'item'] },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    expanded: { control: 'boolean' },
    onExpandedChange: { control: false },
    name: { control: 'text' },
    status: { control: 'inline-radio', options: ['done', 'progress', 'fail'] },
    statusLabel: { control: 'text' },
    noData: { control: 'boolean' },
    values: { control: 'object' },
    showCompletion: { control: 'boolean' },
    showAction: { control: 'boolean' },
    actionLabel: { control: 'text' },
    onAction: { control: false },
    tasksLink: { control: 'text' },
    onTasksLinkClick: { control: false },
    align: { control: 'inline-radio', options: ['center', 'end'] },
    checked: { control: 'boolean' },
    onCheckedChange: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MatrixRow>

export default meta
type Story = StoryObj<typeof meta>

/** Показатель внутри группы: «Выручка», выполнение плана 98%. */
export const Item: Story = {}
/** Группа KPI свёрнута. */
export const GroupCollapsed: Story = {
  args: { level: 'group', name: 'Продажи', status: 'progress', statusLabel: undefined, values: SALES, tasksLink: '3 задачи' },
}
/** Группа KPI раскрыта. */
export const GroupExpanded: Story = { args: { ...GroupCollapsed.args, expanded: true } }
/** Нет данных: статус nodata, ячейки «—». */
export const NoData: Story = { args: { noData: true, name: 'Конверсия в сделку' } }
/** Ряд «Оценка руководителя»: кнопка «Оценить» вместо значения, числа справа. */
export const ManagerScore: Story = {
  args: { name: 'Оценка руководителя', showCompletion: false, showAction: true, align: 'end', values: { weight: '10%', plan: '—', fact: '—', score: '—', weighted: '—' } },
}

/** Живая группа: шеврон раскрывает показатели, чекбоксы переключаются. */
export const LiveExpand: Story = {
  render: () => (
    <Stateful initial={false}>
      {(open, setOpen) => (
        <div>
          <Stateful initial={false}>
            {(v, set) => (
              <MatrixRow level="group" name="Продажи" values={SALES} tasksLink="3 задачи" expanded={open} onExpandedChange={setOpen} checked={v} onCheckedChange={set} />
            )}
          </Stateful>
          {open && (
            <>
              <Stateful initial={false}>
                {(v, set) => <MatrixRow level="item" name="Выручка" statusLabel="98%" values={REVENUE} checked={v} onCheckedChange={set} />}
              </Stateful>
              <Stateful initial={false}>
                {(v, set) => (
                  <MatrixRow
                    level="item"
                    name="Конверсия в сделку"
                    status="progress"
                    statusLabel="72%"
                    values={{ weight: '20%', plan: '25%', fact: '18%', completion: '72%', score: '0%', weighted: '0%' }}
                    checked={v}
                    onCheckedChange={set}
                  />
                )}
              </Stateful>
            </>
          )}
        </div>
      )}
    </Stateful>
  ),
}

/** Level × State × Expanded — 9 ячеек; последний блок без state — наведение, фокус и раскрытие живые. */
export const AllVariants: Story = {
  render: () => (
    <Stack>
      {STATES.map((st) => (
        <Block key={st} title={`State=${st}`}>
          <Width size="xl">
            <Stack>
              <Labeled label="group / collapsed">
                <MatrixRow level="group" state={st} name="Продажи" values={SALES} tasksLink="3 задачи" />
              </Labeled>
              <Labeled label="group / expanded">
                <MatrixRow level="group" state={st} expanded name="Продажи" values={SALES} tasksLink="3 задачи" />
              </Labeled>
              <Labeled label="item">
                <MatrixRow level="item" state={st} name="Выручка" statusLabel="98%" values={REVENUE} />
              </Labeled>
            </Stack>
          </Width>
        </Block>
      ))}
      <Block title="Без state (наведи, нажми Tab и шеврон — переход живой)">
        <Width size="xl">
          <Stack>
            <Stateful initial={false}>
              {(open, setOpen) => (
                <Stateful initial={false}>
                  {(v, set) => (
                    <MatrixRow level="group" name="Продажи" values={SALES} expanded={open} onExpandedChange={setOpen} checked={v} onCheckedChange={set} />
                  )}
                </Stateful>
              )}
            </Stateful>
            <Stateful initial={false}>
              {(v, set) => <MatrixRow level="item" name="Выручка" statusLabel="98%" values={REVENUE} checked={v} onCheckedChange={set} />}
            </Stateful>
            <Labeled label="noData">
              <MatrixRow level="item" name="Конверсия в сделку" noData />
            </Labeled>
            <Labeled label="status=fail">
              <MatrixRow level="item" name="Средний чек" status="fail" statusLabel="64%" values={{ weight: '10%', plan: '25 000 ₽', fact: '16 000 ₽', completion: '64%', score: '0%', weighted: '0%' }} />
            </Labeled>
          </Stack>
        </Width>
      </Block>
    </Stack>
  ),
}
