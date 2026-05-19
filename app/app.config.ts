export default defineAppConfig({
  ui: {
    colors: {
      primary: 'rose',
      secondary: 'teal',
      success: 'green',
      info: 'cyan',
      warning: 'amber',
      error: 'red',
      neutral: 'slate',
    },
    button: {
      slots: {
        base: 'rounded-full font-semibold shadow-sm transition-[background,box-shadow,transform] active:scale-[0.98]',
      },
      compoundVariants: [
        {
          variant: 'solid',
          class: 'shadow-lg shadow-primary/20',
        },
        {
          variant: 'soft',
          class: 'backdrop-blur-xl ring-1 ring-white/35 dark:ring-white/10',
        },
        {
          variant: 'subtle',
          class: 'backdrop-blur-xl ring-1 ring-white/35 dark:ring-white/10',
        },
        {
          variant: 'outline',
          class: 'bg-default/45 backdrop-blur-xl ring-white/45 dark:ring-white/15',
        },
        {
          variant: 'ghost',
          class: 'hover:bg-default/45 hover:backdrop-blur-xl',
        },
      ],
    },
    card: {
      slots: {
        root: 'rounded-3xl bg-default/65 backdrop-blur-2xl ring-1 ring-white/50 shadow-xl shadow-slate-900/5 dark:bg-default/15 dark:ring-white/10 dark:shadow-black/20',
        header: 'p-4 sm:px-5',
        body: 'p-4 sm:p-5',
        footer: 'p-4 sm:px-5',
      },
      variants: {
        variant: {
          outline: {
            root: 'bg-default/65 backdrop-blur-2xl ring-1 ring-white/50 divide-y divide-white/35 dark:bg-default/15 dark:ring-white/10 dark:divide-white/10',
          },
          soft: {
            root: 'bg-elevated/50 backdrop-blur-2xl divide-y divide-white/35 dark:bg-elevated/15 dark:divide-white/10',
          },
          subtle: {
            root: 'bg-elevated/55 backdrop-blur-2xl ring-1 ring-white/45 divide-y divide-white/35 dark:bg-elevated/15 dark:ring-white/10 dark:divide-white/10',
          },
        },
      },
    },
    input: {
      slots: {
        base: 'rounded-2xl bg-default/55 backdrop-blur-xl ring-white/55 dark:bg-default/10 dark:ring-white/10',
      },
    },
    textarea: {
      slots: {
        base: 'rounded-2xl bg-default/55 backdrop-blur-xl ring-white/55 dark:bg-default/10 dark:ring-white/10',
      },
    },
    alert: {
      slots: {
        root: 'rounded-3xl backdrop-blur-2xl ring-1 ring-white/45 dark:ring-white/10',
      },
    },
    badge: {
      slots: {
        base: 'rounded-full backdrop-blur-xl',
      },
    },
    tabs: {
      slots: {
        list: 'rounded-full bg-default/45 backdrop-blur-xl ring-1 ring-white/45 dark:bg-default/10 dark:ring-white/10',
        indicator: 'rounded-full shadow-sm',
        trigger: 'rounded-full',
      },
    },
    icons: {
      arrowLeft: 'i-lucide-arrow-left',
      arrowRight: 'i-lucide-arrow-right',
      check: 'i-lucide-check',
      chevronDown: 'i-lucide-chevron-down',
      chevronLeft: 'i-lucide-chevron-left',
      chevronRight: 'i-lucide-chevron-right',
      close: 'i-lucide-x',
      dark: 'i-lucide-moon',
      error: 'i-lucide-circle-alert',
      external: 'i-lucide-external-link',
      light: 'i-lucide-sun',
      loading: 'i-lucide-loader-circle',
      minus: 'i-lucide-minus',
      plus: 'i-lucide-plus',
      search: 'i-lucide-search',
      system: 'i-lucide-monitor',
    },
  },
});
