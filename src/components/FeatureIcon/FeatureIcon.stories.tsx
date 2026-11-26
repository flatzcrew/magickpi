import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { FeatureIcon } from './FeatureIcon'

const TYPES = ['primary', 'primary-light', 'secondary', 'tertiary', 'quaternary', 'neutral', 'primary-flat'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

/**
 * Иконка в цветной плашке. Figma: кит, `Feature-icon` `12051:4447` — 7 Type × 5 Size, плюс иконка.
 *
 * Плашка 32–64, иконка 20–36 по Size. Без `label` декоративная (aria-hidden). Дефолтный Size — xs, как в Figma.
 * Интерактивных состояний нет.
 */
const meta = {
  title: 'Components/FeatureIcon',
  component: FeatureIcon,
  tags: ['autodocs'],
  args: {
    type: 'primary',
    size: 'md',
    icon: 'pie-chart',
    label: 'Выполнение плана',
  },
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    icon: { control: 'text' },
    label: { control: 'text' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof FeatureIcon>

export default meta
type Story = StoryObj<typeof meta>

/** Брендовая плашка: блок «Выполнение плана». */
export const Primary: Story = { args: { type: 'primary' } }
export const PrimaryLight: Story = { args: { type: 'primary-light' } }
export const Secondary: Story = { args: { type: 'secondary', icon: 'users', label: 'Сотрудники' } }
export const Tertiary: Story = { args: { type: 'tertiary', icon: 'users', label: 'Сотрудники' } }
export const Quaternary: Story = { args: { type: 'quaternary', icon: 'calender', label: 'Период' } }
/** Нейтральная: файл отчёта. */
export const Neutral: Story = { args: { type: 'neutral', icon: 'doc', label: 'Отчёт' } }
/** Без фона. */
export const PrimaryFlat: Story = { args: { type: 'primary-flat', icon: 'info', label: 'Подсказка' } }

/** Матрица Type × Size. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <FeatureIcon type={t} size={sz} icon="pie-chart" />} />
      </Block>
    </Stack>
  ),
}
