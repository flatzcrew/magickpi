import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Stack, Stateful, Width } from '../../catalog/Catalog'
import { TaskRow } from './TaskRow'

const STATUSES = ['on-approval', 'in-progress', 'done', 'closed-plan', 'closed-fact', 'rejected'] as const
const STATES = ['default', 'hover', 'focus', 'selected'] as const

/**
 * Строка SMART-задачи в таблице задач. Figma: kpi-bro · web, ext `TaskRow` `176:2263` —
 * Selectable: false · true × State: default · hover · focus · selected (selected только при Selectable=true) — 7 ячеек;
 * тексты title, meta; showAction1, showAction2 (в React — `primaryAction` / `secondaryAction`, `null` скрывает кнопку).
 *
 * Корень фокусируемый. Наведение и фокус — нативные; `state` только фиксирует состояние для сверки с Figma.
 * Выбор — булев `selected` при `selectable`. Карточка в колонке — `TaskCard`; строка показателя — `MatrixRow`.
 */
const meta = {
  title: 'Components/TaskRow',
  component: TaskRow,
  tags: ['autodocs'],
  args: {
    selectable: false,
    selected: false,
    title: 'Согласовать план на декабрь',
    meta: 'Иван Петров · план 1 200 000 ₽ · отправлена 26 ноября',
    status: 'on-approval',
    primaryAction: { label: 'Согласовать', onClick: fn() },
    secondaryAction: { label: 'Отклонить', onClick: fn() },
    onSelectedChange: fn(),
  },
  argTypes: {
    selectable: { control: 'boolean' },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    selected: { control: 'boolean' },
    onSelectedChange: { control: false },
    title: { control: 'text' },
    meta: { control: 'text' },
    status: { control: 'select', options: STATUSES },
    primaryAction: { control: 'object' },
    secondaryAction: { control: 'object' },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <Width size="xl">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof TaskRow>

export default meta
type Story = StoryObj<typeof meta>

/** Строка на согласовании: «Согласовать» и «Отклонить». */
export const Default: Story = {}
/** С чекбоксом для массового выбора. */
export const Selectable: Story = { args: { selectable: true } }
/** Выбранная строка (только при selectable). */
export const Selected: Story = { args: { selectable: true, selected: true } }
/** Одна кнопка — задача выполнена, ждёт закрытия. */
export const OneAction: Story = {
  args: { status: 'done', title: 'Провести 20 встреч с клиентами', meta: 'Анна Смирнова · план 20 · факт 22', primaryAction: { label: 'Закрыть' }, secondaryAction: null },
}
/** Без кнопок — задача закрыта. */
export const NoActions: Story = { args: { status: 'closed-fact', primaryAction: null, secondaryAction: null } }

/** Живой выбор: чекбокс переключает `selected`. */
export const LiveSelect: Story = {
  args: { selectable: true },
  render: (args) => <Stateful initial={false}>{(v, set) => <TaskRow {...args} selected={v} onSelectedChange={set} />}</Stateful>,
}

/** Selectable × State — 7 ячеек, статусы задачи и строки без state с живым наведением. */
export const AllVariants: Story = {
  decorators: [],
  render: () => (
    <Stack>
      <Block title="Selectable=false × State">
        <Width size="xl">
          <Stack>
            {(['default', 'hover', 'focus'] as const).map((st) => (
              <Labeled key={st} label={st}>
                <TaskRow state={st} title="Согласовать план на декабрь" meta="Иван Петров · план 1 200 000 ₽" />
              </Labeled>
            ))}
          </Stack>
        </Width>
      </Block>
      <Block title="Selectable=true × State">
        <Width size="xl">
          <Stack>
            {STATES.map((st) => (
              <Labeled key={st} label={st}>
                <TaskRow selectable state={st} selected={st === 'selected'} title="Согласовать план на декабрь" meta="Иван Петров · план 1 200 000 ₽" />
              </Labeled>
            ))}
          </Stack>
        </Width>
      </Block>
      <Block title="Status (без state — наведи, нажми Tab и чекбокс, переход живой)">
        <Width size="xl">
          <Stack>
            {STATUSES.map((status) => (
              <Labeled key={status} label={status}>
                <Stateful initial={false}>
                  {(v, set) => (
                    <TaskRow selectable status={status} selected={v} onSelectedChange={set} title="Провести 20 встреч с клиентами" meta="Анна Смирнова · план 20" />
                  )}
                </Stateful>
              </Labeled>
            ))}
          </Stack>
        </Width>
      </Block>
    </Stack>
  ),
}
