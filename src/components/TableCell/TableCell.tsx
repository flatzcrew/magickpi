import type { HTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import { Checkbox } from '../Checkbox'
import type { CheckboxProps, CheckboxSize } from '../Checkbox'
import { Tag } from '../Tag'
import { IconButton } from '../IconButton'
import type { IconButtonSize } from '../IconButton'
import { Button } from '../Button'
import { Dropdown } from '../Dropdown'
import type { DropdownProps } from '../Dropdown'
import type { ListAction, ListImageSize, ListTag } from '../List'
import styles from './TableCell.module.css'

/**
 * TableCell — ячейка таблицы. Figma: кит, `Table-cell` `16115:25252`
 * (Size md · lg × State default · loading × Type default · header; header — только md).
 * Слоты как у List: Lead-action · Left · Text-group-1 · Text-group-2 · Right (иконки, теги, Icon-button, Dropdown, Button-1/2).
 * loading — скелетон: два круга слева и полоса на всю ширину.
 */
export type TableCellSize = 'md' | 'lg'
export type TableCellState = 'default' | 'loading'
export type TableCellType = 'default' | 'header'

const TEXT_CLASS: Record<'header' | TableCellSize, [string, string, string]> = {
  header: ['ui-para-medium', 'ui-para-normal', 'ui-caption-2-normal'],
  md: ['ui-para-medium', 'ui-para-normal', 'ui-caption-2-normal'],
  lg: ['ui-body-2-medium', 'ui-body-2-normal', 'ui-caption-2-normal'],
}
const CHECKBOX: Record<'header' | TableCellSize, CheckboxSize> = { header: 'md', md: 'sm', lg: 'md' }
const ICON_BUTTON: Record<'header' | TableCellSize, IconButtonSize> = { header: 'xs', md: 'sm', lg: 'sm' }

export interface TableCellProps extends HTMLAttributes<HTMLDivElement> {
  /** 📐 Size: md 56 · lg 64 (header — 40, только md). */
  size?: TableCellSize
  /** 💡 State: loading — скелетон вместо содержимого. */
  state?: TableCellState
  /** ☘️ Type: header — заголовок колонки (role columnheader, текст Text/low-em). */
  type?: TableCellType
  /** ☑️ Lead-action — чекбокс (передан — показан). */
  checkbox?: Omit<CheckboxProps, 'size'>
  /** ↪ Left-icon. */
  leftIcon?: string
  /** ↪ 🏞️ Lead-item — src картинки слева. */
  image?: string
  /** Lead-item-sm · md · lg (у header одна картинка 20). */
  imageSize?: ListImageSize
  /** ↪ Primary-text. */
  children?: ReactNode
  /** ↪ Secondary-text. */
  secondaryText?: ReactNode
  /** ↪ Description (у header нет). */
  description?: ReactNode
  /** Description-icon. */
  descriptionIcon?: string
  /** ↪ Trail-primary-text. */
  trailText?: ReactNode
  /** ↪ Trail-secondary-text. */
  trailSecondaryText?: ReactNode
  /** ↪ Trail-description. */
  trailDescription?: ReactNode
  /** Trail-description-icon. */
  trailDescriptionIcon?: string
  /** ↪ Right-icon-1…3. */
  rightIcons?: string[]
  /** ↪ 🏷️ Tag-1, Tag-2 (secondary, info). */
  tags?: ListTag[]
  /** Icon-button (secondary). */
  iconButton?: ListAction
  /** Dropdown в ячейке (без label и hint). */
  dropdown?: DropdownProps
  /** Button-1 (secondary). */
  button?: ListAction
  /** Button-2 (tertiary). */
  button2?: ListAction
}

export function TableCell({
  size = 'md',
  state = 'default',
  type = 'header',
  checkbox,
  leftIcon,
  image,
  imageSize = 'md',
  children,
  secondaryText,
  description,
  descriptionIcon,
  trailText,
  trailSecondaryText,
  trailDescription,
  trailDescriptionIcon,
  rightIcons,
  tags,
  iconButton,
  dropdown,
  button,
  button2,
  className,
  ...rest
}: TableCellProps) {
  const isHeader = type === 'header'
  const key = isHeader ? 'header' : size
  const [primaryClass, secondaryClass, descClass] = TEXT_CLASS[key]
  const loading = state === 'loading'
  const hasLeft = Boolean(leftIcon || image)
  const hasTrail = !isHeader && (trailText != null || trailSecondaryText != null || trailDescription != null)
  const hasRight = Boolean(rightIcons?.length || tags?.length || iconButton || dropdown || button || button2)

  return (
    <div
      role={isHeader ? 'columnheader' : 'cell'}
      aria-busy={loading || undefined}
      {...rest}
      data-state={state}
      className={[styles.root, styles[key], loading && styles.loading, className].filter(Boolean).join(' ')}
    >
      {loading ? (
        <>
          <span className={styles.left}>
            <span className={[styles.loader, styles.loaderLg].join(' ')} />
            <span className={[styles.loader, styles.loaderSm].join(' ')} />
          </span>
          <span className={styles.bar} />
        </>
      ) : (
        <>
          {checkbox && <Checkbox {...checkbox} size={CHECKBOX[key]} />}

          {hasLeft && (
            <span className={styles.left}>
              {leftIcon && <Icon name={leftIcon} className={styles.leftIcon} />}
              {image && (
                <img
                  className={[styles.image, styles[isHeader ? 'image-md' : `image-${imageSize}`]].join(' ')}
                  src={image}
                  alt=""
                />
              )}
            </span>
          )}

          <span className={styles.textWrap}>
            <span className={styles.headingTop}>
              {children != null && <span className={[styles.primary, primaryClass].join(' ')}>{children}</span>}
              {secondaryText != null && (
                <span className={[styles.secondary, secondaryClass].join(' ')}>{secondaryText}</span>
              )}
            </span>
            {!isHeader && description != null && (
              <span className={styles.bottom}>
                {descriptionIcon && <Icon name={descriptionIcon} className={styles.descIcon} />}
                <span className={[styles.description, descClass].join(' ')}>{description}</span>
              </span>
            )}
          </span>

          {hasTrail && (
            <span className={[styles.textWrap, styles.trail].join(' ')}>
              <span className={styles.headingTop}>
                {trailText != null && <span className={[styles.primary, primaryClass].join(' ')}>{trailText}</span>}
                {trailSecondaryText != null && (
                  <span className={[styles.secondary, secondaryClass].join(' ')}>{trailSecondaryText}</span>
                )}
              </span>
              {trailDescription != null && (
                <span className={styles.bottom}>
                  {trailDescriptionIcon && <Icon name={trailDescriptionIcon} className={styles.descIcon} />}
                  <span className={[styles.description, descClass].join(' ')}>{trailDescription}</span>
                </span>
              )}
            </span>
          )}

          {hasRight && (
            <span className={styles.right}>
              {rightIcons?.slice(0, 3).map((name, i) => (
                <Icon key={`${name}-${i}`} name={name} className={styles.rightIcon} />
              ))}
              {tags?.slice(0, 2).map((t, i) => (
                <Tag key={i} type={t.type ?? (i === 0 ? 'secondary' : 'info')} size="sm" leftIcon={t.leftIcon}>
                  {t.label}
                </Tag>
              ))}
              {iconButton && (
                <IconButton
                  type="secondary"
                  size={ICON_BUTTON[key]}
                  icon={iconButton.icon ?? 'placeholder'}
                  aria-label={iconButton['aria-label'] ?? 'Действие'}
                  onClick={iconButton.onClick}
                  disabled={iconButton.disabled}
                />
              )}
              {dropdown && (
                <span className={styles.dropdown}>
                  <Dropdown {...dropdown} />
                </span>
              )}
              {button && (
                <Button type="secondary" size="sm" leftIcon={button.icon} onClick={button.onClick} disabled={button.disabled}>
                  {button.label}
                </Button>
              )}
              {button2 && (
                <Button type="tertiary" size="sm" leftIcon={button2.icon} onClick={button2.onClick} disabled={button2.disabled}>
                  {button2.label}
                </Button>
              )}
            </span>
          )}
        </>
      )}
    </div>
  )
}
