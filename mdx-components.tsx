// mdx-components.tsx
import ABIViewer from 'components/ABIViewer'
import CopyAddress from 'components/CopyAddress'
import DocsCards from 'components/DocsCard'
import FeeCalculator from 'components/FeeCalculator'
import type { MDXComponents } from 'mdx/types'
import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'


const themeComponents = getThemeComponents()

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...themeComponents,
    ...components,
    FeeCalculator,
    DocsCards,
    ABIViewer,
    CopyAddress
  }
}
