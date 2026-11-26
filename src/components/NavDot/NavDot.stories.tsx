import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Row, Stack } from '../../catalog/Catalog'
import { NavDot } from './NavDot'

/**
 * Точка непрочитанного на иконке навигации. Figma: kpi-bro · web, ext `NavDot` `165:840` —
 * одна ячейка (8×8, `--surface-danger-high-em`, обводка `--surface-s0`).
 * С `label` — role="status" для скринридера, без него точка декоративная. Позиционирует её потребитель
 * (например, слот `badge` пункта Sidebar).
 */
const meta = {
  title: 'Components/NavDot',
  component: NavDot,
  tags: ['autodocs'],
  args: {
    label: 'Есть новые задачи',
  },
  argTypes: {
    label: { control: 'text' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof NavDot>

export default meta
type Story = StoryObj<typeof meta>

/** С доступным именем. */
export const Default: Story = {}
/** Декоративная — без label. */
export const Decorative: Story = { args: { label: undefined } }

/** Единственная ячейка. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="NavDot">
        <Row>
          <Labeled label="label">
            <NavDot label="Есть новые задачи" />
          </Labeled>
          <Labeled label="декоративная">
            <NavDot />
          </Labeled>
        </Row>
      </Block>
    </Stack>
  ),
}
