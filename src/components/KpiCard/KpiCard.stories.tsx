import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Matrix, Stack, Stateful, Width } from '../../catalog/Catalog'
import { KpiCard } from './KpiCard'

const STATES = ['default', 'hover', 'focus', 'selected'] as const
const KPI_STATUSES = ['done', 'progress', 'fail', 'nodata'] as const

/**
 * Карточка группы KPI в краткой матрице в колонке. Figma: kpi-bro · web, ext `KpiCard` `171:1251` —
 * State: default · hover · focus · selected (4 ячейки); тексты name, sub, weight, plan, fact.
 *
 * Чекбокс, название и подпись, строка «Вес · План · Факт», `KpiStatus` и кнопка ↗ в полную матрицу.
 * Корень фокусируемый. Наведение и фокус — нативные; `state` только фиксирует состояние для сверки с Figma.
 * Выбор — булев `selected` (чекбокс отмечен). Полная таблица KPI — `MatrixRow`.
 */
const meta = {
  title: 'Components/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
  args: {
    name: 'Выручка',
    sub: 'KPI внутри: 3',
    weight: '30%',
    plan: '1 200 000 ₽',
    fact: '1 176 000 ₽',
    status: 'done',
    selected: false,
    onSelectedChange: fn(),
    onOpen: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    selected: { control: 'boolean' },
    onSelectedChange: { control: false },
    name: { control: 'text' },
    sub: { control: 'text' },
    weight: { control: 'text' },
    plan: { control: 'text' },
    fact: { control: 'text' },
    status: { control: 'inline-radio', options: KPI_STATUSES },
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
} satisfies Meta<typeof KpiCard>

export default meta
type Story = StoryObj<typeof meta>

/** Группа «Выручка»: план выполнен на 98%. */
export const Default: Story = {}
/** Выбранная группа: чекбокс отмечен. */
export const Selected: Story = { args: { selected: true } }
/** Принудительный hover для сверки с Figma. */
export const Hover: Story = { args: { state: 'hover' } }
/** Принудительный focus для сверки с Figma. */
export const Focus: Story = { args: { state: 'focus' } }
/** Группа в процессе выполнения. */
export const InProgress: Story = {
  args: { name: 'Конверсия в сделку', sub: 'KPI внутри: 2', weight: '20%', plan: '25%', fact: '18%', status: 'progress' },
}

/** Живой выбор: чекбокс переключает `selected`. */
export const LiveSelect: Story = {
  render: (args) => <Stateful initial={false}>{(v, set) => <KpiCard {...args} selected={v} onSelectedChange={set} />}</Stateful>,
}

/** State 4 ячейки и Status × State; ряд без state — наведение живое. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <Stack>
      <Block title="State">
        <Matrix
          rows={['Выручка'] as const}
          cols={STATES}
          render={(_, st) => (
            <Width size="md">
              <Stateful initial={st === 'selected'}>
                {(v, set) => <KpiCard state={st} selected={v} onSelectedChange={set} weight="30%" plan="1 200 000 ₽" fact="1 176 000 ₽" status="done" name="Выручка" />}
              </Stateful>
            </Width>
          )}
        />
      </Block>
      <Block title="Status (без state — наведи и нажми Tab, переход живой)">
        <Matrix
          rows={['live'] as const}
          cols={KPI_STATUSES}
          render={(_, st) => (
            <Width size="md">
              <Stateful initial={false}>
                {(v, set) => <KpiCard status={st} selected={v} onSelectedChange={set} name="Конверсия в сделку" weight="20%" plan="25%" fact="18%" />}
              </Stateful>
            </Width>
          )}
        />
      </Block>
      <Block title="Длинное название (до 2 строк)">
        <Width size="md">
          <Labeled label="name в 2 строки">
            <KpiCard name="Выручка от новых клиентов в регионе Северо-Запад за квартал" weight="30%" plan="1 200 000 ₽" fact="1 176 000 ₽" />
          </Labeled>
        </Width>
      </Block>
    </Stack>
  ),
}
