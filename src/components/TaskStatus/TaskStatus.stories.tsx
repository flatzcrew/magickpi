import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Row, Stack } from '../../catalog/Catalog'
import { TaskStatus } from './TaskStatus'

const STATUSES = ['on-approval', 'in-progress', 'done', 'closed-plan', 'closed-fact', 'rejected'] as const

/**
 * Статус SMART-задачи. Figma: kpi-bro · web, ext `TaskStatus` `164:707` — Status 6 ячеек.
 *
 * Собран из `Tag` кита (Size sm) с иконкой и подписью; цвет и иконка задаются статусом.
 * Не интерактивен — наведения и фокуса нет. Используется в `TaskCard` и `TaskRow`.
 * Статус KPI-показателя — отдельный компонент `KpiStatus`.
 */
const meta = {
  title: 'Components/TaskStatus',
  component: TaskStatus,
  tags: ['autodocs'],
  args: {
    status: 'on-approval',
  },
  argTypes: {
    status: { control: 'select', options: STATUSES },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TaskStatus>

export default meta
type Story = StoryObj<typeof meta>

/** Задача отправлена руководителю, ждёт решения. */
export const OnApproval: Story = { args: { status: 'on-approval' } }
/** Задача согласована, сотрудник работает. */
export const InProgress: Story = { args: { status: 'in-progress' } }
/** Сотрудник отметил выполнение, задача ждёт закрытия. */
export const Done: Story = { args: { status: 'done' } }
/** Руководитель закрыл задачу по плановому значению. */
export const ClosedPlan: Story = { args: { status: 'closed-plan' } }
/** Руководитель закрыл задачу по фактическому значению. */
export const ClosedFact: Story = { args: { status: 'closed-fact' } }
/** Руководитель отклонил задачу. */
export const Rejected: Story = { args: { status: 'rejected' } }

/** Все 6 статусов рядом для сверки с Figma. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Status">
        <Row>
          {STATUSES.map((st) => (
            <Labeled key={st} label={st}>
              <TaskStatus status={st} />
            </Labeled>
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}
