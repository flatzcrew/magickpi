import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Row, Stack } from '../../catalog/Catalog'
import { ModalDragger } from './ModalDragger'

/**
 * «Ручка» шторки модалки. Figma: кит, `Modal-dragger` `16161:28428` — одиночный, 48×6.
 *
 * Декоративная (aria-hidden), используется в ModalHeader мобильной шторки. Вариантов и интерактивных состояний нет.
 */
const meta = {
  title: 'Components/ModalDragger',
  component: ModalDragger,
  tags: ['autodocs'],
  args: {},
  argTypes: {},
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ModalDragger>

export default meta
type Story = StoryObj<typeof meta>

/** Ручка шторки. */
export const Default: Story = {}

/** Единственный вариант. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Одиночный">
        <Row>
          <ModalDragger />
        </Row>
      </Block>
    </Stack>
  ),
}
