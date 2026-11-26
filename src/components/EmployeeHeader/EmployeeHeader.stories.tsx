import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Stack, Width } from '../../catalog/Catalog'
import { EmployeeHeader } from './EmployeeHeader'

const STATUSES = ['done', 'progress', 'fail', 'nodata'] as const

/**
 * Шапка выбранного сотрудника над его матрицей KPI. Figma: kpi-bro · web, ext `EmployeeHeader` `171:1491` —
 * одна ячейка; тексты name, role; булевы showStatus, showInfo.
 *
 * Аватар с инициалами (из имени) или фото, имя, должность; сверху — `KpiStatus` 1+1 (по умолчанию скрыт),
 * справа — иконка Info. Не интерактивна.
 */
const meta = {
  title: 'Components/EmployeeHeader',
  component: EmployeeHeader,
  tags: ['autodocs'],
  args: {
    name: 'Иван Петров',
    role: 'Менеджер по продажам',
    showStatus: false,
    status: 'progress',
    statusValue: '79%',
    showInfo: true,
  },
  argTypes: {
    name: { control: 'text' },
    role: { control: 'text' },
    showStatus: { control: 'boolean' },
    status: { control: 'inline-radio', options: STATUSES },
    statusValue: { control: 'text' },
    showInfo: { control: 'boolean' },
    initials: { control: 'text' },
    avatarSrc: { control: 'text' },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Width size="md">
        <Story />
      </Width>
    ),
  ],
} satisfies Meta<typeof EmployeeHeader>

export default meta
type Story = StoryObj<typeof meta>

/** Мастер Figma: без статуса, с иконкой Info. */
export const Default: Story = {}
/** Со статусом выполнения за месяц. */
export const WithStatus: Story = { args: { showStatus: true, status: 'done', statusValue: '98%' } }
/** Без иконки Info. */
export const WithoutInfo: Story = { args: { showInfo: false, name: 'Анна Смирнова', role: 'Руководитель отдела продаж' } }

/** Комбинации showStatus · showInfo и статусы KPI. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <Stack>
      <Block title="showStatus · showInfo">
        <Width size="md">
          <Stack>
            <Labeled label="showStatus=false, showInfo=true (мастер)">
              <EmployeeHeader name="Иван Петров" role="Менеджер по продажам" />
            </Labeled>
            <Labeled label="showStatus=true, showInfo=true">
              <EmployeeHeader name="Анна Смирнова" role="Руководитель отдела продаж" showStatus status="done" statusValue="98%" />
            </Labeled>
            <Labeled label="showStatus=false, showInfo=false">
              <EmployeeHeader name="Иван Петров" role="Менеджер по продажам" showInfo={false} />
            </Labeled>
          </Stack>
        </Width>
      </Block>
      <Block title="status">
        <Width size="md">
          <Stack>
            {STATUSES.map((st) => (
              <Labeled key={st} label={st}>
                <EmployeeHeader name="Иван Петров" role="Менеджер по продажам" showStatus status={st} statusValue="79%" />
              </Labeled>
            ))}
          </Stack>
        </Width>
      </Block>
    </Stack>
  ),
}
