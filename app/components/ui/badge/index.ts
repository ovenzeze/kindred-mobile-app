import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'h-5 gap-1 rounded-full border border-transparent px-2.5 py-0.5 text-[0.68rem] font-bold backdrop-blur-xl transition-all has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:size-3 group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-ring focus-visible:ring-ring/30 [&>svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary/90 text-primary-foreground shadow-sm shadow-primary/10',
        secondary: 'border-white/10 bg-white/15 text-foreground ring-1 ring-white/10 shadow-sm shadow-black/5',
        destructive: 'bg-destructive/15 text-destructive ring-1 ring-destructive/10',
        outline: 'border-white/10 bg-white/5 text-foreground ring-1 ring-white/10',
        ghost: 'hover:bg-white/10 hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
