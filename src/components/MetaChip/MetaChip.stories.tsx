import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Row, Stack } from '../../catalog/Catalog'
import { MetaChip } from './MetaChip'

const ICONS = ['none', 'calendar', 'users'] as const

/**
 * Метаданные карточки задачи: план, срок, исполнители. Figma: kpi-bro · web, ext `MetaChip` `164:732` —
 * Icon none · calendar · users (3 ячейки); label — одна строка.
 * Иконка calendar рисуется как `Icons / Calender` (опечатка Figma сохранена в имени иконки).
 */
const meta = {
  title: 'Components/MetaChip',
  component: MetaChip,
  tags: ['autodocs'],
  args: {
    icon: 'none',
    label: 'План: 25',
  },
  argTypes: {
    icon: { control: 'inline-radio', options: ICONS },
    label: { control: 'text' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MetaChip>

export default meta
type Story = StoryObj<typeof meta>

/** Без иконки — план задачи. */
export const None: Story = { args: { icon: 'none', label: 'План: 25' } }
/** Срок. */
export const Calendar: Story = { args: { icon: 'calendar', label: 'до 30 июня' } }
/** Исполнители. */
export const Users: Story = { args: { icon: 'users', label: 'Иван Петров, ещё 2' } }

/** Все Icon. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Icon">
        <Row>
          {ICONS.map((i) => (
            <Labeled key={i} label={i}>
              <MetaChip icon={i} label={i === 'none' ? 'План: 25' : i === 'calendar' ? 'до 30 июня' : 'Иван Петров, ещё 2'} />
            </Labeled>
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}
