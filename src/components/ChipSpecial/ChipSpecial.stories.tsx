import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Row, Stack, Stateful } from '../../catalog/Catalog'
import { ChipSpecial } from './ChipSpecial'

const TYPES = ['unselected', 'selected'] as const
const SIZES = ['xs', 'sm', 'md'] as const
const STATES = ['default', 'hover', 'pressed', 'drag', 'disabled'] as const
const PEOPLE = [
  { name: 'Иван Петров', initials: 'ИП' },
  { name: 'Анна Смирнова', initials: 'АС' },
  { name: 'Олег Ким', initials: 'ОК' },
] as const

/**
 * Чип-пилюля с аватаром-инициалами слева — выбор сотрудника в фильтре. Figma: кит, `Chip-special` `10112:2912` — 2 Type × 3 Size × 5 State, +6.
 * Цвета Type и State — из Chip; в xs в аватаре одна буква.
 *
 * Наведение, нажатие и фокус — нативные; drag — только принудительно. Проп `state` только фиксирует состояние для сверки с Figma.
 */
const meta = {
  title: 'Components/ChipSpecial',
  component: ChipSpecial,
  tags: ['autodocs'],
  args: {
    type: 'unselected',
    size: 'sm',
    initials: 'ИП',
    children: 'Иван Петров',
    onClick: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'select', options: [undefined, ...STATES] },
    children: { control: 'text' },
    secondaryText: { control: 'text' },
    initials: { control: 'text' },
    rightIcon: { control: 'text' },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ChipSpecial>

export default meta
type Story = StoryObj<typeof meta>

/** Сотрудник не выбран. */
export const Unselected: Story = { args: { type: 'unselected' } }
/** Сотрудник выбран; крестик снимает выбор. */
export const Selected: Story = { args: { type: 'selected', rightIcon: 'cross' } }
/** С вторичным текстом — отдел. */
export const WithSecondaryText: Story = { args: { secondaryText: 'Отдел продаж', size: 'md' } }
/** Недоступен: нативный `disabled`. */
export const Disabled: Story = { args: { disabled: true } }

/** Живой выбор сотрудников: клик переключает выбор. */
export const Live: Story = {
  render: (args) => (
    <Stateful<string[]> initial={['ИП']}>
      {(v, set) => (
        <Row>
          {PEOPLE.map((p) => (
            <ChipSpecial
              key={p.initials}
              {...args}
              initials={p.initials}
              type={v.includes(p.initials) ? 'selected' : 'unselected'}
              onClick={(e) => {
                set(v.includes(p.initials) ? v.filter((x) => x !== p.initials) : [...v, p.initials])
                args.onClick?.(e)
              }}
            >
              {p.name}
            </ChipSpecial>
          ))}
        </Row>
      )}
    </Stateful>
  ),
}

/** Матрица Type × Size и Type × State; default — без принудительного состояния, наведи и нажми. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <ChipSpecial type={t} size={sz} initials="ИП">Иван Петров</ChipSpecial>} />
      </Block>
      <Block title="Type × State (наведи и нажми default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <ChipSpecial type={t} size="sm" state={st === 'default' ? undefined : st} initials="АС" rightIcon="cross">
              Анна Смирнова
            </ChipSpecial>
          )}
        />
      </Block>
    </Stack>
  ),
}
