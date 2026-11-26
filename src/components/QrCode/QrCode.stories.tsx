import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Row, Stack, Width } from '../../catalog/Catalog'
import { DEMO_QR_MATRIX } from './demoMatrix'
import { QrCode } from './QrCode'

const TYPES = ['round', 'square'] as const

/**
 * QR-код. Figma: кит, `QR-code` `16158:27561` — Type round · square.
 * Рисует готовую матрицу модулей (`matrix`, строки из '0' / '1'), сам QR не кодирует. По умолчанию — демо-матрица 29×29 кита
 * (`DEMO_QR_MATRIX`). Размер — по ширине контейнера.
 */
const meta = {
  title: 'Components/QrCode',
  component: QrCode,
  tags: ['autodocs'],
  args: {
    type: 'square',
    matrix: DEMO_QR_MATRIX,
    label: 'QR-код для входа в мобильное приложение KPI',
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    matrix: { control: 'object' },
    label: { control: 'text' },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <Width size="sm">
          <Story />
        </Width>
      ),
  ],
} satisfies Meta<typeof QrCode>

export default meta
type Story = StoryObj<typeof meta>

/** Квадратные модули. */
export const Square: Story = { args: { type: 'square' } }
/** Круглые модули и скруглённые поисковые метки. */
export const Round: Story = { args: { type: 'round' } }

/** Оба Type. */
export const AllVariants: Story = {
  parameters: { layout: 'padded', bare: true },
  render: () => (
    <Stack>
      <Block title="Type">
        <Row>
          {TYPES.map((t) => (
            <Labeled key={t} label={t}>
              <Width size="sm">
                <QrCode type={t} label="QR-код для входа" />
              </Width>
            </Labeled>
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}
