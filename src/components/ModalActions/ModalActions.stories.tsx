import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Stack, Width } from '../../catalog/Catalog'
import { ButtonDanger } from '../ButtonDanger'
import { Button } from '../Button'
import { ModalActions } from './ModalActions'

/**
 * Блок кнопок внизу модалки. Figma: кит, `Modal-actions/CTAs` `14158:28302` — одиночный, +2 (CTAs-слот, Description).
 * CTAs по умолчанию — две Button md поровну: secondary и primary. `null` в подписи скрывает кнопку,
 * `children` заменяет пару своим набором. Наведение и нажатие нативные.
 */
const meta = {
  title: 'Components/ModalActions',
  component: ModalActions,
  tags: ['autodocs'],
  args: {
    primaryLabel: 'Отправить на согласование',
    secondaryLabel: 'Отмена',
    onPrimary: fn(),
    onSecondary: fn(),
  },
  argTypes: {
    children: { control: false },
    primaryLabel: { control: 'text' },
    onPrimary: { control: false },
    primaryDisabled: { control: 'boolean' },
    secondaryLabel: { control: 'text' },
    onSecondary: { control: false },
    description: { control: 'text' },
    link: { control: 'object' },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <Width size="md">
          <Story />
        </Width>
      ),
  ],
} satisfies Meta<typeof ModalActions>

export default meta
type Story = StoryObj<typeof meta>

/** Пара кнопок по умолчанию. */
export const Default: Story = {}
/** С подписью и ссылкой под кнопками. */
export const WithDescription: Story = {
  args: { description: 'Руководитель получит уведомление', link: { label: 'Кто согласует' } },
}
/** Главное действие недоступно, пока план не заполнен. */
export const PrimaryDisabled: Story = { args: { primaryDisabled: true } }
/** Одна кнопка. */
export const SingleAction: Story = { args: { secondaryLabel: null, primaryLabel: 'Понятно' } }
/** Свой набор кнопок: удаление. */
export const CustomCtas: Story = {
  args: {
    children: (
      <>
        <Button type="secondary" size="md">Отмена</Button>
        <ButtonDanger type="primary" size="md">Удалить задачу</ButtonDanger>
      </>
    ),
  },
}

/** Все варианты состава. */
export const AllVariants: Story = {
  parameters: { layout: 'padded', bare: true },
  render: () => (
    <Stack>
      <Block title="CTAs · Description">
        <Stack>
          <Labeled label="default">
            <Width size="md">
              <ModalActions primaryLabel="Сохранить" secondaryLabel="Отмена" />
            </Width>
          </Labeled>
          <Labeled label="description + link">
            <Width size="md">
              <ModalActions primaryLabel="Сохранить" secondaryLabel="Отмена" description="Изменения применятся сразу" link={{ label: 'Справка' }} />
            </Width>
          </Labeled>
          <Labeled label="primaryDisabled">
            <Width size="md">
              <ModalActions primaryLabel="Сохранить" secondaryLabel="Отмена" primaryDisabled />
            </Width>
          </Labeled>
          <Labeled label="одна кнопка">
            <Width size="md">
              <ModalActions primaryLabel="Понятно" secondaryLabel={null} />
            </Width>
          </Labeled>
        </Stack>
      </Block>
    </Stack>
  ),
}
