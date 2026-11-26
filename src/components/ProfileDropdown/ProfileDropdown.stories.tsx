import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Row, Stack, Stateful } from '../../catalog/Catalog'
import { ProfileDropdown } from './ProfileDropdown'

/**
 * Триггер меню профиля. Figma: кит, `Profile-dropdown` `16451:77325` — одиночный, +6
 * (аватар, картинка, имя, вторая строка, Icon-button со стрелкой, open).
 * Фокус и клавиатура — на Icon-button; клик по всей плашке всплывает в `onClick` корня.
 * Наведение нативное; `open` выставляет aria-expanded у кнопки.
 */
const meta = {
  title: 'Components/ProfileDropdown',
  component: ProfileDropdown,
  tags: ['autodocs'],
  args: {
    name: 'Иван Петров',
    secondaryText: 'Отдел продаж',
    initials: 'ИП',
    avatar: true,
    iconButton: true,
    open: false,
    onClick: fn(),
  },
  argTypes: {
    avatarSrc: { control: 'text' },
    initials: { control: 'text' },
    avatar: { control: 'boolean' },
    name: { control: 'text' },
    secondaryText: { control: 'text' },
    iconButton: { control: 'boolean' },
    open: { control: 'boolean' },
    menuLabel: { control: 'text' },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ProfileDropdown>

export default meta
type Story = StoryObj<typeof meta>

/** Закрытое меню. */
export const Default: Story = {}
/** Меню открыто. */
export const Open: Story = { args: { open: true } }
/** Без аватара. */
export const WithoutAvatar: Story = { args: { avatar: false } }
/** Только имя, без второй строки и стрелки. */
export const NameOnly: Story = { args: { secondaryText: undefined, iconButton: false } }
/** Клик по плашке переключает open. */
export const Toggle: Story = {
  render: (args) => (
    <Stateful initial={false}>{(open, set) => <ProfileDropdown {...args} open={open} onClick={() => set(!open)} />}</Stateful>
  ),
}

/** Все комбинации слоёв. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Слои">
        <Row>
          <Labeled label="default">
            <ProfileDropdown name="Иван Петров" secondaryText="Отдел продаж" initials="ИП" />
          </Labeled>
          <Labeled label="open">
            <ProfileDropdown name="Иван Петров" secondaryText="Отдел продаж" initials="ИП" open />
          </Labeled>
          <Labeled label="avatar=false">
            <ProfileDropdown name="Иван Петров" secondaryText="Отдел продаж" avatar={false} />
          </Labeled>
          <Labeled label="iconButton=false">
            <ProfileDropdown name="Анна Смирнова" initials="АС" iconButton={false} />
          </Labeled>
        </Row>
      </Block>
    </Stack>
  ),
}
