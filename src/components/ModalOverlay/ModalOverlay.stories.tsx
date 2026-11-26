import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Frame, Stack } from '../../catalog/Catalog'
import { Button } from '../Button'
import { InfoNote } from '../InfoNote'
import { ModalOverlay } from './ModalOverlay'

/**
 * Затемняющая подложка под модалку. Figma: кит, `Modal-overlay` `12048:20` — одиночный, без вариантов.
 *
 * `position: fixed` на весь вьюпорт, Overlay/med-em + размытие Blur/16. В stories держится внутри `Frame`.
 * Клик по подложке = «назад»: обработчик `onClick` у потребителя. Модалку кладут соседом поверх подложки.
 */
const meta = {
  title: 'Components/ModalOverlay',
  component: ModalOverlay,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
  argTypes: {
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
  render: (args) => (
    <Frame>
      <InfoNote state="info">Выполнение плана 98% — Иван Петров, Отдел продаж</InfoNote>
      <ModalOverlay {...args} />
    </Frame>
  ),
} satisfies Meta<typeof ModalOverlay>

export default meta
type Story = StoryObj<typeof meta>

/** Подложка поверх контента страницы. */
export const Default: Story = {}

/** Подложка над контентом с кнопками: контент размыт и недоступен для клика. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <Stack>
      <Block title="Одиночный">
        <Frame wide>
          <Button type="primary">Утвердить план</Button>
          <ModalOverlay {...args} />
        </Frame>
      </Block>
    </Stack>
  ),
}
