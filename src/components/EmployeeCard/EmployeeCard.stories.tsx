import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Matrix, Stack, Stateful, Width } from '../../catalog/Catalog'
import { DEMO_EMPLOYEE_CARD_FOOTER, EmployeeCard } from './EmployeeCard'

const STATES = ['default', 'hover', 'focus', 'selected'] as const
const FOOTERS = ['footer=false', 'footer=true'] as const
const KPI_STATUSES = ['done', 'progress', 'fail', 'nodata'] as const

/**
 * Карточка сотрудника в списках «Сотрудники» / «Подчинённые». Figma: kpi-bro · web, ext `EmployeeCard` `171:1455` —
 * Footer: false · true × State: default · hover · focus · selected = 8 ячеек; тексты name, role, footer; showStatus, showExpand.
 *
 * `KpiStatus` 1+1, аватар, имя и должность, кнопка › справа; с `footer` — подложка с подвалом.
 * Корень фокусируемый. Наведение и фокус — нативные; проп `state` только фиксирует состояние для сверки с Figma.
 * Выбор — булев `selected`.
 */
const meta = {
  title: 'Components/EmployeeCard',
  component: EmployeeCard,
  tags: ['autodocs'],
  args: {
    name: 'Иван Петров',
    role: 'Менеджер по продажам',
    showStatus: true,
    status: 'done',
    statusValue: '98%',
    showExpand: true,
    selected: false,
    onExpand: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    selected: { control: 'boolean' },
    name: { control: 'text' },
    role: { control: 'text' },
    footer: { control: 'text' },
    showStatus: { control: 'boolean' },
    status: { control: 'inline-radio', options: KPI_STATUSES },
    statusValue: { control: 'text' },
    showExpand: { control: 'boolean' },
    onExpand: { control: false },
    initials: { control: 'text' },
    avatarSrc: { control: 'text' },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Width size="md">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof EmployeeCard>

export default meta
type Story = StoryObj<typeof meta>

/** Обычная карточка: наведи и нажми Tab — состояния нативные. */
export const Default: Story = {}
/** С подвалом: число подчинённых и открытых заданий. */
export const WithFooter: Story = {
  args: { name: 'Анна Смирнова', role: 'Руководитель отдела продаж', footer: DEMO_EMPLOYEE_CARD_FOOTER, status: 'progress', statusValue: '79%' },
}
/** Выбранный сотрудник — его матрица открыта справа. */
export const Selected: Story = { args: { selected: true } }
/** Принудительный hover для сверки с Figma. */
export const Hover: Story = { args: { state: 'hover' } }
/** Принудительный focus для сверки с Figma. */
export const Focus: Story = { args: { state: 'focus' } }

/** Живой выбор: клик по карточке переключает `selected`. */
export const LiveSelect: Story = {
  render: (args) => (
    <Stateful initial={false}>{(v, set) => <EmployeeCard {...args} selected={v} onClick={() => set(!v)} />}</Stateful>
  ),
}

/** Матрица Footer × State — 8 ячеек; нижний ряд без принудительного состояния, наведение живое. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <Stack>
      <Block title="Footer × State">
        <Matrix
          rows={FOOTERS}
          cols={STATES}
          render={(f, st) => (
            <Width size="md">
              <EmployeeCard
                state={st}
                selected={st === 'selected'}
                name="Анна Смирнова"
                role="Руководитель отдела продаж"
                statusValue="79%"
                footer={f === 'footer=true' ? DEMO_EMPLOYEE_CARD_FOOTER : undefined}
              />
            </Width>
          )}
        />
      </Block>
      <Block title="Без state (наведи и нажми Tab — переход живой)">
        <Width size="md">
          <Stack>
            <Labeled label="footer=false">
              <EmployeeCard name="Иван Петров" role="Менеджер по продажам" status="done" statusValue="98%" />
            </Labeled>
            <Labeled label="footer=true">
              <EmployeeCard name="Иван Петров" role="Менеджер по продажам" status="done" statusValue="98%" footer={DEMO_EMPLOYEE_CARD_FOOTER} />
            </Labeled>
          </Stack>
        </Width>
      </Block>
    </Stack>
  ),
}
