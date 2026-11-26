import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { IconButtonGroup } from './IconButtonGroup'
import type { IconButtonGroupProps } from './IconButtonGroup'

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const BUTTON_TYPES = ['primary', 'primary-gradient', 'primary-light', 'secondary', 'tertiary', 'quaternary', 'neutral', 'flat', 'primary-flat'] as const

const KPI_ACTIONS: IconButtonGroupProps['items'] = [
  { icon: 'edit', 'aria-label': 'Изменить показатель', onClick: fn() },
  { icon: 'copy', 'aria-label': 'Копировать на следующий месяц', onClick: fn() },
  { icon: 'bin', 'aria-label': 'Удалить показатель', onClick: fn() },
]

/**
 * Слитная группа icon-кнопок (действия над строкой KPI). Figma: кит, `Icon-button-group` `12147:7934` — Size xs…xl, +4 (видимость кнопок).
 * Раскладка — из ButtonGroup (combined); у каждой кнопки обязателен `aria-label`.
 *
 * Наведение, нажатие и фокус кнопок — нативные.
 */
const meta = {
  title: 'Components/IconButtonGroup',
  component: IconButtonGroup,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    buttonType: 'tertiary',
    items: KPI_ACTIONS,
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    buttonType: { control: 'select', options: BUTTON_TYPES },
    items: { control: 'object' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof IconButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

/** Группа tertiary, как в ките. */
export const Default: Story = {}
/** Две кнопки. */
export const TwoButtons: Story = { args: { items: KPI_ACTIONS.slice(0, 2) } }
/** Другой тип кнопок. */
export const Secondary: Story = { args: { buttonType: 'secondary' } }

/** Матрица buttonType × Size. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="buttonType × Size (наведи и нажми — состояния живые)">
        <Matrix rows={BUTTON_TYPES} cols={SIZES} render={(bt, sz) => <IconButtonGroup size={sz} buttonType={bt} items={KPI_ACTIONS} />} />
      </Block>
    </Stack>
  ),
}
