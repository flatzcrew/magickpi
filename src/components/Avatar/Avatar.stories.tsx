import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Matrix, Row, Stack } from '../../catalog/Catalog'
import { Avatar } from './Avatar'

const TYPES = ['image', 'text', 'icon'] as const
const SIZES = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const STATUS_TYPES = ['success', 'warning', 'danger', 'disabled'] as const

/**
 * Аватар сотрудника. Figma: кит, `Avatar` `10010:1415` — 3 Type × 6 Size, плюс значок верификации и точка статуса.
 *
 * image — фото (без `src` — нейтральная подложка), text — инициалы (в xxs одна буква), icon — иконка.
 * В ките `icon` и `status` по умолчанию показаны, в React по умолчанию выключены. Интерактивных состояний нет.
 */
const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    type: 'text',
    size: 'md',
    initials: 'ИП',
    icon: false,
    status: false,
    statusType: 'success',
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    icon: { control: 'boolean' },
    status: { control: 'boolean' },
    statusType: { control: 'inline-radio', options: STATUS_TYPES },
    selectIcon: { control: 'text' },
    src: { control: 'text' },
    alt: { control: 'text' },
    initials: { control: 'text' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/** Фото сотрудника; без `src` — подложка Surface/s2. */
export const Image: Story = { args: { type: 'image', alt: 'Иван Петров' } }
/** Инициалы: Иван Петров. */
export const Text: Story = { args: { type: 'text' } }
/** Иконка вместо фото — профиль без фотографии. */
export const IconType: Story = { name: 'Icon', args: { type: 'icon', selectIcon: 'user' } }
/** Со значком верификации — руководитель отдела. */
export const Verified: Story = { args: { icon: true, size: 'lg' } }
/** С точкой статуса выполнения плана. */
export const WithStatus: Story = { args: { status: true, statusType: 'warning', size: 'lg' } }

/** Матрица Type × Size, значок и все типы точки статуса. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <Avatar type={t} size={sz} initials="ИП" alt="Иван Петров" />} />
      </Block>
      <Block title="Icon / Status (statusType)">
        <Row>
          <Labeled label="icon">
            <Avatar type="text" size="lg" initials="ИП" icon />
          </Labeled>
          {STATUS_TYPES.map((st) => (
            <Labeled key={st} label={`status · ${st}`}>
              <Avatar type="text" size="lg" initials="ИП" status statusType={st} />
            </Labeled>
          ))}
          <Labeled label="icon + status">
            <Avatar type="text" size="lg" initials="ИП" icon status />
          </Labeled>
        </Row>
      </Block>
    </Stack>
  ),
}
