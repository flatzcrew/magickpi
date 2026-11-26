import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { IconButton } from '../IconButton'
import { List } from '../List'
import { LogomarkKpi } from '../LogomarkKpi'
import { SidebarItem } from '../SidebarItem'
import type { SidebarItemType } from '../SidebarItem'
import { Switcher } from '../Switcher'
import type { SwitcherOption } from '../Switcher'
import styles from './Sidebar.module.css'

/** Sidebar — боковая навигация приложения. Figma: кит, `Sidebar` `12171:3030`. */
export type SidebarState = 'expanded' | 'collapsed-compact'

export interface SidebarNavOption {
  value: string
  label?: ReactNode
  /** Имя иконки слева (Sidebar-item) / в пункте compact. */
  icon?: string
  /** Иконка справа (expanded). */
  rightIcon?: string
  /** Tag-счётчик справа (expanded). */
  tag?: ReactNode
  disabled?: boolean
  /** Слот поверх пункта (например, NavDot на иконке) — рендерится внутри обёртки пункта. */
  badge?: ReactNode
  onClick?: MouseEventHandler<HTMLElement>
}

export interface SidebarSection {
  /** Section-heading (overline). В collapsed-compact не показывается. */
  heading?: ReactNode
  items: SidebarNavOption[]
}

export interface SidebarAction {
  label?: ReactNode
  icon?: string
  'aria-label'?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export interface SidebarProfile {
  name: ReactNode
  /** Вторая строка (компания / роль). */
  subtitle?: ReactNode
  /** Фото (expanded — картинка 36 в строке List). */
  src?: string
  /** Инициалы (collapsed-compact — Avatar text md). */
  initials?: string
  /** Иконка справа (в ките Icons / Edit-note). */
  icon?: string
}

/** Демо-содержимое кита. */
const DEMO_SECTIONS: SidebarSection[] = [
  { heading: 'General', items: ['1', '2', '3', '4', '5'].map((v) => ({ value: `g${v}`, label: 'Nav item', icon: 'placeholder', rightIcon: 'placeholder' })) },
  { heading: 'Admin', items: ['1', '2', '3', '4', '5'].map((v) => ({ value: `a${v}`, label: 'Nav item', icon: 'placeholder', rightIcon: 'placeholder' })) },
]
const DEMO_BOTTOM: SidebarNavOption[] = [
  { value: 'settings', label: 'Настройки', icon: 'settings' },
  { value: 'help', label: 'Помощь', icon: 'help' },
  { value: 'notifications', label: 'Уведомления', icon: 'notification', tag: '3' },
  { value: 'logout', label: 'Выйти', icon: 'logout' },
]
const DEMO_PROFILE: SidebarProfile = { name: 'Андрей Смирнов', subtitle: 'Procter&Gamble', initials: 'AT', icon: 'edit-note' }
const DEMO_THEMES: SwitcherOption[] = [
  { value: 'system', leftIcon: 'system-theme', 'aria-label': 'Системная тема' },
  { value: 'light', leftIcon: 'light-theme', 'aria-label': 'Светлая тема' },
  { value: 'dark', leftIcon: 'dark-theme', 'aria-label': 'Тёмная тема' },
]

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'title'> {
  /** 💡 State: expanded (304) · collapsed-compact (64) */
  state?: SidebarState
  /** ↪ Header — свой слот шапки; по умолчанию блок «логомарк + название + версия + кнопка». */
  header?: ReactNode
  /** Название продукта в шапке (Text/med-em). */
  title?: ReactNode
  /** Вторая строка шапки (версия, Text/low-em). */
  subtitle?: ReactNode
  /** Кнопка справа в шапке (Icon-button tertiary sm); `false` скрывает. */
  headerAction?: SidebarAction | false
  /** ✅ CTAs — главная кнопка (expanded — Button primary md во всю ширину, collapsed — Icon-button primary md); `false` скрывает. */
  cta?: SidebarAction | false
  /** ↪ Top-section — разделы навигации. */
  sections?: SidebarSection[]
  /** Текущий пункт (value). */
  value?: string
  onChange?: (value: string) => void
  /** Тип текущего пункта: expanded — active-tertiary (как в ките), collapsed — active-primary-light. */
  activeType?: SidebarItemType
  /** Нижние пункты (Настройки, Помощь, Уведомления, Выйти). Пункт с `tag` — Sidebar-item, остальные — строки List. */
  bottomItems?: SidebarNavOption[]
  /** ✅ Профиль: expanded — строка List сверху нижнего блока; collapsed — Avatar при showProfile. `false` скрывает. */
  profile?: SidebarProfile | false
  /** collapsed-compact: ✅ showProfile (в ките false). */
  showProfile?: boolean
  onProfileClick?: MouseEventHandler<HTMLElement>
  /** Переключатель темы (Switcher sm); `false` скрывает. */
  themes?: SwitcherOption[] | false
  theme?: string
  onThemeChange?: (value: string) => void
  /** Подпись блока темы (expanded). */
  themeLabel?: ReactNode
}

export function Sidebar({
  state = 'expanded',
  header,
  title = 'Magic KPI',
  subtitle = 'ver. 1.0.1',
  headerAction = { icon: 'placeholder', 'aria-label': 'Меню' },
  cta = { label: 'Create new item', icon: 'placeholder' },
  sections = DEMO_SECTIONS,
  value,
  onChange,
  activeType,
  bottomItems = DEMO_BOTTOM,
  profile = DEMO_PROFILE,
  showProfile = false,
  onProfileClick,
  themes = DEMO_THEMES,
  theme,
  onThemeChange,
  themeLabel = 'Тема',
  className,
  ...rest
}: SidebarProps) {
  const compact = state === 'collapsed-compact'
  const current = value ?? sections[0]?.items[0]?.value
  const currentTheme = theme ?? (themes ? themes[0]?.value : undefined)
  const select = (item: SidebarNavOption) => (e: Parameters<MouseEventHandler<HTMLElement>>[0]) => {
    item.onClick?.(e)
    onChange?.(item.value)
  }

  const defaultHeader = (
    <div className={styles.brand}>
      <span className={styles.brandLeft}>
        <LogomarkKpi size={36} />
      </span>
      <span className={styles.brandText}>
        {title != null && <span className={[styles.brandTitle, 'ui-para-medium'].join(' ')}>{title}</span>}
        {subtitle != null && <span className={[styles.brandSubtitle, 'ui-caption-2-normal'].join(' ')}>{subtitle}</span>}
      </span>
      {headerAction && (
        <IconButton
          type="tertiary"
          size="sm"
          icon={headerAction.icon ?? 'placeholder'}
          aria-label={headerAction['aria-label'] ?? 'Меню'}
          onClick={headerAction.onClick}
        />
      )}
    </div>
  )

  const ctaNode =
    cta &&
    (compact ? (
      <IconButton type="primary" size="md" icon={cta.icon ?? 'placeholder'} aria-label={cta['aria-label'] ?? String(cta.label ?? 'Создать')} onClick={cta.onClick} />
    ) : (
      <Button type="primary" size="md" rightIcon={cta.icon} onClick={cta.onClick} className={styles.ctaButton}>
        {cta.label}
      </Button>
    ))

  const navItem = (item: SidebarNavOption) => {
    const active = item.value === current
    const node = (
      <SidebarItem
        size="md"
        type={active ? (activeType ?? 'active-tertiary') : 'inactive'}
        leftIcon={item.icon}
        rightIcon={item.rightIcon}
        tag={item.tag}
        disabled={item.disabled}
        onClick={select(item)}
      >
        {item.label}
      </SidebarItem>
    )
    return (
      <span key={item.value} className={styles.navSlot}>
        {node}
        {item.badge}
      </span>
    )
  }

  const bottomItem = (item: SidebarNavOption) => {
    if (item.tag != null) {
      return (
        <span key={item.value} className={styles.navSlot}>
          <SidebarItem size="md" type="inactive" leftIcon={item.icon} tag={item.tag} disabled={item.disabled} onClick={select(item)}>
            {item.label}
          </SidebarItem>
          {item.badge}
        </span>
      )
    }
    return (
      <span key={item.value} className={styles.navSlot}>
        <List size="md" leftIcon={item.icon} role="button" tabIndex={0} className={styles.bottomRow} onClick={select(item)}>
          {item.label}
        </List>
        {item.badge}
      </span>
    )
  }

  const themeNode = themes && (
    <div className={styles.theme}>
      {themeLabel != null && <span className={[styles.themeLabel, 'ui-body-1-medium'].join(' ')}>{themeLabel}</span>}
      <Switcher
        type="secondary"
        size="sm"
        items={themes}
        value={currentTheme}
        onChange={(v) => onThemeChange?.(v)}
      />
    </div>
  )

  if (compact) {
    // Свёрнутая панель — по макету экранов kpi-bro · web (инстанс 83:730), не по collapsed-compact кита:
    // шапка 48×56 с логомарком 32 (клик — headerAction, обычно «развернуть»); пункты 48×38 — только иконка 18,
    // без подписей, шаг Space/md; текущий — тёмный (active-neutral); внизу пункты с Tag / badge и Avatar 40.
    const compactItem = (item: SidebarNavOption, active: boolean) => (
      <span key={item.value} className={styles.cSlot}>
        <button
          type="button"
          className={styles.cItem}
          data-active={active || undefined}
          aria-current={active ? 'page' : undefined}
          aria-label={typeof item.label === 'string' ? item.label : item.value}
          title={typeof item.label === 'string' ? item.label : undefined}
          disabled={item.disabled}
          onClick={select(item)}
        >
          <Icon name={item.icon ?? 'placeholder'} size={18} />
        </button>
        {item.badge && <span className={styles.cBadge}>{item.badge}</span>}
      </span>
    )
    const brandLabel = headerAction ? (headerAction['aria-label'] ?? 'Развернуть меню') : undefined
    return (
      <nav {...rest} className={[styles.root, styles[state], className].filter(Boolean).join(' ')}>
        <div className={styles.top}>
          <div className={styles.cHeader}>
            {header ?? (
              <button
                type="button"
                className={styles.cBrand}
                aria-label={brandLabel}
                title={brandLabel}
                disabled={!headerAction}
                onClick={headerAction ? (e) => headerAction.onClick?.(e) : undefined}
              >
                <LogomarkKpi size={32} />
              </button>
            )}
          </div>
          {ctaNode && <div className={styles.ctas}>{ctaNode}</div>}
          <div className={styles.cSection}>
            <div className={styles.cNav}>{sections.flatMap((sec) => sec.items).map((it) => compactItem(it, it.value === current))}</div>
          </div>
        </div>
        <div className={styles.cBottom}>
          {bottomItems.length > 0 && (
            <div className={styles.cSection}>
              <div className={styles.cNav}>{bottomItems.map((it) => compactItem(it, false))}</div>
            </div>
          )}
          {showProfile && profile && (
            <Avatar
              type={profile.src ? 'image' : 'text'}
              size="md"
              src={profile.src}
              initials={profile.initials}
              onClick={onProfileClick}
            />
          )}
        </div>
      </nav>
    )
  }

  return (
    <nav {...rest} className={[styles.root, styles[state], className].filter(Boolean).join(' ')}>
      <div className={styles.top}>
        <div className={styles.header}>{header ?? defaultHeader}</div>
        {ctaNode && <div className={styles.ctas}>{ctaNode}</div>}
        <div className={styles.topSection}>
          {sections.map((section, i) => (
            <div key={i} className={styles.section}>
              {section.heading != null && (
                <div className={[styles.sectionHeading, 'ui-overline-normal'].join(' ')}>{section.heading}</div>
              )}
              <div className={styles.nav}>{section.items.map(navItem)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomCard}>
          {profile && (
            <List
              size="md"
              image={profile.src}
              imageSize="lg"
              description={profile.subtitle}
              rightIcons={profile.icon ? [profile.icon] : undefined}
              className={styles.profile}
              onClick={onProfileClick}
            >
              {profile.name}
            </List>
          )}
          {themeNode}
          {bottomItems.length > 0 && <div className={styles.bottomList}>{bottomItems.map(bottomItem)}</div>}
        </div>
      </div>
    </nav>
  )
}
