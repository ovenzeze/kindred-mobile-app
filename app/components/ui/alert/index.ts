import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Alert } from './Alert.vue'
export { default as AlertAction } from './AlertAction.vue'
export { default as AlertDescription } from './AlertDescription.vue'
export { default as AlertTitle } from './AlertTitle.vue'

export const alertVariants = cva('grid gap-0.5 rounded-2xl border px-3 py-3 text-left text-sm backdrop-blur-xl has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*=size-])]:size-5 group/alert relative w-full', {
  variants: {
    variant: {
      default: 'border-white/10 bg-card/30 text-card-foreground ring-1 ring-white/10 shadow-sm shadow-black/5',
      destructive: 'border-destructive/15 bg-destructive/10 text-destructive ring-1 ring-destructive/10 shadow-sm shadow-black/5 *:data-[slot=alert-description]:text-destructive/80 *:[svg]:text-current',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type AlertVariants = VariantProps<typeof alertVariants>
