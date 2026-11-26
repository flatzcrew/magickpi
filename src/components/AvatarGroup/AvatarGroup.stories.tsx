import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Row, Stack } from '../../catalog/Catalog'
import { AvatarGroup } from './AvatarGroup'
import type { AvatarGroupProps } from './AvatarGroup'

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const TEAM: AvatarGroupProps['avatars'] = [
  { type: 'text', initials: 'ИП' },
  { type: 'text', initials: 'АС' },
  { type: 'text', initials: 'ОК' },
  { type: 'icon' },
]

/**
 * Стопка аватаров команды с кнопкой «+N». Figma: кит, `Avatar-group` `10087:2600` — Size xs…xl.
 * Аватары — `Avatar` (в xs — xxs 20), «+N» — `Button` secondary; в xs кнопки нет.
 */
const meta = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    avatars: TEAM,
    more: 5,
    onMoreClick: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    avatars: { control: 'object' },
    more: { control: 'number' },
    onMoreClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AvatarGroup>

export default meta
type Story = StoryObj<typeof meta>

/** Команда отдела: 4 аватара и ещё 5 сотрудников. */
export const Default: Story = {}
/** Все участники видны — без «+N». */
export const WithoutMore: Story = { args: { more: undefined } }
/** Size xs — компактная стопка, кнопки «+N» нет, как в ките. */
export const ExtraSmall: Story = { args: { size: 'xs' } }
/** Size xl. */
export const ExtraLarge: Story = { args: { size: 'xl' } }

/** Все Size рядом, с «+N» и без. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Size, more = 5">
        <Row>
          {SIZES.map((sz) => (
            <Labeled key={sz} label={sz}>
              <AvatarGroup size={sz} avatars={TEAM} more={5} />
            </Labeled>
          ))}
        </Row>
      </Block>
      <Block title="Size, без more">
        <Row>
          {SIZES.map((sz) => (
            <Labeled key={sz} label={sz}>
              <AvatarGroup size={sz} avatars={TEAM} />
            </Labeled>
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}
