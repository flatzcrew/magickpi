import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Icon } from '../Icon'
import { FeatureIcon } from '../FeatureIcon'
import { Link } from '../Link'
import { IconButton } from '../IconButton'
import { Button } from '../Button'
import { ModalDragger } from '../ModalDragger'
import styles from './ModalHeader.module.css'

/**
 * ModalHeader — шапка модального окна. Figma: кит, `Modal-header` `14160:29188` (Spacing compact · large; +10).
 * Сверху вниз: Header-icon (Feature-icon primary-light) · Heading (sm / md с иконкой / lg) · Description + Link.
 * Back-button (Button secondary) — слева сверху, Close-icon (Icon-button secondary sm) — справа сверху,
 * Modal-dragger (mobile) — по центру сверху; все три поверх (ABSOLUTE в ките).
 */
export type ModalHeaderSpacing = 'compact' | 'large'
/** Heading-sm · Heading-md · Heading-lg — в ките три булевых слоя, в React один выбор. */
export type ModalHeaderHeadingSize = 'sm' | 'md' | 'lg'

const HEADING_CLASS: Record<ModalHeaderSpacing, Record<ModalHeaderHeadingSize, string>> = {
  compact: { sm: 'ui-title-1-semibold', md: 'ui-title-2-semibold', lg: 'ui-heading-2-medium' },
  large: { sm: 'ui-title-2-medium', md: 'ui-heading-1-medium', lg: 'ui-heading-3-medium' },
}

export interface ModalHeaderLink {
  label: ReactNode
  href?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Spacing: compact — плотная шапка; large — крупная (иконка xl, отступ сверху 72). */
  spacing?: ModalHeaderSpacing
  /** Header-icon — иконка в Feature-icon (передана — показана). */
  headerIcon?: string
  /** Заголовок. */
  heading?: ReactNode
  /** Какой из Heading-sm / md / lg показать. */
  headingSize?: ModalHeaderHeadingSize
  /** ↪ Heading-icon — иконка перед заголовком (только Heading-md). */
  headingIcon?: string
  /** Description. */
  description?: ReactNode
  /** ↪ Link после описания (Link secondary md со стрелкой). */
  link?: ModalHeaderLink
  /** Close-icon — передан обработчик — кнопка закрытия показана. */
  onClose?: MouseEventHandler<HTMLButtonElement>
  closeLabel?: string
  /** Back-button — передан обработчик — кнопка «Назад» показана. */
  onBack?: MouseEventHandler<HTMLButtonElement>
  backLabel?: ReactNode
  /** Modal-dragger (mobile). */
  dragger?: boolean
  /** id заголовка — для aria-labelledby у Modal. */
  headingId?: string
}

export function ModalHeader({
  spacing = 'compact',
  headerIcon,
  heading,
  headingSize = 'md',
  headingIcon,
  description,
  link,
  onClose,
  closeLabel = 'Закрыть',
  onBack,
  backLabel = 'Назад',
  dragger = false,
  headingId,
  className,
  ...rest
}: ModalHeaderProps) {
  const large = spacing === 'large'
  return (
    <header {...rest} className={[styles.root, styles[spacing], className].filter(Boolean).join(' ')}>
      {dragger && (
        <span className={styles.dragger}>
          <ModalDragger />
        </span>
      )}
      {onBack && (
        <span className={styles.back}>
          <Button type="secondary" size={large ? 'md' : 'sm'} leftIcon="arrow-left" onClick={onBack}>
            {backLabel}
          </Button>
        </span>
      )}
      {onClose && (
        <span className={styles.close}>
          <IconButton type="secondary" size="sm" icon="cross" aria-label={closeLabel} onClick={onClose} />
        </span>
      )}

      {headerIcon && (
        <div className={styles.icon}>
          <FeatureIcon type="primary-light" size={large ? 'xl' : 'md'} icon={headerIcon} />
        </div>
      )}

      {(heading != null || description != null || link) && (
        <div className={styles.textWrap}>
          {heading != null && (
            <h2 id={headingId} className={[styles.heading, HEADING_CLASS[spacing][headingSize]].join(' ')}>
              {headingSize === 'md' && headingIcon && <Icon name={headingIcon} className={styles.headingIcon} />}
              {heading}
            </h2>
          )}
          {(description != null || link) && (
            <div className={styles.description}>
              {description != null && <p className={[styles.descriptionText, 'ui-para-normal'].join(' ')}>{description}</p>}
              {link && (
                <Link type="secondary" size="md" rightIcon="arrow-right" href={link.href} onClick={link.onClick}>
                  {link.label}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
