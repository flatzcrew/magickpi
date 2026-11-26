import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Width } from '../../catalog/Catalog'
import { ModalHeader } from './ModalHeader'

const SPACINGS = ['compact', 'large'] as const
const HEADING_SIZES = ['sm', 'md', 'lg'] as const

/**
 * Шапка модального окна. Figma: кит, `Modal-header` `14160:29188` — Spacing compact · large, +10
 * (Header-icon, Heading-sm / md / lg, Heading-icon, Description, Link, Back-button, Close-icon, Modal-dragger).
 * Три булевых слоя Heading-sm / md / lg — один проп `headingSize`. Кнопки «Назад» и «Закрыть» показаны, когда передан обработчик.
 * Наведение и нажатие кнопок нативные.
 */
const meta = {
  title: 'Components/ModalHeader',
  component: ModalHeader,
  tags: ['autodocs'],
  args: {
    spacing: 'compact',
    headerIcon: 'pie-chart',
    heading: 'Согласовать план KPI',
    headingSize: 'md',
    description: 'План на июнь отправится руководителю отдела продаж на согласование.',
    link: { label: 'Как считается вес' },
    onClose: fn(),
  },
  argTypes: {
    spacing: { control: 'inline-radio', options: SPACINGS },
    headerIcon: { control: 'text' },
    heading: { control: 'text' },
    headingSize: { control: 'inline-radio', options: HEADING_SIZES },
    headingIcon: { control: 'text' },
    description: { control: 'text' },
    link: { control: 'object' },
    onClose: { control: false },
    closeLabel: { control: 'text' },
    onBack: { control: false },
    backLabel: { control: 'text' },
    dragger: { control: 'boolean' },
    headingId: { control: 'text' },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <Width size="md">
          <Story />
        </Width>
      ),
  ],
} satisfies Meta<typeof ModalHeader>

export default meta
type Story = StoryObj<typeof meta>

/** Плотная шапка. */
export const Compact: Story = { args: { spacing: 'compact' } }
/** Крупная шапка: иконка xl, отступ сверху 72. */
export const Large: Story = { args: { spacing: 'large', headingSize: 'lg' } }
/** С кнопкой «Назад» — шаг мастера. */
export const WithBack: Story = { args: { onBack: fn(), heading: 'Выбрать сотрудников', headerIcon: undefined } }
/** Мобильная шторка: ручка сверху. */
export const WithDragger: Story = { args: { dragger: true, onClose: undefined } }
/** Заголовок md с иконкой перед текстом. */
export const WithHeadingIcon: Story = { args: { headerIcon: undefined, headingIcon: 'info', link: undefined } }

/** Матрица Spacing × Heading size. */
export const AllVariants: Story = {
  parameters: { layout: 'padded', bare: true },
  render: () => (
    <Stack>
      <Block title="Spacing × Heading size">
        <Matrix
          rows={SPACINGS}
          cols={HEADING_SIZES}
          render={(sp, hs) => (
            <Width size="md">
              <ModalHeader
                spacing={sp}
                headingSize={hs}
                headerIcon="pie-chart"
                heading="Согласовать план KPI"
                description="План на июнь уйдёт руководителю"
                link={{ label: 'Подробнее' }}
                onClose={() => {}}
                onBack={() => {}}
              />
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}
