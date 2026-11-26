/*
 * Showcase — тестовая страница React-базы (Фаза 4 директивы react_base).
 * Палитра и шкала текста собираются разбором css (?raw), порядок галереи — разбором таблицы «Пачки» в COMPONENTS.md.
 * Стили — только var(--…) и классы ui-*; см. Showcase.module.css.
 */
import { Fragment, useEffect, useState, type ReactNode } from 'react'
import semanticsCss from './tokens/semantics.css?raw'
import typographyCss from './tokens/typography.css?raw'
import componentsMd from '../COMPONENTS.md?raw'
import s from './Showcase.module.css'
import {
  Alert,
  Avatar,
  AvatarGroup,
  BatchBar,
  Button,
  ButtonDanger,
  ButtonGroup,
  ButtonSuccess,
  Chart,
  Checkbox,
  CheckboxLabel,
  Chip,
  ChipSpecial,
  DashboardInfo,
  Datepicker,
  DEMO_EMPLOYEE_CARD_FOOTER,
  DigitInput,
  DividerHorizontal,
  DividerVertical,
  Dropdown,
  Dropmenu,
  EmployeeCard,
  EmployeeGroupHeader,
  EmployeeHeader,
  FeatureIcon,
  FileItem,
  HintLabel,
  Icon,
  IconButton,
  IconButtonGroup,
  Indicator,
  InfoNote,
  InputCell,
  InputCellMobile,
  InputCellSpecial,
  InputField,
  InputFieldMobile,
  InputFieldSpecial,
  InputLabel,
  KipiAvatar,
  KipiLauncher,
  KipiMessage,
  KpiCard,
  KpiStatus,
  Link,
  List,
  LogomarkKpi,
  MatrixRow,
  MetaChip,
  MobileNav,
  MobileNavItem,
  Modal,
  ModalActions,
  ModalDragger,
  ModalHeader,
  ModalOverlay,
  MonthCell,
  MonthProgress,
  NavDot,
  NotificationBell,
  NotificationItem,
  PageIndicator,
  Pagination,
  PlanPerEmployeeRow,
  ProfileDropdown,
  QrCode,
  Radio,
  RadioLabel,
  ResultBanner,
  ScaleChart,
  Scroller,
  SidePanel,
  Sidebar,
  SidebarItem,
  SidebarItemCompact,
  Status,
  Switcher,
  SwitcherItem,
  TabNav,
  TabNavItem,
  Table,
  TableCell,
  Tag,
  TagSpecial,
  TaskCard,
  TaskRow,
  TaskStatus,
  Toast,
  Toggle,
  ToggleLabel,
  Tooltip,
  TopNav,
  TopNavItem,
} from './components'

/* ---------- Разбор источников ---------- */

/** Семантика: только первый блок (:root / Light) — в Dark те же имена. */
function parseSemantics(css: string) {
  const start = css.indexOf(':root')
  const block = css.slice(start, css.indexOf('}', start))
  const names = [...block.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1])
  const groups = new Map<string, string[]>()
  for (const name of names) {
    const parts = name.slice(2).split('-')
    const key = parts[0] === 'surface' && (parts[1] === 'special' || parts[1] === 'component') ? `${parts[0]}-${parts[1]}` : parts[0]
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(name)
  }
  return [...groups.entries()]
}

function parseTypography(css: string) {
  return [...new Set([...css.matchAll(/^\.((?:ui|xl)-[a-z0-9-]+)\s*\{/gm)].map((m) => m[1]))]
}

/** Таблица «Пачки» в COMPONENTS.md: | N | count | A, B, C | … | */
function parseBatches(md: string) {
  const section = md.slice(md.indexOf('## Пачки'))
  const end = section.indexOf('\n## ', 4)
  const body = end > 0 ? section.slice(0, end) : section
  const batches: { n: string; names: string[] }[] = []
  for (const line of body.split('\n')) {
    const m = line.match(/^\|\s*(\d+)\s*\|\s*\d+\s*\|\s*([^|]+)\|/)
    if (m) batches.push({ n: m[1], names: m[2].split(',').map((x) => x.trim()).filter(Boolean) })
  }
  return batches
}

const PALETTE = parseSemantics(semanticsCss)
const TEXT_CLASSES = parseTypography(typographyCss)
const BATCHES = parseBatches(componentsMd)
const PANGRAM = 'Съешь ещё этих мягких французских булок — 0123'

/* ---------- Каркас галереи ---------- */

function Matrix<R extends string | number, C extends string | number>({
  rows,
  cols,
  render,
}: {
  rows: readonly R[]
  cols: readonly C[]
  render: (r: R, c: C) => ReactNode
}) {
  return (
    <div className={s.matrix} style={{ gridTemplateColumns: `max-content repeat(${cols.length}, max-content)` }}>
      <span />
      {cols.map((c) => (
        <span key={String(c)} className={`${s.axis} ui-caption-1-medium`}>
          {String(c)}
        </span>
      ))}
      {rows.map((r) => (
        <Fragment key={String(r)}>
          <span className={`${s.axis} ui-caption-1-medium`}>{String(r)}</span>
          {cols.map((c) => (
            <div key={String(c)} className={s.cell}>
              {render(r, c)}
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

function Row({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className={s.rowWrap}>
      {label && <span className={`${s.axis} ui-caption-1-medium`}>{label}</span>}
      <div className={s.row}>{children}</div>
    </div>
  )
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={s.labeled}>
      {children}
      <span className={`${s.axis} ui-caption-1-normal`}>{label}</span>
    </div>
  )
}

function Frame({ children, tall, wide }: { children: ReactNode; tall?: boolean; wide?: boolean }) {
  return <div className={[s.frame, tall && s.tall, wide && s.wide].filter(Boolean).join(' ')}>{children}</div>
}

function Stateful<T>({ initial, children }: { initial: T; children: (v: T, set: (v: T) => void) => ReactNode }) {
  const [v, set] = useState(initial)
  return <>{children(v, set)}</>
}

/* ---------- Значения вариантов (из .tsx) ---------- */

const SIZES5 = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const BUTTON_TYPES = ['primary', 'primary-gradient', 'primary-light', 'secondary', 'tertiary', 'quaternary', 'neutral', 'flat', 'primary-flat'] as const
const BUTTON_STATES = ['default', 'hover', 'pressed', 'disabled'] as const
const COLOR_BUTTON_TYPES = ['primary', 'primary-gradient', 'primary-light', 'secondary', 'tertiary', 'quaternary'] as const
const TAG_TYPES = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'danger', 'primary-light'] as const
const TAG_STATES = ['default', 'hover', 'disabled'] as const
const NAV_TYPES = ['active-neutral', 'inactive', 'active', 'active-primary', 'active-primary-light', 'active-secondary'] as const
const SIDEBAR_TYPES = [...NAV_TYPES, 'active-tertiary'] as const
const KPI_STATUSES = ['done', 'progress', 'fail', 'nodata'] as const
const TASK_STATUSES = ['on-approval', 'in-progress', 'done', 'closed-plan', 'closed-fact', 'rejected'] as const
const CARD_STATES = ['default', 'hover', 'focus', 'selected'] as const
const NOTE_STATES = ['default', 'info', 'success', 'warning', 'danger'] as const
const OPTS3 = [
  { value: 'a', label: 'Месяц' },
  { value: 'b', label: 'Квартал' },
  { value: 'c', label: 'Год' },
]
const noop = () => {}

/* ---------- Демо компонентов ---------- */

const DEMOS: Record<string, () => ReactNode> = {
  /* Пачка 1 */
  Icon: () => (
    <Row>
      {([12, 14, 16, 18, 20, 24, 28, 32] as const).map((sz) => (
        <Labeled key={sz} label={String(sz)}>
          <Icon name="placeholder" size={sz} />
        </Labeled>
      ))}
    </Row>
  ),
  Status: () => (
    <Matrix rows={['outline=false', 'outline=true']} cols={['success', 'warning', 'danger', 'disabled'] as const} render={(r, c) => <Status type={c} outline={r === 'outline=true'} />} />
  ),
  DividerHorizontal: () => (
    <Matrix
      rows={['bottom', 'center', 'top', 'center-double'] as const}
      cols={['pointed', 'rounded'] as const}
      render={(r, c) => (
        <div className={s.hBox}>
          <DividerHorizontal align={r} ends={c} />
        </div>
      )}
    />
  ),
  Button: () => (
    <>
      <Matrix rows={BUTTON_TYPES} cols={SIZES5} render={(t, sz) => <Button type={t} size={sz}>Кнопка</Button>} />
      <Matrix rows={BUTTON_TYPES} cols={BUTTON_STATES} render={(t, st) => <Button type={t} state={st} leftIcon="placeholder" rightIcon="placeholder" secondaryText="2">Кнопка</Button>} />
    </>
  ),
  IconButton: () => (
    <>
      <Matrix rows={BUTTON_TYPES} cols={SIZES5} render={(t, sz) => <IconButton type={t} size={sz} aria-label="Действие" />} />
      <Matrix rows={BUTTON_TYPES} cols={BUTTON_STATES} render={(t, st) => <IconButton type={t} state={st} aria-label="Действие" />} />
    </>
  ),
  Link: () => (
    <>
      <Matrix rows={['primary', 'secondary', 'tertiary'] as const} cols={SIZES5} render={(t, sz) => <Link type={t} size={sz} href="#gallery">Ссылка</Link>} />
      <Matrix rows={['primary', 'secondary', 'tertiary'] as const} cols={TAG_STATES} render={(t, st) => <Link type={t} state={st} leftIcon="placeholder" rightIcon="placeholder" href="#gallery">Ссылка</Link>} />
    </>
  ),
  Avatar: () => (
    <>
      <Matrix rows={['image', 'text', 'icon'] as const} cols={['xxs', 'xs', 'sm', 'md', 'lg', 'xl'] as const} render={(t, sz) => <Avatar type={t} size={sz} />} />
      <Row label="icon / status">
        <Avatar type="text" size="lg" icon />
        <Avatar type="text" size="lg" status />
        <Avatar type="text" size="lg" status statusType="warning" />
        <Avatar type="text" size="lg" status statusType="danger" />
        <Avatar type="text" size="lg" icon status statusType="disabled" />
      </Row>
    </>
  ),
  Tag: () => (
    <>
      <Matrix rows={TAG_TYPES} cols={['xs', 'sm', 'md'] as const} render={(t, sz) => <Tag type={t} size={sz}>Тег</Tag>} />
      <Matrix rows={TAG_TYPES} cols={TAG_STATES} render={(t, st) => <Tag type={t} state={st} leftIcon="placeholder" rightIcon="placeholder" secondaryText="3">Тег</Tag>} />
    </>
  ),
  InputLabel: () => (
    <Row>
      {(['sm', 'md', 'lg'] as const).map((sz) => (
        <Labeled key={sz} label={sz}>
          <InputLabel size={sz} supportText="(необязательно)" icon="info">Название</InputLabel>
        </Labeled>
      ))}
      <Labeled label="disabled">
        <InputLabel disabled supportText="(необязательно)">Название</InputLabel>
      </Labeled>
    </Row>
  ),
  HintLabel: () => (
    <Matrix rows={['default', 'danger', 'disabled'] as const} cols={['sm', 'md', 'lg'] as const} render={(t, sz) => <HintLabel size={sz} tone={t} icon="info" supportText="0/100">Подсказка к полю</HintLabel>} />
  ),
  DigitInput: () => (
    <Matrix
      rows={['md', 'lg'] as const}
      cols={['default', 'hover', 'default-dark', 'filled', 'active', 'danger', 'disabled', 'filled-dark', 'hover-dark'] as const}
      render={(sz, st) => <DigitInput size={sz} state={st} defaultValue={st.startsWith('filled') ? '7' : undefined} />}
    />
  ),
  InputCell: () => (
    <>
      <Matrix rows={['default', 'default-with-button', 'textarea'] as const} cols={SIZES5} render={(t, sz) => <InputCell type={t} size={sz} placeholder="Введите текст" leftIcon="placeholder" />} />
      <div className={s.stack}>
        {(['default', 'hover', 'filled', 'active', 'danger', 'disabled', 'naked', 'default-dark', 'default-dark-hover', 'filled-dark', 'naked-disabled'] as const).map((st) => (
          <Labeled key={st} label={st}>
            <InputCell state={st} placeholder="Введите текст" defaultValue={st.startsWith('filled') ? 'Значение' : undefined} />
          </Labeled>
        ))}
      </div>
    </>
  ),
  InputField: () => (
    <div className={s.grid}>
      {(['default', 'hover', 'filled', 'active', 'danger', 'disabled', 'naked', 'digit', 'digit-lg', 'default-dark', 'default-dark-hover', 'filled-dark', 'naked-disabled'] as const).map((st) => (
        <Labeled key={st} label={st}>
          <InputField state={st} inputLabel="Название" inputHint="Подсказка к полю" placeholder="Введите текст" defaultValue={st.startsWith('filled') ? 'Значение' : undefined} />
        </Labeled>
      ))}
    </div>
  ),

  /* Пачка 2 */
  DividerVertical: () => (
    <Matrix
      rows={['pointed', 'rounded'] as const}
      cols={['right', 'center', 'left', 'center-double'] as const}
      render={(e, a) => (
        <div className={s.vBox}>
          <DividerVertical align={a} ends={e} />
        </div>
      )}
    />
  ),
  ButtonDanger: () => (
    <>
      <Matrix rows={COLOR_BUTTON_TYPES} cols={SIZES5} render={(t, sz) => <ButtonDanger type={t} size={sz}>Удалить</ButtonDanger>} />
      <Matrix rows={COLOR_BUTTON_TYPES} cols={BUTTON_STATES} render={(t, st) => <ButtonDanger type={t} size="md" state={st}>Удалить</ButtonDanger>} />
    </>
  ),
  ButtonSuccess: () => (
    <>
      <Matrix rows={COLOR_BUTTON_TYPES} cols={SIZES5} render={(t, sz) => <ButtonSuccess type={t} size={sz}>Принять</ButtonSuccess>} />
      <Matrix rows={COLOR_BUTTON_TYPES} cols={BUTTON_STATES} render={(t, st) => <ButtonSuccess type={t} size="md" state={st}>Принять</ButtonSuccess>} />
    </>
  ),
  Checkbox: () => (
    <Matrix
      rows={['sm', 'md', 'lg'] as const}
      cols={['unchecked', 'hover', 'checked', 'disabled', 'indeterminate', 'indeterminate-disabled', 'checked-pressed'] as const}
      render={(sz, st) => <Checkbox size={sz} state={st} aria-label={st} />}
    />
  ),
  Radio: () => (
    <Matrix rows={['sm', 'md'] as const} cols={['inactive', 'hover', 'active', 'disabled', 'active-pressed'] as const} render={(sz, st) => <Radio size={sz} state={st} aria-label={st} />} />
  ),
  Toggle: () => (
    <Matrix
      rows={['sm', 'md', 'lg', 'mobile'] as const}
      cols={['switch-off', 'switch-off-disabled', 'switch-on', 'switch-on-disabled', 'switch-on-pressed'] as const}
      render={(sz, st) => <Toggle size={sz} state={st} aria-label={st} />}
    />
  ),
  FeatureIcon: () => (
    <Matrix rows={['primary', 'primary-light', 'secondary', 'tertiary', 'quaternary', 'neutral', 'primary-flat'] as const} cols={SIZES5} render={(t, sz) => <FeatureIcon type={t} size={sz} />} />
  ),
  InfoNote: () => (
    <Matrix
      rows={['default', 'info', 'success', 'warning', 'danger', 'brand'] as const}
      cols={['sm', 'md', 'lg'] as const}
      render={(st, sz) => (
        <InfoNote state={st} size={sz}>
          Заметка к блоку
        </InfoNote>
      )}
    />
  ),
  Scroller: () => (
    <Row>
      <Labeled label="vertical">
        <div className={s.vBox}>
          <Scroller type="vertical" />
        </div>
      </Labeled>
      <Labeled label="horizontal">
        <div className={s.hBox}>
          <Scroller type="horizontal" />
        </div>
      </Labeled>
    </Row>
  ),
  Indicator: () => (
    <Row>
      {(['active-1', 'active-2', 'inactive'] as const).map((st) => (
        <Labeled key={st} label={st}>
          <Indicator state={st} />
        </Labeled>
      ))}
    </Row>
  ),
  ModalOverlay: () => (
    <Frame>
      <p className="ui-para-normal">Контент под оверлеем</p>
      <ModalOverlay />
    </Frame>
  ),
  ModalDragger: () => (
    <Row>
      <ModalDragger />
    </Row>
  ),

  /* Пачка 3 */
  CheckboxLabel: () => (
    <Matrix rows={['left', 'right'] as const} cols={['sm', 'md'] as const} render={(d, sz) => <CheckboxLabel direction={d} size={sz} description="Описание пункта" defaultChecked>Подпись</CheckboxLabel>} />
  ),
  RadioLabel: () => (
    <Matrix rows={['left', 'right'] as const} cols={['sm', 'md'] as const} render={(d, sz) => <RadioLabel direction={d} size={sz} description="Описание пункта" name={`r-${d}-${sz}`}>Подпись</RadioLabel>} />
  ),
  ToggleLabel: () => (
    <Matrix rows={['left', 'right'] as const} cols={['sm', 'md'] as const} render={(d, sz) => <ToggleLabel direction={d} size={sz} description="Описание пункта" defaultChecked>Подпись</ToggleLabel>} />
  ),
  SwitcherItem: () => (
    <>
      <Matrix rows={NAV_TYPES} cols={SIZES5} render={(t, sz) => <SwitcherItem type={t} size={sz}>Пункт</SwitcherItem>} />
      <Row label="state=hover">
        {NAV_TYPES.map((t) => (
          <SwitcherItem key={t} type={t} state="hover">
            {t}
          </SwitcherItem>
        ))}
      </Row>
    </>
  ),
  Switcher: () => (
    <Matrix
      rows={['default', 'secondary'] as const}
      cols={SIZES5}
      render={(t, sz) => <Stateful initial="a">{(v, set) => <Switcher type={t} size={sz} items={OPTS3} value={v} onChange={set} />}</Stateful>}
    />
  ),
  Chip: () => (
    <>
      <Matrix rows={['unselected', 'selected', 'selected-solid'] as const} cols={['xs', 'sm', 'md'] as const} render={(t, sz) => <Chip type={t} size={sz}>Фильтр</Chip>} />
      <Matrix rows={['unselected', 'selected', 'selected-solid'] as const} cols={['default', 'hover', 'pressed', 'drag', 'disabled'] as const} render={(t, st) => <Chip type={t} state={st} leftIcon="placeholder" rightIcon="placeholder">Фильтр</Chip>} />
    </>
  ),
  ChipSpecial: () => (
    <>
      <Matrix rows={['unselected', 'selected'] as const} cols={['xs', 'sm', 'md'] as const} render={(t, sz) => <ChipSpecial type={t} size={sz} initials="ИП">Иван Петров</ChipSpecial>} />
      <Matrix rows={['unselected', 'selected'] as const} cols={['default', 'hover', 'pressed', 'drag', 'disabled'] as const} render={(t, st) => <ChipSpecial type={t} state={st} initials="ИП" rightIcon="close">Иван Петров</ChipSpecial>} />
    </>
  ),
  TagSpecial: () => (
    <>
      <Matrix rows={TAG_TYPES} cols={['sm', 'md'] as const} render={(t, sz) => <TagSpecial type={t} size={sz} initials="ИП">Иван Петров</TagSpecial>} />
      <Row label="state (primary)">
        {TAG_STATES.map((st) => (
          <TagSpecial key={st} state={st} initials="ИП" rightIcon="close">
            {st}
          </TagSpecial>
        ))}
      </Row>
    </>
  ),
  ButtonGroup: () => (
    <Matrix
      rows={['combined', 'spaced-out'] as const}
      cols={SIZES5}
      render={(t, sz) => <ButtonGroup type={t} size={sz} items={[{ children: 'Один' }, { children: 'Два' }, { children: 'Три' }]} />}
    />
  ),
  IconButtonGroup: () => (
    <Row>
      {SIZES5.map((sz) => (
        <Labeled key={sz} label={sz}>
          <IconButtonGroup size={sz} items={[{ 'aria-label': 'Первое' }, { 'aria-label': 'Второе' }, { 'aria-label': 'Третье' }]} />
        </Labeled>
      ))}
    </Row>
  ),
  AvatarGroup: () => (
    <Row>
      {SIZES5.map((sz) => (
        <Labeled key={sz} label={sz}>
          <AvatarGroup size={sz} avatars={[{ type: 'text', initials: 'АБ' }, { type: 'text', initials: 'ВГ' }, { type: 'icon' }, { type: 'image' }]} more={5} />
        </Labeled>
      ))}
    </Row>
  ),
  NotificationBell: () => (
    <Row>
      {(['numeric', 'status', 'numeric-sm', 'status-sm'] as const).map((t) => (
        <Labeled key={t} label={t}>
          <NotificationBell type={t} count={3} label="Уведомления" />
        </Labeled>
      ))}
    </Row>
  ),

  /* Пачка 4 */
  InputCellSpecial: () => (
    <>
      <Matrix
        rows={['default', 'default-with-button', 'textarea'] as const}
        cols={['md / resting', 'md / pressed', 'lg / resting', 'lg / pressed'] as const}
        render={(t, c) => {
          const [sz, st] = c.split(' / ') as ['md' | 'lg', 'resting' | 'pressed']
          return <InputCellSpecial type={t} size={sz} state={st} label="Название" labelSupportText="(необязательно)" leftIcon="placeholder" />
        }}
      />
      <div className={s.grid}>
        {(['default', 'hover', 'default-dark', 'filled', 'active', 'danger', 'disabled', 'filled-dark', 'hover-dark'] as const).map((tn) => (
          <Labeled key={tn} label={`tone=${tn}`}>
            <InputCellSpecial tone={tn} label="Название" defaultValue={tn.startsWith('filled') ? 'Значение' : undefined} />
          </Labeled>
        ))}
      </div>
    </>
  ),
  InputFieldSpecial: () => (
    <div className={s.grid}>
      {(['default', 'hover', 'default-dark', 'filled', 'active', 'danger', 'disabled', 'filled-dark', 'hover-dark'] as const).map((st) => (
        <Labeled key={st} label={st}>
          <InputFieldSpecial state={st} label="Название" inputHint="Подсказка к полю" defaultValue={st.startsWith('filled') ? 'Значение' : undefined} />
        </Labeled>
      ))}
    </div>
  ),
  Dropdown: () => (
    <div className={s.grid}>
      {(['default', 'hover', 'pressed', 'active', 'danger', 'disabled', 'naked', 'default-dark', 'naked-disabled', 'primary-light'] as const).map((st) => (
        <Labeled key={st} label={st}>
          <Dropdown state={st} inputLabel="Отдел" inputHint="Подсказка" placeholder="Выберите" leftIcon="placeholder" />
        </Labeled>
      ))}
      <Labeled label="open">
        <Dropdown open inputLabel="Отдел" value="Продажи" />
      </Labeled>
    </div>
  ),
  InputCellMobile: () => (
    <>
      <Matrix rows={['default', 'default-with-action', 'textarea'] as const} cols={['md', 'lg'] as const} render={(t, sz) => <InputCellMobile type={t} size={sz} label="Название" leftIcon="placeholder" />} />
      <Row label="tone">
        {(['default', 'filled', 'active', 'danger', 'disabled'] as const).map((tn) => (
          <Labeled key={tn} label={tn}>
            <InputCellMobile tone={tn} label="Название" defaultValue={tn === 'filled' ? 'Значение' : undefined} />
          </Labeled>
        ))}
      </Row>
    </>
  ),
  InputFieldMobile: () => (
    <div className={s.grid}>
      {(['default', 'filled', 'active', 'danger', 'disabled'] as const).map((st) => (
        <Labeled key={st} label={st}>
          <InputFieldMobile state={st} label="Название" inputHint="Подсказка к полю" defaultValue={st === 'filled' ? 'Значение' : undefined} />
        </Labeled>
      ))}
    </div>
  ),
  TopNavItem: () => (
    <>
      <Matrix
        rows={['active-neutral', 'inactive', 'inactive-outlined', 'active', 'active-naked', 'active-primary', 'active-primary-light', 'active-secondary'] as const}
        cols={[...SIZES5, 'hover'] as const}
        render={(t, c) => (c === 'hover' ? <TopNavItem type={t} state="hover">Пункт</TopNavItem> : <TopNavItem type={t} size={c}>Пункт</TopNavItem>)}
      />
    </>
  ),
  TopNav: () => (
    <div className={s.stack}>
      {SIZES5.map((sz) => (
        <Labeled key={sz} label={sz}>
          <Stateful initial="a">{(v, set) => <TopNav size={sz} items={OPTS3} value={v} onChange={set} />}</Stateful>
        </Labeled>
      ))}
      <Labeled label="activeType=active-primary, inactiveType=inactive-outlined">
        <Stateful initial="b">{(v, set) => <TopNav items={OPTS3} value={v} onChange={set} activeType="active-primary" inactiveType="inactive-outlined" />}</Stateful>
      </Labeled>
    </div>
  ),
  TabNavItem: () => (
    <Matrix rows={['inactive', 'active-primary'] as const} cols={[...SIZES5, 'hover'] as const} render={(t, c) => (c === 'hover' ? <TabNavItem type={t} state="hover">Вкладка</TabNavItem> : <TabNavItem type={t} size={c}>Вкладка</TabNavItem>)} />
  ),
  TabNav: () => (
    <div className={s.stack}>
      {SIZES5.map((sz) => (
        <Labeled key={sz} label={sz}>
          <Stateful initial="a">{(v, set) => <TabNav size={sz} items={OPTS3} value={v} onChange={set} />}</Stateful>
        </Labeled>
      ))}
    </div>
  ),
  SidebarItem: () => (
    <Matrix
      rows={SIDEBAR_TYPES}
      cols={['sm', 'md', 'lg', 'xl', 'hover'] as const}
      render={(t, c) =>
        c === 'hover' ? (
          <SidebarItem type={t} state="hover" leftIcon="placeholder">Пункт</SidebarItem>
        ) : (
          <SidebarItem type={t} size={c} leftIcon="placeholder" rightIcon="placeholder" tag="3">
            Пункт
          </SidebarItem>
        )
      }
    />
  ),
  SidebarItemCompact: () => (
    <Matrix rows={SIDEBAR_TYPES} cols={['md', 'lg', 'hover'] as const} render={(t, c) => (c === 'hover' ? <SidebarItemCompact type={t} state="hover">Пункт</SidebarItemCompact> : <SidebarItemCompact type={t} size={c}>Пункт</SidebarItemCompact>)} />
  ),
  PageIndicator: () => (
    <Row>
      {[0, 1, 2, 3].map((a) => (
        <Labeled key={a} label={`active=${a}`}>
          <PageIndicator count={4} active={a} />
        </Labeled>
      ))}
    </Row>
  ),

  /* Пачка 5 */
  TableCell: () => (
    <Matrix
      rows={['header / default', 'default / default', 'default / loading'] as const}
      cols={['md', 'lg'] as const}
      render={(r, sz) => {
        const [t, st] = r.split(' / ') as ['default' | 'header', 'default' | 'loading']
        return (
          <div className={s.cellBox}>
            <TableCell type={t} size={sz} state={st} checkbox={{}} leftIcon="placeholder" secondaryText="вторичный" description="Описание" tags={[{ label: 'Тег', type: 'success' }]}>
              Ячейка
            </TableCell>
          </div>
        )
      }}
    />
  ),
  List: () => (
    <Matrix
      rows={['sm', 'md', 'lg', 'xl'] as const}
      cols={['default', 'hover', 'active'] as const}
      render={(sz, st) => (
        <div className={s.cellBox}>
          <List size={sz} state={st} leftIcon="placeholder" description="Описание" trailText="12" tags={[{ label: 'Тег' }]}>
            Пункт списка
          </List>
        </div>
      )}
    />
  ),
  Dropmenu: () => (
    <Row>
      <Dropmenu search={{}}>
        <List leftIcon="placeholder">Продажи</List>
        <List leftIcon="placeholder" state="hover">Маркетинг</List>
        <List leftIcon="placeholder" state="active">Разработка</List>
      </Dropmenu>
    </Row>
  ),
  Pagination: () => (
    <div className={s.stack}>
      {(['first', 'center', 'last', 'less-pages', 'mobile', 'load-more'] as const).map((p) => (
        <Labeled key={p} label={p}>
          <Pagination page={p} current={p === 'first' ? 1 : p === 'last' ? 10 : 5} total={p === 'less-pages' ? 4 : 10} additionalInfo gotoPage resultsCount />
        </Labeled>
      ))}
    </div>
  ),
  Table: () => (
    <div className={s.wideBox}>
      <Table
        columns={[
          { key: 'name', title: 'Сотрудник', header: { checkbox: {} } },
          { key: 'role', title: 'Должность' },
          { key: 'kpi', title: 'KPI' },
        ]}
        rows={[
          { id: '1', cells: { name: { children: 'Анна Смирнова', checkbox: {} }, role: 'Менеджер', kpi: { tags: [{ label: '108%', type: 'success' }] } } },
          { id: '2', cells: { name: { children: 'Иван Петров', checkbox: {} }, role: 'Аналитик', kpi: { tags: [{ label: '74%', type: 'warning' }] } } },
          { id: '3', cells: { name: { children: 'Олег Ким', checkbox: {} }, role: 'Разработчик', kpi: { tags: [{ label: '52%', type: 'danger' }] } } },
        ]}
        pagination={{ page: 'center', current: 2, total: 5 }}
      />
    </div>
  ),
  ModalHeader: () => (
    <Matrix
      rows={['compact', 'large'] as const}
      cols={['sm', 'md', 'lg'] as const}
      render={(sp, hs) => (
        <div className={s.cellBox}>
          <ModalHeader spacing={sp} headingSize={hs} headerIcon="placeholder" heading="Заголовок окна" description="Описание действия" onClose={noop} onBack={noop} link={{ label: 'Подробнее' }} />
        </div>
      )}
    />
  ),
  ModalActions: () => (
    <Row>
      <div className={s.cellBox}>
        <ModalActions primaryLabel="Сохранить" secondaryLabel="Отмена" description="Изменения применятся сразу" link={{ label: 'Справка' }} />
      </div>
    </Row>
  ),
  Modal: () => <ModalDemo />,
  Tooltip: () => (
    <div className={s.grid}>
      {(['botom-left', 'botom-right', 'bottom-center', 'left-center', 'right-center', 'top-center', 'top-left', 'top-right'] as const).map((d) => (
        <Labeled key={d} label={d}>
          <div className={s.tooltipBox}>
            <Tooltip direction={d} icon="info" heading="Подсказка" description="Короткое пояснение к элементу" actions={[{ label: 'Понятно' }]} />
          </div>
        </Labeled>
      ))}
    </div>
  ),
  Alert: () => (
    <div className={s.stack}>
      {NOTE_STATES.map((st) => (
        <Labeled key={st} label={st}>
          <Alert state={st} title="Заголовок уведомления" description="Описание того, что произошло" primaryAction={{ label: 'Действие' }} secondaryAction={{ label: 'Отмена' }} link={{ label: 'Подробнее' }} onClose={noop} />
        </Labeled>
      ))}
    </div>
  ),
  Toast: () => (
    <div className={s.stack}>
      {NOTE_STATES.map((st) => (
        <Labeled key={st} label={st}>
          <Toast state={st} title="Сохранено" secondaryText="сейчас" description="Изменения применены" primaryAction={{ label: 'Открыть' }} secondaryAction={{ label: 'Отменить' }} onClose={noop} />
        </Labeled>
      ))}
    </div>
  ),
  ProfileDropdown: () => (
    <Row>
      <Labeled label="default">
        <ProfileDropdown name="Анна Смирнова" secondaryText="Руководитель" />
      </Labeled>
      <Labeled label="open">
        <ProfileDropdown name="Анна Смирнова" secondaryText="Руководитель" open />
      </Labeled>
    </Row>
  ),

  /* Пачка 6 */
  Sidebar: () => (
    <Row>
      <Labeled label="expanded">
        <Frame tall>
          <Sidebar state="expanded" />
        </Frame>
      </Labeled>
      <Labeled label="collapsed-compact">
        <Frame tall>
          <Sidebar state="collapsed-compact" />
        </Frame>
      </Labeled>
    </Row>
  ),
  Datepicker: () => (
    <div className={s.stack}>
      {(['range', 'single', 'single-sm'] as const).map((t) => (
        <Labeled key={t} label={t}>
          <div className={s.wideBox}>
            <Datepicker type={t} />
          </div>
        </Labeled>
      ))}
    </div>
  ),
  Chart: () => (
    <div className={s.wideBox}>
      <Chart label="Выполнение KPI" value="86%" change="+4%" />
    </div>
  ),
  DashboardInfo: () => (
    <Row>
      <DashboardInfo label="Сотрудников" value="128" change="+6" changeTone="success" />
      <DashboardInfo label="Открытых заданий" value="19" change="0" changeTone="neutral" />
    </Row>
  ),
  MobileNavItem: () => (
    <Matrix
      rows={['active-neutral', 'inactive', 'active', 'active-naked', 'active-primary', 'active-primary-light', 'active-primary-naked'] as const}
      cols={['lg', 'xl', 'pressed'] as const}
      render={(t, c) => (c === 'pressed' ? <MobileNavItem type={t} state="pressed">Главная</MobileNavItem> : <MobileNavItem type={t} size={c}>Главная</MobileNavItem>)}
    />
  ),
  MobileNav: () => (
    <Matrix rows={['default', 'floating'] as const} cols={['md', 'lg'] as const} render={(t, sz) => <Stateful initial="">{(v, set) => <MobileNav type={t} size={sz} value={v || undefined} onChange={set} />}</Stateful>} />
  ),
  QrCode: () => (
    <Row>
      {(['round', 'square'] as const).map((t) => (
        <Labeled key={t} label={t}>
          <div className={s.qrBox}>
            <QrCode type={t} />
          </div>
        </Labeled>
      ))}
    </Row>
  ),
  LogomarkKpi: () => (
    <Row>
      {([28, 36] as const).map((sz) => (
        <Labeled key={sz} label={String(sz)}>
          <LogomarkKpi size={sz} />
        </Labeled>
      ))}
    </Row>
  ),
  KipiAvatar: () => (
    <Matrix rows={[36, 96] as const} cols={['welcome', 'idle', 'thinking', 'error', 'success'] as const} render={(sz, st) => <KipiAvatar size={sz} state={st} />} />
  ),
  NavDot: () => (
    <Row>
      <NavDot label="Есть новое" />
    </Row>
  ),
  KpiStatus: () => (
    <>
      <Matrix rows={['1', '1+1'] as const} cols={KPI_STATUSES} render={(t, st) => <KpiStatus type={t} status={st} />} />
      <Row label="showLabel=false">
        {KPI_STATUSES.map((st) => (
          <KpiStatus key={st} status={st} showLabel={false} />
        ))}
      </Row>
    </>
  ),
  MetaChip: () => (
    <Row>
      {(['none', 'calendar', 'users'] as const).map((i) => (
        <Labeled key={i} label={i}>
          <MetaChip icon={i} />
        </Labeled>
      ))}
    </Row>
  ),

  /* Пачка 7 */
  TaskStatus: () => (
    <Row>
      {TASK_STATUSES.map((st) => (
        <Labeled key={st} label={st}>
          <TaskStatus status={st} />
        </Labeled>
      ))}
    </Row>
  ),
  MonthProgress: () => (
    <Matrix
      rows={KPI_STATUSES}
      cols={[0, 25, 50, 75, 100] as const}
      render={(st, v) => (
        <div className={s.cellBox}>
          <MonthProgress status={st} value={v} label="Ноябрь" valueText={`${v}%`} period="1–30 ноября" showPeriod />
        </div>
      )}
    />
  ),
  ScaleChart: () => (
    <div className={s.stack}>
      {(['show', 'hide'] as const).map((m) => (
        <Labeled key={m} label={`marker=${m}`}>
          <div className={s.wideBox}>
            <ScaleChart marker={m} />
          </div>
        </Labeled>
      ))}
    </div>
  ),
  KipiLauncher: () => (
    <Row>
      {(['idle', 'thinking', 'error', 'success'] as const).map((st) => (
        <Labeled key={st} label={st}>
          <KipiLauncher state={st} aria-label="Кипи" />
        </Labeled>
      ))}
    </Row>
  ),
  KipiMessage: () => (
    <div className={s.stack}>
      {(['default', 'thinking', 'error'] as const).map((st) => (
        <Labeled key={st} label={`kipi / ${st}`}>
          <KipiMessage author="kipi" state={st} text="Привет! Помогу разобраться с вашими KPI за месяц." />
        </Labeled>
      ))}
      <Labeled label="user / default">
        <KipiMessage author="user" text="Почему у меня 74% по продажам?" />
      </Labeled>
    </div>
  ),
  ResultBanner: () => (
    <div className={s.stack}>
      {(['month-result', 'my-matrix'] as const).map((t) => (
        <Labeled key={t} label={t}>
          <ResultBanner type={t} />
        </Labeled>
      ))}
    </div>
  ),
  EmployeeHeader: () => (
    <div className={s.stack}>
      <EmployeeHeader name="Анна Смирнова" role="Руководитель отдела продаж" showStatus showInfo />
      <EmployeeHeader name="Иван Петров" role="Аналитик" showStatus={false} showInfo={false} />
    </div>
  ),
  EmployeeCard: () => (
    <Matrix
      rows={['footer=false', 'footer=true'] as const}
      cols={CARD_STATES}
      render={(f, st) => (
        <div className={s.cardBox}>
          <EmployeeCard state={st} selected={st === 'selected'} name="Анна Смирнова" role="Руководитель" footer={f === 'footer=true' ? DEMO_EMPLOYEE_CARD_FOOTER : undefined} showStatus showExpand />
        </div>
      )}
    />
  ),
  KpiCard: () => (
    <div className={s.grid}>
      {CARD_STATES.map((st) => (
        <Labeled key={st} label={st}>
          <Stateful initial={st === "selected"}>{(v, set) => <KpiCard state={st} selected={v} onSelectedChange={set} />}</Stateful>
        </Labeled>
      ))}
    </div>
  ),
  FileItem: () => (
    <div className={s.grid}>
      {(['loading', 'done', 'error'] as const).map((st) => (
        <Labeled key={st} label={st}>
          <FileItem state={st} name="Отчёт_ноябрь.xlsx" size="1,2 МБ" />
        </Labeled>
      ))}
    </div>
  ),
  MonthCell: () => (
    <Matrix
      rows={['closed', 'open', 'future'] as const}
      cols={['default', 'hover', 'focus', 'selected', 'disabled'] as const}
      render={(p, st) => <MonthCell period={p} state={st} selected={st === 'selected'} month="Ноя" />}
    />
  ),
  NotificationItem: () => (
    <Matrix
      rows={['read=false', 'read=true'] as const}
      cols={['default', 'hover'] as const}
      render={(r, st) => (
        <div className={s.cellBox}>
          <NotificationItem read={r === 'read=true'} state={st} text="Руководитель утвердил план на декабрь" time="5 мин назад" />
        </div>
      )}
    />
  ),

  /* Пачка 8 */
  TaskCard: () => (
    <>
      <div className={s.grid}>
        {TASK_STATUSES.map((st) => (
          <Labeled key={st} label={st}>
            <Stateful initial={false}>{(v, set) => <TaskCard status={st} selected={v} onSelectedChange={set} title="Подготовить отчёт по продажам" description="Собрать данные за квартал" />}</Stateful>
          </Labeled>
        ))}
      </div>
      <div className={s.grid}>
        {CARD_STATES.map((st) => (
          <Labeled key={st} label={`state=${st}`}>
            <Stateful initial={st === "selected"}>{(v, set) => <TaskCard state={st} selected={v} onSelectedChange={set} title="Подготовить отчёт по продажам" />}</Stateful>
          </Labeled>
        ))}
      </div>
    </>
  ),
  TaskRow: () => (
    <div className={s.stack}>
      {(['default', 'hover', 'focus'] as const).map((st) => (
        <Labeled key={st} label={`selectable=false / ${st}`}>
          <TaskRow state={st} title="Подготовить отчёт по продажам" meta="до 30 ноября" />
        </Labeled>
      ))}
      {CARD_STATES.map((st) => (
        <Labeled key={st} label={`selectable=true / ${st}`}>
          <Stateful initial={st === "selected"}>{(v, set) => <TaskRow selectable state={st} selected={v} onSelectedChange={set} title="Подготовить отчёт по продажам" meta="до 30 ноября" />}</Stateful>
        </Labeled>
      ))}
    </div>
  ),
  MatrixRow: () => (
    <div className={s.stack}>
      {(['default', 'hover', 'focus'] as const).flatMap((st) => [
        <Labeled key={`g0${st}`} label={`group / ${st} / collapsed`}>
          <Stateful initial={false}>{(v, set) => <MatrixRow level="group" state={st} expanded={false} name="Продажи" checked={v} onCheckedChange={set} />}</Stateful>
        </Labeled>,
        <Labeled key={`g1${st}`} label={`group / ${st} / expanded`}>
          <Stateful initial={false}>{(v, set) => <MatrixRow level="group" state={st} expanded name="Продажи" checked={v} onCheckedChange={set} />}</Stateful>
        </Labeled>,
        <Labeled key={`i${st}`} label={`item / ${st}`}>
          <Stateful initial={false}>{(v, set) => <MatrixRow level="item" state={st} name="Выручка" checked={v} onCheckedChange={set} />}</Stateful>
        </Labeled>,
      ])}
    </div>
  ),
  BatchBar: () => (
    <div className={s.stack}>
      {(['default', 'hint'] as const).map((st) => (
        <Labeled key={st} label={st}>
          <BatchBar state={st} />
        </Labeled>
      ))}
    </div>
  ),
  PlanPerEmployeeRow: () => (
    <div className={s.stack}>
      {(['default', 'error'] as const).map((st) => (
        <Labeled key={st} label={st}>
          <PlanPerEmployeeRow state={st} name="Анна Смирнова" />
        </Labeled>
      ))}
    </div>
  ),
  EmployeeGroupHeader: () => (
    <div className={s.stack}>
      {[false, true].map((o) => (
        <Labeled key={String(o)} label={`offer=${o}`}>
          <Stateful initial={false}>{(v, set) => <EmployeeGroupHeader offer={o} name="Анна Смирнова" role="Руководитель" count="16" selectAllChecked={v} onSelectAllChange={set} />}</Stateful>
        </Labeled>
      ))}
    </div>
  ),
  SidePanel: () => (
    <Row>
      <Labeled label="showActions">
        <Frame wide tall>
          <SidePanel heading="Боковая панель" showClose onClose={noop} showActions />
        </Frame>
      </Labeled>
      <Labeled label="без действий">
        <Frame wide tall>
          <SidePanel heading="Боковая панель" showClose onClose={noop} showActions={false} />
        </Frame>
      </Labeled>
    </Row>
  ),
}

function ModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Row>
        <Labeled label="compact · overlay=false">
          <Modal size="compact" overlay={false} header={{ heading: 'Удалить задание?', description: 'Действие нельзя отменить' }} actions={{ primaryLabel: 'Удалить', secondaryLabel: 'Отмена' }}>
            <p className="ui-para-normal">Содержимое окна</p>
          </Modal>
        </Labeled>
        <Labeled label="large · overlay=false">
          <Modal size="large" overlay={false} header={{ heading: 'Новое задание', headerIcon: 'placeholder' }} actions={{ primaryLabel: 'Создать', secondaryLabel: 'Отмена' }}>
            <p className="ui-para-normal">Содержимое окна</p>
          </Modal>
        </Labeled>
      </Row>
      <Labeled label="с оверлеем в рамке">
        <Frame wide tall>
          <Modal size="compact" header={{ heading: 'Окно в рамке' }} actions={{ primaryLabel: 'Ок' }}>
            <p className="ui-para-normal">Оверлей ограничен рамкой</p>
          </Modal>
        </Frame>
      </Labeled>
      <Row>
        <Button onClick={() => setOpen(true)}>Открыть</Button>
      </Row>
      <Modal open={open} onClose={() => setOpen(false)} header={{ heading: 'Модальное окно', description: 'Закрыть — Esc, крестик или клик по оверлею' }} actions={{ primaryLabel: 'Готово', onPrimary: () => setOpen(false), secondaryLabel: 'Отмена', onSecondary: () => setOpen(false) }}>
        <p className="ui-para-normal">Содержимое окна</p>
      </Modal>
    </>
  )
}

/* ---------- Страница ---------- */

const TOC = [
  { id: 'palette', label: 'Палитра' },
  { id: 'type', label: 'Шкала текста' },
  { id: 'gallery', label: 'Галерея' },
]

export function Showcase() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const shown = BATCHES.flatMap((b) => b.names).filter((n) => DEMOS[n])
  const missing = BATCHES.flatMap((b) => b.names).filter((n) => !DEMOS[n])

  return (
    <div className={s.page}>
      <header className={s.top}>
        <span className="ui-title-2-semibold">Showcase · KPI Bro</span>
        <nav className={s.toc}>
          {TOC.map((t) => (
            <a key={t.id} href={`#${t.id}`} className={`${s.tocLink} ui-para-medium`}>
              {t.label}
            </a>
          ))}
        </nav>
        <Switcher
          size="sm"
          items={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
          value={theme}
          onChange={(v) => setTheme(v as 'light' | 'dark')}
        />
      </header>

      <main className={s.main}>
        <section id="palette" className={s.section}>
          <h2 className="ui-heading-4-semibold">Палитра</h2>
          <p className={`${s.muted} ui-para-normal`}>Семантика из semantics.css, разбор ?raw. Групп: {PALETTE.length}, переменных: {PALETTE.reduce((n, [, v]) => n + v.length, 0)}.</p>
          {PALETTE.map(([group, vars]) => (
            <div key={group} id={`palette-${group}`} className={s.group}>
              <h3 className="ui-title-1-semibold">
                {group} <span className={`${s.muted} ui-para-normal`}>· {vars.length}</span>
              </h3>
              <div className={s.swatches}>
                {vars.map((v) => (
                  <div key={v} className={s.swatch}>
                    <span className={s.chip} style={{ background: `var(${v})` }} />
                    <code className={`${s.code} ui-caption-1-normal`}>{v}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section id="type" className={s.section}>
          <h2 className="ui-heading-4-semibold">Шкала текста</h2>
          <p className={`${s.muted} ui-para-normal`}>Классы из typography.css: {TEXT_CLASSES.length}.</p>
          <div className={s.typeList}>
            {TEXT_CLASSES.map((c) => (
              <div key={c} className={s.typeRow}>
                <code className={`${s.code} ${s.typeName} ui-caption-1-normal`}>.{c}</code>
                <span className={c}>{PANGRAM}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="gallery" className={s.section}>
          <h2 className="ui-heading-4-semibold">Галерея</h2>
          <p className={`${s.muted} ui-para-normal`}>
            Показано {shown.length} из {shown.length + missing.length}, порядок — пачки COMPONENTS.md.
            {missing.length > 0 && ` Без демо: ${missing.join(', ')}.`}
          </p>
          <nav className={s.galleryToc}>
            {BATCHES.map((b) => (
              <div key={b.n} className={s.tocBatch}>
                <a href={`#batch-${b.n}`} className={`${s.tocLink} ui-para-semibold`}>
                  Пачка {b.n}
                </a>
                {b.names.map((n) => (
                  <a key={n} href={`#c-${n}`} className={`${s.tocLink} ui-caption-1-medium`}>
                    {n}
                  </a>
                ))}
              </div>
            ))}
          </nav>
          {BATCHES.map((b) => (
            <div key={b.n} id={`batch-${b.n}`} className={s.batch}>
              <h3 className="ui-heading-6-semibold">Пачка {b.n}</h3>
              {b.names.map((n) => (
                <article key={n} id={`c-${n}`} className={s.demo}>
                  <h4 className="ui-title-1-semibold">{n}</h4>
                  <div className={s.demoBody}>{DEMOS[n] ? DEMOS[n]() : <span className={`${s.muted} ui-para-normal`}>нет демо</span>}</div>
                </article>
              ))}
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
