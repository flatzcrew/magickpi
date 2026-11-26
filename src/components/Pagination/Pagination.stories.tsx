import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Stack, Stateful } from '../../catalog/Catalog'
import { Pagination } from './Pagination'

const PAGES = ['first', 'center', 'last', 'less-pages', 'mobile', 'load-more'] as const

/**
 * Постраничная навигация. Figma: кит, `Pagination` `12124:22612` — Page: first · center · last · less-pages · mobile · load-more, +4
 * (Additional-info, Goto-page, Results-count, слот Right).
 * first · center · last дают одну раскладку — номера считаются из `current` / `total`.
 * Наведение и нажатие кнопок нативные.
 */
const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    page: 'first',
    total: 10,
    additionalInfo: true,
    gotoPage: true,
    resultsCount: true,
    onChange: fn(),
    onPageSizeClick: fn(),
    onLoadMore: fn(),
  },
  argTypes: {
    page: { control: 'select', options: PAGES },
    current: { control: 'number' },
    total: { control: 'number' },
    additionalInfo: { control: 'boolean' },
    gotoPage: { control: 'boolean' },
    resultsCount: { control: 'boolean' },
    gotoLabel: { control: 'text' },
    resultsLabel: { control: 'text' },
    pageSize: { control: 'text' },
    right: { control: false },
    shown: { control: 'number' },
    totalResults: { control: 'number' },
    loadMoreLabel: { control: 'text' },
    onChange: { control: false },
    onPageSizeClick: { control: false },
    onLoadMore: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

/** Первая страница. */
export const First: Story = { args: { page: 'first', current: 1 } }
/** Страница в середине: пропуски с обеих сторон. */
export const Center: Story = { args: { page: 'center', current: 5 } }
/** Последняя страница. */
export const Last: Story = { args: { page: 'last', current: 10 } }
/** Мало страниц: «Назад · 1 / 4 · Далее». */
export const LessPages: Story = { args: { page: 'less-pages', current: 1, total: 4 } }
/** Мобильная раскладка: номера и «строк на странице» под ними. */
export const Mobile: Story = { args: { page: 'mobile', current: 1 } }
/** Подгрузка: «Отображается 35 из 128» и кнопка. */
export const LoadMore: Story = { args: { page: 'load-more', shown: 35, totalResults: 128, loadMoreLabel: 'Показать ещё сотрудников' } }

/** Живая пагинация: клик по номеру и стрелкам меняет страницу. */
export const Live: Story = {
  args: { page: 'center', total: 12 },
  render: (args) => (
    <Stateful initial={1}>{(v, set) => <Pagination {...args} current={v} onChange={set} />}</Stateful>
  ),
}

/** Все раскладки Page. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Page">
        <Stack>
          {PAGES.map((p) => (
            <Labeled key={p} label={p}>
              <Pagination
                page={p}
                current={p === 'first' ? 1 : p === 'last' ? 10 : p === 'less-pages' ? 2 : 5}
                total={p === 'less-pages' ? 4 : 10}
                totalResults={128}
              />
            </Labeled>
          ))}
        </Stack>
      </Block>
    </Stack>
  ),
}
