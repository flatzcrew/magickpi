import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Stack, Width } from '../../catalog/Catalog'
import { FileItem } from './FileItem'

const STATES = ['loading', 'done', 'error'] as const

/**
 * Строка прикреплённого файла в форме закрытия задачи (SCR-07). Figma: kpi-bro · web, ext `FileItem` `225:1041` —
 * State: loading · done · error (3 ячейки); тексты name, size.
 *
 * Здесь `state` — этап загрузки файла, а не наведение. Строка целиком не интерактивна:
 * действие — только иконка-кнопка (крестик в loading — отмена, корзина в done / error — удалить), её hover нативный.
 */
const meta = {
  title: 'Components/FileItem',
  component: FileItem,
  tags: ['autodocs'],
  args: {
    state: 'done',
    name: 'Отчёт_продажи_ноябрь.xlsx',
    size: '1,2 МБ',
    errorText: 'Файл больше 20 МБ — прикрепите поменьше',
    icon: 'doc',
    onRemove: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: STATES },
    name: { control: 'text' },
    size: { control: 'text' },
    errorText: { control: 'text' },
    icon: { control: 'inline-radio', options: ['doc', 'image'] },
    onRemove: { control: false },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Width size="md">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof FileItem>

export default meta
type Story = StoryObj<typeof meta>

/** Файл загружается — можно отменить. */
export const Loading: Story = { args: { state: 'loading' } }
/** Файл прикреплён, показан размер. */
export const Done: Story = { args: { state: 'done' } }
/** Ошибка загрузки — текст ошибки вместо размера. */
export const ErrorState: Story = { name: 'Error', args: { state: 'error', name: 'Фото_встреча_с_клиентом.jpg', icon: 'image' } }

/** Все 3 состояния для сверки с Figma. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <Stack>
      <Block title="State">
        <Width size="md">
          <Stack>
            {STATES.map((st) => (
              <Labeled key={st} label={st}>
                <FileItem state={st} name="Отчёт_продажи_ноябрь.xlsx" size="1,2 МБ" />
              </Labeled>
            ))}
            <Labeled label="icon=image, длинное имя">
              <FileItem state="done" icon="image" name="Фото_встреча_с_клиентом_отдел_продаж_ноябрь_2026.jpg" size="3,8 МБ" />
            </Labeled>
          </Stack>
        </Width>
      </Block>
    </Stack>
  ),
}
