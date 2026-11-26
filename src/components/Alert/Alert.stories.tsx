import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Stack, Width } from '../../catalog/Catalog'
import { Alert } from './Alert'

const STATES = ['default', 'info', 'success', 'warning', 'danger'] as const

/**
 * Баннер-сообщение в потоке страницы. Figma: кит, `Alert` `12074:6202` — State default · info · success · warning · danger, +11
 * (Icon, заголовок, Description, Button-1 secondary, Button-2 primary-light, Button-3 tertiary, Link, крестик, слот CTAs).
 * State в ките меняет только Button-2: success — `ButtonSuccess`, danger — `ButtonDanger`, остальные — `Button`.
 * Наведение и нажатие кнопок нативные. warning · danger получают role="alert", остальные — role="status".
 */
const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    state: 'default',
    icon: 'info',
    title: 'План на июнь ждёт согласования',
    description: 'Руководитель отдела продаж ещё не подтвердил 5 показателей.',
    primaryAction: { label: 'Открыть план', onClick: fn() },
    secondaryAction: { label: 'Напомнить', onClick: fn() },
    link: { label: 'Подробнее' },
    onClose: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: STATES },
    icon: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    primaryAction: { control: 'object' },
    secondaryAction: { control: 'object' },
    tertiaryAction: { control: 'object' },
    link: { control: 'object' },
    actions: { control: false },
    onClose: { control: false },
    closeLabel: { control: 'text' },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <Width size="xl">
          <Story />
        </Width>
      ),
  ],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { state: 'default' } }
/** Информация: новый период. */
export const Info: Story = {
  args: { state: 'info', title: 'Открыт период «Июль»', description: 'Можно заполнять план KPI на следующий месяц.' },
}
/** Успех: Button-2 — ButtonSuccess. */
export const Success: Story = {
  args: { state: 'success', icon: 'check', title: 'План согласован', description: 'Выполнение плана 98% — отличный результат.', primaryAction: { label: 'К результатам' } },
}
/** Предупреждение. */
export const Warning: Story = {
  args: { state: 'warning', title: 'Сумма весов 90%', description: 'Добавьте показатели до 100%, чтобы отправить план.', primaryAction: { label: 'Добавить показатель' } },
}
/** Ошибка: Button-2 — ButtonDanger. */
export const Danger: Story = {
  args: { state: 'danger', icon: 'cross', title: 'План отклонён', description: 'Руководитель вернул план с комментарием.', primaryAction: { label: 'Исправить' } },
}
/** Tertiary-кнопка слева вместо ссылки. */
export const WithTertiary: Story = { args: { link: undefined, tertiaryAction: { label: 'Скрыть до завтра', onClick: fn() } } }

/** Все State с полным набором действий. */
export const AllVariants: Story = {
  parameters: { layout: 'padded', bare: true },
  render: () => (
    <Stack>
      <Block title="State">
        <Stack>
          {STATES.map((st) => (
            <Labeled key={st} label={st}>
              <Width size="xl">
                <Alert
                  state={st}
                  icon="info"
                  title="План на июнь ждёт согласования"
                  description="Руководитель ещё не подтвердил 5 показателей"
                  primaryAction={{ label: 'Открыть план' }}
                  secondaryAction={{ label: 'Напомнить' }}
                  link={{ label: 'Подробнее' }}
                  onClose={() => {}}
                />
              </Width>
            </Labeled>
          ))}
        </Stack>
      </Block>
    </Stack>
  ),
}
