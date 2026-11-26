import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { ButtonGroup } from './ButtonGroup'
import type { ButtonGroupProps } from './ButtonGroup'

const TYPES = ['combined', 'spaced-out'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const BUTTON_TYPES = ['primary', 'primary-gradient', 'primary-light', 'secondary', 'tertiary', 'quaternary', 'neutral', 'flat', 'primary-flat'] as const

const PERIOD_ACTIONS: ButtonGroupProps['items'] = [
  { children: 'Месяц', onClick: fn() },
  { children: 'Квартал', onClick: fn() },
  { children: 'Год', onClick: fn() },
]
const ROW_ACTIONS: ButtonGroupProps['items'] = [
  { children: 'Экспорт', leftIcon: 'download' },
  { children: 'Копировать план', leftIcon: 'copy' },
  { children: 'Ещё', rightIcon: 'chevron-down' },
]

/**
 * Группа кнопок, слитная или с промежутками. Figma: кит, `Button-group` `12147:7059` — Size xs…xl × Type combined · spaced-out, +4 (видимость кнопок 2–5).
 * Кнопки — `Button`; Size задаёт группа, Type кнопок по умолчанию — `buttonType` (в ките tertiary). Видимость кнопок = длина `items`.
 *
 * Наведение, нажатие и фокус кнопок — нативные.
 */
const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  args: {
    type: 'combined',
    size: 'sm',
    buttonType: 'tertiary',
    items: PERIOD_ACTIONS,
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    buttonType: { control: 'select', options: BUTTON_TYPES },
    items: { control: 'object' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

/** Слитная группа. */
export const Combined: Story = { args: { type: 'combined' } }
/** Кнопки с промежутками. */
export const SpacedOut: Story = { args: { type: 'spaced-out', items: ROW_ACTIONS } }
/** С иконками. */
export const WithIcons: Story = { args: { items: ROW_ACTIONS } }
/** Две кнопки — минимум кита. */
export const TwoButtons: Story = { args: { items: [{ children: 'План' }, { children: 'Факт' }] } }
/** Другой тип кнопок. */
export const SecondaryButtons: Story = { args: { buttonType: 'secondary' } }

/** Матрица Type × Size и buttonType × Type. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <ButtonGroup type={t} size={sz} items={PERIOD_ACTIONS} />} />
      </Block>
      <Block title="buttonType × Type (наведи и нажми — состояния живые)">
        <Matrix rows={BUTTON_TYPES} cols={TYPES} render={(bt, t) => <ButtonGroup type={t} size="sm" buttonType={bt} items={ROW_ACTIONS} />} />
      </Block>
    </Stack>
  ),
}
