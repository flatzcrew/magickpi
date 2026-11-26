import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Icon } from '../Icon'
import { Checkbox } from '../Checkbox'
import type { CheckboxProps, CheckboxSize } from '../Checkbox'
import { Tag } from '../Tag'
import type { TagSize, TagType } from '../Tag'
import { IconButton } from '../IconButton'
import type { IconButtonSize } from '../IconButton'
import { Button } from '../Button'
import type { ButtonSize } from '../Button'
import styles from './List.module.css'

/**
 * List — строка списка. Figma: кит, `List` `10063:2066` (Size sm…xl × State default · hover · active).
 * Слева: Lead-action (Checkbox) · Left (иконка / картинка sm · md · lg). Центр: Text-group-1 (Primary + Secondary + Tag-main,
 * снизу Description с иконкой). Справа: Text-group-2 (трейлинг-тексты) · Right (до 3 иконок, Tag-1, Tag-2, Icon-button, Button).
 */
export type ListSize = 'sm' | 'md' | 'lg' | 'xl'
export type ListState = 'default' | 'hover' | 'active'
/** Lead-item-sm · md · lg — три размера картинки слева. */
export type ListImageSize = 'sm' | 'md' | 'lg'

export interface ListTag {
  label: ReactNode
  type?: TagType
  leftIcon?: string
}

export interface ListAction {
  label?: ReactNode
  icon?: string
  'aria-label'?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

/** Размеры вложенных инстансов по Size строки (сверено в Figma). */
const NESTED: Record<ListSize, { checkbox: CheckboxSize; tagMain: TagSize; tag: TagSize; control: ButtonSize & IconButtonSize }> = {
  sm: { checkbox: 'sm', tagMain: 'xs', tag: 'sm', control: 'sm' },
  md: { checkbox: 'sm', tagMain: 'xs', tag: 'sm', control: 'sm' },
  lg: { checkbox: 'md', tagMain: 'sm', tag: 'sm', control: 'sm' },
  xl: { checkbox: 'md', tagMain: 'sm', tag: 'md', control: 'md' },
}

/** Типостили: [Primary (medium), Secondary (normal), Description]. */
const TEXT_CLASS: Record<ListSize, [string, string, string]> = {
  sm: ['ui-para-medium', 'ui-para-normal', 'ui-caption-2-normal'],
  md: ['ui-para-medium', 'ui-para-normal', 'ui-caption-2-normal'],
  lg: ['ui-body-2-medium', 'ui-body-2-normal', 'ui-caption-2-normal'],
  xl: ['ui-title-2-medium', 'ui-title-2-normal', 'ui-para-normal'],
}

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  /** 📐 Size: высота sm 48 · md 56 · lg 64 · xl 72. */
  size?: ListSize
  /** 💡 State: hover — :hover, active — выбранная строка (задаётся пропом; aria-selected — у потребителя вместе с role). */
  state?: ListState
  /** ☑️ Lead-action — чекбокс слева (передан — показан; размер по Size). */
  checkbox?: Omit<CheckboxProps, 'size'>
  /** ↪ Left-icon — иконка слева. */
  leftIcon?: string
  /** ↪ 🏞️ Lead-item — src картинки слева. */
  image?: string
  /** Размер картинки: Lead-item-sm · md · lg. */
  imageSize?: ListImageSize
  /** ↪ Primary-text. */
  children?: ReactNode
  /** ↪ Secondary-text — рядом с Primary («• Secondary»). */
  secondaryText?: ReactNode
  /** ↪ Tag-main — тег в строке заголовка (Tag secondary). */
  tag?: ReactNode
  /** ↪ Description — строка под заголовком. */
  description?: ReactNode
  /** Description-icon — иконка перед описанием. */
  descriptionIcon?: string
  /** ↪ Trail-primary-text — Text-group-2 справа. */
  trailText?: ReactNode
  /** ↪ Trail-secondary-text. */
  trailSecondaryText?: ReactNode
  /** ↪ Trail-description. */
  trailDescription?: ReactNode
  /** Trail-description-icon. */
  trailDescriptionIcon?: string
  /** ↪ Right-icon-1…3 — до трёх иконок справа. */
  rightIcons?: string[]
  /** ↪ 🏷️ Tag-1, Tag-2 (в ките secondary и info). */
  tags?: ListTag[]
  /** Icon-button справа (secondary). */
  iconButton?: ListAction
  /** Button справа (secondary). */
  button?: ListAction
}

export function List({
  size = 'sm',
  state = 'default',
  checkbox,
  leftIcon,
  image,
  imageSize = 'md',
  children,
  secondaryText,
  tag,
  description,
  descriptionIcon,
  trailText,
  trailSecondaryText,
  trailDescription,
  trailDescriptionIcon,
  rightIcons,
  tags,
  iconButton,
  button,
  className,
  ...rest
}: ListProps) {
  const nested = NESTED[size]
  const [primaryClass, secondaryClass, descClass] = TEXT_CLASS[size]
  const hasLeft = Boolean(leftIcon || image)
  const hasTrail = trailText != null || trailSecondaryText != null || trailDescription != null
  const hasRight = Boolean(rightIcons?.length || tags?.length || iconButton || button)

  return (
    <div
      {...rest}
      data-state={state}
      className={[styles.root, styles[size], className].filter(Boolean).join(' ')}
    >
      {checkbox && <Checkbox {...checkbox} size={nested.checkbox} />}

      {hasLeft && (
        <span className={styles.left}>
          {leftIcon && <Icon name={leftIcon} className={styles.leftIcon} />}
          {image && <img className={[styles.image, styles[`image-${imageSize}`]].join(' ')} src={image} alt="" />}
        </span>
      )}

      <span className={styles.textWrap}>
        <span className={styles.headingTop}>
          {children != null && <span className={[styles.primary, primaryClass].join(' ')}>{children}</span>}
          {secondaryText != null && <span className={[styles.secondary, secondaryClass].join(' ')}>{secondaryText}</span>}
          {tag != null && (
            <Tag type="secondary" size={nested.tagMain}>
              {tag}
            </Tag>
          )}
        </span>
        {description != null && (
          <span className={styles.bottom}>
            {descriptionIcon && <Icon name={descriptionIcon} className={styles.descIcon} />}
            <span className={[styles.description, descClass].join(' ')}>{description}</span>
          </span>
        )}
      </span>

      {hasTrail && (
        <span className={[styles.textWrap, styles.trail].join(' ')}>
          <span className={styles.headingTop}>
            {trailText != null && <span className={[styles.trailPrimary, primaryClass].join(' ')}>{trailText}</span>}
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
          {rightIcons?.slice(0, 3).map((name, i) => <Icon key={`${name}-${i}`} name={name} className={styles.rightIcon} />)}
          {tags?.slice(0, 2).map((t, i) => (
            <Tag key={i} type={t.type ?? (i === 0 ? 'secondary' : 'info')} size={nested.tag} leftIcon={t.leftIcon}>
              {t.label}
            </Tag>
          ))}
          {iconButton && (
            <IconButton
              type="secondary"
              size={nested.control}
              icon={iconButton.icon ?? 'placeholder'}
              aria-label={iconButton['aria-label'] ?? 'Действие'}
              onClick={iconButton.onClick}
              disabled={iconButton.disabled}
            />
          )}
          {button && (
            <Button type="secondary" size={nested.control} leftIcon={button.icon} onClick={button.onClick} disabled={button.disabled}>
              {button.label}
            </Button>
          )}
        </span>
      )}
    </div>
  )
}
