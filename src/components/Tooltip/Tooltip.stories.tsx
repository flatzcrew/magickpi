import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Row, Stack } from '../../catalog/Catalog'
import { Tooltip } from './Tooltip'

const DIRECTIONS = [
  'botom-left',
  'botom-right',
  'bottom-center',
  'left-center',
  'right-center',
  'top-center',
  'top-left',
  'top-right',
] as const

/**
 * Всплывающая подсказка. Figma: кит, `Tooltip` `12089:7621` — Direction (8 направлений указателя), +7
 * (Icon, заголовок, Description, медиа-слот, Button-1 secondary, Button-2 tertiary, Body).
 * Опечатка Figma `botom-*` сохранена: имя значения = якорь. Video не переносим — слот `media` пустой.
 * Компонент — только карточка, позиционирует её потребитель.
 */
const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    direction: 'botom-left',
    icon: 'info',
    heading: 'Вес показателя',
    description: 'Доля показателя в итоговой оценке. Сумма весов в плане — 100%.',
    actions: [{ label: 'Понятно', onClick: fn() }],
  },
  argTypes: {
    direction: { control: 'select', options: DIRECTIONS },
    icon: { control: 'text' },
    heading: { control: 'text' },
    description: { control: 'text' },
    media: { control: false },
    actions: { control: 'object' },
    children: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

/** Указатель снизу слева (`botom-left`, опечатка кита). */
export const BotomLeft: Story = { args: { direction: 'botom-left' } }
/** Указатель снизу справа (`botom-right`, опечатка кита). */
export const BotomRight: Story = { args: { direction: 'botom-right' } }
export const BottomCenter: Story = { args: { direction: 'bottom-center' } }
export const LeftCenter: Story = { args: { direction: 'left-center' } }
export const RightCenter: Story = { args: { direction: 'right-center' } }
export const TopCenter: Story = { args: { direction: 'top-center' } }
export const TopLeft: Story = { args: { direction: 'top-left' } }
export const TopRight: Story = { args: { direction: 'top-right' } }
/** Только текст, без иконки и кнопок. */
export const TextOnly: Story = { args: { icon: undefined, actions: undefined, heading: 'План/факт', description: 'Факт обновляется раз в сутки' } }
/** Две кнопки — шаг онбординга Кипи. */
export const TwoActions: Story = {
  args: {
    heading: 'Кипи поможет с планом',
    description: 'Спросите ассистента, как распределить вес между задачами',
    actions: [
      { label: 'Спросить', onClick: fn() },
      { label: 'Позже', onClick: fn() },
    ],
  },
}

/** Все 8 направлений указателя. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Direction">
        <Row>
          {DIRECTIONS.map((d) => (
            <Labeled key={d} label={d}>
              <Tooltip
                direction={d}
                icon="info"
                heading="Вес показателя"
                description="Доля в итоговой оценке"
                actions={[{ label: 'Понятно' }]}
              />
            </Labeled>
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}
