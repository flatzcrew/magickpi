import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful, Width } from '../../catalog/Catalog'
import { TaskCard } from './TaskCard'

const STATUSES = ['on-approval', 'in-progress', 'done', 'closed-plan', 'closed-fact', 'rejected'] as const
const STATES = ['default', 'hover', 'focus', 'selected'] as const

/**
 * Карточка SMART-задачи в узкой колонке матрицы сотрудника. Figma: kpi-bro · web, ext `TaskCard` `167:1582` —
 * Status 6 × State 4 = 24 ячейки; тексты title, description; showDescription, showAssignees.
 *
 * Чекбокс, заголовок и описание, `TaskStatus`; внизу — `MetaChip` (план, дата, исполнители) и действие по статусу:
 * on-approval — «Согласовать», done — «Закрыть», у трёх первых — ↗; у закрытых и отклонённых кнопок нет.
 * Корень фокусируемый. Наведение и фокус — нативные; `state` только фиксирует состояние для сверки с Figma.
 * Выбор — булев `selected`. Таблица задач — `TaskRow`.
 */
const meta = {
  title: 'Components/TaskCard',
  component: TaskCard,
  tags: ['autodocs'],
  args: {
    status: 'on-approval',
    selected: false,
    title: 'Согласовать план на декабрь',
    description: 'Выручка 1 200 000 ₽ и конверсия в сделку 25% для отдела продаж',
    plan: 'План: 1 200 000 ₽',
    date: 'от 26.11.2026',
    onSelectedChange: fn(),
    onAction: fn(),
    onOpen: fn(),
  },
  argTypes: {
    status: { control: 'select', options: STATUSES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    selected: { control: 'boolean' },
    onSelectedChange: { control: false },
    title: { control: 'text' },
    description: { control: 'text' },
    plan: { control: 'text' },
    date: { control: 'text' },
    assignees: { control: 'text' },
    onAction: { control: false },
    onOpen: { control: false },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Width size="md">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof TaskCard>

export default meta
type Story = StoryObj<typeof meta>

/** На согласовании: кнопка «Согласовать» и ↗. */
export const OnApproval: Story = { args: { status: 'on-approval' } }
/** В работе: только ↗. */
export const InProgress: Story = { args: { status: 'in-progress', title: 'Провести 20 встреч с клиентами', plan: 'План: 20' } }
/** Выполнена: кнопка «Закрыть» и ↗. */
export const Done: Story = { args: { status: 'done', title: 'Провести 20 встреч с клиентами', plan: 'План: 20' } }
/** Закрыта по плану — без действий. */
export const ClosedPlan: Story = { args: { status: 'closed-plan' } }
/** Закрыта по факту — без действий. */
export const ClosedFact: Story = { args: { status: 'closed-fact' } }
/** Отклонена — без действий. */
export const Rejected: Story = { args: { status: 'rejected' } }
/** Без описания, с исполнителями. */
export const WithAssignees: Story = { args: { description: null, assignees: '3 сотрудника' } }
/** Выбранная задача. */
export const Selected: Story = { args: { selected: true } }

/** Живой выбор: чекбокс переключает `selected`. */
export const LiveSelect: Story = {
  render: (args) => <Stateful initial={false}>{(v, set) => <TaskCard {...args} selected={v} onSelectedChange={set} />}</Stateful>,
}

/** Матрица Status × State — 24 ячейки; столбец live без state — наведение и выбор живые. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <Stack>
      <Block title="Status × State">
        <Matrix
          rows={STATUSES}
          cols={[...STATES, 'live'] as const}
          render={(status, st) => (
            <Width size="md">
              {st === 'live' ? (
                <Stateful initial={false}>
                  {(v, set) => <TaskCard status={status} selected={v} onSelectedChange={set} title="Согласовать план на декабрь" plan="План: 1 200 000 ₽" date="от 26.11.2026" />}
                </Stateful>
              ) : (
                <TaskCard
                  status={status}
                  state={st}
                  selected={st === 'selected'}
                  title="Согласовать план на декабрь"
                  plan="План: 1 200 000 ₽"
                  date="от 26.11.2026"
                />
              )}
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}
