import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { TagSpecial } from './TagSpecial'

const TYPES = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'danger', 'primary-light'] as const
const SIZES = ['sm', 'md'] as const
const STATES = ['default', 'hover', 'disabled'] as const

/**
 * Тег-пилюля с аватаром-инициалами — исполнитель или согласующий. Figma: кит, `Tag-special` `10108:4237` — 9 Type × 2 Size × 3 State, +6.
 * Цвета Type и State — из Tag; в sm в аватаре одна буква. С `onClick` рендерится как `<button>`, без него — `<span>`.
 *
 * Нативный hover есть только у кликабельного тега. Проп `state` только фиксирует состояние для сверки с Figma.
 */
const meta = {
  title: 'Components/TagSpecial',
  component: TagSpecial,
  tags: ['autodocs'],
  args: {
    type: 'primary',
    size: 'md',
    initials: 'ИП',
    children: 'Иван Петров',
  },
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    children: { control: 'text' },
    secondaryText: { control: 'text' },
    initials: { control: 'text' },
    rightIcon: { control: 'text' },
    disabled: { control: 'boolean' },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TagSpecial>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { type: 'primary' } }
export const Secondary: Story = { args: { type: 'secondary' } }
export const Tertiary: Story = { args: { type: 'tertiary' } }
export const Neutral: Story = { args: { type: 'neutral' } }
export const Info: Story = { args: { type: 'info', children: 'Согласующий' } }
/** План согласован. */
export const Success: Story = { args: { type: 'success', secondaryText: 'согласовал' } }
export const Warning: Story = { args: { type: 'warning', secondaryText: 'ждёт' } }
/** План отклонён. */
export const Danger: Story = { args: { type: 'danger', secondaryText: 'отклонил' } }
export const PrimaryLight: Story = { args: { type: 'primary-light' } }
/** Кликабельный тег с крестиком: рендерится как кнопка, hover нативный. */
export const Clickable: Story = { args: { rightIcon: 'cross', onClick: fn() } }
/** Недоступен. */
export const Disabled: Story = { args: { disabled: true } }

/** Матрица Type × Size и Type × State; native — кликабельный тег без принудительного состояния, наведи. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <TagSpecial type={t} size={sz} initials="ИП">Иван Петров</TagSpecial>} />
      </Block>
      <Block title="Type × State (native — живой)">
        <Matrix
          rows={TYPES}
          cols={['native', ...STATES] as const}
          render={(t, st) =>
            st === 'native' ? (
              <TagSpecial type={t} initials="АС" rightIcon="cross" onClick={() => {}}>
                Анна Смирнова
              </TagSpecial>
            ) : (
              <TagSpecial type={t} state={st} initials="АС" rightIcon="cross">
                Анна Смирнова
              </TagSpecial>
            )
          }
        />
      </Block>
    </Stack>
  ),
}
